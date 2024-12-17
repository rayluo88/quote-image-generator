import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box
} from '@mui/material';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: string, quality: number, filename: string) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  onExport
}) => {
  const [format, setFormat] = useState<string>('png');
  const [quality, setQuality] = useState<number>(92);
  const [filename, setFilename] = useState<string>('quote-image');

  const handleExport = () => {
    onExport(format, quality, filename);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Image</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Format"
            >
              <MenuItem value="png">PNG (Transparent Background)</MenuItem>
              <MenuItem value="jpeg">JPEG (Better Compression)</MenuItem>
            </Select>
          </FormControl>

          {format === 'jpeg' && (
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Quality</Typography>
              <Slider
                value={quality}
                onChange={(_, value) => setQuality(value as number)}
                min={10}
                max={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            helperText={`Will be saved as: ${filename}.${format}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleExport} variant="contained" color="primary">
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 