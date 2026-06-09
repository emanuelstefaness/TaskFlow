# DER — TaskFlow

## Diagrama

```mermaid
erDiagram
    USUARIO ||--o{ DEMANDA : cria
    USUARIO ||--o{ DEMANDA : responsavel

    USUARIO {
        string id PK
        string nome
        string email
        string senha_hash
        string role
    }

    DEMANDA {
        string id PK
        string titulo
        string descricao
        string prioridade
        string status
        date prazo
        string responsavel_id FK
        string criado_por_id FK
    }
```

## Entidades

**Usuario** — gestor ou funcionario

**Demanda** — tarefa com titulo, prioridade, status e prazo

## Relacionamentos

- gestor cria demandas (1:N)
- funcionario é responsavel por demandas (1:N)

## Tabelas

**usuarios:** id, nome, email, senha_hash, role, created_at, updated_at

**demandas:** id, titulo, descricao, prioridade, status, prazo, responsavel_id, criado_por_id, created_at, updated_at

Código: `api/prisma/schema.prisma`
