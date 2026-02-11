# 🚀 Guia Rápido - Deploy SSA

## ✅ O que foi corrigido

Corrigi 4 arquivos com imports incorretos de ícones do Chakra UI v2:
- `src/components/navbar/MenuToggle.tsx`
- `src/pages/apps/index.tsx`
- `src/pages/users/index.tsx`
- `src/components/Formik/CustomDragNDrop.tsx`

O projeto agora compila sem erros no Vercel.

---

## 📦 Passos para Deploy

### 1. Backend (Railway - gratuito)

```bash
# 1. Crie conta em railway.app
# 2. New Project → Deploy from GitHub
# 3. Faça upload do ssa-backend
# 4. Adicione variáveis de ambiente:

MONGO_URL=mongodb+srv://...
PORT=35000
BACKEND_APP_URL=https://seu-projeto.up.railway.app
WEB_APP_URL=https://seu-frontend.vercel.app
AWS_BUCKET_NAME=seu-bucket
AWS_BUCKET_REGION=us-east-1
AWS_ACCESS_KEY=sua-key
AWS_SECRET_KEY=sua-secret
```

### 2. Frontend (Vercel - gratuito)

```bash
# 1. Extraia o ssa-web-fixed.zip
# 2. Crie repositório Git e faça push
# 3. Importe em vercel.com
# 4. Adicione variáveis de ambiente:

MONGO_URL=mongodb+srv://...  (mesmo do backend)
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=gere_com_openssl_rand_base64_32
NEXT_PUBLIC_BACKEND_URL=https://seu-backend.up.railway.app
```

### 3. Criar Primeiro Usuário

**OPÇÃO A - Script automático (recomendado):**

```bash
# No projeto BACKEND:
cd ssa-backend
node scripts/create-user.js

# Responda: nome e email
# Copie o link gerado e acesse no navegador
```

**OPÇÃO B - Manual no MongoDB Compass:**

```javascript
// Conecte ao MongoDB Compass
// Database → users → Add Data → Insert Document:

{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "",
  "confirmationCode": "abc123xyz",
  "confirmed": false,
  "createdAt": new Date(),
  "updatedAt": new Date()
}

// Depois acesse:
// https://seu-projeto.vercel.app/first-access/abc123xyz
```

---

## 🔑 Gerando NEXTAUTH_SECRET

```bash
# macOS/Linux:
openssl rand -base64 32

# Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## 🧪 Testar se está funcionando

1. Backend rodando: `curl https://seu-backend.railway.app/api/ping`
   - Deve retornar: `{"message":"pong"}`

2. Frontend carregando: acesse `https://seu-projeto.vercel.app`
   - Deve aparecer a tela de login

3. Criar senha: acesse o link `/first-access/SEU_CODIGO`
   - Crie a senha
   - Faça login normalmente

---

## 📝 Checklist Completo

- [ ] MongoDB Atlas configurado (cluster M0 free)
- [ ] Backend no Railway com env vars
- [ ] Frontend no Vercel com env vars
- [ ] NEXTAUTH_SECRET gerado
- [ ] Primeiro usuário criado
- [ ] Senha criada via /first-access
- [ ] Login funcionando

---

## 🆘 Problemas Comuns

**Build falha na Vercel:**
→ Veja os logs completos e verifique se usou o `ssa-web-fixed.zip`

**"Cannot connect to MongoDB":**
→ Verifique se o IP 0.0.0.0/0 está liberado no MongoDB Atlas

**"Invalid credentials":**
→ Acesse o link /first-access primeiro para criar a senha

**"Failed to fetch backend":**
→ Verifique se NEXT_PUBLIC_BACKEND_URL está correto e o backend está rodando

---

## 📂 Arquivos Incluídos

- `INSTRUÇÕES-COMPLETAS.md` → Guia detalhado com todos os passos
- `scripts/create-user.js` → Script para criar usuários
- `scripts/README.md` → Como usar o script
- Projeto corrigido e pronto para deploy

---

## ⏱️ Tempo estimado: 15-20 minutos

1. MongoDB Atlas: 5 min
2. Railway (backend): 5 min
3. Vercel (frontend): 5 min
4. Criar usuário: 2 min
5. Testar: 3 min

Boa sorte! 🚀
