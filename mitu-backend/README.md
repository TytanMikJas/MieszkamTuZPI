## Installation

```bash
$ npm install
```

## Building the image

```bash
# inside mitu-backend directory
docker build -t mitu_backend .
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

```bash
# Swagger
https://localhost:3000/swagger
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Development

```bash
# migrate database (SUPABASE)
npx prisma migrate dev --name migration-name
```

## Development TLS certificates

1. install mkcert https://github.com/FiloSottile/mkcert/releases
2. create directory mitu-backend/secrets
3. run `mkcert -install localhost 127.0.0.1 ::1`
4. rename files to: `localhost-certificate.pem`, `localhost-key.pem`

## Database migrations

To create new database migration use: prisma migrate dev
To apply all previous migrations one by one use: prisma migrate deploy
Generating prisma client and database

```bash
  prisma db push

  # or If You wanna clear the database before:
  prisma db push --force-reset && prisma db seed
```

Invoking seed script (./prisma/seed.ts)

```bash
  prisma db seed
```
