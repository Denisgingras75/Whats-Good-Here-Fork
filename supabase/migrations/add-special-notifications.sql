-- =============================================
-- NOTIFICATION: Notify restaurant favorites on new special
-- =============================================

-- Create trigger function to notify users who favorited a restaurant's dishes
-- when that restaurant posts a new special
CREATE OR REPLACE FUNCTION notify_on_new_special()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  restaurant_name TEXT;
  user_record RECORD;
BEGIN
  -- Get restaurant name
  SELECT name INTO restaurant_name
  FROM restaurants
  WHERE id = NEW.restaurant_id;

  -- Find all users who have favorited any dish from this restaurant
  -- and notify them about the new special
  FOR user_record IN
    SELECT DISTINCT f.user_id
    FROM favorites f
    JOIN dishes d ON f.dish_id = d.id
    WHERE d.restaurant_id = NEW.restaurant_id
      AND f.user_id IS NOT NULL
      -- Don't notify the restaurant owner who posted it
      AND f.user_id != NEW.created_by
  LOOP
    INSERT INTO notifications (user_id, type, data)
    VALUES (
      user_record.user_id,
      'new_special',
      jsonb_build_object(
        'restaurant_id', NEW.restaurant_id,
        'restaurant_name', COALESCE(restaurant_name, 'A restaurant'),
        'special_id', NEW.id,
        'special_name', NEW.deal_name,
        'special_description', NEW.description,
        'special_price', NEW.price
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create trigger on specials table
DROP TRIGGER IF EXISTS trigger_notify_on_new_special ON specials;
CREATE TRIGGER trigger_notify_on_new_special
  AFTER INSERT ON specials
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION notify_on_new_special();

-- Add index to speed up the favorite user lookup
CREATE INDEX IF NOT EXISTS idx_favorites_for_restaurant_notify
  ON favorites(dish_id);
