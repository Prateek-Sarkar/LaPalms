type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  imageUrl?: string;
};

type Order = {
  id: string;
  items: any[];
  total: number;
  type?: string;
  tableId?: string;
  deliveryInfo?: any;
  status?: string;
  createdAt?: string;
};

type Booking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests?: string;
  eventType?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
};

let menuItems: MenuItem[] = [
  { id: '1', name: 'Paneer Tikka', category: 'Appetizers', price: 8.50, description: 'Char-grilled paneer with bell peppers and mint chutney.', available: true },
  { id: '2', name: 'Samosa Trio', category: 'Snacks', price: 5.50, description: 'Crispy pastry filled with spiced potato and peas.', available: true },
  { id: '3', name: 'Masala Dosa', category: 'Main Course', price: 10.50, description: 'Crisp dosa with potato masala, served with sambar.', available: true },
  { id: '4', name: 'Butter Paneer', category: 'Main Course', price: 12.50, description: 'Paneer in a creamy tomato gravy with kasoori methi.', available: true },
  { id: '5', name: 'Chole Bhature', category: 'Main Course', price: 11.00, description: 'Spiced chickpeas with fluffy bhature.', available: true },
  { id: '6', name: 'Dal Tadka', category: 'Main Course', price: 9.00, description: 'Yellow lentils tempered with garlic and cumin.', available: true },
  { id: '7', name: 'Jeera Rice', category: 'Main Course', price: 4.50, description: 'Steamed basmati rice with cumin and ghee.', available: true },
  { id: '8', name: 'Garlic Naan', category: 'Breads', price: 3.00, description: 'Soft naan brushed with garlic butter.', available: true },
  { id: '9', name: 'Mango Lassi', category: 'Beverages', price: 4.00, description: 'Chilled yogurt drink with mango and cardamom.', available: true },
  { id: '10', name: 'Gulab Jamun', category: 'Desserts', price: 5.00, description: 'Milk dumplings in rose-scented syrup.', available: true }
];

let orders: Order[] = [];
let bookings: Booking[] = [];

const readJson = async (req: any) => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
};

const send = (res: any, status: number, data: any) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

export default async function handler(req: any, res: any) {
  const requestUrl = new URL(req.url || '', 'http://localhost');
  const pathname = requestUrl.pathname || '';
  const path = pathname.replace(/^\/api\/?/, '');
  const segments = path.split('/').filter(Boolean);
  const [resource, id] = segments;

  if (resource === 'menu') {
    if (req.method === 'GET' && !id) {
      return send(res, 200, menuItems);
    }
    if (req.method === 'POST' && !id) {
      const body = await readJson(req);
      const newItem = { ...body, id: Date.now().toString() } as MenuItem;
      menuItems.push(newItem);
      return send(res, 200, newItem);
    }
    if (id && req.method === 'PUT') {
      const body = await readJson(req);
      menuItems = menuItems.map((item) => item.id === id ? { ...item, ...body } : item);
      return send(res, 200, { success: true });
    }
    if (id && req.method === 'DELETE') {
      menuItems = menuItems.filter((item) => item.id !== id);
      return send(res, 200, { success: true });
    }
  }

  if (resource === 'orders') {
    if (req.method === 'GET' && !id) {
      return send(res, 200, orders);
    }
    if (req.method === 'POST' && !id) {
      const body = await readJson(req);
      const newOrder: Order = {
        ...body,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      return send(res, 200, newOrder);
    }
    if (id && req.method === 'PATCH') {
      const body = await readJson(req);
      orders = orders.map((order) => order.id === id ? { ...order, ...body } : order);
      return send(res, 200, { success: true });
    }
  }

  if (resource === 'bookings') {
    if (req.method === 'GET' && !id) {
      return send(res, 200, bookings);
    }
    if (req.method === 'POST' && !id) {
      const body = await readJson(req);
      const newBooking: Booking = {
        ...body,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      bookings.push(newBooking);
      return send(res, 200, newBooking);
    }
    if (id && req.method === 'PATCH') {
      const body = await readJson(req);
      bookings = bookings.map((booking) => booking.id === id ? { ...booking, ...body } : booking);
      return send(res, 200, { success: true });
    }
  }

  return send(res, 404, { error: 'Not found' });
}
