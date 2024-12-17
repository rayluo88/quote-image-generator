// src/editor/types.ts
export interface TextEffects {
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  letterSpacing: number;
  lineHeight: number;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  color: string;
  gradientColors: string[];
  gradientAngle: number;
  imageUrl?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface ThemeConfig {
  background: BackgroundConfig;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  padding: number;
  alignment: 'left' | 'center' | 'right';
  width: number;
  height: number;
  effects: TextEffects;
  position: Position;
}

export interface PresetSize {
  name: string;
  width: number;
  height: number;
}

export const PRESET_SIZES: PresetSize[] = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'Facebook Post', width: 1200, height: 630 }
];

export const FONT_OPTIONS = [
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Lora', value: 'Lora, serif' }
];

export const DEFAULT_TEXT_EFFECTS: TextEffects = {
  shadow: false,
  shadowColor: '#000000',
  shadowBlur: 3,
  letterSpacing: 0,
  lineHeight: 1.5
};

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'solid',
  color: '#ffffff',
  gradientColors: ['#ffffff', '#f0f0f0'],
  gradientAngle: 45
};

export const DEFAULT_THEME: ThemeConfig = {
  background: DEFAULT_BACKGROUND,
  textColor: '#000000',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 24,
  padding: 40,
  alignment: 'left',
  width: 1200,
  height: 675,
  effects: DEFAULT_TEXT_EFFECTS,
  position: {
    x: 50,
    y: 50
  }
};

export interface ThemePreset {
  id: string;
  name: string;
  config: ThemeConfig;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'clean',
    name: 'Clean/Minimal',
    config: {
      background: {
        type: 'solid',
        color: '#ffffff',
        gradientColors: ['#ffffff', '#ffffff'],
        gradientAngle: 0
      },
      textColor: '#000000',
      fontFamily: 'Roboto, sans-serif',
      fontSize: 24,
      padding: 20,
      alignment: 'center',
      width: 800,
      height: 400,
      effects: {
        shadow: false,
        shadowColor: '#000000',
        shadowBlur: 0,
        letterSpacing: 0,
        lineHeight: 1.5
      },
      position: { x: 50, y: 50 }
    }
  },
  {
    id: 'dark',
    name: 'Dark/Modern',
    config: {
      background: {
        type: 'solid',
        color: '#1a1a1a',
        gradientColors: ['#1a1a1a', '#2a2a2a'],
        gradientAngle: 45
      },
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: 28,
      padding: 24,
      alignment: 'center',
      width: 800,
      height: 400,
      effects: {
        shadow: true,
        shadowColor: '#000000',
        shadowBlur: 8,
        letterSpacing: 1,
        lineHeight: 1.6
      },
      position: { x: 50, y: 50 }
    }
  },
  {
    id: 'colorful',
    name: 'Colorful/Fun',
    config: {
      background: {
        type: 'gradient',
        color: '#ff6b6b',
        gradientColors: ['#ff6b6b', '#4ecdc4'],
        gradientAngle: 135
      },
      textColor: '#ffffff',
      fontFamily: 'Poppins, sans-serif',
      fontSize: 26,
      padding: 24,
      alignment: 'center',
      width: 800,
      height: 400,
      effects: {
        shadow: true,
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 6,
        letterSpacing: 0.5,
        lineHeight: 1.4
      },
      position: { x: 50, y: 50 }
    }
  },
  {
    id: 'professional',
    name: 'Professional/Business',
    config: {
      background: {
        type: 'gradient',
        color: '#f8f9fa',
        gradientColors: ['#f8f9fa', '#e9ecef'],
        gradientAngle: 120
      },
      textColor: '#212529',
      fontFamily: 'Lora, serif',
      fontSize: 24,
      padding: 40,
      alignment: 'center',
      width: 800,
      height: 400,
      effects: {
        shadow: false,
        shadowColor: '#000000',
        shadowBlur: 0,
        letterSpacing: 0.2,
        lineHeight: 1.6
      },
      position: { x: 50, y: 50 }
    }
  }
];

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality: number;
  filename: string;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'png',
  quality: 0.92,
  filename: 'quote-image'
};