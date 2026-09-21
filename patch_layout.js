const fs = require('fs');
let code = fs.readFileSync('/app/applet/app/layout.tsx', 'utf8');
code = code.replace('<SmoothScroll>', '<>');
code = code.replace('</SmoothScroll>', '</>');
fs.writeFileSync('/app/applet/app/layout.tsx', code);
