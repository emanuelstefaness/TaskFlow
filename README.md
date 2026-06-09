# TaskFlow

Painel de demandas. Front Next.js + API NestJS com JWT.

## Rodar tudo

Clique duas vezes em **`rodar.bat`** (sobe API + front e abre o navegador).

## Front

```bash
npm install
npm run dev
```

http://localhost:3000

## API

```bash
cd api
npm install
npx prisma migrate dev
npm run start:dev
```

http://localhost:3001

## Login

| | E-mail | Senha |
|---|--------|-------|
| Gestor | gestor@taskflow.com | 123 |
| Funcionário | manu@taskflow.com | 123 |
