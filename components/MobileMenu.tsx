import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  activePlan: string;
  onOpenPricing: () => void;
  onOpenBrandPanel: () => void;
  selectedBrandName?: string;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activePlan,
  onOpenPricing,
  onOpenBrandPanel,
  selectedBrandName,
  onLogout,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: '🎨',
      label: 'Diseños',
      onClick: () => {
        onNavigate('/panel');
        onClose();
      },
    },
    {
      icon: '📅',
      label: 'Calendario',
      onClick: () => {
        onNavigate('/panel');
        onClose();
      },
    },
    {
      icon: '👤',
      label: 'Perfil',
      onClick: () => {
        onNavigate('/perfil');
        onClose();
      },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-[#0A0A0A] border-r border-white/10 z-50 animate-slide-in-left flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="font-bold text-lg tracking-tight">Estudio 56</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-white/80 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Brand Selector */}
          <button
            onClick={onOpenBrandPanel}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: '#333', color: '#fff' }}
            >
              {selectedBrandName?.charAt(0).toUpperCase() || '🏪'}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{selectedBrandName || 'Seleccionar Marca'}</div>
              <div className="text-xs text-white/50">Marca activa</div>
            </div>
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Plan */}
          <button
            onClick={onOpenPricing}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${activePlan === 'GRATIS' ? 'bg-gray-500' : 'bg-yellow-400 animate-pulse'}`}></div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{activePlan}</div>
              <div className="text-xs text-white/50">Tu plan</div>
            </div>
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};