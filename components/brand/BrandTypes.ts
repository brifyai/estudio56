import {
  Hexagon, Zap, Layers, Command, Globe, Box, Triangle, Cpu, Anchor, Activity,
  Circle, Square, Leaf, Briefcase, TrendingUp, Wifi, Database, Sun, Aperture,
  Target, Feather, Crown, Gem, Shield, Rocket, Flame, Heart, Star, Award,
  PenTool, Music, Camera, Video, Mic, Lightbulb, Puzzle, Fingerprint, Atom,
  Infinity, Shuffle, Stethoscope, HeartPulse, Pill, Thermometer, Plus,
  Dumbbell, Medal, Bike, Swords, Plane, Train, Ship, MapPin, Map, Compass,
  Tent, Flag, Dog, Cat, Bone, Fish, PawPrint, TreeDeciduous, Mountain, Wind,
  Moon, Flower, Hash, Percent, Utensils, Coffee, Soup, Carrot, Apple, ChefHat,
  Cake, GlassWater, Smartphone, Monitor as MonitorIcon, Server, Cloud, Code,
  Terminal, DollarSign, CreditCard, Wallet, Landmark, Building, Presentation,
  Clapperboard, Sparkle, Brain, Dna, Watch
} from 'lucide-react';

export const ICON_CATEGORIES = {
  tech: {
    label: "Tecnología",
    icons: { cpu: Cpu, zap: Zap, command: Command, wifi: Wifi, database: Database, smartphone: Smartphone, monitor: MonitorIcon, server: Server, cloud: Cloud, code: Code, terminal: Terminal, fingerprint: Fingerprint, rocket: Rocket }
  },
  creative: {
    label: "Creatividad",
    icons: { penTool: PenTool, layers: Layers, aperture: Aperture, music: Music, camera: Camera, video: Video, mic: Mic, feather: Feather, lightbulb: Lightbulb, puzzle: Puzzle, clapperboard: Clapperboard, sparkle: Sparkle }
  },
  business: {
    label: "Negocios",
    icons: { briefcase: Briefcase, trendingUp: TrendingUp, globe: Globe, target: Target, anchor: Anchor, dollarSign: DollarSign, creditCard: CreditCard, wallet: Wallet, landmark: Landmark, building: Building, award: Award, presentation: Presentation }
  },
  health: {
    label: "Salud",
    icons: { stethoscope: Stethoscope, heartPulse: HeartPulse, activity: Activity, pill: Pill, thermometer: Thermometer, plus: Plus, heart: Heart, brain: Brain, dna: Dna }
  },
  food: {
    label: "Gastronomía",
    icons: { utensils: Utensils, coffee: Coffee, soup: Soup, carrot: Carrot, apple: Apple, chefHat: ChefHat, flame: Flame, cake: Cake, glass: GlassWater }
  },
  sports: {
    label: "Deportes",
    icons: { dumbbell: Dumbbell, trophy: Award, medal: Medal, bike: Bike, swords: Swords, timer: Watch, flame: Flame, activity: Activity }
  },
  travel: {
    label: "Viajes",
    icons: { plane: Plane, train: Train, ship: Ship, mapPin: MapPin, map: Map, compass: Compass, tent: Tent, globe: Globe, flag: Flag }
  },
  pets: {
    label: "Mascotas",
    icons: { dog: Dog, cat: Cat, bone: Bone, fish: Fish, paw: PawPrint, heart: Heart }
  },
  nature: {
    label: "Naturaleza",
    icons: { leaf: Leaf, sun: Sun, tree: TreeDeciduous, mountain: Mountain, wind: Wind, moon: Moon, droplet: Activity, flower: Flower }
  },
  abstract: {
    label: "Abstracto",
    icons: { hexagon: Hexagon, box: Box, triangle: Triangle, circle: Circle, square: Square, star: Star, shield: Shield, hash: Hash, percent: Percent, infinity: Infinity, shuffle: Shuffle }
  }
};

export const ALL_ICONS = Object.values(ICON_CATEGORIES).reduce((acc, cat) => ({...acc, ...cat.icons}), {}) as Record<string, any>;
export type IconKey = keyof typeof ALL_ICONS;
export type CategoryKey = keyof typeof ICON_CATEGORIES;

export interface BrandData {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  logoMode: 'upload' | 'generated';
  logoUrl: string | null;
  genLogoType: 'icon' | 'initials';
  genLogoIcon: IconKey;
  genLogoCategory: CategoryKey;
  genLogoLayout: 'vertical' | 'horizontal' | 'stacked';
  genLogoShape: 'circle' | 'square' | 'rounded' | 'hexagon' | 'none';
  genLogoStyle: 'filled' | 'outline' | 'duotone' | 'soft';
  genLogoRotation: number;
  genLogoScale: number;
  genLogoTextCase: 'uppercase' | 'capitalize' | 'lowercase';
  genLogoTracking: string;
  colors: { primary: string; secondary: string; accent: string; neutral: string; };
  typography: { headingFont: string; bodyFont: string; };
}

export const defaultBrandData: BrandData = {
  name: "Mi Marca",
  tagline: "Tu eslogan aquí",
  description: "Descripción de tu empresa o proyecto.",
  mission: "Nuestra misión es...",
  vision: "Nuestra visión es...",
  logoMode: 'generated',
  logoUrl: null,
  genLogoType: 'icon',
  genLogoIcon: 'rocket',
  genLogoCategory: 'business',
  genLogoLayout: 'horizontal',
  genLogoShape: 'rounded',
  genLogoStyle: 'filled',
  genLogoRotation: 0,
  genLogoScale: 1,
  genLogoTextCase: 'uppercase',
  genLogoTracking: 'tracking-widest',
  colors: { primary: "#2563EB", secondary: "#1E293B", accent: "#F59E0B", neutral: "#F3F4F6" },
  typography: { headingFont: "ui-sans-serif, system-ui, sans-serif", bodyFont: "ui-sans-serif, system-ui, sans-serif" }
};
