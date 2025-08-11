# template-nextjs-starter

## Setup (local dev with Docker)
1. copy `.env.example` to `.env` and fill in secrets
2. `docker-compose up --build`
3. inside container / or locally run `npm install` then `npx prisma migrate dev --name init` and `npx prisma generate`
4. run seed: `npm run prisma:seed`
5. open http://localhost:3000 and http://localhost:8080 (adminer)

## Notes
- Use HTTPS in production and set COOKIE_SECURE=true
- Rotate secrets properly and consider using a secrets manager
- Replace mock user creation with proper sign-up flow
