
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign, Filter, Trash2, CheckCircle, XCircle, Settings, TrendingUp, Users, Bell } from "lucide-react";
import { toast } from "sonner";
import type { Reservation, Sport, Payment, Notification } from "@/pages/Index";

interface AdminDashboardProps {
  reservations: Reservation[];
  sports: Sport[];
  payments: Payment[];
  notifications: Notification[];
  onLogout: () => void;
  onUpdateReservation: (id: string, updates: Partial<Reservation>) => void;
  onDeleteReservation: (id: string) => void;
  onUpdateSport: (id: string, updates: Partial<Sport>) => void;
}

export const AdminDashboard = ({ 
  reservations, 
  sports, 
  payments,
  notifications,
  onLogout, 
  onUpdateReservation, 
  onDeleteReservation,
  onUpdateSport
}: AdminDashboardProps) => {
  const [filterSport, setFilterSport] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  const filteredReservations = reservations.filter(reservation => {
    const sportFilter = filterSport === 'all' || reservation.sportId === filterSport;
    const statusFilter = filterStatus === 'all' || reservation.status === filterStatus;
    return sportFilter && statusFilter;
  });

  const handleStatusChange = (reservationId: string, newStatus: 'confirmed' | 'cancelled') => {
    onUpdateReservation(reservationId, { status: newStatus });
    toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'} exitosamente`);
  };

  const handleDeleteReservation = (reservationId: string) => {
    onDeleteReservation(reservationId);
    toast.success('Reserva eliminada exitosamente');
  };

  const handleUpdateSport = (sportId: string, updates: Partial<Sport>) => {
    onUpdateSport(sportId, updates);
    toast.success('Deporte actualizado exitosamente');
    setSelectedSport(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-club-green text-white">Confirmada</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-club-yellow text-club-yellow">Pendiente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Cálculos para reportes
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayReservations = reservations.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.date === today;
  });

  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const monthlyRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.createdAt);
      const currentMonth = new Date().getMonth();
      return paymentDate.getMonth() === currentMonth && p.status === 'completed';
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Deporte más popular
  const sportUsage = sports.map(sport => ({
    ...sport,
    reservations: reservations.filter(r => r.sportId === sport.id && r.status === 'confirmed').length
  })).sort((a, b) => b.reservations - a.reservations);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-club-yellow via-club-red to-club-blue">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-club-red to-club-yellow rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600">South Park Club - Gestión Completa</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-club-red text-club-red hover:bg-club-red hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Sitio
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="sports">Canchas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>

          {/* Dashboard General */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Reservas</p>
                      <p className="text-2xl font-bold text-club-blue">{reservations.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-club-blue" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Hoy</p>
                      <p className="text-2xl font-bold text-club-green">{todayReservations.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-club-green" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Confirmadas</p>
                      <p className="text-2xl font-bold text-club-yellow">{confirmedReservations.length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-club-yellow" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos Total</p>
                      <p className="text-2xl font-bold text-club-red">${totalRevenue}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-club-red" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deporte más popular */}
            <Card>
              <CardHeader>
                <CardTitle>Deportes Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sportUsage.slice(0, 3).map((sport, index) => (
                    <div key={sport.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="text-2xl">{sport.image}</span>
                        <div>
                          <h4 className="font-medium">{sport.name}</h4>
                          <p className="text-sm text-gray-600">{sport.courts} canchas disponibles</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-club-blue">{sport.reservations}</p>
                        <p className="text-sm text-gray-600">reservas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Reservas */}
          <TabsContent value="reservations" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={filterSport} onValueChange={setFilterSport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por deporte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los deportes</SelectItem>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.image} {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="confirmed">Confirmadas</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="cancelled">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Reservas */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas ({filteredReservations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay reservas que mostrar
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-4 flex-wrap">
                              <h3 className="font-semibold text-lg">{reservation.sportName}</h3>
                              {getStatusBadge(reservation.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {reservation.userName}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                Cancha #{reservation.courtNumber}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(reservation.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {reservation.time}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-600">Email: {reservation.userEmail}</span>
                              <span className="font-semibold text-club-green">Precio: ${reservation.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {reservation.status !== 'confirmed' && (
                              <Button
                                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                size="sm"
                                className="bg-club-green hover:bg-club-green/80 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirmar
                              </Button>
                            )}
                            {reservation.status !== 'cancelled' && (
                              <Button
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                size="sm"
                                variant="outline"
                                className="border-club-red text-club-red hover:bg-club-red hover:text-white"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteReservation(reservation.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Canchas */}
          <TabsContent value="sports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Gestión de Canchas y Deportes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sports.map((sport) => (
                    <Card key={sport.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{sport.image}</span>
                            <div>
                              <h3 className="font-semibold">{sport.name}</h3>
                              <p className="text-sm text-gray-600">{sport.courts} canchas</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={sport.enabled}
                              onCheckedChange={(enabled) => handleUpdateSport(sport.id, { enabled })}
                            />
                            <Button
                              onClick={() => setSelectedSport(sport)}
                              size="sm"
                              variant="outline"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Precio:</span>
                            <span className="font-medium">${sport.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duración:</span>
                            <span className="font-medium">{sport.duration} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Horario:</span>
                            <span className="font-medium">{sport.schedule.start} - {sport.schedule.end}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estado:</span>
                            <Badge variant={sport.enabled ? "default" : "secondary"}>
                              {sport.enabled ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modal de edición de deporte */}
            {selectedSport && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar {selectedSport.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courts">Número de Canchas</Label>
                      <Input
                        id="courts"
                        type="number"
                        value={selectedSport.courts}
                        onChange={(e) => setSelectedSport({
                          ...selectedSport,
                          courts: parseInt(e.target.value) || 0
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio por Sesión</Label>
                      <Input
                        id="price"
                        type="number"
                        value={selectedSport.price}
                        onChange={(e) => setSelectedSport({
                          ...selectedSport,
                          price: parseFloat(e.target.value) || 0
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duración (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={selectedSport.duration}
                        onChange={(e) => setSelectedSport({
                          ...selectedSport,
                          duration: parseInt(e.target.value) || 0
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Switch
                          checked={selectedSport.enabled}
                          onCheckedChange={(enabled) => setSelectedSport({
                            ...selectedSport,
                            enabled
                          })}
                        />
                        <span>{selectedSport.enabled ? "Activo" : "Inactivo"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      onClick={() => setSelectedSport(null)}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => handleUpdateSport(selectedSport.id, selectedSport)}
                      className="bg-club-blue hover:bg-club-blue/80 text-white"
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reportes */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos del Mes</p>
                      <p className="text-2xl font-bold text-club-green">${monthlyRevenue}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-club-green" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Usuarios Activos</p>
                      <p className="text-2xl font-bold text-club-blue">
                        {new Set(reservations.map(r => r.userId)).size}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-club-blue" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Promedio por Reserva</p>
                      <p className="text-2xl font-bold text-club-red">
                        ${Math.round(totalRevenue / (reservations.length || 1))}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-club-red" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Uso de Canchas por Deporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sportUsage.map((sport) => (
                    <div key={sport.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{sport.image}</span>
                        <div>
                          <h4 className="font-medium">{sport.name}</h4>
                          <p className="text-sm text-gray-600">{sport.courts} canchas disponibles</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-club-blue">{sport.reservations} reservas</p>
                        <p className="text-sm text-gray-600">
                          ${sport.reservations * sport.price} en ingresos
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Centro de Notificaciones */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Centro de Notificaciones Administrativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay notificaciones administrativas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleString('es-ES')}
                            </span>
                          </div>
                          <Badge variant={notification.read ? "secondary" : "default"}>
                            {notification.read ? "Leída" : "Nueva"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
