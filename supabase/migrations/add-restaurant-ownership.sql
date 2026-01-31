-- Restaurant Ownership System
-- Run this in Supabase SQL Editor to enable restaurant ownership and claims

-- ============================================
-- RESTAURANT_USERS TABLE
-- Links users to restaurants they own/manage
-- ============================================

CREATE TABLE IF NOT EXISTS restaurant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),

  -- One user can only have one role per restaurant
  UNIQUE(restaurant_id, user_id)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_restaurant_users_user ON restaurant_users(user_id);
-- Index for fast lookups by restaurant
CREATE INDEX IF NOT EXISTS idx_restaurant_users_restaurant ON restaurant_users(restaurant_id);
-- Index for verified owners (common query pattern)
CREATE INDEX IF NOT EXISTS idx_restaurant_users_verified ON restaurant_users(restaurant_id, is_verified) WHERE is_verified = true;

-- ============================================
-- RESTAURANT_CLAIMS TABLE
-- Tracks pending ownership claims for admin approval
-- ============================================

CREATE TABLE IF NOT EXISTS restaurant_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Claim details
  business_role TEXT, -- e.g., "Owner", "General Manager", "Marketing Director"
  verification_method TEXT, -- e.g., "email_domain", "phone", "document"
  verification_notes TEXT, -- Claimant's notes for verification

  -- Admin review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT, -- Admin's internal notes
  rejection_reason TEXT, -- If rejected, explain why

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate pending claims
  UNIQUE(restaurant_id, user_id, status)
);

-- Index for admin dashboard (pending claims)
CREATE INDEX IF NOT EXISTS idx_restaurant_claims_pending ON restaurant_claims(status, created_at) WHERE status = 'pending';
-- Index for user's claims
CREATE INDEX IF NOT EXISTS idx_restaurant_claims_user ON restaurant_claims(user_id, status);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if current user owns a specific restaurant (verified)
CREATE OR REPLACE FUNCTION user_owns_restaurant(check_restaurant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurant_users
    WHERE restaurant_id = check_restaurant_id
      AND user_id = auth.uid()
      AND is_verified = true
      AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user can manage a restaurant (owner OR manager, verified)
CREATE OR REPLACE FUNCTION user_can_manage_restaurant(check_restaurant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM restaurant_users
    WHERE restaurant_id = check_restaurant_id
      AND user_id = auth.uid()
      AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get all restaurant IDs the current user can manage
CREATE OR REPLACE FUNCTION get_user_restaurants()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT restaurant_id
  FROM restaurant_users
  WHERE user_id = auth.uid()
    AND is_verified = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY - RESTAURANT_USERS
-- ============================================

ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;

-- Users can view their own restaurant associations
CREATE POLICY "Users can view own restaurant roles"
  ON restaurant_users FOR SELECT
  USING (user_id = auth.uid());

-- Restaurant owners can view all users for their restaurants
CREATE POLICY "Owners can view restaurant team"
  ON restaurant_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurant_users.restaurant_id
        AND ru.user_id = auth.uid()
        AND ru.is_verified = true
        AND ru.role = 'owner'
    )
  );

-- Admins can view all restaurant_users
CREATE POLICY "Admins can view all restaurant_users"
  ON restaurant_users FOR SELECT
  USING (is_admin());

-- Only admins can insert (claims go through restaurant_claims first)
CREATE POLICY "Admins can insert restaurant_users"
  ON restaurant_users FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update restaurant_users (for verification)
CREATE POLICY "Admins can update restaurant_users"
  ON restaurant_users FOR UPDATE
  USING (is_admin());

-- Admins can delete restaurant_users
CREATE POLICY "Admins can delete restaurant_users"
  ON restaurant_users FOR DELETE
  USING (is_admin());

-- ============================================
-- ROW LEVEL SECURITY - RESTAURANT_CLAIMS
-- ============================================

ALTER TABLE restaurant_claims ENABLE ROW LEVEL SECURITY;

-- Users can view their own claims
CREATE POLICY "Users can view own claims"
  ON restaurant_claims FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all claims
CREATE POLICY "Admins can view all claims"
  ON restaurant_claims FOR SELECT
  USING (is_admin());

