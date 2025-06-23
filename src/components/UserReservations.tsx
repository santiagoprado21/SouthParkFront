
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { User, Reservation, Payment } from "@/pages/Index";

interface UserReservationsProps {
  user: User;
  reservations: Reservation[];
  payments: Payment[];
  onBack: () => void;
  onCancelReservation: (id: string) => void;
}

export const UserReservations = ({ 
  user, 
  reservations, 
  payments, 
  onBack, 
  onCancelReservation 
}: UserReservationsProps) => {
  
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Pagado</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500 text-white">Parcial</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pendiente</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500 text-white">Reembolsado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const canCancelReservation = (reservation: Reservation) => {
    const reservationDate = new Date(reservation.date + 'T' + reservation.time);
    const now = new Date();
    const hoursDifference = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursDifference >= 24 && reservation.status !== 'cancelled';
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (canCancelReservation(reservation)) {
      onCancelReservation(reservation.id);
      toast.success('Reserva cancelada. Se procesará el reembolso según nuestras políticas.');
    } else {
      toast.error('No se puede cancelar esta reserva. Debe hacerlo con al menos 24 horas de anticipación.');
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-club-yellow via-club-red to-club-blue">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
                Mis Reservas
              </h1>
              <p className="text-sm text-gray-600">Historial y gestión de reservas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-sm text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-club-green">
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-club-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-club-red">${totalSpent}</p>
                </div>
                <DollarSign className="w-8 h-8 text-club-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedReservations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes reservas aún</p>
                <p className="text-sm">¡Haz tu primera reserva para comenzar!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-lg">{reservation.sportName}</h3>
                          {getStatusBadge(reservation.status)}
                          {getPaymentStatusBadge(reservation.paymentStatus)}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
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
                            {reservation.time} ({reservation.duration} min)
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            ${reservation.price}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {canCancelReservation(reservation) && (
                          <Button
                            onClick={() => handleCancelReservation(reservation)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
