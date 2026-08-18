import { SnakeTheme } from '../types';

export interface ThemeColors {
  boardBg: string;
  gridLine: string;
  snakeHead: string;
  snakeHeadBorder: string;
  snakeBodyStart: string;
  snakeBodyEnd: string;
  snakeEye: string;
  foodRegular: string;
  foodGolden: string;
  obstacleBg: string;
  obstacleBorder: string;
  accentGlow: string;
}

export interface ThemeUIStyle {
  name: string;
  playBtnGradient: string;
  playBtnHover: string;
  playBtnShadow: string;
  playBtnBorder: string;
  playBtnText: string;
  homeTitleGradient: string;
  logoGradient: string;
  aura1: string;
  aura2: string;
  accentBorder: string;
}

export const THEMES: Record<SnakeTheme, ThemeColors> = {
  CLASSIC: {
    boardBg: '#0f172a',
    gridLine: '#1e293b',
    snakeHead: '#10b981', // Emerald 500
    snakeHeadBorder: '#059669',
    snakeBodyStart: '#34d399', // Emerald 400
    snakeBodyEnd: '#047857', // Emerald 700
    snakeEye: '#ffffff',
    foodRegular: '#ef4444', // Red 500
    foodGolden: '#f59e0b', // Amber 500
    obstacleBg: '#475569',
    obstacleBorder: '#64748b',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
  },
  NEON: {
    boardBg: '#090d16',
    gridLine: '#1e1b4b',
    snakeHead: '#06b6d4', // Cyan 500
    snakeHeadBorder: '#0284c7',
    snakeBodyStart: '#22d3ee',
    snakeBodyEnd: '#ec4899', // Pink 500
    snakeEye: '#ffffff',
    foodRegular: '#f43f5e', // Rose 500
    foodGolden: '#eab308', // Yellow 500
    obstacleBg: '#312e81',
    obstacleBorder: '#6366f1',
    accentGlow: 'rgba(34, 211, 238, 0.5)',
  },
  SUNSET: {
    boardBg: '#180e29',
    gridLine: '#2e1065',
    snakeHead: '#f97316', // Orange 500
    snakeHeadBorder: '#c2410c',
    snakeBodyStart: '#fb923c',
    snakeBodyEnd: '#db2777', // Pink 600
    snakeEye: '#ffffff',
    foodRegular: '#f43f5e',
    foodGolden: '#facc15',
    obstacleBg: '#581c87',
    obstacleBorder: '#7e22ce',
    accentGlow: 'rgba(249, 115, 22, 0.4)',
  },
  GOLDEN: {
    boardBg: '#1c1917',
    gridLine: '#292524',
    snakeHead: '#eab308', // Yellow 500
    snakeHeadBorder: '#ca8a04',
    snakeBodyStart: '#fde047',
    snakeBodyEnd: '#b45309', // Amber 700
    snakeEye: '#1c1917',
    foodRegular: '#ef4444',
    foodGolden: '#38bdf8', // Sky blue golden alternative
    obstacleBg: '#44403c',
    obstacleBorder: '#78716c',
    accentGlow: 'rgba(234, 179, 8, 0.5)',
  },
  OCEAN: {
    boardBg: '#0b192c',
    gridLine: '#1e3e62',
    snakeHead: '#3b82f6', // Blue 500
    snakeHeadBorder: '#1d4ed8',
    snakeBodyStart: '#60a5fa',
    snakeBodyEnd: '#0284c7', // Sky 600
    snakeEye: '#ffffff',
    foodRegular: '#f43f5e',
    foodGolden: '#f59e0b',
    obstacleBg: '#1e293b',
    obstacleBorder: '#334155',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
  },
  DRAGON: {
    boardBg: '#180707',
    gridLine: '#331010',
    snakeHead: '#dc2626', // Red 600
    snakeHeadBorder: '#991b1b',
    snakeBodyStart: '#ef4444',
    snakeBodyEnd: '#7f1d1d',
    snakeEye: '#fef08a',
    foodRegular: '#fbbf24',
    foodGolden: '#38bdf8',
    obstacleBg: '#450a0a',
    obstacleBorder: '#b91c1c',
    accentGlow: 'rgba(220, 38, 38, 0.5)',
  },
  COSMIC: {
    boardBg: '#0c071e',
    gridLine: '#241442',
    snakeHead: '#a855f7', // Purple 500
    snakeHeadBorder: '#7e22ce',
    snakeBodyStart: '#c084fc',
    snakeBodyEnd: '#4c1d95',
    snakeEye: '#38bdf8',
    foodRegular: '#38bdf8',
    foodGolden: '#f43f5e',
    obstacleBg: '#3b0764',
    obstacleBorder: '#9333ea',
    accentGlow: 'rgba(168, 85, 247, 0.5)',
  },
};

