import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"];

const productNames = [
  "Wireless Bluetooth Earbuds", "Smart Fitness Watch", "Portable Bluetooth Speaker",
  "Men's Leather Wallet", "Women's Casual Sneakers", "Denim Jacket",
  "Non-Stick Cookware Set", "Electric Kettle", "Ceramic Dinner Set",
  "Organic Face Serum", "Matte Lipstick Set", "Herbal Shampoo",
  "Yoga Mat", "Adjustable Dumbbells Set", "Running Shoes",
  "Wireless Mouse", "Mechanical Keyboard", "USB-C Hub",
  "Sunglasses UV Protection", "Backpack for Laptop",
  "Table Lamp Modern Design", "Scented Candles Set",
  "Kids Building Blocks Toy", "Water Bottle Insulated",
  "Wall Clock Minimalist",
];

const descriptions = [
  "High-quality product designed for everyday comfort and durability.",
  "Combines modern design with practical functionality for daily use.",
  "Crafted with premium materials to ensure long-lasting performance.",
  "A must-have addition to your collection, offering style and utility.",
  "Designed with the user in mind, blending comfort and reliability.",
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const seller = await User.findOne({ role: "seller" });
    if (!seller) {
      console.log("No seller found. Please register a seller first.");
      process.exit(1);
    }

    const products = productNames.map((name, index) => ({
      seller: seller._id,
      name,
      description: descriptions[index % descriptions.length],
      price: Math.floor(Math.random() * 4500) + 500, // Rs. 500 - 5000
      category: categories[index % categories.length],
      stock: Math.floor(Math.random() * 50) + 10,
      images: [`https://picsum.photos/seed/${index + 1}/400/400`],
      isApproved: true,
    }));

    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedProducts();