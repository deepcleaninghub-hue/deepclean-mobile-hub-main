const { connectDB } = require('./src/config/database');

// Simple test to verify backend setup
async function testBackend() {
  console.log('🧪 Testing Deep Cleaning Hub Backend...\n');

  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await connectDB();
    console.log('✅ Database connection test completed\n');

    // Test environment variables
    console.log('🔍 Checking environment variables...');
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Missing environment variables:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\n📝 Please configure these in your .env file');
    } else {
      console.log('✅ All required environment variables are set');
    }

    console.log('\n🚀 Backend is ready to start!');
    console.log('📱 Run "npm run dev" to start the development server');
    console.log('🔗 Server will be available at: http://localhost:5000');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n💡 This is normal if Supabase is not configured yet');
    console.log('📝 Please configure your .env file and run the test again');
  }
}

// Run test
testBackend();
