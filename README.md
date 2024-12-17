# Quote Image Generator Chrome Extension

A Chrome extension that allows users to convert selected text into beautifully styled images with customizable themes. Perfect for creating shareable quotes for social media.

## Features

### Core Functionality
- ✅ Text selection with floating button and context menu
- ✅ Real-time preview with live updates
- ✅ Drag-and-drop text positioning
- ✅ Theme presets (Clean, Dark, Colorful, Professional)

### Customization
- ✅ Background options:
  - Solid colors
  - Gradient backgrounds
  - Custom image upload
- ✅ Text styling:
  - Multiple font families
  - Size and color
  - Alignment and spacing
  - Shadow effects
- ✅ Layout options:
  - Preset sizes for social media
  - Custom dimensions
  - Adjustable padding

### Export Options
- ✅ PNG export with transparency
- ✅ JPEG export with quality settings
- ✅ Copy to clipboard
- ✅ Custom filename support

## Installation

1. Clone this repository:
   ```bash
   git clone [repository-url]
   cd quote-image-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Usage

1. **Select Text**
   - Highlight any text on a webpage
   - Click the camera icon that appears, or
   - Right-click and select "Create Quote Image"

2. **Customize Design**
   - Choose from predefined themes
   - Customize colors, fonts, and effects
   - Drag text to position it
   - Adjust size and layout

3. **Export**
   - Export as PNG (with transparency)
   - Export as JPEG (with quality settings)
   - Copy directly to clipboard
   - Save with custom filename

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run test` - Run tests

## Project Structure
```
src/
├── editor/         # Quote editor UI components
│   ├── components/     # React components
│   │   ├── DraggableText.tsx  # Draggable text component
│   │   └── ExportDialog.tsx   # Export options dialog
│   ├── utils/          # Utility functions
│   │   └── clipboard.ts    # Clipboard operations
│   ├── EditorApp.tsx   # Main editor component
│   ├── theme.ts        # Material UI theme config
│   └── types.ts        # TypeScript interfaces
├── content/        # Content script
│   └── index.ts    # Text selection handler
├── background/     # Extension background script
│   └── index.ts    # Context menu and messaging
└── popup/          # Extension popup UI
    └── index.tsx   # Simple usage instructions
```

## Technologies Used

- React with TypeScript
- Material-UI for components
- html2canvas for image generation
- react-draggable for text positioning

## Browser Support

- Chrome (Latest version)
- Other Chromium-based browsers (Edge, Brave, etc.)

## License

MIT