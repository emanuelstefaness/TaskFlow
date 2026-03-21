# TaskFlow

Next.js + Tailwind.

## O que o sistema faz

É um painel para **organizar demandas de trabalho**: você entra com login (modo demonstração), vê um resumo em cards e uma lista, e o gestor pode **criar demandas** com título, descrição opcional, **quem vai fazer**, prioridade e prazo. Cada demanda aparece na lista geral; na área **Demandas** só entram as que foram **atribuídas ao seu usuário**. Tudo fica guardado no **navegador** (`localStorage`) — não há servidor nem banco de dados.

## Subir

```bash
npm install
npm run dev
```

## Login de teste

`gestor@taskflow.com` / `123` (definido em `app/page.tsx`).

## Telas

**Dashboard** — todas as demandas; gestor cria nova aqui.  
**Demandas** — só as que estão com o seu nome como responsável.  
**Perfil** — sair da conta.

Nomes para atribuir demanda: `lib/responsaveis.ts`.
