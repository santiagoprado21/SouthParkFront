
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings, UserCircle, Calendar, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { User as UserType, Notification } from "@/pages/Index";

interface HeaderProps {
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
  onAdminDashboard: () => void;
  onProfile: () => void;
  onReservations: () => void;
  notifications: Notification[];
}

export const Header = ({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onAdminDashboard, 
  onProfile, 
  onReservations,
  notifications 
}: HeaderProps) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-club-yellow via-club-red to-club-blue">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-club-yellow to-club-red rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">SP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
                South Park Club
              </h1>
              <p className="text-sm text-gray-600">Reservas Deportivas</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('sports')}
              className="text-gray-700 hover:text-club-blue transition-colors font-medium"
            >
              Deportes
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-club-blue transition-colors font-medium"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-club-blue transition-colors font-medium"
            >
              Contacto
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {unreadNotifications > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
                        >
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Notificaciones</h4>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay notificaciones</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-2 rounded text-sm ${
                                notification.read ? 'bg-gray-50' : 'bg-blue-50'
                              }`}
                            >
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-gray-600">{notification.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* User Menu */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-club-blue" />
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser.name}
                      </span>
                      {currentUser.role === 'admin' && (
                        <Badge variant="destructive" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <Button
                        onClick={onProfile}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </Button>
                      
                      <Button
                        onClick={onReservations}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Mis Reservas
                      </Button>
                      
                      {currentUser.role === 'admin' && (
                        <Button
                          onClick={onAdminDashboard}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Panel Admin
                        </Button>
                      )}
                      
                      <hr />
                      
                      <Button
                        onClick={onLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                onClick={onLogin}
                className="bg-gradient-to-r from-club-blue to-club-green hover:from-club-green hover:to-club-blue text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