-- Authenticated users can submit claims
CREATE POLICY "Authenticated users can submit claims"
  ON restaurant_claims FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    -- Can't claim if already a verified owner
    AND NOT EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurant_claims.restaurant_id
        AND ru.user_id = auth.uid()
        AND ru.is_verified = true
    )
  );

-- Users can update their own pending claims (e.g., add notes)
CREATE POLICY "Users can update own pending claims"
  ON restaurant_claims FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    -- Can't change status themselves
  );

-- Admins can update any claim (for approval/rejection)
CREATE POLICY "Admins can update claims"
  ON restaurant_claims FOR UPDATE
  USING (is_admin());

-- Users can delete their own pending claims
CREATE POLICY "Users can delete own pending claims"
  ON restaurant_claims FOR DELETE
  USING (user_id = auth.uid() AND status = 'pending');

-- Admins can delete any claim
CREATE POLICY "Admins can delete claims"
  ON restaurant_claims FOR DELETE
  USING (is_admin());

-- ============================================
-- UPDATE SPECIALS RLS POLICIES
-- Restaurant owners can manage their specials
-- ============================================

-- Drop the old "anyone can insert" policy
DROP POLICY IF EXISTS "Authenticated users can create specials" ON specials;
DROP POLICY IF EXISTS "Creator can update own specials" ON specials;
DROP POLICY IF EXISTS "Creator can delete own specials" ON specials;

-- Restaurant owners/managers can create specials for their restaurants
CREATE POLICY "Restaurant managers can create specials"
  ON specials FOR INSERT
  TO authenticated
  WITH CHECK (
    user_can_manage_restaurant(restaurant_id)
    OR is_admin()
  );

-- Restaurant owners/managers can update their restaurant's specials
CREATE POLICY "Restaurant managers can update specials"
  ON specials FOR UPDATE
  TO authenticated
  USING (
    user_can_manage_restaurant(restaurant_id)
    OR is_admin()
  );

-- Restaurant owners/managers can delete their restaurant's specials
CREATE POLICY "Restaurant managers can delete specials"
  ON specials FOR DELETE
  TO authenticated
  USING (
    user_can_manage_restaurant(restaurant_id)
    OR is_admin()
  );

-- ============================================
-- TRIGGER: Auto-update updated_at on claims
-- ============================================

CREATE OR REPLACE FUNCTION update_restaurant_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS restaurant_claims_updated_at ON restaurant_claims;
CREATE TRIGGER restaurant_claims_updated_at
  BEFORE UPDATE ON restaurant_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_claims_updated_at();

-- ============================================
-- ADMIN FUNCTION: Approve claim
-- Creates restaurant_user entry and updates claim status
-- ============================================

CREATE OR REPLACE FUNCTION approve_restaurant_claim(claim_id UUID, admin_notes_text TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  claim_record RECORD;
BEGIN
  -- Only admins can approve
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve claims';
  END IF;

  -- Get the claim
  SELECT * INTO claim_record FROM restaurant_claims WHERE id = claim_id AND status = 'pending';

  IF claim_record IS NULL THEN
    RAISE EXCEPTION 'Claim not found or already processed';
  END IF;

  -- Create the restaurant_user entry
  INSERT INTO restaurant_users (restaurant_id, user_id, role, is_verified, verified_at, verified_by)
  VALUES (claim_record.restaurant_id, claim_record.user_id, 'owner', true, NOW(), auth.uid())
  ON CONFLICT (restaurant_id, user_id)
  DO UPDATE SET is_verified = true, verified_at = NOW(), verified_by = auth.uid();

  -- Update the claim status
  UPDATE restaurant_claims
  SET status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      admin_notes = admin_notes_text
  WHERE id = claim_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ADMIN FUNCTION: Reject claim
-- ============================================

CREATE OR REPLACE FUNCTION reject_restaurant_claim(
  claim_id UUID,
  reason TEXT,
  admin_notes_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only admins can reject
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can reject claims';
  END IF;

  -- Update the claim status
  UPDATE restaurant_claims
  SET status = 'rejected',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      rejection_reason = reason,
      admin_notes = admin_notes_text
  WHERE id = claim_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Claim not found or already processed';
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
