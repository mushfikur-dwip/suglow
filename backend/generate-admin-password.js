// Generate hashed password for admin user
// Run: node generate-admin-password.js

import bcrypt from 'bcryptjs';

const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n=== Admin User Setup ===\n');
  console.log('Password:', password);
  console.log('Hashed:', hash);
  console.log('\nSQL Query:');
  console.log(`
INSERT INTO users (first_name, last_name, email, password, role, status, email_verified) 
VALUES ('Admin', 'User', 'admin@suglow.com', '${hash}', 'admin', 'active', TRUE);
  `);
  console.log('\nCopy the SQL query above and run it in phpMyAdmin!\n');
});
