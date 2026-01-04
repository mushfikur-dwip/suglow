import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Star, Check, X, Trash2, MessageSquare, Eye, Loader2 } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useReviews, useReviewStats, useUpdateReviewStatus, useDeleteReview } from "@/hooks/useReviews";
import { toast } from "sonner";
import { format } from "date-fns";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { data: reviewsData, isLoading } = useReviews({ status: statusFilter, search: searchQuery });
  const { data: statsData } = useReviewStats();
  const updateStatusMutation = useUpdateReviewStatus();
  const deleteReviewMutation = useDeleteReview();

  const reviews = reviewsData?.data || [];
  const stats = statsData?.data || {};

  const handleApprove = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: "approved" });
      toast.success("Review approved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve review");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: "rejected" });
      toast.success("Review rejected successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject review");
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      await deleteReviewMutation.mutateAsync(selectedReview.id);
      toast.success("Review deleted successfully");
      setDeleteDialog(false);
      setSelectedReview(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  const openDeleteDialog = (review: any) => {
    setSelectedReview(review);
    setDeleteDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
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
          <AdminStatCard
            title="Total Reviews"
            value={stats.total_reviews || 0}
            icon={MessageSquare}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="Average Rating"
            value={stats.average_rating ? Number(stats.average_rating).toFixed(1) : "0.0"}
            icon={Star}
            change=""
            changeType="positive"
          />
          <AdminStatCard
            title="Pending Approval"
            value={stats.pending_reviews || 0}
            icon={Eye}
            change=""
            changeType="warning"
          />
          <AdminStatCard
            title="This Month"
            value={stats.this_month || 0}
            icon={MessageSquare}
            change=""
            changeType="positive"
          />
        </div>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Reviews</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Comment</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review: any) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">
                          {review.customer_name || "Guest"}
                        </TableCell>
                        <TableCell>{review.product_name}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {review.comment || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {review.created_at ? format(new Date(review.created_at), "MMM dd, yyyy") : "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {review.status !== "approved" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(review.id)}
                                disabled={updateStatusMutation.isPending}
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {review.status !== "rejected" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(review.id)}
                                disabled={updateStatusMutation.isPending}
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => openDeleteDialog(review)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this review from{" "}
                <strong>{selectedReview?.customer_name || "Guest"}</strong> for{" "}
                <strong>{selectedReview?.product_name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteReviewMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteReviewMutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteReviewMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Reviews;
