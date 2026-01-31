-- =============================================
-- RESTAURANT SUGGESTIONS TABLE
-- "Waze Mode Light" - Users can suggest missing restaurants
-- =============================================

CREATE TABLE IF NOT EXISTS restaurant_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Restaurant details
  name TEXT NOT NULL,
  address TEXT,
  town TEXT,

  -- OpenStreetMap data (free geocoding)
  osm_place_id TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,

  -- User notes
  notes TEXT,

  -- Admin workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'duplicate')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,

  -- If approved, link to the created restaurant
  created_restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_suggestions_status ON restaurant_suggestions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_suggestions_user ON restaurant_suggestions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_suggestions_osm ON restaurant_suggestions(osm_place_id);

-- RLS
ALTER TABLE restaurant_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved suggestions (to show "coming soon" list)
CREATE POLICY "Anyone can view approved suggestions"
  ON restaurant_suggestions FOR SELECT
  USING (status = 'approved');

-- Users can view their own suggestions
CREATE POLICY "Users can view own suggestions"
  ON restaurant_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all suggestions"
  ON restaurant_suggestions FOR SELECT
  USING (is_admin());

-- Authenticated users can submit suggestions
CREATE POLICY "Authenticated users can submit suggestions"
  ON restaurant_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- Users can update their own pending suggestions
CREATE POLICY "Users can update own pending suggestions"
  ON restaurant_suggestions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (status = 'pending');

-- Admins can update any suggestion
CREATE POLICY "Admins can update suggestions"
  ON restaurant_suggestions FOR UPDATE
  USING (is_admin());

-- Users can delete their own pending suggestions
CREATE POLICY "Users can delete own pending suggestions"
  ON restaurant_suggestions FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can delete any suggestion
CREATE POLICY "Admins can delete suggestions"
  ON restaurant_suggestions FOR DELETE
  USING (is_admin());

-- =============================================
-- TRIGGER: Auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_restaurant_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS restaurant_suggestions_updated_at ON restaurant_suggestions;
CREATE TRIGGER restaurant_suggestions_updated_at
  BEFORE UPDATE ON restaurant_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_suggestions_updated_at();

-- =============================================
-- ADMIN FUNCTION: Approve suggestion and create restaurant
-- =============================================

CREATE OR REPLACE FUNCTION approve_restaurant_suggestion(
  suggestion_id UUID,
  admin_notes_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  suggestion_record RECORD;
  new_restaurant_id UUID;
BEGIN
  -- Only admins can approve
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve suggestions';
  END IF;

  -- Get the suggestion
  SELECT * INTO suggestion_record
  FROM restaurant_suggestions
  WHERE id = suggestion_id AND status = 'pending';

  IF suggestion_record IS NULL THEN
    RAISE EXCEPTION 'Suggestion not found or already processed';
  END IF;

  -- Create the restaurant
  INSERT INTO restaurants (name, address, town, lat, lng)
  VALUES (
    suggestion_record.name,
    suggestion_record.address,
    suggestion_record.town,
    suggestion_record.lat,
    suggestion_record.lng
  )
  RETURNING id INTO new_restaurant_id;

  -- Update the suggestion
  UPDATE restaurant_suggestions
  SET status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      admin_notes = admin_notes_text,
      created_restaurant_id = new_restaurant_id
  WHERE id = suggestion_id;

  RETURN new_restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
