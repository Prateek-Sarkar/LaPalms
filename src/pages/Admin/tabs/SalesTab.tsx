import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Activity } from 'lucide-react';

export default function SalesTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Process data for charts
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Group by category
  const categoryDataM: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      // In a real app we'd need category here, but for now we aggregate by item
      // Actually let's just group by day for the line chart
    });
  });

  // Group by day for line chart
  const salesByDay: Record<string, number> = {};
  orders.forEach(order => {
    const day = new Date(order.createdAt).toLocaleDateString();
    salesByDay[day] = (salesByDay[day] || 0) + order.total;
  });

  const chartData = Object.entries(salesByDay).map(([date, amount]) => ({
    date,
    amount
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by type (dine-in vs delivery)
  const typesData = [
    { name: 'Dine-In', value: orders.filter(o => o.type === 'dine-in').length },
    { name: 'Delivery', value: orders.filter(o => o.type === 'delivery').length }
  ];

  const COLORS = ['#FFD700', '#000000'];

  return (
    <div className="space-y-6 sm:space-y-10">
      <header className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-sm border border-brand-beige/20 flex flex-col justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black italic">REVENUE</h1>
          <p className="text-brand-black/40 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1">Growth & Performance</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex-1 bg-brand-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center min-w-[100px] sm:min-w-[140px]">
            <p className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-brand-black/20 mb-1">Sales</p>
            <p className="text-lg sm:text-2xl font-black italic">Rs. {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-brand-black text-brand-yellow p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center min-w-[100px] sm:min-w-[140px]">
            <p className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">Orders</p>
            <p className="text-lg sm:text-2xl font-black italic">{orders.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* Sales Trend */}
        <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-sm border border-brand-beige/10">
          <h2 className="text-lg sm:text-xl font-black italic mb-6 sm:mb-10 flex items-center gap-3">
            <TrendingUp className="text-brand-yellow w-5 h-5 sm:w-6 sm:h-6" />
            TREND
          </h2>
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="date" stroke="#999" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#999" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '10px', fontSize: '10px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#FFD700" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#FFD700', strokeWidth: 1.5, stroke: '#FFF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Distribution */}
        <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-sm border border-brand-beige/10">
          <h2 className="text-lg sm:text-xl font-black italic mb-6 sm:mb-10 flex items-center gap-3">
            <Activity className="text-brand-yellow w-5 h-5 sm:w-6 sm:h-6" />
            CHANNELS
          </h2>
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" stroke="#999" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#999" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{ fill: '#F8F9FA' }}
                   contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '10px', fontSize: '10px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
