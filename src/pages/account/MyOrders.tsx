import { Link } from "react-router-dom";
import { Eye, Package } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "Dec 28, 2024",
    status: "Delivered",
    total: 3050,
    items: 3,
  },
  {
    id: "ORD-2024-002",
    date: "Dec 25, 2024",
    status: "Processing",
    total: 1650,
    items: 1,
  },
  {
    id: "ORD-2024-003",
    date: "Dec 20, 2024",
    status: "Shipped",
    total: 2400,
    items: 2,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const MyOrders = () => {
  return (
    <AccountLayout title="My Orders" breadcrumb="My Orders">
      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">
            No orders yet
          </h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border">
                  <td className="py-4 px-4 text-sm font-medium text-foreground">
                    {order.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {order.date}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {order.items} items
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-foreground">
                    ৳{order.total}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AccountLayout>
  );
};

export default MyOrders;
