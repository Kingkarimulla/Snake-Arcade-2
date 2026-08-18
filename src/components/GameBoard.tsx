import React, { useEffect, useRef } from 'react';
import { Position, Food, Obstacle, Particle, FloatingText, Direction, GameSettings } from '../types';
import { THEMES } from '../utils/theme';

interface GameBoardProps {
  gridSize: number;
  snake: Position[];
  food: Food | null;
  obstacles: Obstacle[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  direction: Direction;
  settings: GameSettings;
  onSwipe: (dir: Direction) => void;
  isPaused: boolean;
  hasStartedMoving?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  snake,
  food,
  obstacles,
  particles,
  floatingTexts,
  direction,
  settings,
  onSwipe,
  isPaused,
  hasStartedMoving = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Unified Pointer & Swipe Gesture detection
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!touchStartRef.current) return;
    const start = touchStartRef.current;
    const end = {
      x: e.clientX,
      y: e.clientY,
    };

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const minSwipeDistance = 20;

    if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    } else {
      // Tap on canvas quadrant relative to snake head
      const canvas = canvasRef.current;
      if (canvas && snake.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const cellSize = rect.width / gridSize;
        const headScreenX = snake[0].x * cellSize + cellSize / 2;
        const headScreenY = snake[0].y * cellSize + cellSize / 2;
        const tapDx = clickX - headScreenX;
        const tapDy = clickY - headScreenY;

        if (Math.abs(tapDx) > Math.abs(tapDy)) {
          onSwipe(tapDx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          onSwipe(tapDy > 0 ? 'DOWN' : 'UP');
        }
      }
    }
    touchStartRef.current = null;
  };

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get parent size to keep 1:1 aspect ratio square canvas
    const parentWidth = canvas.parentElement?.clientWidth || 400;
    const size = Math.min(parentWidth, Math.min(window.innerHeight - 280, 560));
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const theme = THEMES[settings.theme] || THEMES.CLASSIC;
    const cellSize = size / gridSize;

    // Clear background
    ctx.fillStyle = theme.boardBg;
    ctx.fillRect(0, 0, size, size);

    // Draw Subtle Grid Lines
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      const pos = i * cellSize;
      // vertical
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();

      // horizontal
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Draw Obstacles (if any)
    obstacles.forEach((obs) => {
      const px = obs.x * cellSize;
      const py = obs.y * cellSize;

      ctx.fillStyle = theme.obstacleBg;
      ctx.strokeStyle = theme.obstacleBorder;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(px + 2, py + 2, cellSize - 4, cellSize - 4, 4);
      ctx.fill();
      ctx.stroke();

      // Cross pattern inside obstacle
      ctx.strokeStyle = theme.obstacleBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 6, py + 6);
      ctx.lineTo(px + cellSize - 6, py + cellSize - 6);
      ctx.moveTo(px + cellSize - 6, py + 6);
      ctx.lineTo(px + 6, py + cellSize - 6);
      ctx.stroke();
    });

    // Draw Food
    if (food) {
      const fx = food.x * cellSize + cellSize / 2;
      const fy = food.y * cellSize + cellSize / 2;
      const radius = (cellSize / 2) * 0.75;

      // Pulse effect calculation
      const pulse = Math.sin(Date.now() / 200) * 1.5;
      const currentRadius = Math.max(2, radius + pulse);

      ctx.save();
      if (food.type === 'GOLDEN') {
        // Golden aura glow
        ctx.shadowColor = theme.foodGolden;
        ctx.shadowBlur = 14;
        ctx.fillStyle = theme.foodGolden;

        ctx.beginPath();
        ctx.arc(fx, fy, currentRadius + 1, 0, Math.PI * 2);
        ctx.fill();

        // Star shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fx - radius * 0.3, fy - radius * 0.3, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Regular Apple
        ctx.shadowColor = theme.foodRegular;
        ctx.shadowBlur = 8;
        ctx.fillStyle = theme.foodRegular;

        // Apple body
        ctx.beginPath();
        ctx.arc(fx, fy + 1, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Leaf / Stem
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#10b981'; // Green leaf
        ctx.beginPath();
        ctx.ellipse(fx + 2, fy - currentRadius + 1, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f'; // Stem
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fx, fy - currentRadius + 2);
        ctx.lineTo(fx, fy - currentRadius - 2);
        ctx.stroke();

        // Apple shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(fx - radius * 0.3, fy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw Snake
    if (snake.length > 0) {
      const head = snake[0];

      // Body segments (back to front)
      for (let i = snake.length - 1; i >= 1; i--) {
        const seg = snake[i];
        const sx = seg.x * cellSize;
        const sy = seg.y * cellSize;

        // Color interpolation along body
        const t = i / (snake.length || 1);
        ctx.fillStyle = t > 0.5 ? theme.snakeBodyEnd : theme.snakeBodyStart;

        const segPadding = 2;
        const segSize = cellSize - segPadding * 2;
        const borderRadius = i === snake.length - 1 ? segSize / 2 : 5; // round tail end

        ctx.beginPath();
        ctx.roundRect(sx + segPadding, sy + segPadding, segSize, segSize, borderRadius);
        ctx.fill();
      }

      // Snake Head
      const hx = head.x * cellSize;
      const hy = head.y * cellSize;

      ctx.save();
      ctx.fillStyle = theme.snakeHead;
      ctx.strokeStyle = theme.snakeHeadBorder;
      ctx.lineWidth = 2;
      ctx.shadowColor = theme.accentGlow;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.roundRect(hx + 1, hy + 1, cellSize - 2, cellSize - 2, cellSize / 3);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Snake Eyes pointing in direction of movement
      const eyeRadius = cellSize * 0.12;
      const pupilRadius = eyeRadius * 0.5;
      let leftEye = { x: 0, y: 0 };
      let rightEye = { x: 0, y: 0 };
      let pupilOffset = { x: 0, y: 0 };

      switch (direction) {
        case 'UP':
          leftEye = { x: hx + cellSize * 0.28, y: hy + cellSize * 0.28 };
          rightEye = { x: hx + cellSize * 0.72, y: hy + cellSize * 0.28 };
          pupilOffset = { x: 0, y: -1 };
          break;
        case 'DOWN':
          leftEye = { x: hx + cellSize * 0.28, y: hy + cellSize * 0.72 };
          rightEye = { x: hx + cellSize * 0.72, y: hy + cellSize * 0.72 };
          pupilOffset = { x: 0, y: 1 };
          break;
        case 'LEFT':
          leftEye = { x: hx + cellSize * 0.28, y: hy + cellSize * 0.28 };
          rightEye = { x: hx + cellSize * 0.28, y: hy + cellSize * 0.72 };
          pupilOffset = { x: -1, y: 0 };
          break;
        case 'RIGHT':
          leftEye = { x: hx + cellSize * 0.72, y: hy + cellSize * 0.28 };
          rightEye = { x: hx + cellSize * 0.72, y: hy + cellSize * 0.72 };
          pupilOffset = { x: 1, y: 0 };
          break;
      }

      // Draw Eye sockets
      ctx.fillStyle = theme.snakeEye;
      [leftEye, rightEye].forEach((eye) => {
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(eye.x + pupilOffset.x, eye.y + pupilOffset.y, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Hat / Head Accessory if equipped
      if (settings.hat && settings.hat !== 'NONE') {
        ctx.font = `${Math.round(cellSize * 0.8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let emoji = '';
        if (settings.hat === 'CROWN') emoji = '👑';
        else if (settings.hat === 'CAP') emoji = '🧢';
        else if (settings.hat === 'GLASSES') emoji = '🕶️';
        else if (settings.hat === 'HEADPHONES') emoji = '🎧';
        else if (settings.hat === 'WIZARD') emoji = '🧙';

        ctx.fillText(emoji, hx + cellSize / 2, hy - cellSize * 0.25);
      }

      ctx.restore();
    }

    // Draw Particles
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Floating Texts
    floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${Math.round(16 * ft.scale)}px sans-serif`;
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // Draw Boundary Danger Wall if wall wrap is disabled
    const isWrap = settings.wallWrap || settings.gameMode === 'WALL_WRAP';
    if (!isWrap) {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
      ctx.restore();
    }

    // Ready to Move / Tap to Start Overlay
    if (!hasStartedMoving && !isPaused) {
      ctx.save();
      // Subtle vignette background
      const pulseAlpha = 0.4 + Math.sin(Date.now() / 300) * 0.15;
      ctx.fillStyle = `rgba(15, 23, 42, ${pulseAlpha})`;
      ctx.fillRect(0, 0, size, size);

      // Card pill container
      const pillWidth = Math.min(size * 0.88, 360);
      const pillHeight = Math.round(size * 0.18);
      const pillX = (size - pillWidth) / 2;
      const pillY = (size - pillHeight) / 2;

      ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = `bold ${Math.round(size * 0.048)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fillText('READY TO PLAY!', size / 2, pillY + pillHeight * 0.35);

      ctx.font = `500 ${Math.round(size * 0.034)}px system-ui, sans-serif`;
      ctx.fillStyle = '#e2e8f0';
      ctx.shadowBlur = 0;
      ctx.fillText('Tap D-Pad, Swipe or Press Arrow to Start', size / 2, pillY + pillHeight * 0.72);
      ctx.restore();
    }

    // Pause overlay if paused
    if (isPaused) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(0, 0, size, size);
    }
  }, [gridSize, snake, food, obstacles, particles, floatingTexts, direction, settings, isPaused, hasStartedMoving]);

  return (
    <div className="w-full flex justify-center items-center my-1 select-none touch-none">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-slate-950 p-1.5 transition-all">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="block rounded-xl cursor-pointer touch-none"
        />
      </div>
    </div>
  );
};
