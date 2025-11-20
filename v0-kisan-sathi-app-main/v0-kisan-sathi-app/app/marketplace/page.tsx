"use client";

import { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '@/lib/marketplace-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardNav } from '@/components/dashboard-nav';
import { useActivityTracker } from '@/hooks/use-activity-tracker';
import { 
  Star, ShoppingCart, Heart, Search, Package, TrendingUp, 
  ShoppingBag, User, Plus, Edit, Trash2, Minus, Download,
  MapPin, CheckCircle2, CreditCard, DollarSign,
  Settings, Bell, LogOut
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price_per_unit: number;
  original_price?: number;
  primary_image_url?: string;
  farmer_name: string;
  category_name: string;
  rating: number;
  review_count: number;
  is_organic_certified: boolean;
  quality_grade: string;
  quantity_available: number;
  unit: string;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  farmer: string;
  maxQuantity: number;
}

export default function UnifiedMarketplace() {
  // Track page visit
  useActivityTracker(
    "Marketplace",
    "Buy and sell agricultural products",
    "🛒",
    "/marketplace"
  );

  const [activeTab, setActiveTab] = useState('browse');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [farmerProducts, setFarmerProducts] = useState<any[]>([]);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: '1',
      name: 'Organic Tomatoes',
      price: 40,
      quantity: 10,
      unit: 'kg',
      farmer: 'Green Valley Farms',
      maxQuantity: 500,
    },
    {
      id: '2',
      productId: '2',
      name: 'Fresh Potatoes',
      price: 25,
      quantity: 20,
      unit: 'kg',
      farmer: 'Green Valley Farms',
      maxQuantity: 1000,
    },
  ]);

  // User role (mock - replace with actual auth)
  const [userRole, setUserRole] = useState<'buyer' | 'farmer'>('buyer');

  useEffect(() => {
    loadData();
    // Load farmer products from localStorage
    const saved = localStorage.getItem('farmerProducts');
    if (saved) {
      setFarmerProducts(JSON.parse(saved));
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.list({ page_size: 12 }),
        categoriesApi.list(),
      ]);
      
      setProducts(productsRes.results || []);
      setCategories(categoriesRes.results || []);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFarmerProduct = (product: any) => {
    const newProducts = [...farmerProducts, product];
    setFarmerProducts(newProducts);
    localStorage.setItem('farmerProducts', JSON.stringify(newProducts));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const cartCount = cartItems.length;

  return (
    <>
      <DashboardHeader />
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header with Role Switcher */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {userRole === 'buyer' ? '🛒 Marketplace' : '🌾 Farmer Dashboard'}
              </h2>
              <p className="text-muted-foreground">
                {userRole === 'buyer' 
                  ? 'Buy fresh crops directly from farmers' 
                  : 'Manage and sell your farm products'}
              </p>
            </div>
            {/* Role Switcher */}
            <div className="flex gap-3 bg-muted p-2 rounded-lg">
              <Button
                variant={userRole === 'buyer' ? 'default' : 'ghost'}
                onClick={() => {
                  setUserRole('buyer');
                  setActiveTab('browse');
                }}
                className={`${
                  userRole === 'buyer' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : 'hover:bg-muted-foreground/10'
                } transition-all duration-200 px-6 py-2`}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span className="font-semibold">Buyer Mode</span>
              </Button>
              <Button
                variant={userRole === 'farmer' ? 'default' : 'ghost'}
                onClick={() => {
                  setUserRole('farmer');
                  setActiveTab('browse');
                }}
                className={`${
                  userRole === 'farmer' 
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                    : 'hover:bg-muted-foreground/10'
                } transition-all duration-200 px-6 py-2`}
              >
                <Package className="w-5 h-5 mr-2" />
                <span className="font-semibold">Farmer Mode</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Role-Specific Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {userRole === 'buyer' ? (
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-blue-50 p-2">
              <TabsTrigger 
                value="browse" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Products</span>
                <span className="sm:hidden">Browse</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cart" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">My Cart</span>
                <span className="sm:hidden">Cart</span>
                {cartCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white">{cartCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">My Orders</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 gap-2 bg-green-50 p-2">
              <TabsTrigger 
                value="browse" 
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Market</span>
                <span className="sm:hidden">Market</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manage" 
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">My Products</span>
                <span className="sm:hidden">Products</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Browse Products Tab */}
          <TabsContent value="browse">
            <BrowseProducts
              products={[...products, ...farmerProducts]}
              categories={categories}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              formatCurrency={formatCurrency}
              calculateDiscount={calculateDiscount}
              renderStars={renderStars}
              userRole={userRole}
              onAddToCart={(product: any) => {
                if (userRole === 'buyer') {
                  const newItem: CartItem = {
                    id: Date.now().toString(),
                    productId: product.id,
                    name: product.name,
                    price: product.price_per_unit || product.price,
                    quantity: 1,
                    unit: product.unit,
                    farmer: product.farmer_name || 'Green Valley Farms',
                    maxQuantity: product.quantity_available || product.stock,
                  };
                  setCartItems([...cartItems, newItem]);
                  setActiveTab('cart');
                }
              }}
            />
          </TabsContent>

          {/* Cart Tab (Buyer Only) */}
          {userRole === 'buyer' && (
            <TabsContent value="cart">
              <CartSection
                cartItems={cartItems}
                setCartItems={setCartItems}
                formatCurrency={formatCurrency}
              />
            </TabsContent>
          )}

          {/* Orders Tab (Buyer Only) */}
          {userRole === 'buyer' && (
            <TabsContent value="orders">
              <BuyerOrders formatCurrency={formatCurrency} />
            </TabsContent>
          )}

          {/* Manage Products Tab (Farmer Only) */}
          {userRole === 'farmer' && (
            <TabsContent value="manage">
              <FarmerManagement 
                formatCurrency={formatCurrency} 
                farmerProducts={farmerProducts}
                setFarmerProducts={setFarmerProducts}
                addFarmerProduct={addFarmerProduct}
              />
            </TabsContent>
          )}

          {/* Profile Tab */}
          <TabsContent value="profile">
            <UserProfile userRole={userRole} formatCurrency={formatCurrency} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

// Browse Products Component
function BrowseProducts({ products, categories, loading, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, formatCurrency, calculateDiscount, renderStars, userRole, onAddToCart }: any) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Farmer Info Banner */}
      {userRole === 'farmer' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">Farmer View - Market Research</h3>
                <p className="text-sm text-green-700">
                  You're viewing the marketplace to see what other farmers are selling and current market prices. 
                  To manage your own products, go to the <strong>"My Products"</strong> tab.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search for crops, farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-green-600 hover:bg-green-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size="sm"
          >
            All
          </Button>
          {categories.map((cat: any) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id.toString() ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id.toString())}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={product.primary_image_url || `https://via.placeholder.com/300x200/10b981/ffffff?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {calculateDiscount(product.original_price, product.price_per_unit) > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  {calculateDiscount(product.original_price, product.price_per_unit)}% OFF
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-gray-500 uppercase mb-1">{product.category_name}</div>
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">👨‍🌾 {product.farmer_name}</p>
              
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-600">({product.review_count})</span>
                </div>
              )}
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(product.price_per_unit)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
              </div>
              
              <div className="flex gap-1 mb-3">
                {product.is_organic_certified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    🌱 Organic
                  </Badge>
                )}
                {product.quality_grade === 'premium' && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    ⭐ Premium
                  </Badge>
                )}
              </div>
              
              {userRole === 'buyer' ? (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => onAddToCart(product)}
                  disabled={product.quantity_available <= 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  variant="outline"
                  disabled
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Cart Section Component
function CartSection({ cartItems, setCartItems, formatCurrency }: any) {
  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((items: CartItem[]) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((items: CartItem[]) => items.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + delivery;

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600">Add some products to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item: CartItem) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">👨‍🌾 {item.farmer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-16 text-center font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-green-600">FREE</span> : formatCurrency(delivery)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Buyer Orders Component
function BuyerOrders({ formatCurrency }: any) {
  const orders = [
    {
      id: 'ORD-2025-001',
      date: '2025-11-01',
      items: 'Organic Tomatoes, Fresh Potatoes',
      total: 900,
      status: 'delivered',
    },
    {
      id: 'ORD-2025-002',
      date: '2025-11-05',
      items: 'Organic Basmati Rice',
      total: 2000,
      status: 'shipped',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">9</p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-gray-600">Wishlist</p>
          </CardContent>
        </Card>
      </div>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{order.id}</h3>
                <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                <p className="text-sm text-gray-600 mt-1">{order.items}</p>
              </div>
              <Badge className={order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {order.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex gap-2">
                {order.status === 'delivered' && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Receipt
                  </Button>
                )}
                <Button variant="outline" size="sm">Track Order</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// User Profile Component
function UserProfile({ userRole, formatCurrency }: any) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
              <p className="text-gray-600">+91 9876543210</p>
              <Badge className="mt-2">{userRole === 'farmer' ? 'Farmer' : 'Buyer'}</Badge>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-lg">John Doe</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">john.doe@example.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg">+91 9876543210</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-lg">January 2025</p>
            </div>
            {userRole === 'farmer' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">Farm Name</label>
                  <p className="text-lg">Green Valley Farms</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-lg">Telangana, Rangareddy</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-600">Manage your notifications</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Addresses</p>
                  <p className="text-sm text-gray-600">Manage delivery addresses</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Payment Methods</p>
                  <p className="text-sm text-gray-600">Manage payment options</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Privacy & Security</p>
                  <p className="text-sm text-gray-600">Password and security settings</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === 'buyer' ? (
              <>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(25000)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">5</p>
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">8</p>
                  <p className="text-sm text-gray-600">Reviews Given</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">10</p>
                  <p className="text-sm text-gray-600">Products Listed</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(125000)}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">45</p>
                  <p className="text-sm text-gray-600">Orders Received</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">4.5</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card>
        <CardContent className="p-6">
          <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Farmer Management Component
function FarmerManagement({ formatCurrency, farmerProducts, setFarmerProducts, addFarmerProduct }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadFarmerProducts();
  }, []);
  
  const loadFarmerProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.list({ page_size: 100 }),
        categoriesApi.list(),
      ]);
      setProducts(productsRes.results || []);
      setCategories(categoriesRes.results || []);
    } catch (error) {
      console.error('Error loading farmer products:', error);
    } finally {
      setLoading(false);
    }
  };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    quality_grade: 'grade_a',
    description: '',
    is_organic: false,
    primary_image: null as File | null,
    additional_images: [] as File[],
  });
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  const handleAddProduct = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category_id', newProduct.category);
      formData.append('price_per_unit', newProduct.price);
      formData.append('quantity_available', newProduct.quantity);
      formData.append('unit', newProduct.unit);
      formData.append('quality_grade', newProduct.quality_grade);
      formData.append('description', newProduct.description);
      formData.append('is_organic_certified', String(newProduct.is_organic));
      formData.append('listing_status', 'active');
      
      // Add primary image if selected
      if (newProduct.primary_image) {
        formData.append('primary_image', newProduct.primary_image);
      }
      
      // Add additional images if selected
      newProduct.additional_images.forEach((file) => {
        formData.append('additional_images', file);
      });
      
      // Send to backend API
      const token = typeof window !== 'undefined' ? (localStorage.getItem('kisan-sathi-access') || localStorage.getItem('auth_token')) : null;
      const response = await fetch('http://localhost:8000/api/marketplace/products/', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add product');
      }
      
      const createdProduct = await response.json();
      
      // Reload products from API
      await loadFarmerProducts();
      
      setIsAddDialogOpen(false);
      alert('Product added successfully!');
      
      // Reset form
      setNewProduct({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: 'kg',
        quality_grade: 'grade_a',
        description: '',
        is_organic: false,
        primary_image: null,
        additional_images: [],
      });
      setPrimaryImagePreview(null);
      setAdditionalImagePreviews([]);
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(error.message || 'Failed to add product. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{products.filter((p: any) => p.status === 'active').length}</p>
            <p className="text-sm text-gray-600">Active Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(125000)}</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">My Products</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Organic Tomatoes"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Unit (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 40"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity Available *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 500"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="litre">Litre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quality">Quality Grade *</Label>
                  <Select value={newProduct.quality_grade} onValueChange={(value) => setNewProduct({ ...newProduct, quality_grade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="grade_a">Grade A</SelectItem>
                      <SelectItem value="grade_b">Grade B</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              {/* Primary Image Upload */}
              <div>
                <Label htmlFor="primary_image">Primary Image *</Label>
                <Input
                  id="primary_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewProduct({ ...newProduct, primary_image: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPrimaryImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {primaryImagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={primaryImagePreview}
                      alt="Primary preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewProduct({ ...newProduct, primary_image: null });
                        setPrimaryImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Images Upload */}
              <div>
                <Label htmlFor="additional_images">Additional Images (Optional)</Label>
                <Input
                  id="additional_images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5);
                    if (files.length > 0) {
                      setNewProduct({ ...newProduct, additional_images: files });
                      const previews: string[] = [];
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          previews.push(reader.result as string);
                          if (previews.length === files.length) {
                            setAdditionalImagePreviews(previews);
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                    }
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">You can select up to 5 images</p>
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Additional preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFiles = newProduct.additional_images.filter((_, i) => i !== index);
                            const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
                            setNewProduct({ ...newProduct, additional_images: newFiles });
                            setAdditionalImagePreviews(newPreviews);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={newProduct.is_organic}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_organic: checked as boolean })}
                />
                <Label htmlFor="organic" className="cursor-pointer">
                  🌱 This product is organic certified
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity || !newProduct.primary_image}
                >
                  Add Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No products yet. Add your first product!</p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {product.primary_image_url ? (
                      <img 
                        src={product.primary_image_url} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(product.price_per_unit)}/{product.unit} • {product.quantity_available} {product.unit} in stock
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={product.listing_status === 'active' ? 'default' : 'secondary'}>
                          {product.listing_status}
                        </Badge>
                        {product.is_organic_certified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            🌱 Organic
                          </Badge>
                        )}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
