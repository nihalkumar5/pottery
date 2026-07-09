const fs = require('fs');

function scopeCSS(inputFile, outputFile, prefix) {
  let css = fs.readFileSync(inputFile, 'utf8');
  
  // A simple regex to prefix CSS selectors. It's not perfect but works for standard class/element selectors.
  // We'll skip @media, @keyframes, and :root for the prefixing.
  // Actually, since this is complex, a safer approach is just using PostCSS or wrapping the entire content inside a parent selector if we were using SASS.
  // Without SASS, doing this purely with regex is risky.
  
  // Alternative: We can just use the @media approach! It's much cleaner for standard responsive design.
  
  const mediaWrappedCss = `
${css}
`;
  
  fs.writeFileSync(outputFile, mediaWrappedCss);
}

// Let's just use the media query wrapping, it's safer than regex prefixing.
const desktopCss = fs.readFileSync('src/desktop.css', 'utf8');
const mobileCss = fs.readFileSync('src/index.css', 'utf8');

const combinedCss = `
/* ===============================
   DESKTOP STYLES (min-width: 769px)
   =============================== */
@media (min-width: 769px) {
  ${desktopCss.replace(/:root {/g, '.desktop-app {')}
}

/* ===============================
   MOBILE STYLES (max-width: 768px)
   =============================== */
@media (max-width: 768px) {
  ${mobileCss.replace(/:root {/g, '.mobile-app {')}
}

/* Base resets */
* { margin: 0; padding: 0; box-sizing: border-box; }
`;

fs.writeFileSync('src/index.css', combinedCss);
console.log('Combined CSS created');
