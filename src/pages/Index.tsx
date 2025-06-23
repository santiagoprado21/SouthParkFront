import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SportsGrid } from "@/components/SportsGrid";
import { ClubInfo } from "@/components/ClubInfo";
import { ReservationModal } from "@/components/ReservationModal";
import { LoginModal } from "@/components/LoginModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserProfile } from "@/components/UserProfile";
import { UserReservations } from "@/components/UserReservations";
import { PaymentModal } from "@/components/PaymentModal";
import { NotificationCenter } from "@/components/NotificationCenter";

export interface Sport {
  id: string;
  name: string;
  courts: number;
  price: number;
  duration: number;
  image: string;
  color: string;
  imageUrl: string;
  enabled: boolean;
  schedule: {
    start: string;
    end: string;
  };
  maintenance: {
    day: string;
    start: string;
    end: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'client';
  createdAt: string;
}

export interface Reservation {
  id: string;
  sportId: string;
  sportName: string;
  courtNumber: number;
  date: string;
  time: string;
  duration: number;
  userId: string;
  userName: string;
  userEmail: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentAmount: number;
  paymentPercentage: number;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  type: 'reservation' | 'full_payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  receipt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reservation_confirmed' | 'reminder' | 'cancellation' | 'admin_alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const sports: Sport[] = [
  {
    id: 'voley-playa',
    name: 'Voley Playa',
    courts: 4,
    price: 25,
    duration: 60,
    image: '🏐',
    color: 'from-club-yellow to-orange-400',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    enabled: true,
    schedule: { start: '16:00', end: '00:00' },
    maintenance: [{ day: 'Monday', start: '15:00', end: '16:00' }]
  },
  {
    id: 'canchas-sinteticas',
    name: 'Canchas Sintéticas',
    courts: 5,
    price: 30,
    duration: 90,
    image: '⚽',
    color: 'from-club-green to-emerald-400',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
    enabled: true,
    schedule: { start: '16:00', end: '00:00' },
    maintenance: [{ day: 'Tuesday', start: '15:00', end: '16:00' }]
  },
  {
    id: 'tennis',
    name: 'Tennis',
    courts: 6,
    price: 40,
    duration: 60,
    image: '🎾',
    color: 'from-club-blue to-blue-400',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
    enabled: true,
    schedule: { start: '16:00', end: '00:00' },
    maintenance: [{ day: 'Wednesday', start: '15:00', end: '16:00' }]
  },
  {
    id: 'mini-golf',
    name: 'Mini Golf',
    courts: 2,
    price: 15,
    duration: 45,
    image: '⛳',
    color: 'from-club-red to-red-400',
    imageUrl: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=400&h=300&fit=crop',
    enabled: true,
    schedule: { start: '16:00', end: '00:00' },
    maintenance: [{ day: 'Thursday', start: '15:00', end: '16:00' }]
  }
];

const Index = () => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserReservations, setShowUserReservations] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [sportsData, setSportsData] = useState<Sport[]>(sports);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    if (user.role === 'admin') {
      setShowAdminDashboard(true);
    }
    
    // Create welcome notification
    const welcomeNotification: Notification = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'reservation_confirmed',
      title: 'Bienvenido al South Park Club',
      message: `Hola ${user.name}, bienvenido a nuestro sistema de reservas.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [...prev, welcomeNotification]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAdminDashboard(false);
    setShowUserProfile(false);
    setShowUserReservations(false);
  };

  const handleReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setReservations(prev => [...prev, newReservation]);
    setSelectedReservation(newReservation);
    setSelectedSport(null);
    setShowPaymentModal(true);
    
    // Create confirmation notification
    const confirmationNotification: Notification = {
      id: (Date.now() + 1).toString(),
      userId: reservationData.userId,
      type: 'reservation_confirmed',
      title: 'Reserva Creada',
      message: `Tu reserva para ${reservationData.sportName} el ${reservationData.date} a las ${reservationData.time} ha sido creada. Completa el pago para confirmarla.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [...prev, confirmationNotification]);
  };

  const handlePayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setPayments(prev => [...prev, newPayment]);
    
    // Update reservation payment status
    if (selectedReservation) {
      const updatedReservation: Reservation = {
        ...selectedReservation,
        paymentStatus: payment.type === 'reservation' ? 'partial' : 'paid',
        paymentAmount: selectedReservation.paymentAmount + payment.amount,
        status: 'confirmed'
      };
      
      setReservations(prev => 
        prev.map(res => res.id === selectedReservation.id ? updatedReservation : res)
      );
    }
    
    setShowPaymentModal(false);
    setSelectedReservation(null);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev => 
      prev.map(res => res.id === id ? { ...res, ...updates } : res)
    );
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  const updateSport = (id: string, updates: Partial<Sport>) => {
    setSportsData(prev => 
      prev.map(sport => sport.id === id ? { ...sport, ...updates } : sport)
    );
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  if (showAdminDashboard && currentUser?.role === 'admin') {
    return (
      <AdminDashboard
        reservations={reservations}
        sports={sportsData}
        payments={payments}
        notifications={notifications}
        onLogout={handleLogout}
        onUpdateReservation={updateReservation}
        onDeleteReservation={deleteReservation}
        onUpdateSport={updateSport}
      />
    );
  }

  if (showUserProfile && currentUser) {
    return (
      <UserProfile
        user={currentUser}
        onUpdateUser={updateUser}
        onBack={() => setShowUserProfile(false)}
      />
    );
  }

  if (showUserReservations && currentUser) {
    return (
      <UserReservations
        user={currentUser}
        reservations={reservations.filter(r => r.userId === currentUser.id)}
        payments={payments}
        onBack={() => setShowUserReservations(false)}
        onCancelReservation={(id) => updateReservation(id, { status: 'cancelled' })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        currentUser={currentUser} 
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onAdminDashboard={() => setShowAdminDashboard(true)}
        onProfile={() => setShowUserProfile(true)}
        onReservations={() => setShowUserReservations(true)}
        notifications={notifications.filter(n => n.userId === currentUser?.id)}
      />
      
      <Hero />
      
      <SportsGrid 
        sports={sportsData.filter(sport => sport.enabled)}
        onSelectSport={setSelectedSport}
        currentUser={currentUser}
        onLoginRequired={() => setShowLoginModal(true)}
      />

      <ClubInfo />

      <NotificationCenter 
        notifications={notifications.filter(n => n.userId === currentUser?.id)}
        onMarkAsRead={(id) => {
          setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
          );
        }}
      />

      {selectedSport && currentUser && (
        <ReservationModal
          sport={selectedSport}
          user={currentUser}
          onClose={() => setSelectedSport(null)}
          onReserve={handleReservation}
          existingReservations={reservations}
        />
      )}

      {showPaymentModal && selectedReservation && (
        <PaymentModal
          reservation={selectedReservation}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedReservation(null);
          }}
          onPayment={handlePayment}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Index;
