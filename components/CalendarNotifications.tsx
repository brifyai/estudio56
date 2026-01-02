import React, { useState, useEffect } from 'react';
import { getUpcomingEvents, getDaysUntilEvent, CommercialEvent } from '../services/commercialCalendarService';

interface CalendarNotificationProps {
  onGenerateForEvent?: (event: CommercialEvent) => void;
}

export const CalendarNotifications: React.FC<CalendarNotificationProps> = ({ onGenerateForEvent }) => {
  const [notifications, setNotifications] = useState<CommercialEvent[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for important events every minute
    const checkEvents = () => {
      const upcomingEvents = getUpcomingEvents([], 21); // Próximos 21 días
      const importantEvents = upcomingEvents.filter(e => {
        const days = getDaysUntilEvent(e.date);
        // Solo alertar: hoy, mañana, 7 días, 14 días
        return [0, 1, 7, 14].includes(days) && !dismissed.has(e.id);
      });
      setNotifications(importantEvents);
    };

    checkEvents();
    const interval = setInterval(checkEvents, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [dismissed]);

  const getDaysMessage = (days: number): string => {
    if (days === 0) return '¡HOY es';
    if (days === 1) return 'Mañana es';
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

  const handleDismiss = (eventId: string) => {
    setDismissed(prev => new Set(prev).add(eventId));
    setNotifications(prev => prev.filter(e => e.id !== eventId));
  };

  const handleGenerate = (event: CommercialEvent) => {
    onGenerateForEvent?.(event);
    handleDismiss(event.id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((event) => {
        const days = getDaysUntilEvent(event.date);
        return (
          <div
            key={event.id}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 shadow-2xl animate-slide-in-right backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getEventEmoji(event.category)}</span>
              <div className="flex-1">
                <div className="text-xs text-amber-300 font-medium uppercase tracking-wider">
                  {getDaysMessage(days)} 🎯
                </div>
                <div className="text-white font-bold text-sm mt-1">
                  {event.name}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {event.date} • {event.category}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleGenerate(event)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                  >
                    ✨ Generar Oferta
                  </button>
                  <button
                    onClick={() => handleDismiss(event.id)}
                    className="bg-white/10 hover:bg-white/20 text-white/70 text-xs py-2 px-3 rounded-lg transition-colors"
                  >
                    Después
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(event.id)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarNotifications;