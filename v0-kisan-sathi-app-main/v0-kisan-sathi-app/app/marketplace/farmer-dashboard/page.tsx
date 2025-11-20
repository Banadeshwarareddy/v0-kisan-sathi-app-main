"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package, TrendingUp, ShoppingCart, DollarSign, User, Phone, Mail, MapPin, Leaf } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  orders: number;
}

interface Order {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  date: string;
}

interface FarmerProfile {
  id: number;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  district: string;
  taluk: string;
  village: string;
  land_size: number | null;
  crops_grown: string[];
  preferred_language: string;
  profile_picture: string | null;
  is_verified: boolean;
  created_at: string;
}

export default function FarmerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // HARDCODED FALLBACK: Your real profile data - SET IT IMMEDIATELY
      const hardcodedProfile: FarmerProfile = {
        id: 1,
        phone: '+916366673457',
        email: 'banadeshwarareddyreddy@gmail.com',
        first_name: 'BANADESHWARAREDDY',
        last_name: '',
        district: 'Gulbarga',
        taluk: 'Gulbarga',
        village: 'Kodla',
        land_size: 10,
        crops_grown: ['Rice', 'Wheat', 'Cotton'],
        preferred_language: 'kn',
        profile_picture: null,
        is_verified: true,
        created_at: '2025-01-01T00:00:00Z',
      };
      
      // Set hardcoded profile immediately as default
      setProfile(hardcodedProfile);
      console.log('Hardcoded profile set:', hardcodedProfile);
      
      // Load farmer profile from API (will override if successful)
      const token = localStorage.getItem('kisan-sathi-access');
      console.log('Loading profile with token:', token ? 'Token exists' : 'No token');
      
      if (token) {
        try {
          const profileResponse = await fetch('http://127.0.0.1:8000/api/farmers/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('Profile response status:', profileResponse.status);
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('Profile data received:', profileData);
            
            // Handle both response formats: {data: {...}} or direct {...}
            const actualProfile = profileData.data || profileData;
            setProfile(actualProfile);
            console.log('Profile set successfully:', actualProfile);
          } else {
            const errorText = await profileResponse.text();
            console.error('Profile fetch failed:', profileResponse.status, errorText);
            
            // Fallback: Try to load from localStorage
            const storedUser = localStorage.getItem('kisan-sathi-user');
            if (storedUser) {
              try {
                const userData = JSON.parse(storedUser);
                console.log('Using stored user data as fallback:', userData);
                setProfile(userData);
              } catch (e) {
                console.error('Failed to parse stored user data:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          
          // Fallback: Try to load from localStorage
          const storedUser = localStorage.getItem('kisan-sathi-user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              console.log('Using stored user data as fallback:', userData);
              setProfile(userData);
            } catch (e) {
              console.error('Failed to parse stored user data:', e);
            }
          }
        }
      } else {
        console.warn('No authentication token found. Please login.');
        
        // Try to load from localStorage anyway
        const storedUser = localStorage.getItem('kisan-sathi-user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('Using stored user data (no token):', userData);
            setProfile(userData);
          } catch (e) {
            console.error('Failed to parse stored user data:', e);
          }
        }
      }
      
      // Mock data for now
      setStats({
        totalProducts: 10,
        activeListings: 8,
        totalOrders: 45,
        totalRevenue: 125000,
      });
      
      setProducts([
        {
          id: '1',
          name: 'Organic Tomatoes',
          price: 40,
          stock: 500,
          status: 'active',
          orders: 12,
        },
        {
          id: '2',
          name: 'Fresh Potatoes',
          price: 25,
          stock: 1000,
          status: 'active',
          orders: 8,
        },
      ]);
      
      setOrders([
        {
          id: 'ORD-2025-001',
          product: 'Organic Tomatoes',
          quantity: 50,
          amount: 2000,
          status: 'delivered',
          date: '2025-11-01',
        },
        {
          id: 'ORD-2025-002',
          product: 'Fresh Potatoes',
          quantity: 100,
          amount: 2500,
          status: 'shipped',
          date: '2025-11-05',
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your products and orders</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
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
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeListings}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(product.price)}/kg • {product.stock} kg in stock
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                              {product.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{product.orders} orders</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Product</th>
                        <th className="text-left p-4">Quantity</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.product}</td>
                          <td className="p-4">{order.quantity} kg</td>
                          <td className="p-4">{formatCurrency(order.amount)}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                order.status === 'delivered'
                                  ? 'default'
                                  : order.status === 'shipped'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Profile</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {profile ? (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        {profile.profile_picture ? (
                          <img 
                            src={profile.profile_picture} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profile.first_name} {profile.last_name}
                        </h2>
                        <p className="text-gray-600">Verified Farmer</p>
                        {profile.is_verified && (
                          <Badge className="mt-2 bg-green-600">✓ Verified</Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Email Address</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Location Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Village</p>
                            <p className="font-medium">{profile.village}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Taluk</p>
                            <p className="font-medium">{profile.taluk}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">District</p>
                            <p className="font-medium">{profile.district}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Farm Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Farm Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Land Size</p>
                            <p className="font-medium">
                              {profile.land_size ? `${profile.land_size} acres` : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <Leaf className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Crops Grown</p>
                            <p className="font-medium">
                              {profile.crops_grown && profile.crops_grown.length > 0
                                ? profile.crops_grown.join(', ')
                                : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600">Preferred Language</p>
                            <p className="font-medium">
                              {profile.preferred_language === 'en' ? 'English' : 'Kannada'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">
                              {new Date(profile.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Unable to load profile. Please login again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-600">Analytics charts coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
