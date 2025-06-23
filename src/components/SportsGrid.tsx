
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, DollarSign, Calendar, Image } from "lucide-react";
import type { Sport, User } from "@/pages/Index";

interface SportsGridProps {
  sports: Sport[];
  onSelectSport: (sport: Sport) => void;
  currentUser: User | null;
  onLoginRequired: () => void;
}

export const SportsGrid = ({ sports, onSelectSport, currentUser, onLoginRequired }: SportsGridProps) => {
  const handleReservation = (sport: Sport) => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }
    onSelectSport(sport);
  };

  return (
    <section id="sports" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestros Deportes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige entre nuestras excelentes instalaciones deportivas y reserva la que más te guste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Card key={sport.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <CardHeader className={`bg-gradient-to-br ${sport.color} text-white relative overflow-hidden`}>
                {/* Imagen de fondo del deporte */}
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={sport.imageUrl} 
                    alt={sport.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="text-6xl text-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {sport.image}
                  </div>
                  <CardTitle className="text-center text-xl font-bold">
                    {sport.name}
                  </CardTitle>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {sport.courts} canchas
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-club-blue" />
                    <span className="text-sm">{sport.courts} canchas disponibles</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-club-green" />
                    <span className="text-sm font-semibold">{sport.duration} minutos por reserva</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-club-red" />
                    <span className="text-sm font-semibold">${sport.price} por sesión</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={() => handleReservation(sport)}
                  className={`w-full bg-gradient-to-r ${sport.color} hover:opacity-90 text-white shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {currentUser ? 'Reservar Ahora' : 'Iniciar Sesión para Reservar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
