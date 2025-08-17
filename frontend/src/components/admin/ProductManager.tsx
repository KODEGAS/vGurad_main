import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  dosage_instructions: string;
  seller_name: string;
  seller_contact: string;
  seller_location: string;
  image_url?: string;
  stock_quantity: number;
  is_approved: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: 'pesticides', label: 'Pesticides & Fungicides' },
  { value: 'fertilizers', label: 'Fertilizers' },
  { value: 'organic', label: 'Organic Solutions' },
  { value: 'tools', label: 'Tools & Equipment' },
];

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    currency: 'LKR',
    dosage_instructions: '',
    seller_name: '',
    seller_contact: '',
    seller_location: '',
    image_url: '',
    stock_quantity: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || !newProduct.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          currency: newProduct.currency,
          dosage_instructions: newProduct.dosage_instructions,
          seller_name: newProduct.seller_name,
          seller_contact: newProduct.seller_contact,
          seller_location: newProduct.seller_location,
          image_url: newProduct.image_url || null,
          stock_quantity: parseInt(newProduct.stock_quantity) || 0,
          is_approved: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');
      const data = await res.json();

      setProducts([data, ...products]);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        currency: 'LKR',
        dosage_instructions: '',
        seller_name: '',
        seller_contact: '',
        seller_location: '',
        image_url: '',
        stock_quantity: '',
      });
      setShowAddForm(false);

      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const toggleApproval = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${productId}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_approved: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update product approval');

      setProducts(products.map(product =>
        product._id === productId
          ? { ...product, is_approved: !currentStatus }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${!currentStatus ? 'approved' : 'unapproved'} successfully`,
      });
    } catch (error) {
      console.error('Error updating product approval:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(product => product._id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <Label htmlFor="seller-name">Seller Name</Label>
                <Input
                  id="seller-name"
                  value={newProduct.seller_name}
                  onChange={(e) => setNewProduct({ ...newProduct, seller_name: e.target.value })}
                  placeholder="Enter seller name"
                />
              </div>
              <div>
                <Label htmlFor="seller-contact">Seller Contact</Label>
                <Input
                  id="seller-contact"
                  value={newProduct.seller_contact}
                  onChange={(e) => setNewProduct({ ...newProduct, seller_contact: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <Label htmlFor="seller-location">Seller Location</Label>
                <Input
                  id="seller-location"
                  value={newProduct.seller_location}
                  onChange={(e) => setNewProduct({ ...newProduct, seller_location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter product description"
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage Instructions</Label>
              <Textarea
                id="dosage"
                value={newProduct.dosage_instructions}
                onChange={(e) => setNewProduct({ ...newProduct, dosage_instructions: e.target.value })}
                placeholder="Enter usage instructions"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addProduct}>Add Product</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <Badge variant={product.is_approved ? 'default' : 'destructive'}>
                      {product.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                    <Badge variant="outline">
                      {categories.find(c => c.value === product.category)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Price:</strong> {product.currency} {product.price}</p>
                    <p><strong>Stock:</strong> {product.stock_quantity}</p>
                    <p><strong>Seller:</strong> {product.seller_name} - {product.seller_location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={product.is_approved ? 'outline' : 'default'}
                    onClick={() => toggleApproval(product._id, product.is_approved)}
                  >
                    {product.is_approved ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};