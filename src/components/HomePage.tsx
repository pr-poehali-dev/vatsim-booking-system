import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type HomePageProps = {
  onNavigate: (page: 'pilot-login' | 'admin-login' | 'pilot-dashboard') => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
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
            onClick={() => onNavigate('pilot-login')}
            size="lg"
            className="w-full h-16 text-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/50 transition-all hover:scale-105"
          >
            <Icon name="UserCircle" size={28} className="mr-3" />
            Букинг для пилотов
          </Button>
          
          <Button 
            onClick={() => onNavigate('admin-login')}
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
            onClick={() => onNavigate('pilot-dashboard')}
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
