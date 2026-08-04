function unsplashImg(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
}

const PRODUCTS = [
  { id: "p01", name: "Trail Runner Backpack", category: "Outdoors", price: 64.99, discount: 0.15, rating: 4.6, reviews: 128, stock: 12, color: "#3e64ff", image: unsplashImg("photo-1726711340800-d3709587de53"), description: "A lightweight 28L pack built for long trail days, with a ventilated back panel and a dedicated hydration sleeve." },
  { id: "p02", name: "Insulated Water Bottle", category: "Outdoors", price: 18.5, discount: 0, rating: 4.8, reviews: 342, stock: 40, color: "#3e64ff", image: unsplashImg("photo-1649867219867-3faeab653df9"), description: "Double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12." },
  { id: "p03", name: "Camping Hammock", category: "Outdoors", price: 39, discount: 0.1, rating: 4.4, reviews: 76, stock: 18, color: "#3e64ff", image: unsplashImg("photo-1623387417641-d1a31753f78e"), description: "Parachute-nylon hammock with aluminium carabiners, packs down to the size of a grapefruit." },
  { id: "p04", name: "Ceramic Pour-Over Coffee Set", category: "Home", price: 32, discount: 0, rating: 4.7, reviews: 91, stock: 22, color: "#e8823c", image: unsplashImg("photo-1582768772255-7fb8066357ce"), description: "Hand-glazed ceramic dripper and carafe set for a cleaner, brighter cup of coffee." },
  { id: "p05", name: "Linen Throw Blanket", category: "Home", price: 45, discount: 0.2, rating: 4.5, reviews: 64, stock: 15, color: "#e8823c", image: unsplashImg("photo-1600369672770-985fd30004eb"), description: "Pre-washed European linen throw, breathable and gets softer with every wash." },
  { id: "p06", name: "Desk Plant Terrarium", category: "Home", price: 27.5, discount: 0, rating: 4.3, reviews: 38, stock: 25, color: "#e8823c", image: unsplashImg("photo-1416339411116-62e1226aacd8"), description: "Self-contained glass terrarium with moss and succulents — low maintenance, no green thumb required." },
  { id: "p07", name: "Aroma Diffuser", category: "Home", price: 29.99, discount: 0, rating: 4.2, reviews: 57, stock: 30, color: "#e8823c", image: unsplashImg("photo-1635575066917-e788c2bd06b7"), description: "Ultrasonic diffuser with a 7-colour LED ring and a 400ml tank for all-night runtime." },
  { id: "p08", name: "Wireless Mechanical Keyboard", category: "Tech", price: 89, discount: 0, rating: 4.6, reviews: 210, stock: 20, color: "#2fa36b", image: unsplashImg("photo-1562819606-b7a0ebd7e7c5"), description: "Hot-swappable mechanical keyboard with a low-latency 2.4GHz connection and 3-device Bluetooth switching." },
  { id: "p09", name: "Noise-Cancelling Earbuds", category: "Tech", price: 119, discount: 0.25, rating: 4.5, reviews: 483, stock: 33, color: "#2fa36b", image: unsplashImg("photo-1756902368926-eb9e5e9d2a69"), description: "True-wireless earbuds with adaptive ANC and 30 hours of total battery life with the case." },
  { id: "p10", name: "Portable SSD 1TB", category: "Tech", price: 74.99, discount: 0, rating: 4.7, reviews: 156, stock: 27, color: "#2fa36b", image: unsplashImg("photo-1518547606470-00ac2ae882af"), description: "Pocket-sized 1TB SSD rated for 1050MB/s reads — fast enough for on-location video editing." },
  { id: "p11", name: "Smart Desk Lamp", category: "Tech", price: 42, discount: 0, rating: 4.1, reviews: 45, stock: 0, color: "#2fa36b", image: unsplashImg("photo-1609842584868-ac6620dada7b"), description: "App-controlled desk lamp with adjustable colour temperature and a built-in wireless charging base." },
  { id: "p12", name: "Merino Wool Beanie", category: "Fashion", price: 22, discount: 0, rating: 4.6, reviews: 88, stock: 50, color: "#b5539a", image: unsplashImg("photo-1544967919-44c1ef2f9e7a"), description: "Fine-gauge merino beanie, warm without the itch, folds flat for travel." },
  { id: "p13", name: "Canvas Tote Bag", category: "Fashion", price: 16.5, discount: 0.1, rating: 4.4, reviews: 133, stock: 60, color: "#b5539a", image: unsplashImg("photo-1574365569389-a10d488ca3fb"), description: "Heavyweight 16oz canvas tote with an internal pocket, holds its shape even when full." },
  { id: "p14", name: "Leather Card Wallet", category: "Fashion", price: 34, discount: 0, rating: 4.5, reviews: 71, stock: 24, color: "#b5539a", image: unsplashImg("photo-1614330316567-11d8e572db16"), description: "Full-grain leather card wallet that develops a natural patina with age." }
];

const DEMO_ACCOUNTS = [
  { email: "admin@demo.com", password: "demo", role: "admin", name: "Admin Demo" },
  { email: "user@demo.com", password: "demo", role: "user", name: "Alex Demo" }
];

const DEFAULT_BANNER = {
  active: true,
  text: "Summer Sale — enjoy 15% off everything with code SUMMER15",
  code: "SUMMER15",
  discount: 0.15
};

const DEFAULT_POPUP = {
  active: true,
  delaySeconds: 8,
  title: "Get 10% off your first order",
  body: "Join our newsletter and we'll email you a code for 10% off today's order.",
  code: "WELCOME10",
  discount: 0.1
};

const REVIEW_SNIPPETS = [
  { author: "Priya", rating: 5, text: "Exactly as described and arrived faster than expected. Would buy again." },
  { author: "Tom", rating: 4, text: "Good quality for the price. Packaging could be better but the product itself is solid." },
  { author: "Marek", rating: 5, text: "This has been in daily use for weeks now and still looks brand new." },
  { author: "Jade", rating: 4, text: "Does exactly what it says. Took a star off only because delivery was a bit slow." },
  { author: "Sam", rating: 5, text: "Bought this as a gift and ended up ordering a second one for myself." }
];
