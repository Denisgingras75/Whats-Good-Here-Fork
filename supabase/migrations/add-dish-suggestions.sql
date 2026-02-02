-- =============================================
-- DISH SUGGESTIONS TABLE
-- Users can suggest dishes at any restaurant
-- =============================================

CREATE TABLE IF NOT EXISTS dish_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Restaurant where this dish is served
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

  -- Dish details
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(6, 2),
  description TEXT,
  photo_url TEXT,

  -- Admin workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'duplicate')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,

  -- If approved, link to the created dish
  created_dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dish_suggestions_status ON dish_suggestions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dish_suggestions_user ON dish_suggestions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dish_suggestions_restaurant ON dish_suggestions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dish_suggestions_name_restaurant ON dish_suggestions(restaurant_id, LOWER(name));

-- RLS
ALTER TABLE dish_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved suggestions (for transparency)
CREATE POLICY "Anyone can view approved dish suggestions"
  ON dish_suggestions FOR SELECT
  USING (status = 'approved');

-- Users can view their own suggestions
CREATE POLICY "Users can view own dish suggestions"
  ON dish_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all suggestions
CREATE POLICY "Admins can view all dish suggestions"
  ON dish_suggestions FOR SELECT
  USING (is_admin());

-- Authenticated users can submit suggestions
CREATE POLICY "Authenticated users can submit dish suggestions"
  ON dish_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- Users can update their own pending suggestions
CREATE POLICY "Users can update own pending dish suggestions"
  ON dish_suggestions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (status = 'pending');

-- Admins can update any suggestion
CREATE POLICY "Admins can update dish suggestions"
  ON dish_suggestions FOR UPDATE
  USING (is_admin());

-- Users can delete their own pending suggestions
CREATE POLICY "Users can delete own pending dish suggestions"
  ON dish_suggestions FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can delete any suggestion
CREATE POLICY "Admins can delete dish suggestions"
  ON dish_suggestions FOR DELETE
  USING (is_admin());

-- =============================================
-- TRIGGER: Auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_dish_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dish_suggestions_updated_at ON dish_suggestions;
CREATE TRIGGER dish_suggestions_updated_at
  BEFORE UPDATE ON dish_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_dish_suggestions_updated_at();

-- =============================================
-- ADMIN FUNCTION: Approve suggestion and create dish
-- =============================================

CREATE OR REPLACE FUNCTION approve_dish_suggestion(
  suggestion_id UUID,
  admin_notes_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  suggestion_record RECORD;
  new_dish_id UUID;
BEGIN
  -- Only admins can approve
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can approve suggestions';
  END IF;

  -- Get the suggestion
  SELECT * INTO suggestion_record
  FROM dish_suggestions
  WHERE id = suggestion_id AND status = 'pending';

  IF suggestion_record IS NULL THEN
    RAISE EXCEPTION 'Suggestion not found or already processed';
  END IF;

  -- Create the dish
  INSERT INTO dishes (name, category, restaurant_id, price, description)
  VALUES (
    suggestion_record.name,
    suggestion_record.category,
    suggestion_record.restaurant_id,
    suggestion_record.price,
    suggestion_record.description
  )
  RETURNING id INTO new_dish_id;

  -- Update the suggestion
  UPDATE dish_suggestions
  SET status = 'approved',
      reviewed_at = NOW(),
      reviewed_by = auth.uid(),
      admin_notes = admin_notes_text,
      created_dish_id = new_dish_id
  WHERE id = suggestion_id;

  RETURN new_dish_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- HELPER FUNCTION: Check for duplicate dish at restaurant
-- =============================================

CREATE OR REPLACE FUNCTION check_dish_duplicate(
  p_restaurant_id UUID,
  p_dish_name TEXT
)
RETURNS TABLE(
  exists_as_dish BOOLEAN,
  existing_dish_id UUID,
  exists_as_suggestion BOOLEAN,
  existing_suggestion_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Check if dish already exists
    EXISTS(
      SELECT 1 FROM dishes
      WHERE restaurant_id = p_restaurant_id
      AND LOWER(TRIM(name)) = LOWER(TRIM(p_dish_name))
    ) AS exists_as_dish,
    -- Get the existing dish ID if any
    (
      SELECT id FROM dishes
      WHERE restaurant_id = p_restaurant_id
      AND LOWER(TRIM(name)) = LOWER(TRIM(p_dish_name))
      LIMIT 1
    ) AS existing_dish_id,
    -- Check if there's a pending suggestion
    EXISTS(
      SELECT 1 FROM dish_suggestions
      WHERE restaurant_id = p_restaurant_id
      AND LOWER(TRIM(name)) = LOWER(TRIM(p_dish_name))
      AND status IN ('pending', 'approved')
    ) AS exists_as_suggestion,
    -- Get the existing suggestion ID if any
    (
      SELECT id FROM dish_suggestions
      WHERE restaurant_id = p_restaurant_id
      AND LOWER(TRIM(name)) = LOWER(TRIM(p_dish_name))
      AND status IN ('pending', 'approved')
      LIMIT 1
    ) AS existing_suggestion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RATE LIMITING FUNCTIONS
-- =============================================

-- Check dish suggestion rate limit (max 10/day/user)
CREATE OR REPLACE FUNCTION check_dish_suggestion_rate_limit()
RETURNS TABLE(
  allowed BOOLEAN,
  count_today INTEGER,
  limit_per_day INTEGER
) AS $$
DECLARE
  user_id_var UUID;
  suggestions_today INTEGER;
  max_per_day INTEGER := 10;
BEGIN
  user_id_var := auth.uid();

  IF user_id_var IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, max_per_day;
    RETURN;
  END IF;

  -- Count suggestions in the last 24 hours
  SELECT COUNT(*)::INTEGER INTO suggestions_today
  FROM dish_suggestions
  WHERE user_id = user_id_var
  AND created_at > NOW() - INTERVAL '24 hours';

  RETURN QUERY SELECT (suggestions_today < max_per_day), suggestions_today, max_per_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check restaurant suggestion rate limit (max 5/day/user)
CREATE OR REPLACE FUNCTION check_restaurant_suggestion_rate_limit()
RETURNS TABLE(
  allowed BOOLEAN,
  count_today INTEGER,
  limit_per_day INTEGER
) AS $$
DECLARE
  user_id_var UUID;
  suggestions_today INTEGER;
  max_per_day INTEGER := 5;
BEGIN
  user_id_var := auth.uid();

  IF user_id_var IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, max_per_day;
    RETURN;
  END IF;

  -- Count suggestions in the last 24 hours
  SELECT COUNT(*)::INTEGER INTO suggestions_today
  FROM restaurant_suggestions
  WHERE user_id = user_id_var
  AND created_at > NOW() - INTERVAL '24 hours';

  RETURN QUERY SELECT (suggestions_today < max_per_day), suggestions_today, max_per_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
