require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    console.log('\n🔧 Criador de Usuário - SSA\n');

    // Conecta ao MongoDB
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      console.error('❌ MONGO_URL não encontrada no .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUrl);
    console.log('✓ Conectado ao MongoDB\n');

    // Schema do usuário
    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      confirmationCode: { type: String, required: true, unique: true },
      confirmed: { type: Boolean, default: false }
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

    // Solicita informações
    const name = await question('Nome do usuário: ');
    const email = await question('Email: ');

    // Verifica se já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n❌ Já existe um usuário com este email!');
      
      if (existingUser.confirmationCode && !existingUser.confirmed) {
        console.log('\n📋 Código de confirmação existente:', existingUser.confirmationCode);
        console.log('🔗 Link:', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/first-access/${existingUser.confirmationCode}`);
      }
      
      await mongoose.disconnect();
      rl.close();
      process.exit(0);
    }

    // Gera confirmation code único
    const confirmationCode = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);

    // Cria o usuário
    const user = await User.create({
      name,
      email,
      password: '', // Vazio - será definido no first-access
      confirmationCode,
      confirmed: false
    });

    console.log('\n✓ Usuário criado com sucesso!\n');
    console.log('📋 INFORMAÇÕES IMPORTANTES:');
    console.log('━'.repeat(60));
    console.log('Nome:', user.name);
    console.log('Email:', user.email);
    console.log('Código de Confirmação:', confirmationCode);
    console.log('━'.repeat(60));
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.log('\n🔗 LINK DE PRIMEIRO ACESSO:');
    console.log(`${baseUrl}/first-access/${confirmationCode}`);
    console.log('\n⚠️  Salve este link! O usuário precisa acessá-lo para criar a senha.\n');

    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    if (error.code === 11000) {
      console.error('Este email já está cadastrado no sistema.');
    }
    rl.close();
    process.exit(1);
  }
}

createUser();
