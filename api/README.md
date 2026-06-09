# API TaskFlow

NestJS + Prisma. DER em `../docs/DER.md`.

```bash
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

http://localhost:3001

Ver banco: `npm run prisma:studio`

| | E-mail | Senha |
|---|--------|-------|
| Gestor | gestor@taskflow.com | 123 |
| Funcionário | manu@taskflow.com | 123 |

Rotas: `/auth/login`, `/usuarios/funcionarios`, `/demandas`
