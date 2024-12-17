import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, ContentCopy, Download } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import {
  ThemeConfig,
  PRESET_SIZES,
  FONT_OPTIONS,
  DEFAULT_TEXT_EFFECTS,
  DEFAULT_BACKGROUND,
  BackgroundConfig,
  THEME_PRESETS
} from './types';
import { DraggableText } from './components/DraggableText';
import { ExportDialog } from './components/ExportDialog';
import { copyImageToClipboard } from './utils/clipboard';

const defaultTheme: ThemeConfig = {
  background: DEFAULT_BACKGROUND,
  textColor: '#000000',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 24,
  padding: 40,
  alignment: 'center',
  width: 1080,
  height: 1080,
  effects: DEFAULT_TEXT_EFFECTS,
  position: { x: 50, y: 50 }
};

const getBackgroundStyle = (background: BackgroundConfig): React.CSSProperties => {
  switch (background.type) {
    case 'gradient':
      return { background: `linear-gradient(${background.gradientAngle}deg, ${background.gradientColors[0]}, ${background.gradientColors[1]})` };
    case 'image':
      return { backgroundImage: `url(${background.imageUrl})`, backgroundSize: 'cover' };
    default:
      return { backgroundColor: background.color };
  }
};

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

const EditorApp: React.FC = () => {
  const [text, setText] = useState('');
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const previewRef = useRef<HTMLDivElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    chrome.storage.local.get(['selectedText', 'themeConfig'], (result) => {
      if (result.selectedText) {
        setText(result.selectedText);
      }
      if (result.themeConfig) {
        setTheme(result.themeConfig);
      }
    });
  }, []);

  const handleThemeChange = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => {
      const newTheme = { ...prev, [key]: value };
      chrome.storage.local.set({ themeConfig: newTheme });
      return newTheme;
    });
  };

  const handlePresetSize = (preset: typeof PRESET_SIZES[0]) => {
    handleThemeChange('width', preset.width);
    handleThemeChange('height', preset.height);
  };

  const handleExport = async (format: string, quality: number, filename: string) => {
    try {
      const previewElement = previewRef.current;
      if (!previewElement) throw new Error('Preview element not found');

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const blob = await new Promise<Blob>((resolve) => {
        if (format === 'png') {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        } else {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100);
        }
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Image exported successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export image',
        severity: 'error'
      });
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const previewElement = previewRef.current;
      if (!previewElement) throw new Error('Preview element not found');

      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const success = await copyImageToClipboard(canvas);
      
      setSnackbar({
        open: true,
        message: success ? 'Image copied to clipboard!' : 'Failed to copy image',
        severity: success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to copy image to clipboard',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleThemeChange('background', {
          ...theme.background,
          type: 'image',
          imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Text
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Quote Text"
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom>
              Theme
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={theme.fontFamily}
                onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                label="Font Family"
              >
                {FONT_OPTIONS.map(font => (
                  <MenuItem key={font.value} value={font.value}>
                    {font.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>Font Size</Typography>
            <Slider
              value={theme.fontSize}
              onChange={(_, value) => handleThemeChange('fontSize', value)}
              min={12}
              max={72}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Padding</Typography>
            <Slider
              value={theme.padding}
              onChange={(_, value) => handleThemeChange('padding', value)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Text Alignment</Typography>
            <ToggleButtonGroup
              value={theme.alignment}
              exclusive
              onChange={(_, value) => value && handleThemeChange('alignment', value)}
              sx={{ mb: 3, width: '100%' }}
            >
              <ToggleButton value="left">
                <FormatAlignLeft />
              </ToggleButton>
              <ToggleButton value="center">
                <FormatAlignCenter />
              </ToggleButton>
              <ToggleButton value="right">
                <FormatAlignRight />
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography gutterBottom>Colors</Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                type="color"
                value={theme.background.color}
                onChange={(e) => handleThemeChange('background', {
                  ...theme.background,
                  color: e.target.value
                })}
                label="Background Color"
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                type="color"
                value={theme.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
                label="Text Color"
                fullWidth
              />
            </Box>

            <Typography gutterBottom>Preset Sizes</Typography>
            <Box sx={{ mb: 3 }}>
              {PRESET_SIZES.map(preset => (
                <Button
                  key={preset.name}
                  variant="outlined"
                  size="small"
                  onClick={() => handlePresetSize(preset)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {preset.name}
                </Button>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>
              Background
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Background Type</InputLabel>
              <Select
                value={theme.background.type}
                onChange={(e) => handleThemeChange('background', {
                  ...theme.background,
                  type: e.target.value
                })}
                label="Background Type"
              >
                <MenuItem value="solid">Solid Color</MenuItem>
                <MenuItem value="gradient">Gradient</MenuItem>
                <MenuItem value="image">Image</MenuItem>
              </Select>
            </FormControl>

            {theme.background.type === 'gradient' && (
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Gradient Colors</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    type="color"
                    value={theme.background.gradientColors[0]}
                    onChange={(e) => handleThemeChange('background', {
                      ...theme.background,
                      gradientColors: [e.target.value, theme.background.gradientColors[1]]
                    })}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="color"
                    value={theme.background.gradientColors[1]}
                    onChange={(e) => handleThemeChange('background', {
                      ...theme.background,
                      gradientColors: [theme.background.gradientColors[0], e.target.value]
                    })}
                    sx={{ flex: 1 }}
                  />
                </Stack>
                <Typography gutterBottom>Gradient Angle</Typography>
                <Slider
                  value={theme.background.gradientAngle}
                  onChange={(_, value) => handleThemeChange('background', {
                    ...theme.background,
                    gradientAngle: value as number
                  })}
                  min={0}
                  max={360}
                  valueLabelDisplay="auto"
                />
              </Box>
            )}

            {theme.background.type === 'image' && (
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
            )}

            <Typography variant="h6" gutterBottom>
              Text Effects
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={theme.effects.shadow}
                  onChange={(e) => handleThemeChange('effects', {
                    ...theme.effects,
                    shadow: e.target.checked
                  })}
                />
              }
              label="Text Shadow"
            />

            {theme.effects.shadow && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  type="color"
                  value={theme.effects.shadowColor}
                  onChange={(e) => handleThemeChange('effects', {
                    ...theme.effects,
                    shadowColor: e.target.value
                  })}
                  label="Shadow Color"
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <Typography gutterBottom>Shadow Blur</Typography>
                <Slider
                  value={theme.effects.shadowBlur}
                  onChange={(_, value) => handleThemeChange('effects', {
                    ...theme.effects,
                    shadowBlur: value as number
                  })}
                  min={0}
                  max={20}
                  valueLabelDisplay="auto"
                />
              </Box>
            )}

            <Typography gutterBottom>Letter Spacing</Typography>
            <Slider
              value={theme.effects.letterSpacing}
              onChange={(_, value) => handleThemeChange('effects', {
                ...theme.effects,
                letterSpacing: value as number
              })}
              min={-2}
              max={10}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Line Height</Typography>
            <Slider
              value={theme.effects.lineHeight}
              onChange={(_, value) => handleThemeChange('effects', {
                ...theme.effects,
                lineHeight: value as number
              })}
              min={1}
              max={3}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Theme Presets
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {THEME_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outlined"
                    size="small"
                    onClick={() => setTheme(preset.config)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Text Position
              </Typography>
              <Button 
                variant="outlined"
                size="small"
                onClick={() => {
                  setTheme(prev => ({
                    ...prev,
                    position: { x: 50, y: 50 }
                  }));
                }}
                sx={{ mr: 1 }}
              >
                Center Text
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Drag text to reposition
              </Typography>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => setExportDialogOpen(true)}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Box
              className="preview-container"
              ref={previewRef}
              sx={{
                position: 'relative',
                width: theme.width,
                height: theme.height,
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)',
                margin: '0 auto',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                ...getBackgroundStyle(theme.background)
              }}
            >
              <DraggableText
                text={text}
                theme={theme}
                onPositionChange={(position) => {
                  handleThemeChange('position', position);
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditorApp; 