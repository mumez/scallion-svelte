# scallion-svelte

A wiki frontend app developed using [SvelteKit](https://kit.svelte.dev/) + [Skeleton](https://www.skeleton.dev/).

Designed to work with [scallion-wiki-api](https://github.com/mumez/scallion-wiki-api) as the wiki API backend.

## Features

- Utilizes Markdown format for page editing.
- Employs Firebase for authentication, using JWT.
- Allows the wiki owner to lock pages, preventing edits by other users.
- Supports versioning of pages, enabling users to view and restore previous page versions as needed.
- Permits users to attach files to pages, offering a convenient method for sharing documents and other resources.
- Accommodates multiple wikis.
- Supports blog-style pages (bliki)

## To Do

- [x] Implement a blog-style page view, commonly referred to as a "bliki."
- Add localizable labels and messages.
- Develop a search function that enables users to locate wiki pages based on specific keywords.

## Demo

https://scallion-svelte.vercel.app/

Note: You can only edit the "demo" wiki, and the content of this wiki is reset daily.
