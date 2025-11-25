import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Pilot = {
  pid: string;
  firstName: string;
  lastName: string;
  password: string;
  rating: number;
  completedFlights: number;
  failedFlights: number;
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

type PilotDashboardProps = {
  currentUser: Pilot | null;
  pilots: Pilot[];
  events: Event[];
  onLogout: () => void;
};

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

export default function PilotDashboard({ currentUser, pilots, events, onLogout }: PilotDashboardProps) {
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
        <Button onClick={onLogout} variant="outline" className="border-slate-600">
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
