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
import { Search, Plus, Percent, Tag, Calendar, TrendingUp, Edit, Trash2, Eye } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";

const Promotions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Active Promotions", value: "12", icon: Tag, change: "+3", changeType: "positive" as const },
    { title: "Total Discount Given", value: "৳45,230", icon: Percent, change: "+15%", changeType: "positive" as const },
    { title: "Orders with Promo", value: "234", icon: TrendingUp, change: "+22%", changeType: "positive" as const },
    { title: "Ending Soon", value: "4", icon: Calendar, change: "This week", changeType: "neutral" as const },
  ];

  const promotions = [
    {
      id: 1,
      name: "Winter Sale 2024",
      type: "Percentage",
      discount: "20%",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      usageCount: 156,
      status: "active",
    },
    {
      id: 2,
      name: "New Year Special",
      type: "Fixed Amount",
      discount: "৳200",
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      usageCount: 89,
      status: "active",
    },
    {
      id: 3,
      name: "Flash Sale",
      type: "Percentage",
      discount: "30%",
      startDate: "2024-01-20",
      endDate: "2024-01-21",
      usageCount: 0,
      status: "scheduled",
    },
    {
      id: 4,
      name: "Christmas Offer",
      type: "Percentage",
      discount: "25%",
      startDate: "2023-12-20",
      endDate: "2023-12-31",
      usageCount: 234,
      status: "expired",
    },
    {
      id: 5,
      name: "Buy 2 Get 1",
      type: "Bundle",
      discount: "1 Free",
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      usageCount: 45,
      status: "active",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Promotions</h1>
            <p className="text-muted-foreground">Manage sales and promotional campaigns</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Promotion
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <AdminStatCard key={index} {...stat} />
          ))}
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Promotions</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search promotions..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{promo.type}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">{promo.discount}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <p>{promo.startDate}</p>
                        <p className="text-muted-foreground">to {promo.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{promo.usageCount} orders</TableCell>
                    <TableCell>{getStatusBadge(promo.status)}</TableCell>
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

export default Promotions;
