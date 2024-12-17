import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Clean up dist/src if it exists
if (existsSync(resolve(__dirname, 'dist/src'))) {
  rmSync(resolve(__dirname, 'dist/src'), { recursive: true });
}

// Create necessary directories
const createDir = (path) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};

createDir('dist');
createDir('dist/assets');

// Copy and modify HTML files
const processHtml = (sourcePath, targetPath, scriptName) => {
  let html = readFileSync(sourcePath, 'utf8');
  
  // Update script paths to use built files
  html = html.replace(
    /<script type="module" src="\.\/index\.tsx"><\/script>/,
    `<script type="module" src="/${scriptName}.js"></script>`
  );
  
  // Add viewport meta tag if missing
  if (!html.includes('viewport')) {
    html = html.replace(
      /<meta charset="UTF-8">/,
      '<meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
  }
  
  writeFileSync(targetPath, html);
};

// Process HTML files
processHtml(
  resolve(__dirname, 'src/popup/index.html'),
  resolve(__dirname, 'dist/popup.html'),
  'popup'
);

processHtml(
  resolve(__dirname, 'src/editor/index.html'),
  resolve(__dirname, 'dist/editor.html'),
  'editor'
);

// Copy manifest and icons
copyFileSync(
  resolve(__dirname, 'public/manifest.json'),
  resolve(__dirname, 'dist/manifest.json')
);

const iconSizes = [16, 48, 128];
iconSizes.forEach(size => {
  try {
    copyFileSync(
      resolve(__dirname, `public/icons/icon${size}.png`),
      resolve(__dirname, `dist/assets/icon${size}.png`)
    );
  } catch (error) {
    console.warn(`Warning: Could not copy icon${size}.png`);
  }
});

console.log('Build files copied successfully!'); 