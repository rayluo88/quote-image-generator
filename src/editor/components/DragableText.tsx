import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Position, ThemeConfig } from '../types';

interface Props {
  text: string;
  theme: ThemeConfig;
  onPositionChange: (position: Position) => void;
}

export const DraggableText: React.FC<Props> = ({ text, theme, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0] : e;
    dragStartPos.current = {
      x: pos.clientX - (theme.position?.x || 0),
      y: pos.clientY - (theme.position?.y || 0)
    };
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const pos = 'touches' in e ? e.touches[0] : e;
    const container = containerRef.current.getBoundingClientRect();
    
    // Calculate new position as percentage
    const x = Math.max(0, Math.min(100, 
      ((pos.clientX - dragStartPos.current.x) / container.width) * 100
    ));
    const y = Math.max(0, Math.min(100, 
      ((pos.clientY - dragStartPos.current.y) / container.height) * 100
    ));

    onPositionChange({ x, y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        left: `${theme.position?.x}%`,
        top: `${theme.position?.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        padding: theme.padding,
        maxWidth: '90%',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <Typography
        sx={{
          color: theme.textColor,
          fontFamily: theme.fontFamily,
          fontSize: theme.fontSize,
          textAlign: theme.alignment,
          letterSpacing: theme.effects.letterSpacing,
          lineHeight: theme.effects.lineHeight,
          textShadow: theme.effects.shadow 
            ? `${theme.effects.shadowBlur}px ${theme.effects.shadowBlur}px ${theme.effects.shadowColor}`
            : 'none',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
