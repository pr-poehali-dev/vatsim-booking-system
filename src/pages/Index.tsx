import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import HomePage from '@/components/HomePage';
import AuthPages from '@/components/AuthPages';
import AdminDashboard from '@/components/AdminDashboard';
import PilotDashboard from '@/components/PilotDashboard';
import { login, getEvents, getPilots } from '@/lib/api';

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
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
    loadPilots();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data.events);
  };

  const loadPilots = async () => {
    const data = await getPilots();
    setPilots(data.pilots);
  };

  const handlePilotLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pid = formData.get('pid') as string;
    const password = formData.get('password') as string;
    
    const result = await login('pilot', pid, password);
    if (result.success) {
      setCurrentUser(result.user);
      setPage('pilot-dashboard');
      toast.success('Вход выполнен успешно!');
    } else {
      toast.error('Неверный PID или пароль');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pid = formData.get('pid') as string;
    const password = formData.get('password') as string;
    
    const result = await login('admin', pid, password);
    if (result.success) {
      setCurrentAdmin(result.user);
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
        onRefresh={() => {
          loadEvents();
          loadPilots();
        }}
      />
    );
  }

  return null;
}