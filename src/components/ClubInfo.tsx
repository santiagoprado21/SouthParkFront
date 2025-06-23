
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Clock, Star } from "lucide-react";

export const ClubInfo = () => {
  const events = [
    {
      id: 1,
      title: "Torneo de Tennis",
      date: "2024-06-15",
      type: "Competencia",
      participants: 32,
      status: "Finalizado"
    },
    {
      id: 2,
      title: "Liga de Fútbol Sintético",
      date: "2024-07-01",
      type: "Liga",
      participants: 16,
      status: "En progreso"
    },
    {
      id: 3,
      title: "Campeonato de Voley Playa",
      date: "2024-08-10",
      type: "Competencia",
      participants: 24,
      status: "Próximo"
    },
    {
      id: 4,
      title: "Torneo de Mini Golf Familiar",
      date: "2024-08-25",
      type: "Familiar",
      participants: 40,
      status: "Próximo"
    }
  ];

  const stats = [
    { icon: Users, label: "Miembros Activos", value: "500+" },
    { icon: Trophy, label: "Torneos Anuales", value: "12" },
    { icon: Calendar, label: "Años de Historia", value: "25" },
    { icon: Star, label: "Calificación", value: "4.8/5" }
  ];

  return (
    <section id="about" className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto">
        {/* Información del Club */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Sobre South Park Club
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Con más de 25 años de experiencia, somos el club deportivo líder en la región. 
            Ofrecemos instalaciones de primera clase y una comunidad vibrante para todos los amantes del deporte.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-club-blue" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Historia del Club */}
        <Card className="mb-12 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-club-blue to-club-green text-white">
            <CardTitle className="text-2xl">Nuestra Historia</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Fundado en 1999</h3>
                <p className="text-gray-600 mb-4">
                  South Park Club nació con la visión de crear un espacio donde las familias y deportistas 
                  pudieran disfrutar de actividades recreativas de calidad en un ambiente seguro y amigable.
                </p>
                <p className="text-gray-600 mb-4">
                  Desde nuestros inicios con solo 2 canchas de tennis, hemos crecido hasta convertirnos 
                  en el complejo deportivo más completo de la zona, con 17 canchas distribuidas en 4 deportes diferentes.
                </p>
                <p className="text-gray-600">
                  Nuestro compromiso con la excelencia y la satisfacción de nuestros miembros nos ha 
                  permitido mantener los más altos estándares de calidad durante más de dos décadas.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="/placeholder.svg" 
                  alt="Club South Park"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-club-yellow/20 to-club-red/20 rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eventos y Torneos */}
        <div>
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Eventos y Torneos
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge 
                      variant={event.status === 'Finalizado' ? 'secondary' : 
                              event.status === 'En progreso' ? 'default' : 'outline'}
                      className={
                        event.status === 'Finalizado' ? 'bg-gray-500' :
                        event.status === 'En progreso' ? 'bg-club-green' : 'border-club-blue text-club-blue'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {event.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-club-blue" />
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-club-green" />
                      {event.participants} participantes
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Horarios de Atención */}
        <Card className="mt-12">
          <CardHeader className="bg-gradient-to-r from-club-red to-club-yellow text-white">
            <CardTitle className="text-2xl text-center">Horarios de Atención</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 text-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2 text-club-blue" />
                  Instalaciones Deportivas
                </h4>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Lunes a Viernes:</strong> 6:00 AM - 10:00 PM</p>
                  <p><strong>Sábados:</strong> 7:00 AM - 10:00 PM</p>
                  <p><strong>Domingos:</strong> 8:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2 text-club-green" />
                  Administración
                </h4>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Sábados:</strong> 9:00 AM - 2:00 PM</p>
                  <p><strong>Domingos:</strong> Cerrado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
