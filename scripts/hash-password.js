const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'password123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('\nPassword:', password);
  console.log('Hashed:', hash);
  console.log('\nUse this hash in your Supabase users table.\n');
});

