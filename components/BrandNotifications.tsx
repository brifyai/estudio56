import React, { useState, useEffect } from 'react';
import { getUpcomingEvents, getDaysUntilEvent, CommercialEvent } from '../services/commercialCalendarService';
import { Brand } from '../services/brandService';

interface BrandNotificationsProps {
  brand: Brand | null;
  onGenerateForEvent?: (event: CommercialEvent, brand: Brand) => void;
}

export const BrandNotifications: React.FC<BrandNotificationsProps> = ({ brand, onGenerateForEvent }) => {
  const [notifications, setNotifications] = useState<{ event: CommercialEvent; days: number }[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!brand) return;

    const checkEvents = () => {
      const upcomingEvents = getUpcomingEvents([], 21);
      const importantEvents = upcomingEvents
        .filter(e => {
          const days = getDaysUntilEvent(e.date);
          // Alertar: hoy, mañana, 3 días, 7 días, 14 días
          return [0, 1, 3, 7, 14].includes(days) && !dismissed.has(e.id);
        })
        .map(e => ({
          event: e,
          days: getDaysUntilEvent(e.date)
        }));
      
      setNotifications(importantEvents);
    };

    checkEvents();
    const interval = setInterval(checkEvents, 60000);
    return () => clearInterval(interval);
  }, [brand, dismissed]);

  const getDaysMessage = (days: number): string => {
    if (days === 0) return '¡HOY es';
    if (days === 1) return 'Mañana es';
    if (days === 3) return 'Faltan 3 días para';
    if (days === 7) return 'Faltan 7 días para';
    if (days === 14) return 'Faltan 2 semanas para';
    return `Faltan ${days} días para`;
  };

  const getEventEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      festivo: '🎉',
      consumo: '🛒',
      comercio: '🏪',
      marketing: '📢',
      especial: '⭐'
    };
    return emojis[category] || '📅';
  };

  const getEventColor = (days: number): string => {
    if (days === 0) return 'from-red-500/30 to-orange-500/30 border-red-500/40';
    if (days === 1) return 'from-orange-500/30 to-yellow-500/30 border-orange-500/40';
    if (days === 3) return 'from-yellow-500/30 to-amber-500/30 border-yellow-500/40';
    if (days === 7) return 'from-blue-500/30 to-cyan-500/30 border-blue-500/40';
    return 'from-purple-500/30 to-pink-500/30 border-purple-500/40';
  };

  const handleDismiss = (eventId: string) => {
    setDismissed(prev => new Set(prev).add(eventId));
    setNotifications(prev => prev.filter(n => n.event.id !== eventId));
  };

  const handleGenerate = (event: CommercialEvent) => {
    if (brand) {
      onGenerateForEvent?.(event, brand);
    }
    handleDismiss(event.id);
  };

  if (!brand) return null;

  const unreadCount = notifications.length;

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-80 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🔔</span>
                <span className="text-sm font-medium text-white">Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="text-[8px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-white/50 text-xs">Sin notificaciones pendientes</p>
                  <p className="text-white/30 text-[10px] mt-1">Te avisaremos cuando se acerque un evento</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map(({ event, days }) => (
                    <div
                      key={event.id}
                      className={`p-3 bg-gradient-to-r ${getEventColor(days)} border-l-2`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getEventEmoji(event.category)}</span>
                        <div className="flex-1">
                          <div className="text-[10px] text-white/70 uppercase tracking-wider">
                            {getDaysMessage(days)}
                          </div>
                          <div className="text-white font-medium text-xs mt-0.5">
                            {event.name}
                          </div>
                          <div className="text-white/50 text-[10px] mt-0.5">
                            {event.date} • {event.category}
                          </div>
                          {/* Brand mention */}
                          <div className="text-[10px] text-blue-300 mt-1">
                            @{brand.name}, genera ofertas 🎁
                          </div>
                          {/* Actions */}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleGenerate(event)}
                              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium py-1.5 px-2 rounded transition-colors"
                            >
                              ✨ Generar
                            </button>
                            <button
                              onClick={() => handleDismiss(event.id)}
                              className="bg-white/10 hover:bg-white/20 text-white/70 text-[10px] py-1.5 px-2 rounded transition-colors"
                            >
                              Después
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/10">
              <button className="w-full text-[10px] text-white/50 hover:text-white transition-colors py-1">
                ⚙️ Configurar notificaciones
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BrandNotifications;