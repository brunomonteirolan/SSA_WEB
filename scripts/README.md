# Scripts de Utilidade

## create-user.js

Script para criar usuários no MongoDB.

### Como usar:

**⚠️ IMPORTANTE: Este script deve ser executado no projeto BACKEND, não no frontend!**

1. Copie o arquivo `create-user.js` para a pasta do backend:
   ```bash
   cp scripts/create-user.js ../ssa-backend/scripts/
   ```

2. No projeto backend, certifique-se que o `.env` está configurado com `MONGO_URL`

3. Execute o script:
   ```bash
   cd ssa-backend
   node scripts/create-user.js
   ```

4. Responda as perguntas (nome e email)

5. Copie o link gerado e acesse no navegador para criar a senha

### Exemplo de uso:

```bash
$ node scripts/create-user.js

🔧 Criador de Usuário - SSA

✓ Conectado ao MongoDB

Nome do usuário: João Silva
Email: joao@example.com

✓ Usuário criado com sucesso!

📋 INFORMAÇÕES IMPORTANTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: João Silva
Email: joao@example.com
Código de Confirmação: k9f3j2d8x7m1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 LINK DE PRIMEIRO ACESSO:
http://localhost:3000/first-access/k9f3j2d8x7m1

⚠️  Salve este link! O usuário precisa acessá-lo para criar a senha.
```

### Notas:

- O script usa a variável `MONGO_URL` do `.env`
- Se o email já existir, mostra o código de confirmação existente
- A senha é criada pelo próprio usuário ao acessar o link de first-access
- Em produção, substitua `http://localhost:3000` pela URL do Vercel
