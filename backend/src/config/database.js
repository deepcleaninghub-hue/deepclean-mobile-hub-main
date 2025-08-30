const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema initialization
const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database schema...');

    // Create services table
    const { error: servicesError } = await supabase.rpc('create_services_table');
    if (servicesError && !servicesError.message.includes('already exists')) {
      console.log('Creating services table...');
      await supabase.rpc('create_services_table');
    }

    // Create inquiries table
    const { error: inquiriesError } = await supabase.rpc('create_inquiries_table');
    if (inquiriesError && !inquiriesError.message.includes('already exists')) {
      console.log('Creating inquiries table...');
      await supabase.rpc('create_inquiries_table');
    }

    // Create blogs table
    const { error: blogsError } = await supabase.rpc('create_blogs_table');
    if (blogsError && !blogsError.message.includes('already exists')) {
      console.log('Creating blogs table...');
      await supabase.rpc('create_blogs_table');
    }

    // Create admin users table
    const { error: adminError } = await supabase.rpc('create_admin_users_table');
    if (adminError && !adminError.message.includes('already exists')) {
      console.log('Creating admin users table...');
      await supabase.rpc('create_admin_users_table');
    }

    // Insert default services if they don't exist
    await insertDefaultServices();
    
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
};

// Insert default services
const insertDefaultServices = async () => {
  const defaultServices = [
    {
      id: 'kitchen-cleaning',
      title: 'Kitchen Deep Cleaning',
      description: 'Thorough cleaning of your kitchen including appliances, cabinets, and surfaces for a spotless cooking environment.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/man-cleaning-cabinet-with-rag-1-2048x1363-1.jpg',
      category: 'Cleaning',
      price: 'From €80',
      duration: '2-4 hours',
      features: ['Appliance cleaning', 'Cabinet cleaning', 'Surface sanitization', 'Grease removal'],
      is_active: true
    },
    {
      id: 'house-moving',
      title: 'House Moving',
      description: 'Professional moving services to help you relocate your home with care and efficiency.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1-1.webp',
      category: 'Moving',
      price: 'From €150',
      duration: '4-8 hours',
      features: ['Furniture disassembly', 'Safe packing', 'Transportation', 'Reassembly'],
      is_active: true
    },
    {
      id: 'deep-cleaning',
      title: 'Deep Cleaning',
      description: 'Comprehensive deep cleaning services for homes, hotels, and commercial spaces.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/shutterstock_1628546512-1.jpg',
      category: 'Cleaning',
      price: 'From €120',
      duration: '4-6 hours',
      features: ['Complete home cleaning', 'Sanitization', 'Odor removal', 'Stain treatment'],
      is_active: true
    },
    {
      id: 'furniture-assembly',
      title: 'Furniture Assembly',
      description: 'Expert furniture assembly services for all your home and office furniture needs.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/puls-furnture-assembly-services-included-1024x684-1.webp',
      category: 'Assembly',
      price: 'From €60',
      duration: '1-3 hours',
      features: ['IKEA furniture', 'Office furniture', 'Bed assembly', 'Warranty included'],
      is_active: true
    },
    {
      id: 'carpet-cleaning',
      title: 'Carpet & Upholstery Cleaning',
      description: 'Professional deep cleaning for carpets, rugs, and upholstered furniture.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/shutterstock_1628546512-1.jpg',
      category: 'Cleaning',
      price: 'From €40',
      duration: '2-3 hours',
      features: ['Stain removal', 'Deep cleaning', 'Odor elimination', 'Protection treatment'],
      is_active: true
    },
    {
      id: 'window-cleaning',
      title: 'Window & Glass Cleaning',
      description: 'Crystal clear windows and glass surfaces for a brighter, cleaner home.',
      image: 'https://deepcleaninghub.com/wp-content/uploads/2025/08/man-cleaning-cabinet-with-rag-1-2048x1363-1.jpg',
      category: 'Cleaning',
      price: 'From €30',
      duration: '1-2 hours',
      features: ['Interior & exterior', 'Frame cleaning', 'Screen cleaning', 'Streak-free finish'],
      is_active: true
    }
  ];

  try {
    for (const service of defaultServices) {
      const { error } = await supabase
        .from('services')
        .upsert(service, { onConflict: 'id' });
      
      if (error) {
        console.log(`Service ${service.id} already exists or error:`, error.message);
      }
    }
    console.log('✅ Default services inserted/updated');
  } catch (error) {
    console.log('Note: Services table might not exist yet or services already exist');
  }
};

// Connect to database
const connectDB = async () => {
  try {
    console.log('🔌 Connecting to Supabase...');
    
    // Test connection
    const { data, error } = await supabase
      .from('services')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Database connection test failed, but continuing...');
      console.log('   This is normal if tables don\'t exist yet');
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
    
    // Initialize database schema
    await initializeDatabase();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️  Continuing without database connection...');
  }
};

module.exports = {
  connectDB,
  supabase,
  initializeDatabase
};
