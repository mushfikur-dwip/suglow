import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, AlertTriangle, Package, DollarSign, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";

const Damages = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Damages", value: "45", icon: AlertTriangle, change: "-12%", changeType: "positive" as const },
    { title: "This Month", value: "8", icon: Calendar, change: "-3", changeType: "positive" as const },
    { title: "Total Loss", value: "৳12,450", icon: DollarSign, change: "-8%", changeType: "positive" as const },
    { title: "Items Affected", value: "67", icon: Package, change: "-15", changeType: "positive" as const },
  ];

  const damages = [
    {
      id: "DMG-001",
      product: "Vitamin C Serum",
      quantity: 5,
      reason: "Expired",
      reportedBy: "Store Manager",
      date: "2024-01-15",
      lossAmount: 4250,
      status: "verified",
    },
    {
      id: "DMG-002",
      product: "Niacinamide Cream",
      quantity: 3,
      reason: "Damaged in transit",
      reportedBy: "Warehouse Staff",
      date: "2024-01-14",
      lossAmount: 1950,
      status: "pending",
    },
    {
      id: "DMG-003",
      product: "Retinol Night Cream",
      quantity: 2,
      reason: "Manufacturing defect",
      reportedBy: "Quality Control",
      date: "2024-01-13",
      lossAmount: 2400,
      status: "verified",
    },
    {
      id: "DMG-004",
      product: "Sunscreen SPF 50",
      quantity: 8,
      reason: "Storage issue",
      reportedBy: "Store Manager",
      date: "2024-01-12",
      lossAmount: 3600,
      status: "under_review",
    },
    {
      id: "DMG-005",
      product: "Face Wash",
      quantity: 4,
      reason: "Customer return - damaged",
      reportedBy: "Customer Service",
      date: "2024-01-10",
      lossAmount: 1400,
      status: "verified",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      default:
        return null;
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      "Expired": "bg-red-100 text-red-800",
      "Damaged in transit": "bg-orange-100 text-orange-800",
      "Manufacturing defect": "bg-purple-100 text-purple-800",
      "Storage issue": "bg-blue-100 text-blue-800",
      "Customer return - damaged": "bg-gray-100 text-gray-800",
    };
    return <Badge className={colors[reason] || "bg-gray-100 text-gray-800"}>{reason}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Damages & Losses</h1>
            <p className="text-muted-foreground">Track damaged, expired, and lost inventory</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Report Damage
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <AdminStatCard key={index} {...stat} />
          ))}
        </div>

        {/* Damages Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Damage Reports</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="hidden md:table-cell">Reason</TableHead>
                  <TableHead>Loss</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {damages.map((damage) => (
                  <TableRow key={damage.id}>
                    <TableCell className="font-medium">{damage.id}</TableCell>
                    <TableCell>{damage.product}</TableCell>
                    <TableCell>{damage.quantity}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getReasonBadge(damage.reason)}
                    </TableCell>
                    <TableCell className="font-semibold text-destructive">
                      ৳{damage.lossAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(damage.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Damages;
