# Digital Hub Frontend

The frontend for the Digital Hub service using Node

## Getting started

### Prerequisites

    Node >= v14

### Install dependencies

    npm install

### Running the application

Create a `.env` file using the provided template

    cp .env-template .env

The `.env` can then be configured to point to local or remote backend services as required and toggle application features

### Establishment from Hostname

The app now takes it's establishment name from the hostname of each request. In order for dev and staging sites to work we use a reg exp `/-prisoner-content-hub.*$/g` in order to only use the site name, i.e. production uses `wayland.` whereas staging uses `wayland-prisoner-content-hub-staging.`. The reg exp ensures `wayland` will be used in all cases.

When running locally, in order to access the application as if you were at a specific establishment, `/etc/hosts` will need to be configured so that `127.0.0.1 localhost` includes one or more of the following:

- `berwyn.prisoner-content-hub.local`
- `cookhamwood.prisoner-content-hub.local`
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

1.) Wiremock needs to run:  
`docker-compose -f docker-compose-wiremock.yml up`

2.) The application needs to run in test mode:
`npm run start:e2e`

#### Running tests

Can either run the tests headlessly:
`npm run test:e2e:ci`

Or with the cypress user interface:
`npm run test:e2e:ui`

You can combine starting the application and running the tests by using:
`npm run test:e2e:run`
