"use client";

import { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '@/lib/marketplace-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, ShoppingCart, Heart, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Filters {
  search: string;
  category: string;
  min_price: string;
  max_price: string;
  is_organic_certified: boolean;
  quality_grade: string[];
  state: string;
  ordering: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    is_organic_certified: false,
    quality_grade: [],
    state: '',
    ordering: '-created_at',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.list();
      setCategories(response.results || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const apiFilters: any = {
        page: currentPage,
        page_size: 20,
      };

      if (filters.search) apiFilters.search = filters.search;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.min_price) apiFilters.min_price = filters.min_price;
      if (filters.max_price) apiFilters.max_price = filters.max_price;
      if (filters.is_organic_certified) apiFilters.is_organic_certified = true;
      if (filters.quality_grade.length > 0) apiFilters.quality_grade = filters.quality_grade.join(',');
      if (filters.state) apiFilters.state = filters.state;
      if (filters.ordering) apiFilters.ordering = filters.ordering;

      const response = await productsApi.list(apiFilters);
      setProducts(response.results || []);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      is_organic_certified: false,
      quality_grade: [],
      state: '',
      ordering: '-created_at',
    });
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
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

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <div className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <Button size="icon" variant="outline">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={(e) => updateFilter('min_price', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={(e) => updateFilter('max_price', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Quality</label>
        <div className="space-y-2">
          {['premium', 'grade_a', 'grade_b'].map((grade) => (
            <div key={grade} className="flex items-center space-x-2">
              <Checkbox
                id={grade}
                checked={filters.quality_grade.includes(grade)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilter('quality_grade', [...filters.quality_grade, grade]);
                  } else {
                    updateFilter('quality_grade', filters.quality_grade.filter(g => g !== grade));
                  }
                }}
              />
              <label htmlFor={grade} className="text-sm capitalize">
                {grade.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Certifications</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic"
            checked={filters.is_organic_certified}
            onCheckedChange={(checked) => updateFilter('is_organic_certified', checked)}
          />
          <label htmlFor="organic" className="text-sm">
            🌱 Organic Certified
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">State</label>
        <Select value={filters.state} onValueChange={(value) => updateFilter('state', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All States</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
            <SelectItem value="Kerala">Kerala</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
          <p className="text-gray-600">Fresh crops directly from verified farmers</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter products by your preferences
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            <span className="text-sm text-gray-600">
              {totalCount} product{totalCount !== 1 ? 's' : ''} found
            </span>
          </div>

          <Select value={filters.ordering} onValueChange={(value) => updateFilter('ordering', value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">Newest First</SelectItem>
              <SelectItem value="price_per_unit">Price: Low to High</SelectItem>
              <SelectItem value="-price_per_unit">Price: High to Low</SelectItem>
              <SelectItem value="-rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      formatPrice={formatPrice}
                      calculateDiscount={calculateDiscount}
                      renderStars={renderStars}
                    />
                  ))}
                </div>

                {totalCount > 20 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, formatPrice, calculateDiscount, renderStars }: {
  product: Product;
  formatPrice: (price: number) => string;
  calculateDiscount: (original?: number, current?: number) => number;
  renderStars: (rating: number) => JSX.Element[];
}) {
  const discount = calculateDiscount(product.original_price, product.price_per_unit);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={product.primary_image_url || `https://via.placeholder.com/300x200/10b981/ffffff?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x200/10b981/ffffff?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category_name}
        </div>
        
        <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>👨‍🌾 {product.farmer_name}</span>
        </div>
        
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">({product.review_count})</span>
          </div>
        )}
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(product.price_per_unit)}
          </span>
          {product.original_price && discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
        
        <div className="flex gap-1 mb-3 flex-wrap">
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
        
        <div className="text-sm text-gray-600 mb-3">
          {product.quantity_available > 0 ? (
            <span className="text-green-600">✓ {product.quantity_available} {product.unit} available</span>
          ) : (
            <span className="text-red-600">✗ Out of stock</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            disabled={product.quantity_available <= 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.quantity_available > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
