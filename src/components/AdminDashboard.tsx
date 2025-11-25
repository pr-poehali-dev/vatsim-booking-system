import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type Admin = {
  pid: string;
  firstName: string;
  lastName: string;
  password: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  banner: string;
  flights: unknown[];
};

type AdminDashboardProps = {
  currentAdmin: Admin;
  events: Event[];
  admins: Admin[];
  onLogout: () => void;
};

export default function AdminDashboard({ currentAdmin, events, admins, onLogout }: AdminDashboardProps) {
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
        <Button onClick={onLogout} variant="outline" className="border-slate-600">
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
