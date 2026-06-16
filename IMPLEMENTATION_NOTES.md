# GreenWings Backend and Admin Access

## Database

- Source dataset: `database/greenwings_maharashtra_seed.sql`
- Development database: SQLite, generated locally and excluded from Git
- Production target: PostgreSQL
- New columns:
  - `produce.info`
  - `subtypes.info`

The PostgreSQL seed populates each `info` value from the existing description,
scientific name, category, season, local names, origin, and taste-profile fields.
The local importer performs the same enrichment when creating the development
database.

## Backend API

- `GET /api/health`: health check
- `GET /api/products`: all database products and subtypes
- `GET /api/products?type=fruit`: products filtered by type
- `POST /api/auth/login`: validates admin credentials
- `GET /api/auth/me`: validates the current token
- `GET /api/admin/summary`: admin-only endpoint

## Frontend Integration

The Products page contains a live database catalogue. Selecting a produce item
reveals its `info` value and all subtype `info` values loaded from the backend.

## Admin Access Rules

- Member login sets the member role and never renders the admin navigation item.
- Admin credentials are validated by the backend.
- Admin sign-in is available only at the unlinked `/admin/login` route.
- Only an authenticated admin role renders the admin navigation item.
- Direct attempts to select the admin panel without the admin role fall back to
  the member dashboard.
- Signing out clears the stored role and admin token.

## Commit Process

Each completed change should be committed with a concise imperative subject,
for example:

`Add database-backed product catalogue and admin authorization`


