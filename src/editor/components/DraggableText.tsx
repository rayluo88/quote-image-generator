import React from 'react';
import Draggable from 'react-draggable';
import { Box } from '@mui/material';
import { ThemeConfig, Position } from '../types';

interface DraggableTextProps {
  text: string;
  theme: ThemeConfig;
  onPositionChange: (position: Position) => void;
}

export const DraggableText: React.FC<DraggableTextProps> = ({ text, theme, onPositionChange }) => {
  const handleDrag = (_: any, data: { x: number; y: number }) => {
    onPositionChange({ x: data.x, y: data.y });
  };

  const getTextStyle = () => {
    const { effects, textColor, fontFamily, fontSize, alignment } = theme;
    
    const textShadow = effects.shadow
      ? `${effects.shadowColor} 0px 0px ${effects.shadowBlur}px`
      : 'none';

    return {
      color: textColor,
      fontFamily,
      fontSize: `${fontSize}px`,
      textAlign: alignment,
      letterSpacing: `${effects.letterSpacing}px`,
      lineHeight: effects.lineHeight,
      textShadow,
      cursor: 'move',
      userSelect: 'none',
      position: 'absolute',
      maxWidth: '90%',
      padding: theme.padding,
      transform: 'translate(-50%, -50%)'
    } as React.CSSProperties;
  };

  return (
    <Draggable
      position={theme.position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <Box
        component="div"
        sx={getTextStyle()}
      >
        {text}
      </Box>
    </Draggable>
  );
}; 