# 📅 Room Booking Tool

## Docker Setup

Run `docker-compose up` to start the development server.

### Directus Setup
After the directus instance is running you have to create the schema, roles and permissions.  
The extension used is [directus-sync](https://github.com/tractr/directus-sync?tab=readme-ov-file#installation). 

```sh
npx directus-sync push -u http://localhost:8055 -e 'email' -p 'password'
```

## Directus after work until another solution is found

1. In the Delete Avatar Image on Delete flow: change api endpoint to your host address.
   - To solve this you could create a run script that changes this in the exported flow.  
     directus-config/collections/operations.json

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```
