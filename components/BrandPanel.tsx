import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Brand, getUserBrands, createBrand, updateBrand, deleteBrand, setDefaultBrand } from '../services/brandService';

interface BrandPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandSelect: (brand: Brand) => void;
  onBrandSelectWithPrompt?: (brand: Brand, prompt: string) => void; // NEW: Callback con prompt generado
  selectedBrand: Brand | null;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({ isOpen, onClose, onBrandSelect, onBrandSelectWithPrompt, selectedBrand }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    primary_color: '#000000',
    secondary_color: '#FFFFFF',
    industry: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadBrands();
    }
  }, [isOpen]);

  const loadBrands = async () => {
    setIsLoading(true);
    const loadedBrands = await getUserBrands();
    setBrands(loadedBrands);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingBrand) {
      await updateBrand({ id: editingBrand.id, ...formData });
    } else {
      await createBrand({
        name: formData.name,
        website_url: formData.website_url,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        facebook: formData.facebook,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        industry: formData.industry,
        is_default: brands.length === 0
      });
    }

    setFormData({
      name: '',
      website_url: '',
      instagram: '',
      tiktok: '',
      facebook: '',
      primary_color: '#000000',
      secondary_color: '#FFFFFF',
      industry: ''
    });
    setShowForm(false);
    setEditingBrand(null);
    await loadBrands();
    setIsLoading(false);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      website_url: brand.website_url || '',
      instagram: brand.instagram || '',
      tiktok: brand.tiktok || '',
      facebook: brand.facebook || '',
      primary_color: brand.primary_color || '#000000',
      secondary_color: brand.secondary_color || '#FFFFFF',
      industry: brand.industry || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (brandId: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar esta marca?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111827',
      color: '#ffffff',
      customClass: {
        popup: 'border border-gray-700 rounded-2xl',
        title: 'text-lg font-bold',
        confirmButton: 'rounded-lg px-4 py-2',
        cancelButton: 'rounded-lg px-4 py-2'
      }
    });

    if (result.isConfirmed) {
      await deleteBrand(brandId);
      await loadBrands();
      Swal.fire({
        title: 'Marca eliminada',
        icon: 'success',
        background: '#111827',
        color: '#ffffff',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'border border-gray-700 rounded-2xl'
        }
      });
    }
  };

  const handleSetDefault = async (brandId: string) => {
    await setDefaultBrand(brandId);
    await loadBrands();
  };

  // NEW: Generar prompt contextual para la marca
  const generateBrandPrompt = (brand: Brand): string => {
    let prompt = '';

    // Si tiene website_url, usar eso como base
    if (brand.website_url) {
      prompt = brand.website_url;
    } else {
      // Generar prompt basado en los datos de la marca
      prompt = brand.name;
      if (brand.industry) {
        const industryLabels: Record<string, string> = {
          gastronomy: 'restaurante de comida',
          retail_sale: 'tienda de retail',
          wellness_zen: 'spa y bienestar',
          sport_gritty: 'gimnasio y deporte',
          aesthetic_min: 'salón de belleza',
          medical_clean: 'clínica médica',
          tech_saas: 'empresa de tecnología',
          corporate: 'empresa corporativa',
          education: 'centro educativo',
          realestate: 'inmobiliaria',
          other: 'negocio local'
        };
        prompt += ` - ${industryLabels[brand.industry] || brand.industry}`;
      }
      // Agregar redes sociales
      const socials: string[] = [];
      if (brand.instagram) socials.push(`Instagram: @${brand.instagram}`);
      if (brand.tiktok) socials.push(`TikTok: @${brand.tiktok}`);
      if (brand.facebook) socials.push(`Facebook: ${brand.facebook}`);
      if (socials.length > 0) {
        prompt += ` | ${socials.join(', ')}`;
      }
    }

    return prompt;
  };

  // NEW: Manejar selección de marca con prompt automático
  const handleSelectBrand = (brand: Brand) => {
    // Llamar al callback original
    onBrandSelect(brand);

    // Si hay callback con prompt, generar y pasar
    if (onBrandSelectWithPrompt) {
      const prompt = generateBrandPrompt(brand);
      onBrandSelectWithPrompt(brand, prompt);
    } else {
      // Fallback: solo pasar la marca
      onBrandSelect(brand);
    }

    // Cerrar el panel
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-[#0A0A0A] border-l border-white/10 z-50 flex flex-col animate-slide-in-left">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Mis Marcas</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {isLoading && brands.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          ) : showForm ? (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                  {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBrand(null);
                    setFormData({
                      name: '',
                      website_url: '',
                      instagram: '',
                      tiktok: '',
                      facebook: '',
                      primary_color: '#000000',
                      secondary_color: '#FFFFFF',
                      industry: ''
                    });
                  }}
                  className="text-white/50 hover:text-white text-xs"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Nombre de la marca *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Mi Tienda"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Sitio web</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  placeholder="https://mitienda.cl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/70 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    placeholder="@mitienda"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">TikTok</label>
                  <input
                    type="text"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    placeholder="@mitienda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Facebook</label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  placeholder="/mitienda"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/70 mb-1">Color primario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Color secundario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Industria</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="">Seleccionar...</option>
                  <option value="gastronomy">Restaurante / Comida</option>
                  <option value="retail_sale">Tienda / Retail</option>
                  <option value="wellness_zen">Bienestar / Spa</option>
                  <option value="sport_gritty">Deporte / Gym</option>
                  <option value="aesthetic_min">Belleza</option>
                  <option value="medical_clean">Salud / Médico</option>
                  <option value="tech_saas">Tecnología</option>
                  <option value="corporate">Corporativo</option>
                  <option value="education">Educación</option>
                  <option value="realestate">Inmobiliario</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : editingBrand ? 'Actualizar' : 'Crear Marca'}
              </button>
            </form>
          ) : (
            /* Brand List */
            <>
              {brands.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏪</div>
                  <p className="text-white/70 text-sm mb-4">Aún no tienes marcas registradas</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    + Agregar tu primera marca
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedBrand?.id === brand.id 
                          ? 'bg-blue-500/20 border-blue-500/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {brand.primary_color === '#000000' ? '🏪' : 
                             brand.primary_color === '#FF6B6B' ? '🍽️' :
                             brand.primary_color === '#4ECDC4' ? '🧘' :
                             brand.primary_color === '#FFE66D' ? '💪' : '🏪'}
                          </span>
                          <span className="font-medium text-white text-sm">{brand.name}</span>
                          {brand.is_default && (
                            <span className="text-[8px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
                              ⭐
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {selectedBrand?.id !== brand.id && (
                            <button
                              onClick={() => handleSelectBrand(brand)}
                              className="text-[8px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded transition-colors"
                            >
                              Seleccionar
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Socials */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {brand.instagram && (
                          <span className="text-[8px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded">
                            📷 @{brand.instagram}
                          </span>
                        )}
                        {brand.tiktok && (
                          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                            🎵 @{brand.tiktok}
                          </span>
                        )}
                        {brand.facebook && (
                          <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                            📘 {brand.facebook}
                          </span>
                        )}
                      </div>

                      {/* Colors */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-white/20"
                          style={{ backgroundColor: brand.primary_color || '#000000' }}
                        />
                        <div 
                          className="w-4 h-4 rounded border border-white/20"
                          style={{ backgroundColor: brand.secondary_color || '#FFFFFF' }}
                        />
                        {brand.website_url && (
                          <span className="text-[8px] text-white/50 truncate">
                            {brand.website_url}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                        {!brand.is_default && (
                          <button
                            onClick={() => handleSetDefault(brand.id)}
                            className="text-[8px] text-white/50 hover:text-yellow-300 transition-colors"
                          >
                            ⭐ Predeterminada
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-[8px] text-white/50 hover:text-white transition-colors"
                        >
                          ⚙️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-[8px] text-white/50 hover:text-red-300 transition-colors ml-auto"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showForm && brands.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Agregar nueva marca</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BrandPanel;