# Digital Hub Frontend

The frontend for the Digital Hub service using Node

## Getting started

### Prerequisites

    Node >= v16

### Install dependencies

    npm install

### The application environment

Create a `.env` file using the provided template

    cp .env-template .env

The `.env` can then be configured to point to local or remote backend services as required and toggle application features

### Redis cache

The application caches certain of the CMS queries in redis cache. To not use redis and instead use memory cache, set `ENABLE_REDIS_CACHE=false` in your `.env` file. Alternatively running `docker-compose up` will spin up a local redis instance.

### Using a local instance of Drupal as the front-end application data source

To point to a locally running Drupal backend application that has been spun up using docker-compose.
Set `HUB_API_ENDPOINT=http://localhost:11001` in your `.env` file.

### Running the app

To run this locally you first need to build the CSS and templates:

    npm run build

You can then start the app in dev mode with:

    npm run dev

### Establishment from Hostname

The app now takes it's establishment name from the hostname of each request. In order for dev and staging sites to work we use a reg exp `/-prisoner-content-hub.*$/g` in order to only use the site name, i.e. production uses `wayland.` whereas staging uses `wayland-prisoner-content-hub-staging.`. The reg exp ensures `wayland` will be used in all cases.

When running locally, in order to access the application as if you were at a specific establishment, `/etc/hosts` will need to be configured so that `127.0.0.1 localhost` includes one or more of the following:

- `berwyn.prisoner-content-hub.local`
- `e2e.prisoner-content-hub.local`
- `erlestoke.prisoner-content-hub.local`
- `felthama.prisoner-content-hub.local`
- `felthamb.prisoner-content-hub.local`
- `garth.prisoner-content-hub.local`
- `lindholme.prisoner-content-hub.local`
- `newhall.prisoner-content-hub.local`
- `ranby.prisoner-content-hub.local`
- `stokeheath.prisoner-content-hub.local`
- `styal.prisoner-content-hub.local`
- `swaleside.prisoner-content-hub.local`
- `themount.prisoner-content-hub.local`
- `thestudio.prisoner-content-hub.local`
- `wayland.prisoner-content-hub.local`
- `werrington.prisoner-content-hub.local`
- `wetherby.prisoner-content-hub.local`

You can then access the application in the browser on `http://wetherby.prisoner-content-hub.local:3000` for example.

### Running tests

Jest is used for unit and integration tests

`npm run test`

### Running the E2E tests

Cypress is used for E2E testing

#### Prerequisites

Wiremock needs to run:
`docker-compose -f docker-compose.yml up`

#### Running tests

Can either run the tests headlessly:
`npm run test:e2e:ci`

Or with the cypress user interface:
`npm run test:e2e:ui`

## Adding new breadcrumbs to none Drupal pages

### breadcrumbs.json

The server > content > breadcrumbs.json file lists the href and link text for breadcrumb navigation links that are displayed in sections of the site that do not use content from Drupal.

### breadcrumbs.js

The server > utils > breadcrumbs.js creates breadcrumbs structure for each path defined.

When breadcrumbs are required for a path it should be added within the switch statement in this file.

### Add breadcrumbs to the required routers

Import the createBreadcrumbs function into the router

```
const { createBreadcrumbs } = require('../utils/breadcrumbs');
```

Pass the breadcrumb data into the view within res.render

```
return res.render('pages/approvedVisitors', {
    ...
    data: {
        contentType: 'profile',
        breadcrumbs: createBreadcrumbs(req)
        },
    ...
});
```
