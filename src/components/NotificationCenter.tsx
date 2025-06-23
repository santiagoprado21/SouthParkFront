
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Calendar, AlertCircle, Info } from "lucide-react";
import type { Notification } from "@/pages/Index";

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationCenter = ({ notifications, onMarkAsRead }: NotificationCenterProps) => {
  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation_confirmed':
        return <Calendar className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      case 'cancellation':
        return <AlertCircle className="w-4 h-4" />;
      case 'admin_alert':
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reservation_confirmed':
        return 'text-club-green';
      case 'reminder':
        return 'text-club-blue';
      case 'cancellation':
        return 'text-club-red';
      case 'admin_alert':
        return 'text-club-yellow';
      default:
        return 'text-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <section className="py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Centro de Notificaciones
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications.length} nuevas
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Notificaciones no leídas */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Nuevas Notificaciones</h4>
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{notification.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => onMarkAsRead(notification.id)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notificaciones leídas */}
              {readNotifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Notificaciones Anteriores</h4>
                  <div className="space-y-2">
                    {readNotifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className="bg-gray-50 rounded-lg p-3 opacity-75"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 ${getNotificationColor(notification.type)} opacity-60`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-700 text-sm">{notification.title}</h5>
                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                            <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay notificaciones</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
