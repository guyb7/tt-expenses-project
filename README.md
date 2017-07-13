# Expenses Tracking App
A webapp to track expenses in your company.
Backend: Node, Express, PostgreSQL
Frontend: React, Redux

## Installation
The app was developed and tested on these versions:
```
node v8.1.4
yarn v0.24.6
```

Get started by running `git clone`.
Then create `config/config.env` with the template listed below.
From the root directory run `yarn install`. It will install the dependencies in `/client` as well.

### Config file
**config/config.env**
APP_NAME=expenses-app
ENV=development
PORT=3003

**client/config/config.env**
PORT=3004

### DB Setup

## Development
This repo contains both the server and the clienr for the appilcation.
The server entrypoint is `/api/Server.js`, and the client entrypoint is `/client/src/index.js`.
In general, the API base-URL is `/api/`, and the app is served from `/app`.

### Server
When developing the API, it's enough to run the server only. Notice that it will serve the compiled client files, so if you plan to use the client make sure you run the build.

`yarn start`
_Optional:_ `yarn client-build`

### Client
When developing the client, it's best to run this for auto-recompiling:
`yarn client-dev`

## Deployment
yarn client-build

## Tests
yarn test
yarn test:client

## Views
/
/login
/profile
/expenses
/expense/:expenseId
/search
/admin/users
/admin/users/:userId
/admin/expenses
/admin/expense/:expenseId

## API
### endpoints:
### admin/manager endpoints:
### Authentication
