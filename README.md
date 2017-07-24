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
PG_HOST=localhost
PG_PORT=5432
PG_USER=expenses_admin
PG_PASSWORD=
PG_DB=expenses_db
TZ=utc
COOKIE_SECRET=
COOKIE_DAYS_TOEXPIRE=90

**client/config/config.env**
PORT=3004

### DB Setup
Set up a PostgreSQL DB (version 9.6 or greater), then create a database:
```sql
CREATE DATABASE expenses_db WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = -1;
REVOKE ALL ON DATABASE expenses_db FROM public;
```
Then, create an admin user and set its permissions:
```sql
CREATE ROLE expenses_admin LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE expenses_db TO expenses_admin;
```
For RDS/Google-Cloud, grant expenses_admin to the default user (postgres):
```sql
GRANT expenses_admin TO postgres WITH ADMIN OPTION;
```
Then, create a schema with the admin user as its owner:
```sql
CREATE SCHEMA expenses AUTHORIZATION expenses_admin;
SET search_path = expenses;
ALTER ROLE expenses_admin IN DATABASE expenses_db SET search_path = expenses;
GRANT USAGE, CREATE ON SCHEMA expenses TO expenses_admin;
```
Then, import a snapshot, or create the essential tables using the `db_migrations/latest.sql` script.


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
yarn test:api
yarn test:client

Create a test db for e2e tests:
```sql
CREATE DATABASE expenses_test_db WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = -1;
REVOKE ALL ON DATABASE expenses_test_db FROM public;
GRANT ALL ON DATABASE expenses_test_db TO expenses_admin;
GRANT expenses_admin TO postgres WITH ADMIN OPTION;
```

## Views
/
/login
/profile
/expenses
/admin/users
/admin/users/:userId/expenses

## API

### endpoints:
**baseUrl**: `/api`
POST __/register__
POST __/login__
GET __/logout__
GET __/profile__
PUT __/profile__
GET __/expenses?year=:year&week=:week&day=monday__
POST __/expenses__
GET __/expenses/:expenseId__
PUT __/expenses/:expenseId__
DELETE __/expenses/:expenseId__

### admin/manager endpoints:
**baseUrl**: `/api/admin`
GET __/users__
POST __/users__
GET __/users/:userId__
PUT __/users/:userId__
DELETE __/users/:userId__
GET __/user/:userId/expenses?year=:year&week=:week__
POST __/user/:userId/expenses__
GET __/expenses/:expenseId__
PUT __/expenses/:expenseId__
DELETE __/expenses/:expenseId__

### Authentication
Call `/login` with credentials. A successful request will set a cookie `session` with a token.
Send this token in the Cookie header with all following API requests.
Some API requests may set a new token.

### Issues
- Search expenses
- Currency
- Timezones
- Localized date/time formats
- Reset password
- Activity logs
- Redirect to login on session-expired
- URL for expenses week/id
- Mockup data
