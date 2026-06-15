
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
=======
# GreenWings
-GreenWings is a scalable multilingual digital platform for a Farmer Producer Organisation (FPO), combining a corporate website, agricultural product marketplace, member portal, enquiry management system, and administrative dashboard to empower farmers and connect them with markets and opportunities.
>>>>>>> 410737ad7206d2bc95688e98f9ae4c7c263cd790
