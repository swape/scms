# scms
CMS from outer space

List of  features:
- Front end in svelte and astro
- Back end in python and fastApi
- Database module with support for multiple databases (sqlite, postgres, firebase, supabase, etc)
- Authentication module with support for multiple authentication methods (jwt, oauth, firebase, supabase, etc)
- Docker support for all modules (frontend, backend, database, authentication)
- Support for publish to firebase hosting, github pages, vercel, netlify, etc
- Support for multiple languages (i18n)
- Support for multiple themes (light, dark, etc)
- Support for multiple users with different roles (admin, editor, viewer, etc)
- Support for both page-templates and page-builder
- Support for both markdown and wysiwyg editors
- Support for both static and dynamic content
- Support for import from other cms (wordpress, ghost, etc)
- Support for extract content from a url

List of technologies used:
- Front end: svelte, astro, tailwindcss, vite
- Back end: python, fastapi, uvicorn
- Database: sqlite, postgres, firebase, supabase
- Authentication: jwt, oauth, firebase, supabase
- Docker: docker, docker-compose
- Deployment: firebase hosting, github pages, vercel, netlify

All the modules are independent and can be used separately or together.
You can use the front end with your own hosted backend and database. Since they communicate via api and it is on its own docker files, you can choose what to pay for and what to host yourself.

The end product is static files that can be hosted anywhere. But can also have some dynamic content via backend api calls and serverless functions.

If supabase or firebase is used, the backend can be completely skipped and the front end can communicate directly with the database and authentication services.

But backend is still useful for server side rendering, custom api endpoints, webhooks, etc.

## Step by step guide to implement instructions from above

