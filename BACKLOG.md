# Feature Backlog

Ideas and features for future versions. Not prioritized yet.

---

## Photo-to-Rate Flow

**Summary:** Let users photograph their food, match it to a dish, and rate it later.

**Flow:**
1. User takes photo of their food
2. AI + location tries to match to existing dish in database
3. If match found → save to "rate later" queue
4. If no match → user can add the dish (photo already attached)
5. Reminder when user opens app: "You have dishes to rate!"

**Why it's good:**
- Users already love photographing food - capture that moment
- Reduces friction (no searching while eating)
- Crowdsources database growth when dishes aren't found
- Gets user-submitted photos for dish cards

**Technical needs:**
- OpenAI Vision API or Google Cloud Vision for photo analysis
- Supabase Storage for photos
- New `pending_ratings` table
- Reminder system (in-app first, push notifications later)

**Suggested approach:**
- v1: Skip AI matching. Photo → pick restaurant → pick or add dish → rate later
- v2: Add AI matching once dish database is larger

---

## How to Add Ideas

```markdown
## Feature Name

**Summary:** One-liner description

**Flow:** How it works from user perspective

**Why it's good:** Benefits

**Technical needs:** What's required to build it
```
