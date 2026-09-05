import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";

// Fill "url" for each product with your own image link
const productData = [
  { name: "Wireless Bluetooth Earbuds", category: "Electronics", url: "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Smart Fitness Watch", category: "Electronics", url: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Portable Bluetooth Speaker", category: "Electronics", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Wireless Mouse", category: "Electronics", url: "https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Mechanical Keyboard", category: "Electronics", url: "https://images.unsplash.com/photo-1632079003110-d694908500da?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "USB-C Hub Adapter", category: "Electronics", url: "https://images.unsplash.com/photo-1639675960002-2f414c58ed79?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Noise Cancelling Headphones", category: "Electronics", url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Power Bank 20000mAh", category: "Electronics", url: "https://images.unsplash.com/photo-1706275399524-813e89914e43?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Men's Leather Wallet", category: "Fashion", url: "https://images.unsplash.com/photo-1614330315526-166f2d71e544?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Women's Casual Sneakers", category: "Fashion", url: "https://images.unsplash.com/photo-1641997465126-c73cc4070337?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Denim Jacket", category: "Fashion", url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Sunglasses UV Protection", category: "Fashion", url: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Leather Handbag", category: "Fashion", url: "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Men's Formal Shirt", category: "Fashion", url: "https://images.unsplash.com/photo-1642764873654-9eef0467b342?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Backpack for Laptop", category: "Fashion", url: "https://images.unsplash.com/photo-1668114844900-537ab91478b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Analog Wrist Watch", category: "Fashion", url: "https://images.unsplash.com/photo-1696774690902-6e2057307e20?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Non-Stick Cookware Set", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1584990347165-6da57a4be47d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Electric Kettle", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1738520420652-0c47cea3922b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Ceramic Dinner Set", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1660217594804-92a67cdd8e63?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Table Lamp Modern Design", category: "Home & Kitchen", url: "https://plus.unsplash.com/premium_photo-1672166939372-5b16118eee45?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Scented Candles Set", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1643122966676-29e8597257f7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Wall Clock Minimalist", category: "Home & Kitchen", url: "https://plus.unsplash.com/premium_photo-1744471321853-5a3a8378c1fa?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Coffee Maker Machine", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1565452344518-47faca79dc69?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Throw Pillow Set", category: "Home & Kitchen", url: "https://images.unsplash.com/photo-1538577880403-f9998e75dd06?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Organic Face Serum", category: "Beauty", url: "https://images.unsplash.com/photo-1575508945826-d2412b1b1747?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Matte Lipstick Set", category: "Beauty", url: "https://plus.unsplash.com/premium_photo-1677172236687-dd440c298cb6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Herbal Shampoo", category: "Beauty", url: "https://images.unsplash.com/photo-1660090455967-24cf8b0eb58d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Facial Cleansing Brush", category: "Beauty", url: "https://images.unsplash.com/photo-1711577735131-ce758887a1d6?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Perfume Eau de Parfum", category: "Beauty", url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Hair Dryer Professional", category: "Beauty", url: "https://images.unsplash.com/photo-1727364438136-6edc10ef0a52?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Yoga Mat", category: "Sports", url: "https://images.unsplash.com/photo-1591291621164-2c6367723315?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Adjustable Dumbbells Set", category: "Sports", url: "https://images.unsplash.com/photo-1697129392091-d08875930fec?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Running Shoes", category: "Sports", url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Cycling Helmet", category: "Sports", url: "https://images.unsplash.com/photo-1601971360277-7b4c8aa60894?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Water Bottle Insulated", category: "Sports", url: "https://images.unsplash.com/photo-1544003484-3cd181d17917?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Resistance Bands Set", category: "Sports", url: "https://plus.unsplash.com/premium_photo-1672280783581-cd302f891599?q=80&w=1013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Football Size 5", category: "Sports", url: "https://images.unsplash.com/photo-1511342603327-463faeb51b6f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Kids Building Blocks Toy", category: "Toys", url: "https://images.unsplash.com/photo-1631106256072-54c89defe828?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Remote Control Car", category: "Toys", url: "https://plus.unsplash.com/premium_photo-1734631337834-60b1b76e5821?q=80&w=1355&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Board Game Family Pack", category: "Toys", url: "https://images.unsplash.com/photo-1547998625-b9eb3adba158?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
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

    const seller = await User.findOne({ email: "sellernab@gmail.com.com" });
    if (!seller) {
      console.log("Seller not found with that email. Please check the email.");
      process.exit(1);
    }

    const products = productData.map((item, index) => ({
      seller: seller._id,
      name: item.name,
      description: descriptions[index % descriptions.length],
      price: Math.floor(Math.random() * 4500) + 500,
      category: item.category,
      stock: Math.floor(Math.random() * 50) + 10,
      images: item.url ? [item.url] : [],
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