import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Square, Download, RefreshCw, AlertCircle, Palette, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Type, Move, Edit3, Sun, Moon, Aperture, Coffee, Box, Search, Settings, Key, Leaf, Camera, Building2, Feather } from 'lucide-react';

const apiKey = "";

export default function CanvasEditor() {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Creative Studio</h1>
        <p className="text-gray-400">Generador de banners con análisis de URL</p>
      </div>
    </div>
  );
}
