# Instruções Completas - SSA Web no Vercel

## 1. Como criar usuário no MongoDB

### Opção A: Via código (recomendado)

Crie um arquivo temporário `scripts/create-user.js` na raiz do projeto **backend**:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function createUser() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✓ Conectado ao MongoDB');

    // Schema do usuário
    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      confirmationCode: { type: String, required: true, unique: true },
      confirmed: { type: Boolean, default: false }
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

    // Gera confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 15);

    // Cria o usuário (sem senha ainda)
    const user = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '', // Vazio por enquanto
      confirmationCode: confirmationCode,
      confirmed: false
    });

    console.log('✓ Usuário criado com sucesso!');
    console.log('\n📋 INFORMAÇÕES IMPORTANTES:');
    console.log('Email:', user.email);
    console.log('Confirmation Code:', confirmationCode);
    console.log('\n🔗 Link de primeiro acesso:');
    console.log(`http://localhost:3000/first-access/${confirmationCode}`);
    console.log('\nOu na produção:');
    console.log(`https://seu-dominio.vercel.app/first-access/${confirmationCode}`);
    console.log('\nAcesse esse link para criar a senha do usuário.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createUser();
```

Depois execute:

```bash
cd ssa-backend
node scripts/create-user.js
```

Copie o link de primeiro acesso e cole no navegador para criar a senha.

---

### Opção B: Via MongoDB Compass (GUI)

1. Abra o MongoDB Compass e conecte ao seu banco
2. Vá para a database do projeto (ex: `sacoa_super_app`)
3. Crie uma collection chamada `users` (se não existir)
4. Clique em "Add Data" → "Insert Document"
5. Cole este JSON:

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "",
  "confirmationCode": "abc123xyz456",
  "confirmed": false,
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

6. Clique em "Insert"
7. Acesse `http://localhost:3000/first-access/abc123xyz456` para criar a senha

---

### Opção C: Via MongoDB Shell

```bash
# Conecte ao MongoDB
mongosh "sua-connection-string"

# Use o database correto
use sacoa_super_app

# Insira o usuário
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "",
  confirmationCode: "abc123xyz456",
  confirmed: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

# Confirme a criação
db.users.findOne({ email: "admin@example.com" })
```

Depois acesse: `http://localhost:3000/first-access/abc123xyz456`

---

## 2. Deploy no Vercel

### Passo 1: Prepare o projeto

1. Extraia o `ssa-web-fixed.zip`
2. Certifique-se que tem um `.gitignore`:

```
node_modules/
.next/
.env.local
.vercel
```

3. Inicialize um repositório Git (se ainda não tiver):

```bash
cd ssa-web
git init
git add .
git commit -m "Initial commit"
```

4. Suba para o GitHub/GitLab/Bitbucket

---

### Passo 2: Conecte à Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório
4. Configure as variáveis de ambiente:

**Environment Variables (TODAS obrigatórias):**

```env
# MongoDB (mesmo que o backend)
MONGO_URL=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/myDatabase

# NextAuth (URL do seu site)
NEXTAUTH_URL=https://seu-projeto.vercel.app

# NextAuth Secret (gere um aleatório)
NEXTAUTH_SECRET=sua_string_secreta_aleatoria_de_32_caracteres_ou_mais

# Backend URL (Railway, Render, etc)
NEXT_PUBLIC_BACKEND_URL=https://ssa-backend.up.railway.app
```

**Como gerar NEXTAUTH_SECRET:**

```bash
# No terminal (macOS/Linux):
openssl rand -base64 32

# No PowerShell (Windows):
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

5. Clique em "Deploy"

---

### Passo 3: Configure o domínio personalizado (opcional)

1. Na Vercel, vá em "Settings" → "Domains"
2. Adicione seu domínio customizado
3. Configure os DNS records conforme instruções da Vercel

---

## 3. Checklist Completo

### Backend (Railway/Render/VPS)

- [ ] Backend rodando com `npm start` (porta 35000 ou variável PORT)
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB conectado
- [ ] Teste: `curl https://seu-backend.railway.app/api/ping` retorna "pong"

### Frontend (Vercel)

- [ ] Código corrigido (ssa-web-fixed.zip)
- [ ] Repositório Git criado e enviado
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído sem erros
- [ ] Teste: acesse `https://seu-projeto.vercel.app`

### Banco de Dados (MongoDB Atlas)

- [ ] Cluster criado (M0 Free Tier)
- [ ] Usuário do banco criado
- [ ] Network Access liberado (0.0.0.0/0)
- [ ] Connection string copiada
- [ ] Usuário da aplicação criado (via script ou Compass)

### Primeiro Acesso

- [ ] Acesse: `https://seu-projeto.vercel.app/first-access/SEU_CONFIRMATION_CODE`
- [ ] Crie a senha
- [ ] Faça login em `https://seu-projeto.vercel.app`

---

## 4. Troubleshooting

### Erro: "Cannot connect to MongoDB"

```bash
# Verifique a connection string
echo $MONGO_URL

# Teste a conexão diretamente
mongosh "sua-connection-string"
```

### Erro: "NextAuth configuration error"

Verifique se:
- `NEXTAUTH_URL` aponta para o domínio correto (com `https://`)
- `NEXTAUTH_SECRET` está preenchido
- As variáveis estão na seção correta do Vercel (Production/Preview/Development)

### Erro: "Failed to fetch backend"

Verifique se:
- `NEXT_PUBLIC_BACKEND_URL` está correto
- O backend está rodando (acesse `/api/ping`)
- Não há CORS bloqueando (backend deve permitir origin do frontend)

### Build falha na Vercel

1. Veja os logs de build completos
2. Verifique se todas as dependências estão no `package.json`
3. Confirme que o TypeScript não tem erros (rode `npm run build` localmente)

---

## 5. Comandos Úteis

```bash
# Testar localmente antes de fazer deploy
npm run build
npm run start

# Ver logs do backend (Railway)
railway logs

# Fazer redeploy na Vercel
vercel --prod

# Limpar cache do Next.js
rm -rf .next
npm run build
```

---

## 6. Estrutura Final

```
[Usuário]
    ↓
[Vercel] → Next.js Frontend (ssa-web)
    ↓
[Railway/Render] → Express Backend (ssa-backend)
    ↓
[MongoDB Atlas] → Banco de dados
```

Todos os três serviços precisam estar rodando e configurados corretamente para o sistema funcionar.
