import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

  const getRankBadge = (rating: number) => {
    if (rating < -20) return { label: 'Обманщик', color: 'bg-red-600' };
    if (rating < 30) return { label: 'Новичок', color: 'bg-gray-500' };
    if (rating < 55) return { label: 'Не новичок', color: 'bg-blue-500' };
    if (rating < 75) return { label: '4-й курс лётного', color: 'bg-cyan-500' };
    if (rating < 85) return { label: 'Второй пилот', color: 'bg-green-500' };
    if (rating < 95) return { label: 'Командир ВС', color: 'bg-yellow-500' };
    return { label: 'Командир-инструктор', color: 'bg-purple-600' };
  };

  const getRatingColor = (rating: number) => {
    if (rating < 0) return 'bg-red-500';
    if (rating < 30) return 'bg-orange-500';
    if (rating < 60) return 'bg-yellow-500';
    if (rating < 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icon name="Plane" size={48} className="text-cyan-400" />
              <h1 className="text-5xl font-bold text-white font-mono tracking-wider">VATSIM BOOKING</h1>
            </div>
            <p className="text-cyan-300 text-lg max-w-xl mx-auto leading-relaxed">
              Система бронирования рейсов для полётов в РегЦ Екатеринбург
            </p>
          </div>

          <div className="space-y-4 w-full max-w-md animate-scale-in">
            <Button 
              onClick={() => setPage('pilot-login')}
              size="lg"
              className="w-full h-16 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/50 transition-all hover:scale-105"
            >
              <Icon name="UserCircle" size={28} className="mr-3" />
              Букинг для пилотов
            </Button>
            
            <Button 
              onClick={() => setPage('admin-login')}
              variant="outline"
              size="lg"
              className="w-full h-12 text-lg border-slate-600 text-slate-300 hover:bg-slate-800 transition-all hover:scale-105"
            >
              <Icon name="Shield" size={20} className="mr-2" />
              Админка
            </Button>
          </div>

          <div className="mt-16">
            <Button 
              onClick={() => setPage('pilot-dashboard')}
              variant="ghost"
              className="text-slate-400 hover:text-cyan-400"
            >
              <Icon name="Trophy" size={20} className="mr-2" />
              Рейтинг пилотов
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'pilot-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <Button 
          onClick={() => setPage('home')}
          variant="ghost"
          className="text-slate-300 mb-8"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-slate-800/80 border-cyan-500/30 backdrop-blur animate-fade-in">
            <div className="text-center mb-8">
              <Icon name="UserCircle" size={48} className="mx-auto mb-4 text-cyan-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Вход для пилотов</h2>
              <p className="text-slate-400">Введите свои данные для доступа</p>
            </div>

            <form onSubmit={handlePilotLogin} className="space-y-4">
              <div>
                <Label htmlFor="pid" className="text-slate-300">PID</Label>
                <Input id="pid" name="pid" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="firstName" className="text-slate-300">Имя</Label>
                <Input id="firstName" name="firstName" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-300">Фамилия</Label>
                <Input id="lastName" name="lastName" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300">Пароль</Label>
                <Input id="password" name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500">
                Войти
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  if (page === 'admin-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <Button 
          onClick={() => setPage('home')}
          variant="ghost"
          className="text-slate-300 mb-8"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-slate-800/80 border-orange-500/30 backdrop-blur animate-fade-in">
            <div className="text-center mb-8">
              <Icon name="Shield" size={48} className="mx-auto mb-4 text-orange-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Админ-панель</h2>
              <p className="text-slate-400">Вход для администраторов</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-pid" className="text-slate-300">PID</Label>
                <Input id="admin-pid" name="pid" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <div>
                <Label htmlFor="admin-password" className="text-slate-300">Пароль</Label>
                <Input id="admin-password" name="password" type="password" required className="bg-slate-900 border-slate-700 text-white" />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500">
                Войти
              </Button>
            </form>

            <div className="mt-6">
              <Button 
                onClick={() => setPage('admin-register')}
                variant="ghost"
                className="w-full text-slate-400 hover:text-orange-400"
              >
                Стать админом
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (page === 'admin-dashboard' && currentAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Icon name="Shield" size={32} className="text-orange-400" />
              Панель администратора
            </h1>
            <p className="text-slate-400 mt-2">
              {currentAdmin.firstName} {currentAdmin.lastName} (PID: {currentAdmin.pid})
            </p>
          </div>
          <Button onClick={() => { setCurrentAdmin(null); setPage('home'); }} variant="outline" className="border-slate-600">
            <Icon name="LogOut" size={20} className="mr-2" />
            Выход
          </Button>
        </div>

        <Tabs defaultValue="add-event" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="add-event" className="data-[state=active]:bg-orange-600">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить ивент
            </TabsTrigger>
            <TabsTrigger value="edit-event" className="data-[state=active]:bg-orange-600">
              <Icon name="Edit" size={18} className="mr-2" />
              Редактировать ивент
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-orange-600">
              <Icon name="Users" size={18} className="mr-2" />
              Админы
            </TabsTrigger>
            {currentAdmin.pid === '1437139' && (
              <TabsTrigger value="requests" className="data-[state=active]:bg-orange-600">
                <Icon name="Bell" size={18} className="mr-2" />
                Запросы на админку
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="add-event">
            <Card className="p-8 bg-slate-800/80 border-orange-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">Создать новый ивент</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-slate-300">Название ивента</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" placeholder="Полёт в Москву" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Дата</Label>
                    <Input type="date" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Время начала (UTC)</Label>
                    <Input type="time" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-300">Время окончания (UTC)</Label>
                    <Input type="time" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-300">Банер (emoji)</Label>
                    <Input className="bg-slate-900 border-slate-700 text-white" placeholder="✈️" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-300">Описание</Label>
                    <Textarea className="bg-slate-900 border-slate-700 text-white" rows={4} />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6 mt-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Icon name="Plane" size={24} className="text-cyan-400" />
                    Добавить рейсы
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Номер рейса</Label>
                        <Input className="bg-slate-900 border-slate-700 text-white" placeholder="AFL123" />
                      </div>
                      <div>
                        <Label className="text-slate-300">Время (UTC)</Label>
                        <Input type="time" className="bg-slate-900 border-slate-700 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-300">Тип рейса</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="departure">Вылет</SelectItem>
                            <SelectItem value="arrival">Прилёт</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Тип ВС</Label>
                        <Select>
                          <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plane">Самолёт</SelectItem>
                            <SelectItem value="helicopter">Вертолёт</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-slate-300">Воздушное судно</Label>
                        <Input className="bg-slate-900 border-slate-700 text-white" placeholder="A320" />
                      </div>
                      <div>
                        <Label className="text-slate-300">Маршрут</Label>
                        <Input className="bg-slate-900 border-slate-700 text-white" placeholder="USSS-UUEE" />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-slate-300">Описание (необязательно)</Label>
                        <Input className="bg-slate-900 border-slate-700 text-white" placeholder="Оставьте пустым для 'Без особенностей'" />
                      </div>
                    </div>
                    <Button type="button" variant="outline" className="w-full border-cyan-500 text-cyan-400">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Добавить ещё рейс
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 h-12 text-lg">
                  <Icon name="Check" size={20} className="mr-2" />
                  Создать ивент
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="edit-event">
            <Card className="p-8 bg-slate-800/80 border-orange-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">Редактировать ивент</h3>
              <div className="space-y-4">
                {events.map(event => (
                  <Card key={event.id} className="p-4 bg-slate-900/50 border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{event.banner}</span>
                        <div>
                          <h4 className="text-xl font-bold text-white">{event.name}</h4>
                          <p className="text-slate-400">{event.date} • {event.startTime} - {event.endTime} UTC</p>
                        </div>
                      </div>
                      <Button variant="outline" className="border-orange-500 text-orange-400">
                        <Icon name="Edit" size={18} className="mr-2" />
                        Редактировать
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="p-8 bg-slate-800/80 border-orange-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">Список администраторов</h3>
              <div className="space-y-3">
                {admins.map(admin => (
                  <Card key={admin.pid} className="p-4 bg-slate-900/50 border-slate-700">
                    <div className="flex items-center gap-4">
                      <Icon name="Shield" size={24} className="text-orange-400" />
                      <div>
                        <p className="text-white font-bold">{admin.firstName} {admin.lastName}</p>
                        <p className="text-slate-400 text-sm">PID: {admin.pid}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {currentAdmin.pid === '1437139' && (
            <TabsContent value="requests">
              <Card className="p-8 bg-slate-800/80 border-orange-500/30">
                <h3 className="text-2xl font-bold text-white mb-6">Запросы на получение прав администратора</h3>
                <p className="text-slate-400 text-center py-8">Нет новых запросов</p>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }

  if (page === 'pilot-dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Icon name="Plane" size={32} className="text-cyan-400" />
              Панель пилота
            </h1>
            {currentUser && (
              <p className="text-slate-400 mt-2">
                {currentUser.firstName} {currentUser.lastName} (PID: {currentUser.pid})
              </p>
            )}
          </div>
          <Button onClick={() => { setCurrentUser(null); setPage('home'); }} variant="outline" className="border-slate-600">
            <Icon name="LogOut" size={20} className="mr-2" />
            Выход
          </Button>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="events" className="data-[state=active]:bg-cyan-600">
              <Icon name="Calendar" size={18} className="mr-2" />
              Ивенты
            </TabsTrigger>
            <TabsTrigger value="rating" className="data-[state=active]:bg-cyan-600">
              <Icon name="Trophy" size={18} className="mr-2" />
              Мой рейтинг
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-600">
              <Icon name="Award" size={18} className="mr-2" />
              Рейтинг пилотов
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid gap-6">
              {events.map(event => (
                <Card key={event.id} className="p-6 bg-slate-800/80 border-cyan-500/30 hover:border-cyan-500 transition-all animate-fade-in">
                  <div className="flex items-start gap-6">
                    <div className="text-6xl">{event.banner}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
                      <div className="flex items-center gap-4 text-slate-400 mb-4">
                        <span className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Icon name="Clock" size={16} />
                          {event.startTime} - {event.endTime} UTC
                        </span>
                      </div>
                      <p className="text-slate-300 mb-4">{event.description}</p>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-cyan-600 hover:bg-cyan-500">
                            <Icon name="Calendar" size={18} className="mr-2" />
                            Забронировать рейс
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-cyan-500/30 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-white flex items-center gap-3">
                              <span className="text-3xl">{event.banner}</span>
                              {event.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {event.flights.map(flight => (
                              <Card key={flight.id} className="p-4 bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                      <Badge variant={flight.type === 'departure' ? 'default' : 'secondary'} className="text-sm">
                                        {flight.type === 'departure' ? '🛫 Вылет' : '🛬 Прилёт'}
                                      </Badge>
                                      <Badge variant="outline" className="text-sm border-slate-600">
                                        {flight.aircraftType === 'plane' ? '✈️ Самолёт' : '🚁 Вертолёт'}
                                      </Badge>
                                      <Badge 
                                        className={
                                          flight.status === 'pending' ? 'bg-yellow-600' :
                                          flight.status === 'completed' ? 'bg-green-600' : 'bg-red-600'
                                        }
                                      >
                                        {flight.status === 'pending' ? 'Ожидается' :
                                         flight.status === 'completed' ? 'Выполнен' : 'Не выполнен'}
                                      </Badge>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">{flight.flightNumber}</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-slate-400">Время:</span>
                                        <span className="text-white ml-2">{flight.time} UTC</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">ВС:</span>
                                        <span className="text-white ml-2">{flight.aircraft || 'Без особенностей'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Маршрут:</span>
                                        <span className="text-white ml-2">{flight.route || 'Без особенностей'}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400">Описание:</span>
                                        <span className="text-white ml-2">{flight.description || 'Без особенностей'}</span>
                                      </div>
                                    </div>
                                    {flight.bookedBy && (
                                      <p className="text-cyan-400 mt-3 text-sm">
                                        Забронировано: {flight.bookedBy}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    {!flight.bookedBy ? (
                                      <Button 
                                        onClick={() => toast.success(`Рейс ${flight.flightNumber} забронирован!`)}
                                        className="bg-cyan-600 hover:bg-cyan-500"
                                      >
                                        Забронировать
                                      </Button>
                                    ) : (
                                      <Button 
                                        onClick={() => toast.success(`Бронь рейса ${flight.flightNumber} отменена`)}
                                        variant="outline"
                                        className="border-red-500 text-red-400"
                                      >
                                        Отменить бронь
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rating">
            {currentUser && (
              <Card className="p-8 bg-slate-800/80 border-cyan-500/30 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">Ваш рейтинг</h3>
                  <Badge className={`${getRankBadge(currentUser.rating).color} text-lg px-4 py-2`}>
                    {getRankBadge(currentUser.rating).label}
                  </Badge>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-300 text-lg font-semibold">Прогресс: {currentUser.rating}</span>
                    <span className="text-slate-400">100</span>
                  </div>
                  <Progress value={Math.min(Math.max(currentUser.rating, 0), 100)} className="h-4" />
                  <div className={`h-4 rounded-full mt-[-16px] ${getRatingColor(currentUser.rating)}`} style={{ width: `${Math.min(Math.max(currentUser.rating, 0), 100)}%` }}></div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 bg-slate-900/50 border-slate-700 text-center">
                    <Icon name="CheckCircle" size={32} className="mx-auto mb-3 text-green-400" />
                    <p className="text-3xl font-bold text-white">{currentUser.completedFlights}</p>
                    <p className="text-slate-400 mt-1">Выполнено</p>
                  </Card>
                  <Card className="p-6 bg-slate-900/50 border-slate-700 text-center">
                    <Icon name="XCircle" size={32} className="mx-auto mb-3 text-red-400" />
                    <p className="text-3xl font-bold text-white">{currentUser.failedFlights}</p>
                    <p className="text-slate-400 mt-1">Не выполнено</p>
                  </Card>
                  <Card className="p-6 bg-slate-900/50 border-slate-700 text-center">
                    <Icon name="TrendingUp" size={32} className="mx-auto mb-3 text-cyan-400" />
                    <p className="text-3xl font-bold text-white">{currentUser.rating}</p>
                    <p className="text-slate-400 mt-1">Рейтинг</p>
                  </Card>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white mb-4">Достижения</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className={`p-4 ${currentUser.rating >= 0 ? 'bg-green-900/30 border-green-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 0 ? 'text-green-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">Новичок</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 0+</p>
                        </div>
                      </div>
                    </Card>
                    <Card className={`p-4 ${currentUser.rating >= 30 ? 'bg-blue-900/30 border-blue-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 30 ? 'text-blue-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">Не новичок</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 30+</p>
                        </div>
                      </div>
                    </Card>
                    <Card className={`p-4 ${currentUser.rating >= 55 ? 'bg-cyan-900/30 border-cyan-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 55 ? 'text-cyan-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">4-й курс лётного</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 55+</p>
                        </div>
                      </div>
                    </Card>
                    <Card className={`p-4 ${currentUser.rating >= 75 ? 'bg-green-900/30 border-green-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 75 ? 'text-green-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">Второй пилот</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 75+</p>
                        </div>
                      </div>
                    </Card>
                    <Card className={`p-4 ${currentUser.rating >= 85 ? 'bg-yellow-900/30 border-yellow-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 85 ? 'text-yellow-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">Командир ВС</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 85+</p>
                        </div>
                      </div>
                    </Card>
                    <Card className={`p-4 ${currentUser.rating >= 95 ? 'bg-purple-900/30 border-purple-600' : 'bg-slate-900/30 border-slate-700'}`}>
                      <div className="flex items-center gap-3">
                        <Icon name="Award" size={24} className={currentUser.rating >= 95 ? 'text-purple-400' : 'text-slate-600'} />
                        <div>
                          <p className="text-white font-semibold">Командир-инструктор</p>
                          <p className="text-slate-400 text-sm">Рейтинг: 95+</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="p-8 bg-slate-800/80 border-cyan-500/30 animate-fade-in">
              <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <Icon name="Trophy" size={32} className="text-yellow-400" />
                Рейтинг пилотов
              </h3>
              <div className="space-y-3">
                {[...pilots].sort((a, b) => b.rating - a.rating).map((pilot, index) => (
                  <Card key={pilot.pid} className={`p-4 border-slate-700 ${
                    index === 0 ? 'bg-yellow-900/20 border-yellow-600' :
                    index === 1 ? 'bg-gray-400/10 border-gray-500' :
                    index === 2 ? 'bg-orange-800/20 border-orange-600' :
                    'bg-slate-900/50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-white w-12 text-center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-bold text-white">{pilot.firstName} {pilot.lastName}</p>
                        <p className="text-slate-400 text-sm">PID: {pilot.pid}</p>
                      </div>
                      <Badge className={getRankBadge(pilot.rating).color}>
                        {getRankBadge(pilot.rating).label}
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{pilot.rating}</p>
                        <p className="text-slate-400 text-sm">рейтинг</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return null;
}
