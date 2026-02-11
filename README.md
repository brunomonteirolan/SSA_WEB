# SSA Web

Next.js frontend atualizado para versões modernas.

## O que foi atualizado

| Pacote | Antes | Depois |
|---|---|---|
| Next.js | 11 | 14 |
| next-auth | 3 | 4 |
| React | 17 | 18 |
| mongoose | 5.11 | 8.1 |
| Chakra UI | 1.3 | 2.8 |
| framer-motion | 3 | 10 |
| socket.io-client | 3 | 4 |
| SWR | 0.5 | 2.2 |
| TypeScript | 4 | 5 |
| @types/node | 14 | 20 |

## Principais mudanças de código

### next-auth v3 → v4
- `Provider` de `next-auth/client` → `SessionProvider` de `next-auth/react`
- `Providers.Credentials` → `CredentialsProvider` de `next-auth/providers/credentials`
- `useSession()` agora retorna `{ data: session, status }` em vez de `[session, loading]`
- `getSession({ req })` → `getServerSession(req, res, authOptions)` nas API routes
- Opção `database` removida (usando JWT puro, não precisava de BD para sessão)
- `callbacks.redirect` com `{ url, baseUrl }` em vez de `(_, baseUrl)`

### mongoose 5 → 8
- Removidas opções deprecadas: `useNewUrlParser`, `useUnifiedTopology`, `useFindAndModify`, `useCreateIndex`

### Next.js 11 → 14
- Link component: não precisa mais de `<a>` filho aninhado
- `MenuToggle`: `children` movido para prop `icon` do `IconButton`

### Chakra UI v1 → v2
- Compatível com React 18
- `ColorMode` config com `useSystemColorMode: false`

## Configuração

1. Copie `.env.local` e preencha:
```
MONGO_URL=mongodb://localhost:27017/myDatabase
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aqui
NEXT_PUBLIC_BACKEND_URL=http://localhost:35000
```

2. Instale e rode:
```bash
npm install
npm run dev
```

## Deploy (produção)
```bash
npm run build
npm start
```
