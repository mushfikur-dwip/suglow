import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { useOrderDetails } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";

const OrderDetails = () => {
  const { id } = useParams();
  const { data: orderData, isLoading } = useOrderDetails(Number(id));
  
  const order = orderData?.data;

  if (isLoading) {
    return (
      <AccountLayout title="Order Details" breadcrumb="Order Details">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout title="Order Details" breadcrumb="Order Details">
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">
            Order not found
          </h2>
          <Link to="/account/orders" className="text-primary hover:underline">
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <AccountLayout title="Order Details" breadcrumb="Order Details">
      <Link 
        to="/account/orders" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-background border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Order #{order.order_number}
            </h2>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold text-foreground">৳{order.total_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium text-foreground capitalize">{order.payment_method}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
              {order.payment_status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-background border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">SKU: {item.product_sku}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-semibold text-foreground">৳{item.total_price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-background border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h3>
            {order.shipping_address ? (
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                <p className="text-muted-foreground mt-2">
                  {order.shipping_address.address_line1}
                  {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-muted-foreground">{order.shipping_address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No address available</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-background border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">৳{order.subtotal}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shipping_cost === 0 ? 'Free' : `৳${order.shipping_cost}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold text-foreground">
                <span>Total</span>
                <span>৳{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default OrderDetails;
