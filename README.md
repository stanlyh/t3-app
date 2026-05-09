# T3 App — Gestor de Todos

Aplicación full-stack construida con el **T3 Stack**: Next.js, tRPC, Prisma, NextAuth y Tailwind CSS.

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (Pages Router) | 15.x |
| API type-safe | tRPC | 11.x |
| ORM | Prisma | 6.x |
| Autenticación | NextAuth.js | 4.x |
| Estilos | Tailwind CSS | 4.x |
| Validación | Zod | 3.x |
| Cache/Estado | React Query | 5.x |
| Base de datos | MySQL (PlanetScale) | — |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                            │
│                                                             │
│   /               /todos/create      /todos/show            │
│   (index.tsx)     (create.tsx)       (show.tsx)             │
│        │               │                  │                 │
│        └───────────────┴──────────────────┘                 │
│                        │                                    │
│              React Query + tRPC Client                      │
│              (src/utils/api.ts)                             │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP /api/trpc/[trpc]
┌─────────────────────────────▼───────────────────────────────┐
│                       SERVIDOR (Next.js)                    │
│                                                             │
│   /api/auth/[...nextauth]      /api/trpc/[trpc]             │
│   (NextAuth handler)           (tRPC handler)               │
│          │                           │                      │
│          │                    tRPC Router (root.ts)         │
│          │                    ┌──────┴──────┐               │
│          │               example        todosRouter         │
│          │               Router          Router             │
│          │                           (todos.ts)             │
│          │                                │                 │
│          └──────────────┬─────────────────┘                 │
│                         │                                   │
│                   Prisma Client                             │
│                   (src/server/db.ts)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  MySQL — PlanetScale                        │
│                                                             │
│   User  ──< Account                                         │
│   User  ──< Session                                         │
│   User  ──< Todo                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Páginas y cómo interactúan

### `/` — Página principal
- Muestra el nombre del usuario autenticado
- Botón **Sign in / Sign out** conectado a NextAuth
- Llama a `api.example.hello` para verificar la conexión tRPC
- Si hay sesión activa, también consulta `api.example.getSecretMessage`

### `/todos/create` — Crear un todo
- Formulario con campos **Name** y **Description**
- Requiere sesión activa (la mutación está protegida en el servidor)
- Al enviar llama a `api.todosRouter.createTodo.useMutation()`
- El servidor asocia el todo al `userId` de la sesión actual
- Confirma la creación con un `alert`

### `/todos/show` — Ver todos
- Consulta `api.todosRouter.getTodos.useQuery()`
- El servidor filtra y devuelve **solo los todos del usuario autenticado**
- Muestra los resultados en una tabla con columnas: ID, Title, Description
- Mientras carga muestra un mensaje de estado

---

## Flujo de datos (ejemplo: crear un todo)

```
create.tsx
   │
   ├─ useMutation() → tRPC Client
   │                       │
   │               POST /api/trpc/todosRouter.createTodo
   │                       │
   │              tRPC Server (trpc.ts)
   │                       │
   │              protectedProcedure ──► verifica sesión (NextAuth)
   │                       │
   │              prisma.todo.create({ userId: session.user.id, ... })
   │                       │
   │                  PlanetScale MySQL
   │                       │
   └─ onSuccess → alert("Todo creado")
```

---

## Modelos de base de datos

```prisma
model Todo {
    id          String  @id @default(cuid())
    name        String
    description String
    userId      String
    author      User    @relation(fields: [userId], references: [id])
}

model User {
    id       String  @id @default(cuid())
    name     String?
    email    String? @unique
    Todo     Todo[]
    // + campos de NextAuth (accounts, sessions)
}
```

---

## Estructura de archivos clave

```
src/
├── pages/
│   ├── index.tsx                    ← Página principal
│   ├── _app.tsx                     ← Provider global (tRPC + Session)
│   ├── todos/
│   │   ├── create.tsx               ← Formulario crear todo
│   │   └── show.tsx                 ← Listado de todos
│   └── api/
│       ├── auth/[...nextauth].ts    ← Endpoints de NextAuth
│       └── trpc/[trpc].ts           ← Endpoint de tRPC
├── server/
│   ├── auth.ts                      ← Configuración NextAuth
│   ├── db.ts                        ← Singleton Prisma Client
│   └── api/
│       ├── trpc.ts                  ← Contexto y middleware tRPC
│       ├── root.ts                  ← Router principal
│       └── routers/
│           ├── todos.ts             ← Procedimientos de todos
│           └── example.ts           ← Procedimientos de ejemplo
└── utils/
    └── api.ts                       ← Cliente tRPC (frontend)
```

---

## En este ejemplo se utiliza una base de datos MYSQL desde PlanetScale (stanlydb)
### En el .env reemplzar por la URL para conectar con el ORM prisma
~~~
DATABASE_URL='mysql://uq61sylh8fvka9dshjqm:pscale_pw_nddN4I3wcRBjdZ8iZ7xD6sRw22ITATG0n87ZGThZE8S@aws.connect.psdb.cloud/stanlydb?sslaccept=strict'
~~~

### En schema.prisma (mysql en lugar de sqlite)
~~~
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "mysql" 👈
  url = env("DATABASE_URL")
  relationMode = "prisma" 👈
}
~~~

### Para que se suba a PlanetScale:
~~~
npx prisma db push
~~~

### Generar el cliente de prisma para la base de datos
~~~
npx prisma generate client
~~~
Devuelve:
~~~
✔ Generated Prisma Client (4.13.0 | library) to .\node_modules\@prisma\client in 141ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
~~~

## Configuración acceso con GITHUB
- Settings
- <> Developer settins
- OAuth Apps
- New
- Homapage URL: http://localhost:3000
- Autorization callback URL: http://localhost:3000/api/auth/callback/github
- Generate
- Client ID para la variable de entorno GITHUB_CLIENT_ID=""
- Generar un Clien secrets para la variable de entorno GITHUB_CLIENT_SECRET=""

## Reemplazar las variable de entorno en archivo env.mjs
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

### En el archivo .env indicar el valor de la variable NEXTAUTH_SECRET="changethisonprod"

### Dentro del archivo `src/pages/api/auth/[...nextauth].ts` en authOptions reemplazar la palabra "discord" por "github"

### reemplazar el DiscordProvider por GithubProvider:
~~~
GithubProvider({
  clientId:env.GITHUB_CLIENT_ID,
  clientSecret:env.GITHUB_CLIENT_SECRET
})
~~~
### Ejecutar la aplicación:
~~~
npm run dev
~~~
### Para ejecutar una visualización de la DB mas amigable
~~~
npx prisma studio
~~~

> NOTAS: Basado en el video tutorial de T3 stack realizado por ***manumrtf***
> todos los derechoa al autororiginal.