export const THEME_UI_STYLES: Record<SnakeTheme, ThemeUIStyle> = {
  CLASSIC: {
    name: 'Classic Emerald',
    playBtnGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    playBtnHover: 'hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300',
    playBtnShadow: 'shadow-[0_0_35px_rgba(16,185,129,0.45)] hover:shadow-[0_0_55px_rgba(20,184,166,0.65)]',
    playBtnBorder: 'border-emerald-200/40',
    playBtnText: 'text-slate-950',
    homeTitleGradient: 'from-emerald-400 via-teal-300 via-cyan-300 to-indigo-400',
    logoGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    aura1: 'bg-emerald-500/15',
    aura2: 'bg-cyan-500/15',
    accentBorder: 'border-emerald-500/30',
  },
  NEON: {
    name: 'Cyber Neon',
    playBtnGradient: 'from-cyan-400 via-fuchsia-500 to-pink-500',
    playBtnHover: 'hover:from-cyan-300 hover:via-fuchsia-400 hover:to-pink-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(236,72,153,0.65)]',
    playBtnBorder: 'border-cyan-200/40',
    playBtnText: 'text-white',
    homeTitleGradient: 'from-cyan-400 via-fuchsia-400 to-pink-400',
    logoGradient: 'from-cyan-400 via-fuchsia-400 to-pink-400',
    aura1: 'bg-cyan-500/15',
    aura2: 'bg-pink-500/15',
    accentBorder: 'border-cyan-500/30',
  },
  SUNSET: {
    name: 'Sunset Blaze',
    playBtnGradient: 'from-amber-400 via-orange-500 to-rose-500',
    playBtnHover: 'hover:from-amber-300 hover:via-orange-400 hover:to-rose-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(249,115,22,0.45)] hover:shadow-[0_0_55px_rgba(244,63,94,0.65)]',
    playBtnBorder: 'border-amber-200/40',
    playBtnText: 'text-slate-950',
    homeTitleGradient: 'from-amber-400 via-orange-400 via-rose-400 to-purple-400',
    logoGradient: 'from-amber-400 via-orange-500 to-rose-500',
    aura1: 'bg-amber-500/15',
    aura2: 'bg-rose-500/15',
    accentBorder: 'border-amber-500/30',
  },
  GOLDEN: {
    name: 'Midas Gold',
    playBtnGradient: 'from-yellow-300 via-amber-400 to-yellow-500',
    playBtnHover: 'hover:from-yellow-200 hover:via-amber-300 hover:to-yellow-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(234,179,8,0.5)] hover:shadow-[0_0_55px_rgba(245,158,11,0.7)]',
    playBtnBorder: 'border-yellow-100/50',
    playBtnText: 'text-slate-950',
    homeTitleGradient: 'from-yellow-300 via-amber-300 to-yellow-500',
    logoGradient: 'from-yellow-300 via-amber-400 to-yellow-500',
    aura1: 'bg-amber-500/20',
    aura2: 'bg-yellow-500/15',
    accentBorder: 'border-amber-500/30',
  },
  OCEAN: {
    name: 'Ocean Sapphire',
    playBtnGradient: 'from-sky-400 via-blue-500 to-indigo-500',
    playBtnHover: 'hover:from-sky-300 hover:via-blue-400 hover:to-indigo-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(59,130,246,0.45)] hover:shadow-[0_0_55px_rgba(99,102,241,0.65)]',
    playBtnBorder: 'border-sky-200/40',
    playBtnText: 'text-white',
    homeTitleGradient: 'from-sky-400 via-blue-400 to-indigo-400',
    logoGradient: 'from-sky-400 via-blue-500 to-indigo-500',
    aura1: 'bg-sky-500/15',
    aura2: 'bg-blue-500/15',
    accentBorder: 'border-sky-500/30',
  },
  DRAGON: {
    name: 'Dragon Scale',
    playBtnGradient: 'from-rose-500 via-red-600 to-amber-500',
    playBtnHover: 'hover:from-rose-400 hover:via-red-500 hover:to-amber-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(220,38,38,0.5)] hover:shadow-[0_0_55px_rgba(245,158,11,0.7)]',
    playBtnBorder: 'border-rose-300/40',
    playBtnText: 'text-white',
    homeTitleGradient: 'from-rose-400 via-red-500 to-amber-400',
    logoGradient: 'from-rose-500 via-red-600 to-amber-500',
    aura1: 'bg-red-500/15',
    aura2: 'bg-amber-500/15',
    accentBorder: 'border-red-500/30',
  },
  COSMIC: {
    name: 'Cosmic Nebula',
    playBtnGradient: 'from-purple-400 via-violet-500 to-fuchsia-500',
    playBtnHover: 'hover:from-purple-300 hover:via-violet-400 hover:to-fuchsia-400',
    playBtnShadow: 'shadow-[0_0_35px_rgba(168,85,247,0.45)] hover:shadow-[0_0_55px_rgba(217,70,239,0.65)]',
    playBtnBorder: 'border-purple-200/40',
    playBtnText: 'text-white',
    homeTitleGradient: 'from-purple-400 via-violet-400 to-fuchsia-400',
    logoGradient: 'from-purple-400 via-violet-500 to-fuchsia-500',
    aura1: 'bg-purple-500/15',
    aura2: 'bg-fuchsia-500/15',
    accentBorder: 'border-purple-500/30',
  },
};
