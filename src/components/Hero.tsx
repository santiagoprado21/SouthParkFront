
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Clock } from "lucide-react";

export const Hero = () => {
  const scrollToSports = () => {
    const sportsSection = document.getElementById('sports');
    if (sportsSection) {
      sportsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-club-blue via-club-green to-club-yellow py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Reserva tu cancha
            <span className="block bg-gradient-to-r from-club-yellow to-club-red bg-clip-text text-transparent">
              favorita
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-in">
            Disfruta de las mejores instalaciones deportivas del Club South Park. 
            Reserva fácil, pago seguro, diversión garantizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={scrollToSports}
              size="lg"
              className="bg-white text-club-blue hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-200 text-lg px-8 py-4"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Hacer Reserva
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-club-blue shadow-xl transform hover:scale-105 transition-all duration-200 text-lg px-8 py-4"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Ver Instalaciones
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-club-yellow rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <p className="text-white font-medium">Voley Playa</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-club-green rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <p className="text-white font-medium">Canchas Sintéticas</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-club-blue rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xl">6</span>
              </div>
              <p className="text-white font-medium">Tennis</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-club-red rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <p className="text-white font-medium">Mini Golf</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
