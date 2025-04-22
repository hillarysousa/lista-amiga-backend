# Lista Amiga - Backend

Este é o backend da aplicação **Lista Amiga**, desenvolvido com **NestJS** e **TypeORM**, utilizando **PostgreSQL** como banco de dados.

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

## 📁 Estrutura do Projeto

A estrutura do projeto segue a convenção do NestJS, com algumas customizações:

```
lista-amiga-backend/
├── src/
│   ├── firebase/         # Configuração do Firebase
│   ├── migrations/       # Migrações do banco de dados
│   ├── routes/           # Rotas da aplicação
│   ├── types/            # Tipagens auxiliares
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/                 # Testes automatizados
├── .dockerignore
├── .gitignore
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
├── env.config.ts
├── eslint.config.mjs
├── firebase.ts
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
└── typeorm.config.ts
```

## ⚙️ Configuração e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- Conta no [Firebase](https://firebase.google.com/) para utilizar o Admin SDK

### Passos para Executar Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/hillarysousa/lista-amiga-backend.git
   cd lista-amiga-backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   DB_HOST=db
   DB_PORT=5432
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=postgres
   DB_URL=url_do_banco
   FIREBASE_API_KEY=sua_api_key
   FIREBASE_AUTH_DOMAIN=seu_auth_domain
   FIREBASE_PROJECT_ID=seu_project_id
   FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   FIREBASE_APP_ID=seu_app_id
   FIREBASE_SERVICE_ACCOUNT='{seu_json_service_account}'
   ```

4. Execute a aplicação no Docker com Docker Compose:

   ```bash
   docker-compose up
   ```

   O banco está acessível no navegador via **pgAdmin** em `http://localhost:5050`

5. Execute a aplicação localmente:

   ```bash
   npm run start:dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## 🧪 Testes

Para executar os testes automatizados:

```bash
npm run test
```

## 📦 Migrações

Este projeto usa o TypeORM para controle de migrações. Aqui estão alguns comandos úteis:

```bash
# Cria uma nova migração
migrationName=NomeDaMigracao npm run typeorm:create-migration
# Gera uma nova migração
migrationName=NomeDaMigracao npm run typeorm:generate-migration

# Executa as migrações pendentes
npm run typeorm:run-migrations

# Reverte a última migração executada
npm run typeorm:revert-migration
```

## 🛠️ Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia a aplicação em modo de desenvolvimento
- `npm run build` - Compila a aplicação
- `npm run test` - Executa os testes
- `npm run lint` - Verifica o código com ESLint

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Para mais informações sobre a desenvolvedora, visite o [perfil no GitHub](https://github.com/hillarysousa) ou o [portfólio](https://hillarysousa.com.br).
