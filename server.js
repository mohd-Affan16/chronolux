const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock Products
const products = [
  {
    id: 1,
    name: "The Tourbillon Grand Complication",
    price: 125000,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
    description: "A masterpiece of Swiss engineering featuring a triple-axis tourbillon."
  },
  {
    id: 2,
    name: "Midnight Stellar Chronograph",
    price: 45000,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
    description: "Deep obsidian dial with 18k brushed gold hands and meteorite sub-dials."
  },
  {
    id: 3,
    name: "Heritage Perpetual Calendar",
    price: 85000,
    image: "/images/heritage_calendar.png",
    description: "Tracks time, day, month, and leap year accurately until 2100 without adjustment."
  },
  {
    id: 4,
    name: "Abyssal Diver Pro",
    price: 18500,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    description: "Water-resistant to 3000m with an automatic helium escape valve."
  }
];

// API: Get Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API: Process Payment (Simulation)
app.post('/api/process-payment', (req, res) => {
  const { cart, total } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  
  // Simulate 2 second delay for processing
  setTimeout(() => {
    res.json({ status: "Payment Successful", orderId: Math.floor(Math.random() * 1000000) });
  }, 2000);
});

// API: AI Concierge (Chat)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const msgLower = (message || "").toLowerCase();
  
  let reply = "Greetings. I am the Master Horologist of ChronoLux. How may I assist you with our bespoke timepieces today?";
  
  if (msgLower.includes("material") || msgLower.includes("metal")) {
    reply = "We craft our cases from 18-karat brushed gold and 904L aerospace-grade stainless steel. Our straps are meticulously stitched from Italian calf leather and rare alligator skin.";
  } else if (msgLower.includes("price") || msgLower.includes("cost") || msgLower.includes("expensive")) {
    reply = "True craftsmanship is an investment. Our entry pieces begin at ₹1,572,500, while our Grand Complications reach well over ₹8,500,000. Which tier shall we explore?";
  } else if (msgLower.includes("tourbillon") || msgLower.includes("movement") || msgLower.includes("complication")) {
    reply = "Ah, you have an eye for mechanics. Our in-house movements feature hand-beveled bridges, blued screws, and a triple-axis tourbillon designed to entirely negate the effects of gravity on precision.";
  } else if (msgLower.includes("hello") || msgLower.includes("hi")) {
    reply = "A pleasure to make your acquaintance. May I introduce you to the Midnight Stellar Chronograph, our most recent masterwork?";
  }

  res.json({ reply });
});

// API: Contact Submit
app.post('/api/contact-submit', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  console.log(`New Inquiry from ${name} (${email}): ${message}`);
  res.json({ status: "Inquiry Received. A concierge will reach out within 24 hours." });
});

app.listen(PORT, () => {
  console.log(`ChronoLux server running on port ${PORT}`);
});
