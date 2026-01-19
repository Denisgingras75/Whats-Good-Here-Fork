# Security: Row Level Security (RLS) Policies

This document describes the database security model for What's Good Here.

## Overview

All data access is protected by Supabase Row Level Security (RLS). Even if the client-side UI is bypassed, the database enforces permissions.

## Tables and Policies

### `restaurants`
| Operation | Policy |
|-----------|--------|
| SELECT | Public (anyone can read) |
| INSERT/UPDATE/DELETE | Admin only (`is_admin()`) |

### `dishes`
| Operation | Policy |
|-----------|--------|
| SELECT | Public (anyone can read) |
| INSERT/UPDATE/DELETE | Admin only (`is_admin()`) |

### `votes`
| Operation | Policy |
|-----------|--------|
| SELECT | Public (anyone can read) |
| INSERT | Authenticated users (own votes only) |
| UPDATE/DELETE | Own votes only (`auth.uid() = user_id`) |

### `admins`
| Operation | Policy |
|-----------|--------|
| SELECT | Users can check their own status (`auth.uid() = user_id`) |
| INSERT/UPDATE/DELETE | None (manual DB access only) |

### `dish_photos`
| Operation | Policy |
|-----------|--------|
| SELECT | Public (anyone can read) |
| INSERT | Authenticated users |
| UPDATE/DELETE | Own photos only |

## Admin System

### How it works
1. **Database table**: `admins` stores user IDs of admin users
2. **Helper function**: `is_admin()` checks if current user is in the admins table
3. **RLS policies**: Use `is_admin()` to gate write operations on dishes/restaurants
4. **Client check**: `adminApi.isAdmin()` queries the same table for UI display

### Adding an admin
```sql
-- Find user ID by email
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- Add to admins table
INSERT INTO admins (user_id) VALUES ('user-uuid-here');
```

### Removing an admin
```sql
DELETE FROM admins WHERE user_id = 'user-uuid-here';
```

## Key Security Principles

1. **Defense in depth**: Both client-side checks AND database RLS
2. **Principle of least privilege**: Users can only modify their own data
3. **No silent failures**: APIs throw errors, don't mask with fallbacks
4. **Config validation**: App throws in production if Supabase not configured
