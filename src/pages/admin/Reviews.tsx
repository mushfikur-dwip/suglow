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
import { Search, Star, Check, X, Eye, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Reviews", value: "1,234", icon: MessageSquare, change: "+12%", changeType: "positive" as const },
    { title: "Average Rating", value: "4.5", icon: Star, change: "+0.2", changeType: "positive" as const },
    { title: "Pending Approval", value: "23", icon: Eye, change: "-5", changeType: "negative" as const },
    { title: "This Month", value: "156", icon: ThumbsUp, change: "+18%", changeType: "positive" as const },
  ];

  const reviews = [
    {
      id: 1,
      customer: "রহিমা বেগম",
      product: "Vitamin C Serum",
      rating: 5,
      comment: "অসাধারণ প্রোডাক্ট! আমার স্কিন অনেক ব্রাইট হয়ে গেছে।",
      date: "2024-01-15",
      status: "approved",
    },
    {
      id: 2,
      customer: "করিম উদ্দিন",
      product: "Niacinamide Cream",
      rating: 4,
      comment: "ভালো প্রোডাক্ট, তবে দাম একটু বেশি মনে হয়েছে।",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      customer: "সালমা খাতুন",
      product: "Retinol Night Cream",
      rating: 5,
      comment: "রাতে ব্যবহার করি, সকালে স্কিন অনেক সফট থাকে।",
      date: "2024-01-13",
      status: "approved",
    },
    {
      id: 4,
      customer: "জামাল হোসেন",
      product: "Sunscreen SPF 50",
      rating: 3,
      comment: "ঠিকই আছে, তবে একটু oily লাগে।",
      date: "2024-01-12",
      status: "pending",
    },
    {
      id: 5,
      customer: "নাজমা আক্তার",
      product: "Face Wash",
      rating: 2,
      comment: "আমার স্কিনে সুট করেনি।",
      date: "2024-01-11",
      status: "rejected",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <AdminStatCard key={index} {...stat} />
          ))}
        </div>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Reviews</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden md:table-cell">Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.customer}</TableCell>
                    <TableCell>{review.product}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
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

export default Reviews;
