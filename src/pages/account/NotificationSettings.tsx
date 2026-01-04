import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import AccountLayout from '@/components/account/AccountLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/hooks/useNotifications';

export default function NotificationSettings() {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  const [formData, setFormData] = useState({
    emailOrders: true,
    emailPromotions: true,
    emailNewsletters: true,
    smsOrders: true,
    smsPromotions: false,
    pushOrders: true,
    pushPromotions: true
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        emailOrders: settings.email_orders,
        emailPromotions: settings.email_promotions,
        emailNewsletters: settings.email_newsletters,
        smsOrders: settings.sms_orders,
        smsPromotions: settings.sms_promotions,
        pushOrders: settings.push_orders,
        pushPromotions: settings.push_promotions
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <AccountLayout title="Notification Settings" breadcrumb="Notification Settings">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Notification Settings" breadcrumb="Notification Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Receive updates and promotional offers via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailOrders">Order Updates</Label>
                <p className="text-sm text-gray-500">
                  Get notified about your order status, shipping updates, and delivery
                </p>
              </div>
              <Switch
                id="emailOrders"
                checked={formData.emailOrders}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailOrders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailPromotions">Promotional Offers</Label>
                <p className="text-sm text-gray-500">
                  Receive special discounts, deals, and exclusive offers
                </p>
              </div>
              <Switch
                id="emailPromotions"
                checked={formData.emailPromotions}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailPromotions: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNewsletters">Newsletters</Label>
                <p className="text-sm text-gray-500">
                  Get the latest news, beauty tips, and product launches
                </p>
              </div>
              <Switch
                id="emailNewsletters"
                checked={formData.emailNewsletters}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailNewsletters: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              SMS Notifications
            </CardTitle>
            <CardDescription>
              Receive important updates via text message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsOrders">Order Updates</Label>
                <p className="text-sm text-gray-500">
                  Critical order updates and delivery notifications
                </p>
              </div>
              <Switch
                id="smsOrders"
                checked={formData.smsOrders}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, smsOrders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsPromotions">Promotional Offers</Label>
                <p className="text-sm text-gray-500">
                  Flash sales and limited-time offers (may incur charges)
                </p>
              </div>
              <Switch
                id="smsPromotions"
                checked={formData.smsPromotions}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, smsPromotions: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive instant notifications on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushOrders">Order Updates</Label>
                <p className="text-sm text-gray-500">
                  Real-time updates about your orders
                </p>
              </div>
              <Switch
                id="pushOrders"
                checked={formData.pushOrders}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, pushOrders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushPromotions">Promotional Offers</Label>
                <p className="text-sm text-gray-500">
                  Instant alerts for new deals and exclusive offers
                </p>
              </div>
              <Switch
                id="pushPromotions"
                checked={formData.pushPromotions}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, pushPromotions: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </AccountLayout>
  );
}
