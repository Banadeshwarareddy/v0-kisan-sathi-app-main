"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingBag, Heart, Download, MapPin } from 'lucide-react';

export default function BuyerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistItems: 0,
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data
      setStats({
        totalOrders: 12,
        pendingOrders: 3,
        completedOrders: 9,
        wishlistItems: 5,
      });

      setOrders([
        {
          id: 'ORD-2025-001',
          farmer: 'Green Valley Farms',
          products: [
            { name: 'Organic Tomatoes', quantity: 10, price: 40 },
            { name: 'Fresh Potatoes', quantity: 20, price: 25 },
          ],
          total: 900,
          status: 'delivered',
          date: '2025-11-01',
          deliveryDate: '2025-11-03',
        },
        {
          id: 'ORD-2025-002',
          farmer: 'Green Valley Farms',
          products: [{ name: 'Organic Basmati Rice', quantity: 25, price: 80 }],
          total: 2000,
          status: 'shipped',
          date: '2025-11-05',
          deliveryDate: '2025-11-08',
        },
        {
          id: 'ORD-2025-003',
          farmer: 'Green Valley Farms',
          products: [{ name: 'Fresh Mangoes', quantity: 5, price: 150 }],
          total: 750,
          status: 'processing',
          date: '2025-11-06',
          deliveryDate: '2025-11-10',
        },
      ]);

      setWishlist([
        {
          id: '1',
          name: 'Organic Turmeric Powder',
          price: 400,
          farmer: 'Green Valley Farms',
          inStock: true,
        },
        {
          id: '2',
          name: 'Fresh Carrots',
          price: 45,
          farmer: 'Green Valley Farms',
          inStock: true,
        },
      ]);

      setAddresses([
        {
          id: '1',
          label: 'Home',
          name: 'John Doe',
          phone: '+919876543210',
          address: '123 Main Street, Bangalore',
          pincode: '560001',
          isDefault: true,
        },
        {
          id: '2',
          label: 'Office',
          name: 'John Doe',
          phone: '+919876543210',
          address: '456 Business Park, Bangalore',
          pincode: '560002',
          isDefault: false,
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = (orderId: string) => {
    // TODO: Implement receipt download
    console.log('Downloading receipt for:', orderId);
    alert(`Receipt download for ${orderId} - Coming soon!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your orders and manage your account</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedOrders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wishlist</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.wishlistItems}</p>
                </div>
                <div className="bg-pink-100 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          Ordered on {order.date} • From {order.farmer}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {product.name} × {product.quantity} kg
                          </span>
                          <span className="font-medium">
                            {formatCurrency(product.quantity * product.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'delivered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReceipt(order.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </div>
                    </div>

                    {order.status === 'shipped' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          📦 Expected delivery: {order.deliveryDate}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">👨‍🌾 {item.farmer}</p>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            {formatCurrency(item.price)}/kg
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Add to Cart</Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="bg-green-100 p-2 rounded-full h-fit">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{address.label}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-900">{address.name}</p>
                          <p className="text-gray-600">{address.phone}</p>
                          <p className="text-gray-600 mt-2">{address.address}</p>
                          <p className="text-gray-600">PIN: {address.pincode}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
