# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
# t3-app

### Instalar T3
~~~
folder> npm create t3-app@latest
~~~

### Need to install the following packages:
~~~
  create-t3-app@7.11.0
~~~
Ok to proceed? (y) y
~~~
   ___ ___ ___   __ _____ ___   _____ ____    __   ___ ___
  / __| _ \ __| /  \_   _| __| |_   _|__ /   /  \ | _ \ _ \
 | (__|   / _| / /\ \| | | _|    | |  |_ \  / /\ \|  _/  _/
  \___|_|_\___|_/‾‾\_\_| |___|   |_| |___/ /_/‾‾\_\_| |_|
~~~

#### ? What will your project be called? **t3-app**

#### ? Will you be using TypeScript or JavaScript? **TypeScript**

Good choice! Using TypeScript!

#### ? Which packages would you like to enable? ***nextAuth, prisma, tailwind, trpc***

#### ? Initialize a new git repository? **No**

Sounds good! You can come back and run git init later.

#### ? Would you like us to run 'npm install'? **Yes**

Alright. We'll install the dependencies for you!

#### ? What import alias would you like configured? ~/
~~~
npm run dev
~~~

| Left-Aligned  | Center Aligned  | Right Aligned |<!-- --> |
|:------------- |:---------------:| -------------:|---------|
| Row 1         | **Bold**        | Cell 3        |Cell 10  |
| Row 2         | *Italic*        | Cell 6        |Cell 11  |
| Row 3         | ~~Strike~~      | Cell 9        |Cell 12  |
| Row 3         | [Link](dot.com) | 👉 &#124;      |Cell 13 |
$${\color{lightgreen}Light \space Green}$$
$${\color{blue}Blue}$$
<span style="color:red">cardenales</span>

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
