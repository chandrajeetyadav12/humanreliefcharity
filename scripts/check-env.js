// Quick check script to validate environment variables
// Run with: node scripts/check-env.js

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'BUCKET',
  'REGION',
  'ACCESS_KEY_ID',
  'SECRET_ACCESS_KEY',
];

console.log('🔍 Checking environment variables...\n');

let allPresent = true;
let warnings = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`❌ ${varName} - NOT SET`);
    allPresent = false;
  } else {
    // Mask sensitive values
    const displayValue = ['JWT_SECRET', 'SECRET_ACCESS_KEY', 'MONGODB_URI'].includes(varName)
      ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
      : value;
    
    console.log(`✅ ${varName} - ${displayValue}`);
    
    // Basic validation
    if (varName === 'JWT_SECRET' && value.length < 32) {
      warnings.push(`⚠️  ${varName} should be at least 32 characters long (current: ${value.length})`);
    }
    
    if (varName === 'MONGODB_URI' && !value.startsWith('mongodb')) {
      warnings.push(`⚠️  ${varName} should start with "mongodb://" or "mongodb+srv://"`);
    }
    
    if (varName === 'REGION' && value.toUpperCase() === value) {
      warnings.push(`⚠️  ${varName} should be lowercase (e.g., "us-east-1" not "${value}")`);
    }
  }
});

console.log('\n---\n');

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(w => console.log(w));
  console.log();
}

if (allPresent && warnings.length === 0) {
  console.log('✅ All environment variables are set correctly!');
  console.log('✅ Ready for deployment to AWS Amplify!');
  process.exit(0);
} else if (allPresent) {
  console.log('⚠️  All variables are set, but check the warnings above.');
  process.exit(0);
} else {
  console.log('❌ Missing required environment variables!');
  console.log('\n📋 Next steps:');
  console.log('   1. For local development: Create .env.local file');
  console.log('   2. For AWS Amplify: Set variables in Amplify Console');
  console.log('   3. See .env.example for required format');
  console.log('   4. See DEPLOYMENT_CHECKLIST.md for detailed guide');
  process.exit(1);
}
