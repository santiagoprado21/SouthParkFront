
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, CreditCard, DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";
import type { Reservation, Payment } from "@/pages/Index";

interface PaymentModalProps {
  reservation: Reservation;
  onClose: () => void;
  onPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
}

export const PaymentModal = ({ reservation, onClose, onPayment }: PaymentModalProps) => {
  const [paymentType, setPaymentType] = useState<'reservation' | 'full_payment'>('reservation');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const reservationAmount = Math.round(reservation.price * (reservation.paymentPercentage / 100));
  const remainingAmount = reservation.price - reservationAmount;
  const paymentAmount = paymentType === 'reservation' ? reservationAmount : reservation.price;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast.error('Por favor completa todos los campos de pago');
      return;
    }

    const payment: Omit<Payment, 'id' | 'createdAt'> = {
      reservationId: reservation.id,
      amount: paymentAmount,
      type: paymentType,
      status: 'completed',
      receipt: `REC-${Date.now()}`
    };

    onPayment(payment);
    toast.success(
      paymentType === 'reservation' 
        ? 'Pago de reserva procesado exitosamente'
        : 'Pago completo procesado exitosamente'
    );
  };

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
            Procesar Pago
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Resumen de la reserva */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Resumen de la Reserva</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Deporte:</span>
                <span className="font-medium">{reservation.sportName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancha:</span>
                <span className="font-medium">#{reservation.courtNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">{formatDate(reservation.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-medium">{reservation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">{reservation.duration} min</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Precio Total:</span>
                <span className="text-club-blue">${reservation.price}</span>
              </div>
            </div>
          </div>

          {/* Tipo de pago */}
          <div>
            <Label htmlFor="paymentType">Tipo de Pago</Label>
            <Select value={paymentType} onValueChange={(value: 'reservation' | 'full_payment') => setPaymentType(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reservation">
                  <div className="flex flex-col items-start">
                    <span>Separar Cancha ({reservation.paymentPercentage}%)</span>
                    <span className="text-xs text-gray-500">${reservationAmount} - Pago para confirmar</span>
                  </div>
                </SelectItem>
                <SelectItem value="full_payment">
                  <div className="flex flex-col items-start">
                    <span>Pago Completo (100%)</span>
                    <span className="text-xs text-gray-500">${reservation.price} - Pago total</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Información del pago */}
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Monto a Pagar:</span>
              <Badge className="bg-club-green text-white text-lg px-3 py-1">
                ${paymentAmount}
              </Badge>
            </div>
            {paymentType === 'reservation' && (
              <p className="text-sm text-gray-600">
                Restante: ${remainingAmount} (se puede pagar al llegar al club)
              </p>
            )}
          </div>

          {/* Formulario de tarjeta */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nombre completo"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Vencimiento</Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-club-green to-club-blue hover:from-club-blue hover:to-club-green text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pagar ${paymentAmount}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
