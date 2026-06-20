require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const sampleProducts = [
  // ── Espresso ──────────────────────────────────────────────
  {
    name: 'Classic Espresso',
    description: 'A rich, bold shot of pure espresso crafted from our signature dark roast blend. Intense aroma with a velvety crema on top.',
    category: 'Espresso',
    price: 3.49,
    stock: 100,
    ratings: 4.8,
    numReviews: 124,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'espresso_1', url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Double Shot Espresso',
    description: 'Two shots of our finest espresso for those who need an extra kick. Bold, powerful and deeply satisfying.',
    category: 'Espresso',
    price: 4.49,
    stock: 80,
    ratings: 4.7,
    numReviews: 89,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'espresso_2', url: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600&h=600&fit=crop' }],
  },

  // ── Cappuccino ────────────────────────────────────────────
  {
    name: 'Classic Cappuccino',
    description: 'Equal parts espresso, steamed milk and silky foam. The perfect balance of bold coffee and creamy texture.',
    category: 'Cappuccino',
    price: 4.99,
    stock: 90,
    ratings: 4.9,
    numReviews: 201,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'cappuccino_1', url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Dry Cappuccino',
    description: 'Extra foam, less milk — for the purist who loves intense espresso flavor with a light, airy finish.',
    category: 'Cappuccino',
    price: 4.79,
    stock: 60,
    ratings: 4.5,
    numReviews: 55,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'cappuccino_2', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&h=600&fit=crop' }],
  },

  // ── Latte ─────────────────────────────────────────────────
  {
    name: 'Vanilla Latte',
    description: 'Smooth espresso blended with steamed whole milk and a touch of sweet vanilla. Creamy, comforting and irresistible.',
    category: 'Latte',
    price: 5.49,
    stock: 110,
    ratings: 4.9,
    numReviews: 312,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'latte_1', url: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Caramel Latte',
    description: 'Espresso and steamed milk swirled with rich caramel sauce. Sweet, buttery and absolutely indulgent.',
    category: 'Latte',
    price: 5.79,
    stock: 95,
    ratings: 4.8,
    numReviews: 278,
    isFeatured: false,
    isBestSeller: true,
    images: [{ public_id: 'latte_2', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Hazelnut Latte',
    description: 'A dreamy blend of espresso, steamed milk and toasted hazelnut syrup. Nutty, warm and wonderfully smooth.',
    category: 'Latte',
    price: 5.69,
    stock: 75,
    ratings: 4.7,
    numReviews: 143,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'latte_3', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&h=600&fit=crop' }],
  },

  // ── Mocha ─────────────────────────────────────────────────
  {
    name: 'Dark Chocolate Mocha',
    description: 'Espresso meets rich dark chocolate and velvety steamed milk. Topped with whipped cream for the ultimate treat.',
    category: 'Mocha',
    price: 5.99,
    stock: 85,
    ratings: 4.9,
    numReviews: 189,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'mocha_1', url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&h=600&fit=crop' }],
  },
  {
    name: 'White Chocolate Mocha',
    description: 'Creamy white chocolate sauce blended with espresso and steamed milk. Sweet, smooth and utterly satisfying.',
    category: 'Mocha',
    price: 5.99,
    stock: 70,
    ratings: 4.7,
    numReviews: 112,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'mocha_2', url: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=600&fit=crop' }],
  },

  // ── Cold Coffee ───────────────────────────────────────────
  {
    name: 'Cold Brew Classic',
    description: 'Steeped for 18 hours in cold water for an ultra-smooth, low-acid coffee concentrate. Served over ice.',
    category: 'Cold Coffee',
    price: 5.49,
    stock: 60,
    ratings: 4.8,
    numReviews: 167,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'cold_1', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Iced Caramel Macchiato',
    description: 'Layers of vanilla syrup, cold milk, ice and espresso drizzled with caramel. A visual and taste masterpiece.',
    category: 'Cold Coffee',
    price: 5.99,
    stock: 80,
    ratings: 4.9,
    numReviews: 245,
    isFeatured: false,
    isBestSeller: true,
    images: [{ public_id: 'cold_2', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Frappuccino Blended',
    description: 'Blended ice, espresso and creamy milk, topped with whipped cream. The ultimate iced coffee indulgence.',
    category: 'Cold Coffee',
    price: 6.49,
    stock: 55,
    ratings: 4.7,
    numReviews: 198,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'cold_3', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop' }],
  },

  // ── Tea ───────────────────────────────────────────────────
  {
    name: 'Matcha Green Tea Latte',
    description: 'Premium ceremonial-grade matcha whisked with steamed oat milk. Earthy, creamy and energizing.',
    category: 'Tea',
    price: 5.29,
    stock: 70,
    ratings: 4.8,
    numReviews: 134,
    isFeatured: true,
    isBestSeller: false,
    images: [{ public_id: 'tea_1', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Chai Tea Latte',
    description: 'Spiced black tea concentrate blended with steamed milk. Warm cinnamon, cardamom and ginger in every sip.',
    category: 'Tea',
    price: 4.99,
    stock: 65,
    ratings: 4.6,
    numReviews: 98,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'tea_2', url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=600&fit=crop' }],
  },

  // ── Snacks ────────────────────────────────────────────────
  {
    name: 'Butter Croissant',
    description: 'Flaky, golden layers of buttery pastry baked fresh every morning. The perfect coffee companion.',
    category: 'Snacks',
    price: 3.49,
    stock: 40,
    ratings: 4.7,
    numReviews: 88,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'snack_1', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Blueberry Muffin',
    description: 'Moist, fluffy muffin bursting with juicy blueberries and topped with a golden sugar crust.',
    category: 'Snacks',
    price: 3.29,
    stock: 45,
    ratings: 4.6,
    numReviews: 72,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'snack_2', url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Avocado Toast',
    description: 'Sourdough toast topped with smashed avocado, cherry tomatoes, feta and a drizzle of olive oil.',
    category: 'Snacks',
    price: 7.99,
    stock: 30,
    ratings: 4.8,
    numReviews: 61,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'snack_3', url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&h=600&fit=crop' }],
  },

  // ── Desserts ──────────────────────────────────────────────
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.',
    category: 'Desserts',
    price: 6.99,
    stock: 25,
    ratings: 4.9,
    numReviews: 156,
    isFeatured: true,
    isBestSeller: true,
    images: [{ public_id: 'dessert_1', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop' }],
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten fudge center. Served with a scoop of vanilla bean ice cream.',
    category: 'Desserts',
    price: 7.49,
    stock: 20,
    ratings: 4.9,
    numReviews: 203,
    isFeatured: false,
    isBestSeller: true,
    images: [{ public_id: 'dessert_2', url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop' }],
  },
  {
    name: 'New York Cheesecake',
    description: 'Dense, creamy cheesecake on a graham cracker crust. Topped with fresh strawberry compote.',
    category: 'Desserts',
    price: 6.49,
    stock: 22,
    ratings: 4.8,
    numReviews: 119,
    isFeatured: false,
    isBestSeller: false,
    images: [{ public_id: 'dessert_3', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=600&fit=crop' }],
  },
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${inserted.length} products successfully!\n`);

    // Summary by category
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    categories.forEach(cat => {
      const count = sampleProducts.filter(p => p.category === cat).length;
      console.log(`   ${cat}: ${count} product${count > 1 ? 's' : ''}`);
    });

    console.log('\n🚀 Database ready!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();
