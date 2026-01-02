import React, { useState, useEffect } from 'react';
import { 
  getCommercialEvents, 
  getUpcomingEvents, 
  getActiveAlertEvents, 
  getDaysUntilEvent,
  CommercialEvent 
} from '../services/commercialCalendarService';

interface CommercialCalendarProps {
  onGenerateForEvent?: (event: CommercialEvent) => void;
}

export const CommercialCalendar: React.FC<CommercialCalendarProps> = ({ onGenerateForEvent }) => {
  const [events, setEvents] = useState<CommercialEvent[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<CommercialEvent[]>([]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    const loadedEvents = await getCommercialEvents();
    setEvents(loadedEvents);
    setActiveAlerts(getActiveAlertEvents(loadedEvents));
    setIsLoading(false);
  };

  // Eventos próximos en diferentes períodos
  const events30Days = getUpcomingEvents(events, 30);
  const events15Days = getUpcomingEvents(events, 15);
  const events5Days = getUpcomingEvents(events, 5);
  const events1Day = getUpcomingEvents(events, 1);

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      festivo: '🎉',
      consumo: '🛒',
      comercio: '🏪',
      marketing: '📢',
      especial: '⭐'
    };
    return emojis[category] || '📅';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      festivo: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      consumo: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      comercio: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      marketing: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      especial: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Generar días del mes para el calendario
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date): CommercialEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  // Contador de alertas activas
  const alertCount = activeAlerts.length;

  if (isLoading) {
    return (
      <div className="flex-1 p-3 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <div className="w-3 h-3 border border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
          <span>Calendario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header del calendario */}
      <div className="p-3 border-b border-white/5">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="text-sm">📅</span>
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Calendario</div>
              <div className="text-[9px] text-white/50">{events30Days.length} eventos</div>
            </div>
          </div>
          <div className={`transform transition-transform ${showCalendar ? 'rotate-180' : ''} text-white/50`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* ALERTAS ACTIVAS */}
      {alertCount > 0 && (
        <div className="px-3 py-2 space-y-1">
          {activeAlerts.slice(0, 2).map((event) => {
            const daysLeft = getDaysUntilEvent(event.date);
            return (
              <div
                key={event.id}
                className={`flex items-center gap-2 p-2 rounded-lg border ${getCategoryColor(event.category)} animate-pulse-slow`}
              >
                <span className="text-xs">{getCategoryEmoji(event.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium truncate">{event.name}</div>
                  <div className="text-[9px] opacity-70">
                    {daysLeft === 0 ? '¡HOY!' : daysLeft === 1 ? 'Mañana' : `${daysLeft}d`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDARIO EXPANDIBLE */}
      {showCalendar && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* RESUMEN RÁPIDO */}
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center p-1.5 rounded bg-red-500/20 border border-red-500/30">
              <div className="text-xs font-bold text-red-300">{events1Day.length}</div>
              <div className="text-[8px] text-white/50">1d</div>
            </div>
            <div className="text-center p-1.5 rounded bg-orange-500/20 border border-orange-500/30">
              <div className="text-xs font-bold text-orange-300">{events5Days.length}</div>
              <div className="text-[8px] text-white/50">5d</div>
            </div>
            <div className="text-center p-1.5 rounded bg-yellow-500/20 border border-yellow-500/30">
              <div className="text-xs font-bold text-yellow-300">{events15Days.length}</div>
              <div className="text-[8px] text-white/50">15d</div>
            </div>
            <div className="text-center p-1.5 rounded bg-green-500/20 border border-green-500/30">
              <div className="text-xs font-bold text-green-300">{events30Days.length}</div>
              <div className="text-[8px] text-white/50">30d</div>
            </div>
          </div>

          {/* CALENDARIO MENSUAL */}
          <div className="bg-black/20 rounded-lg border border-white/10 p-2">
            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={prevMonth}
                className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/70"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-[10px] font-medium text-white">
                {selectedMonth.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={goToToday}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/70 text-[8px]"
                >
                  Hoy
                </button>
                <button
                  onClick={nextMonth}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/70"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
                <div key={`day-${index}`} className="text-center text-[8px] text-white/50 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-0.5">
              {getMonthDays(selectedMonth).map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-5"></div>;
                }
                
                const dayEvents = getEventsForDate(date);
                const hasEvents = dayEvents.length > 0;
                const isCurrentDay = isToday(date);
                const isPastDay = isPast(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`h-5 rounded flex items-center justify-center text-[9px] transition-all
                      ${isCurrentDay 
                        ? 'bg-blue-500 text-white font-bold shadow-lg' 
                        : isPastDay 
                          ? 'text-white/20'
                          : 'text-white hover:bg-white/10'
                      }
                      ${hasEvents && !isPastDay ? 'border border-white/20' : ''}
                    `}
                    title={dayEvents.map(e => e.name).join(', ')}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRÓXIMOS EVENTOS */}
          <div className="space-y-1">
            <div className="text-[9px] font-bold text-white/70 uppercase tracking-wider">
              Próximos
            </div>
            {events30Days.slice(0, 4).map((event) => {
              const daysLeft = getDaysUntilEvent(event.date);
              return (
                <div
                  key={event.id}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border ${getCategoryColor(event.category)}`}
                >
                  <span className="text-xs">{getCategoryEmoji(event.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium truncate">{event.name}</div>
                  </div>
                  <div className={`text-[10px] font-bold ${
                    daysLeft <= 7 ? 'text-red-300' :
                    daysLeft <= 14 ? 'text-yellow-300' :
                    'text-white/70'
                  }`}>
                    {daysLeft === 0 ? '¡HOY!' : daysLeft === 1 ? '1d' : `${daysLeft}d`}
                  </div>
                  {onGenerateForEvent && (
                    <button
                      onClick={() => onGenerateForEvent(event)}
                      className="text-[8px] bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded transition-colors"
                      title="Generar oferta para este evento"
                    >
                      ✨
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* LEYENDA */}
          <div className="flex flex-wrap gap-1.5 text-[8px] text-white/50 pt-2 border-t border-white/5">
            <span className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> F
            </span>
            <span className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> C
            </span>
            <span className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> M
            </span>
            <span className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span> E
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialCalendar;