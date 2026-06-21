
# React + TypeScript + Vite

## Start the GreenWings website locally

Do not open `index.html` directly. This is a Vite React application and must run through
the development server.

On Windows, double-click `START_DEV_SERVER.cmd`, then open:

`http://127.0.0.1:5173/`

The launcher starts both:

- React/Vite frontend: `http://127.0.0.1:5173/`
- Local database API: `http://127.0.0.1:8787/api/health`

The development database is generated from
`database/greenwings_maharashtra_seed.sql`. The SQL seed includes an `info`
column for both produce and subtypes. Local admin credentials are configured in
the ignored `.env` file; copy `.env.example` when setting up another machine.

Before any production deployment, replace the local credentials and token
secret, migrate the enriched SQL seed to PostgreSQL, and use a managed secret
store.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# GreenWings

GreenWings is a multilingual digital platform for **GREEN WINGS FARMERS PRODUCER COMPANY LIMITED**, a Farmer Producer Organisation (FPO) based in Jalgaon Neur, Yeola, Nashik, Maharashtra.

The project combines a public corporate website, agricultural product catalogue, agricultural inputs module, secure member portal, enquiry management workflow, and admin dashboard.

## Project Goals

- Empower farmers through digital connectivity.
- Promote sustainable and modern agriculture.
- Showcase GreenWings services, products, stories, and impact.
- Help members create and track enquiries.
- Give admins tools to manage enquiries, users, analytics, content, and agricultural input records.

## Current Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Zustand
- React Router

### Local Backend

- Python HTTP server
- SQLite development database
- Local REST APIs under `/api`

### Production Target

- PostgreSQL
- Prisma ORM
- Auth.js / NextAuth or equivalent secure auth layer
- S3-compatible storage for production file uploads

> Note: The current dev app runs with Python + SQLite. Prisma/PostgreSQL schema files are included for production migration planning.

## Main Features

### Public Website

- Home
- About
- Services
- Products catalogue
- Agricultural Inputs
- Impact
- Stories
- Resources
- Contact

### Product Catalogue

The product catalogue loads crop and subtype data from the local database.

Supported examples include:

- Fruits
- Grains
- Millets
- Pulses
- Oilseeds
- Vegetables
- Export produce

Product pages include rich descriptions, variety details, usage notes, and multilingual content where available.

### Agricultural Inputs

Agricultural Inputs are split into two independent sections:

```text
Agricultural Inputs
|-- Local Fertilizers
|-- Imported Fertilizers
```

Each fertilizer detail page displays:

- Product overview
- Nutrient content
- Benefits
- Suitable crops
- Unsuitable crops
- Application instructions
- Seasonal recommendations
- Safety precautions
- Product images
- Downloadable product documents

### Local Fertilizers

Includes:

- Indian manufacturers
- Government-approved products
- Organic and chemical options
- Regional recommendations

### Imported Fertilizers

Includes:

- Import country information
- Brand information
- Import certifications
- Premium nutrient formulations
- International product specifications

## Member Portal

Members can:

- Register an account
- Login securely
- Manage profile information
- Create enquiries
- Receive unique enquiry IDs
- Track enquiry history

Registration creates a user and saves the first question as an enquiry.

## Admin Panel

Admin access is role-protected. Admin tools are visible only after admin login.

Admin can manage:

- Users
- Enquiries
- Website analytics
- Local Fertilizers
- Imported Fertilizers

Fertilizer management includes:

- Add
- Edit
- Delete
- Search
- Filter
- Upload image in dev preview
- Manage multilingual content

## Multilingual Support

Supported languages:

- English
- Hindi
- Marathi

The language switcher is available globally. Product and fertilizer APIs support `lang=en`, `lang=hi`, and `lang=mr` where translations exist.

## Important Routes

### Frontend Routes

```text
/                              Home
/about                         About
/services                      Services
/products                      Product catalogue
/products/:categorySlug        Product category
/products/:categorySlug/:id    Product profile
/agricultural-inputs           Fertilizer catalogue
/agricultural-inputs/local/:id Local fertilizer profile
/agricultural-inputs/imported/:id Imported fertilizer profile
/admin/login                   Admin login
```

### API Routes

```text
GET    /api/health
GET    /api/products
GET    /api/fertilizers?kind=local
GET    /api/fertilizers?kind=imported
GET    /api/fertilizers/local/:id
GET    /api/fertilizers/imported/:id
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/enquiries
POST   /api/enquiries
GET    /api/admin/summary
GET    /api/admin/fertilizers?kind=local
GET    /api/admin/fertilizers?kind=imported
POST   /api/admin/fertilizers?kind=local
POST   /api/admin/fertilizers?kind=imported
PUT    /api/admin/fertilizers/local/:id
PUT    /api/admin/fertilizers/imported/:id
DELETE /api/admin/fertilizers/local/:id
DELETE /api/admin/fertilizers/imported/:id
POST   /api/analytics/visit
```

## Database

### Development Database

The local development database is SQLite and is generated automatically from:

```text
database/greenwings_maharashtra_seed.sql
```

The runtime database file is created under:

```text
database/greenwings.db
```

This file is local-only and should not be committed.

### PostgreSQL and Prisma

Production schema planning files:

```text
prisma/schema.prisma
database/fertilizers_postgres.sql
```

Prisma models included:

- `LocalFertilizer`
- `ImportedFertilizer`
- `LocalFertilizerTranslation`
- `ImportedFertilizerTranslation`

## Environment Variables

Copy `.env.example` to `.env` for local development.

Required local values:

```text
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_TOKEN_SECRET=
API_PORT=8787
```

Optional email notification values:

```text
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=
```

Do not commit real secrets.

## Run Locally

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Start backend:

```bash
npm run api
```

Or on Windows, use:

```text
START_DEV_SERVER.cmd
```

Open:

```text
http://127.0.0.1:5173/
```

API health check:

```text
http://127.0.0.1:8787/api/health
```

## Build and Validate

Run production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Run backend syntax check:

```bash
python -m py_compile server/server.py
```

## Temporary Client Preview

For client testing without deployment, use Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://127.0.0.1:5173
```

The generated `trycloudflare.com` link is temporary.

Keep these running while the client tests:

- Vite frontend on port `5173`
- Python API on port `8787`
- Cloudflare tunnel process

Do not use quick tunnels as production hosting.

## Git Workflow

Current active branch:

```text
feature/application
```

Check status:

```bash
git status
```

Commit format:

```bash
git commit -m "Add clear project change summary"
```

Push:

```bash
git push origin feature/application
```

Do not commit:

- `.env`
- local SQLite database files
- Cloudflare executables
- Cloudflare temporary config/log files
- real secrets or tokens

## Notes for Future Production Work

- Move runtime backend to Next.js API or Node.js service as planned.
- Migrate SQLite data to PostgreSQL.
- Use Prisma migrations.
- Replace local image data URLs with S3-compatible uploads.
- Add email verification workflow.
- Add stronger production rate limiting and audit-log storage.
- Add full admin content management for public pages.
