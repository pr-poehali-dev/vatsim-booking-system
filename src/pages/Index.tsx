import { useState } from 'react';
import { toast } from 'sonner';
import HomePage from '@/components/HomePage';
import AuthPages from '@/components/AuthPages';
import AdminDashboard from '@/components/AdminDashboard';
import PilotDashboard from '@/components/PilotDashboard';

type Event = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  banner: string;
  flights: Flight[];
};

type Flight = {
  id: string;
  flightNumber: string;
  type: 'arrival' | 'departure';
  time: string;
  aircraft: string;
  aircraftType: 'plane' | 'helicopter';
  route: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  bookedBy?: string;
};

type Pilot = {
  pid: string;
  firstName: string;
  lastName: string;
  password: string;
  rating: number;
  completedFlights: number;
  failedFlights: number;
};

type Admin = {
  pid: string;
  firstName: string;
  lastName: string;
  password: string;
};

export default function Index() {
  const [page, setPage] = useState<'home' | 'pilot-login' | 'pilot-dashboard' | 'admin-login' | 'admin-dashboard' | 'admin-register'>('home');
  const [currentUser, setCurrentUser] = useState<Pilot | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  
  const [pilots] = useState<Pilot[]>([
    { pid: '1234567', firstName: 'Иван', lastName: 'Петров', password: 'pilot123', rating: 75, completedFlights: 8, failedFlights: 1 },
    { pid: '7654321', firstName: 'Мария', lastName: 'Сидорова', password: 'pilot456', rating: 30, completedFlights: 3, failedFlights: 0 },
  ]);

  const [admins] = useState<Admin[]>([
    { pid: '1437139', firstName: 'Главный', lastName: 'Админ', password: '12345' },
  ]);

  const [events] = useState<Event[]>([
    {
      id: '1',
      name: 'Полёт в Сочи',
      date: '2025-12-01',
      startTime: '12:00',
      endTime: '18:00',
      description: 'Массовый вылет в Сочи',
      banner: '✈️',
      flights: [
        { id: '1', flightNumber: 'AFL123', type: 'departure', time: '12:30', aircraft: 'A320', aircraftType: 'plane', route: 'USSS-URSS', description: 'Регулярный рейс', status: 'pending' },
        { id: '2', flightNumber: 'AFL456', type: 'arrival', time: '15:00', aircraft: 'B737', aircraftType: 'plane', route: 'UUEE-USSS', description: 'Без особенностей', status: 'pending' },
      ]
    },
    {
      id: '2',
      name: 'Вертолётная миссия',
      date: '2025-12-05',
      startTime: '09:00',
      endTime: '12:00',
      description: 'Тренировочные полёты на вертолётах',
      banner: '🚁',
      flights: [
        { id: '3', flightNumber: 'HEL001', type: 'departure', time: '09:30', aircraft: 'Mi-8', aircraftType: 'helicopter', route: 'USSS-местность', description: 'Патрулирование', status: 'pending' },
      ]
    }
  ]);

  const handlePilotLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pid = formData.get('pid') as string;
    const password = formData.get('password') as string;
    
    const pilot = pilots.find(p => p.pid === pid && p.password === password);
    if (pilot) {
      setCurrentUser(pilot);
      setPage('pilot-dashboard');
      toast.success('Вход выполнен успешно!');
    } else {
      toast.error('Неверный PID или пароль');
    }
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pid = formData.get('pid') as string;
    const password = formData.get('password') as string;
    
    const admin = admins.find(a => a.pid === pid && a.password === password);
    if (admin) {
      setCurrentAdmin(admin);
      setPage('admin-dashboard');
      toast.success('Вход в админ-панель выполнен');
    } else {
      toast.error('Неверный PID или пароль');
    }
  };

  if (page === 'home') {
    return (
      <HomePage 
        onNavigate={(newPage) => setPage(newPage)}
      />
    );
  }

  if (page === 'pilot-login' || page === 'admin-login') {
    return (
      <AuthPages
        page={page}
        onBack={() => setPage('home')}
        onPilotLogin={handlePilotLogin}
        onAdminLogin={handleAdminLogin}
        onNavigateAdminRegister={() => setPage('admin-register')}
      />
    );
  }

  if (page === 'admin-dashboard' && currentAdmin) {
    return (
      <AdminDashboard
        currentAdmin={currentAdmin}
        events={events}
        admins={admins}
        onLogout={() => {
          setCurrentAdmin(null);
          setPage('home');
        }}
      />
    );
  }

  if (page === 'pilot-dashboard') {
    return (
      <PilotDashboard
        currentUser={currentUser}
        pilots={pilots}
        events={events}
        onLogout={() => {
          setCurrentUser(null);
          setPage('home');
        }}
      />
    );
  }

  return null;
}
