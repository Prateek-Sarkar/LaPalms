import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store
  let menuItems = [
    { id: '1', name: 'Paradise Burger', category: 'Main Course', price: 15.50, description: 'Juicy grilled patty with pineapple and teriyaki glaze.', available: true },
    { id: '2', name: 'Coconut Shrimp', category: 'Appetizers', price: 12.00, description: 'Crispy shrimp served with a sweet chili dipping sauce.', available: true },
    { id: '3', name: 'Blue Lagoon Mocktail', category: 'Beverages', price: 8.50, description: 'Refreshing mix of citrus, blueberry, and sparkling water.', available: true },
    { id: '4', name: 'Island Breeze Salad', category: 'Salads', price: 13.00, description: 'Mixed greens with mango, avocado, and lime vinaigrette.', available: true },
    { id: '5', name: 'Beach Fries', category: 'Snacks', price: 6.50, description: 'Truffle oil and sea salt dusted chunky fries.', available: true },
    { id: '6', name: 'Mango Sticky Rice', category: 'Desserts', price: 9.00, description: 'Classic mango sticky rice with coconut cream.', available: true },
  ];

  let orders = [];
  let bookings = [];

  // API Routes
  app.get("/api/menu", (req, res) => {
    res.json(menuItems);
  });

  app.post("/api/menu", (req, res) => {
    const newItem = { ...req.body, id: Date.now().toString() };
    menuItems.push(newItem);
    res.json(newItem);
  });

  app.put("/api/menu/:id", (req, res) => {
    menuItems = menuItems.map(item => item.id === req.params.id ? { ...item, ...req.body } : item);
    res.json({ success: true });
  });

  app.delete("/api/menu/:id", (req, res) => {
    menuItems = menuItems.filter(item => item.id !== req.params.id);
    res.json({ success: true });
  });

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const newOrder = { 
      ...req.body, 
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.json(newOrder);
  });

  app.patch("/api/orders/:id", (req, res) => {
    orders = orders.map(order => order.id === req.params.id ? { ...order, ...req.body } : order);
    res.json({ success: true });
  });

  app.get("/api/bookings", (req, res) => {
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const newBooking = { 
      ...req.body, 
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    res.json(newBooking);
  });

  app.patch("/api/bookings/:id", (req, res) => {
    bookings = bookings.map(booking => booking.id === req.params.id ? { ...booking, ...req.body } : booking);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
