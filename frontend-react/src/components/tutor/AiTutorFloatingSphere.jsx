import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Move, Compass, MessageSquare } from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { playMechanicalClick } from '../../utils/audioEngine';

export default function AiTutorFloatingSphere() {
  const { isAiTutorOpen, setIsAiTutorOpen, langMode } = useLabStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Default initial position (bottom-right area)
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('eec_sphere_position_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    const defaultX = typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 130) : 300;
    const defaultY = typeof window !== 'undefined' ? Math.max(80, window.innerHeight - 200) : 400;
    return { x: defaultX, y: defaultY };
  });

  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const sphereRef = useRef(null);

  // Keep inside viewport if screen resizes
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const sphereSize = window.innerWidth < 640 ? 80 : 96;
        const maxX = Math.max(10, window.innerWidth - sphereSize - 15);
        const maxY = Math.max(70, window.innerHeight - sphereSize - 20);
        const clampedX = Math.min(Math.max(10, prev.x), maxX);
        const clampedY = Math.min(Math.max(70, prev.y), maxY);
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (clientX, clientY) => {
    dragStartRef.current = { x: clientX, y: clientY };
    posStartRef.current = { ...position };
    hasMovedRef.current = false;
    setIsDragging(true);

    const handlePointerMove = (e) => {
      const currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const currentY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = currentX - dragStartRef.current.x;
      const dy = currentY - dragStartRef.current.y;

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const sphereSize = window.innerWidth < 640 ? 80 : 96;
      const maxX = Math.max(10, window.innerWidth - sphereSize - 10);
      const maxY = Math.max(65, window.innerHeight - sphereSize - 15);

      const newX = Math.min(Math.max(10, posStartRef.current.x + dx), maxX);
      const newY = Math.min(Math.max(65, posStartRef.current.y + dy), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      // Save position to localStorage
      setPosition((curr) => {
        try {
          localStorage.setItem('eec_sphere_position_v2', JSON.stringify(curr));
        } catch {
          // ignore
        }
        return curr;
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handlePointerDown(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleClick = () => {
    if (hasMovedRef.current) {
      // Was dragging, do not open drawer
      return;
    }
    playMechanicalClick();
    setIsAiTutorOpen(true);
  };

  // If sidebar is already open, hide the sphere so it doesn't obstruct the drawer
  if (isAiTutorOpen) return null;

  return (
    <div
      ref={sphereRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        touchAction: 'none',
      }}
      className={`select-none transition-shadow ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Drag to move, click to open AI Circuit Tutor"
    >
      <div className="relative group flex items-center justify-center">
        {/* Hover Tooltip Pill (Desktop) */}
        <div
          className={`hidden sm:flex absolute -top-12 left-1/2 -translate-x-1/2 items-center gap-2 bg-slate-950/95 text-white px-3.5 py-1.5 rounded-full border border-indigo-500/50 shadow-2xl text-[11px] font-bold whitespace-nowrap transition-all duration-300 pointer-events-none ${
            isHovered && !isDragging
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 scale-95'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>
            {langMode === 'bn'
              ? 'টেনে যেকোনো জায়গায় রাখুন • ক্লিক করে কথা বলুন'
              : 'Drag anywhere • Click to open AI Tutor'}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-600/80 font-mono text-indigo-100">
            Moveable
          </span>
        </div>

        {/* Outer Radiant Glowing Aura Ring */}
        <div
          className={`absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 blur-lg opacity-75 group-hover:opacity-100 group-hover:scale-115 transition-all duration-500 animate-pulse ${
            isDragging ? 'scale-120 opacity-100' : ''
          }`}
        />

        {/* Rotating Outer Cyber Orbital Ring */}
        <div className="absolute -inset-1 rounded-full border border-dashed border-indigo-300/40 dark:border-indigo-400/50 animate-spin [animation-duration:14s] pointer-events-none" />

        {/* High-Tech 3D Glassmorphic Glowing Sphere (Enlarged w-20 to w-24) */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-700 to-slate-950 p-1 shadow-[0_0_40px_rgba(99,102,241,0.65)] flex flex-col items-center justify-center border-2 border-white/40 dark:border-white/25 backdrop-blur-xl transition-transform duration-200 group-hover:scale-108 active:scale-95 ${
            isDragging ? 'scale-105 shadow-[0_0_55px_rgba(168,85,247,0.85)]' : ''
          }`}
        >
          {/* Specular 3D Curved Light Reflection Arc */}
          <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/45 blur-[1px] -rotate-45 pointer-events-none" />
          <div className="absolute top-4 left-5 w-2 h-2 rounded-full bg-white/70 blur-xs pointer-events-none" />

          {/* Central Animated Bot Icon */}
          <div className="relative flex items-center justify-center">
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] group-hover:rotate-12 transition-transform duration-300" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-2 animate-bounce" />
          </div>

          {/* Bottom Label Badge */}
          <div className="mt-0.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/20 text-[9px] sm:text-[10px] font-black text-sky-200 uppercase tracking-wider shadow-xs pointer-events-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Tutor</span>
          </div>

          {/* Drag Grip Indicator Dots */}
          <div className="absolute top-1 right-2 flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Move className="w-3 h-3 text-white/80" />
          </div>

          {/* Online Active Indicator Beacons */}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm animate-ping" />
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
