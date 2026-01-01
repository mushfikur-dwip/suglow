import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone } from "lucide-react";

const POS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([
    { id: 1, name: "Vitamin C Serum", price: 850, quantity: 2 },
    { id: 2, name: "Niacinamide Cream", price: 650, quantity: 1 },
  ]);

  const products = [
    { id: 1, name: "Vitamin C Serum", price: 850, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100" },
    { id: 2, name: "Niacinamide Cream", price: 650, image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=100" },
    { id: 3, name: "Retinol Night Cream", price: 1200, image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=100" },
    { id: 4, name: "Hyaluronic Acid", price: 750, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100" },
    { id: 5, name: "Sunscreen SPF 50", price: 450, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100" },
    { id: 6, name: "Face Wash", price: 350, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100" },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        {/* Products Section */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-auto flex-1">
            {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-primary font-semibold">৳{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Current Order</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-muted-foreground text-xs">৳{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>৳{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button variant="outline" className="flex flex-col h-16">
                <Banknote className="h-5 w-5 mb-1" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-16">
                <CreditCard className="h-5 w-5 mb-1" />
                <span className="text-xs">Card</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-16">
                <Smartphone className="h-5 w-5 mb-1" />
                <span className="text-xs">bKash</span>
              </Button>
            </div>

            <Button className="w-full mt-3 bg-primary hover:bg-primary/90">
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default POS;
