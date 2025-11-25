import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type AuthPagesProps = {
  page: 'pilot-login' | 'admin-login';
  onBack: () => void;
  onPilotLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onAdminLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onNavigateAdminRegister: () => void;
};

export default function AuthPages({ page, onBack, onPilotLogin, onAdminLogin, onNavigateAdminRegister }: AuthPagesProps) {
  if (page === 'pilot-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
        <Button 
          onClick={onBack}
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

            <form onSubmit={onPilotLogin} className="space-y-4">
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
          onClick={onBack}
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

            <form onSubmit={onAdminLogin} className="space-y-4">
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
                onClick={onNavigateAdminRegister}
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

  return null;
}
