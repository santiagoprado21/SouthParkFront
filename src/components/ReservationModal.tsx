
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, Clock, MapPin, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { Sport, User, Reservation } from "@/pages/Index";

interface ReservationModalProps {
  sport: Sport;
  user: User;
  onClose: () => void;
  onReserve: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  existingReservations: Reservation[];
}

export const ReservationModal = ({ sport, user, onClose, onReserve, existingReservations }: ReservationModalProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [step, setStep] = useState<'reservation' | 'payment'>('reservation');

  // Generar horarios disponibles (4:00 PM a 12:00 AM)
  const generateTimeSlots = () => {
    const slots = [];
    // De 16:00 a 23:30 (4 PM a 11:30 PM)
    for (let hour = 16; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 23) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    // Agregar 00:00 (12:00 AM)
    slots.push('00:00');
    return slots;
  };

  // Verificar si un horario está ocupado
  const isTimeSlotOccupied = (date: string, time: string, courtNumber: number) => {
    return existingReservations.some(reservation => 
      reservation.sportId === sport.id &&
      reservation.date === date &&
      reservation.time === time &&
      reservation.courtNumber === courtNumber &&
      reservation.status !== 'cancelled'
    );
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime || !selectedCourt) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const courtNumber = parseInt(selectedCourt);
    
    if (isTimeSlotOccupied(selectedDate, selectedTime, courtNumber)) {
      toast.error('Esta cancha ya está reservada en ese horario');
      return;
    }

    setStep('payment');
  };

  const handlePayment = () => {
    const reservation: Omit<Reservation, 'id' | 'createdAt'> = {
      sportId: sport.id,
      sportName: sport.name,
      courtNumber: parseInt(selectedCourt),
      date: selectedDate,
      time: selectedTime,
      duration: sport.duration,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      price: sport.price,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentAmount: 0,
      paymentPercentage: 30
    };

    onReserve(reservation);
    toast.success('¡Reserva confirmada exitosamente!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:${minute.toString().padStart(2, '0')} AM`;
    if (hour === 12) return `12:${minute.toString().padStart(2, '0')} PM`;
    return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`;
  };

  // Contar reservas ocupadas para la fecha seleccionada
  const getOccupiedSlotsForDate = (date: string) => {
    if (!date) return {};
    
    const occupied: { [key: string]: number } = {};
    existingReservations.forEach(reservation => {
      if (reservation.sportId === sport.id && 
          reservation.date === date && 
          reservation.status !== 'cancelled') {
        const key = `${reservation.time}-${reservation.courtNumber}`;
        occupied[key] = (occupied[key] || 0) + 1;
      }
    });
    return occupied;
  };

  if (step === 'payment') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
          <CardHeader className="relative">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
              Confirmar Pago
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Resumen de la reserva */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-800">Resumen de la Reserva</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deporte:</span>
                  <span className="font-medium">{sport.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancha:</span>
                  <span className="font-medium">#{selectedCourt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{formatTimeDisplay(selectedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">{sport.duration} min</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-club-green">${sport.price}</span>
                </div>
              </div>
            </div>

            {/* Simulación de pago */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Vencimiento</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setStep('reservation')}
                variant="outline"
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-club-green to-club-blue hover:from-club-blue hover:to-club-green text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar ${sport.price}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const occupiedSlots = getOccupiedSlotsForDate(selectedDate);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-club-blue to-club-green bg-clip-text text-transparent">
            Reservar {sport.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Información del deporte */}
          <div className={`bg-gradient-to-br ${sport.color} text-white rounded-lg p-4 text-center`}>
            <div className="text-4xl mb-2">{sport.image}</div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {sport.duration} min
                </span>
                <span className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${sport.price}
                </span>
              </div>
              <p className="text-xs opacity-90">Horarios: 4:00 PM - 12:00 AM</p>
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="court">Cancha</Label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una cancha" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: sport.courts }, (_, i) => i + 1).map((courtNumber) => (
                    <SelectItem key={courtNumber} value={courtNumber.toString()}>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Cancha #{courtNumber}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visualización de horarios disponibles */}
            {selectedDate && selectedCourt && (
              <div>
                <Label>Horarios Disponibles</Label>
                <div className="mt-2 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                  {generateTimeSlots().map((time) => {
                    const isOccupied = isTimeSlotOccupied(selectedDate, time, parseInt(selectedCourt));
                    
                    return (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : isOccupied ? "secondary" : "outline"}
                        size="sm"
                        className={`h-12 text-xs flex flex-col items-center justify-center ${
                          isOccupied 
                            ? 'bg-red-100 border-red-200 text-red-600 cursor-not-allowed' 
                            : selectedTime === time 
                              ? 'bg-club-blue text-white' 
                              : 'hover:bg-club-blue/10'
                        }`}
                        disabled={isOccupied}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-3 h-3 mb-1" />
                        <span className="font-medium">{formatTimeDisplay(time)}</span>
                        {isOccupied && (
                          <Badge variant="destructive" className="text-[10px] mt-1 px-1 py-0">
                            Ocupado
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-200 border border-green-300 rounded mr-1"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-200 border border-red-300 rounded mr-1"></div>
                      <span>Ocupado</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-club-blue rounded mr-1"></div>
                      <span>Seleccionado</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedDate && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Selecciona una fecha para ver los horarios disponibles</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleReservation}
            className="w-full bg-gradient-to-r from-club-blue to-club-green hover:from-club-green hover:to-club-blue text-white"
            disabled={!selectedDate || !selectedTime || !selectedCourt}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Continuar al Pago
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
