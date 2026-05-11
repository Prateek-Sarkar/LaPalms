// Simple Mock API Client to replace Firebase
export const api = {
  async getMenu() {
    const res = await fetch('/api/menu');
    return res.json();
  },
  async addMenuItem(item: any) {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  async updateMenuItem(id: string, item: any) {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  async deleteMenuItem(id: string) {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },
  async getOrders() {
    const res = await fetch('/api/orders');
    return res.json();
  },
  async placeOrder(order: any) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return res.json();
  },
  async updateOrderStatus(id: string, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  async getBookings() {
    const res = await fetch('/api/bookings');
    return res.json();
  },
  async addBooking(booking: any) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return res.json();
  },
  async updateBookingStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};
