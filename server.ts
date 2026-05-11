import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // In-memory data store
  let menuItems = [
    { id: '1', name: 'Paneer Tikka', category: 'Appetizers', price: 8.50, description: 'Char-grilled paneer with bell peppers and mint chutney.', available: true },
    { id: '2', name: 'Samosa Trio', category: 'Snacks', price: 5.50, description: 'Crispy pastry filled with spiced potato and peas.', available: true },
    { id: '3', name: 'Masala Dosa', category: 'Main Course', price: 10.50, description: 'Crisp dosa with potato masala, served with sambar.', available: true },
    { id: '4', name: 'Butter Paneer', category: 'Main Course', price: 12.50, description: 'Paneer in a creamy tomato gravy with kasoori methi.', available: true },
    { id: '5', name: 'Chole Bhature', category: 'Main Course', price: 11.00, description: 'Spiced chickpeas with fluffy bhature.', available: true },
    { id: '6', name: 'Dal Tadka', category: 'Main Course', price: 9.00, description: 'Yellow lentils tempered with garlic and cumin.', available: true },
    { id: '7', name: 'Jeera Rice', category: 'Main Course', price: 4.50, description: 'Steamed basmati rice with cumin and ghee.', available: true },
    { id: '8', name: 'Garlic Naan', category: 'Breads', price: 3.00, description: 'Soft naan brushed with garlic butter.', available: true },
    { id: '9', name: 'Mango Lassi', category: 'Beverages', price: 4.00, description: 'Chilled yogurt drink with mango and cardamom.', available: true },
    { id: '10', name: 'Gulab Jamun', category: 'Desserts', price: 5.00, description: 'Milk dumplings in rose-scented syrup.', available: true },
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
