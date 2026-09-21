const fs = require('fs');
const file = '/app/applet/components/layout/Navbar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors relative group ${textColor} hover:text-brand-gold`}',
  'className={`font-medium tracking-[0.15em] uppercase transition-colors relative group ${textColor} hover:text-brand-gold`} style={{ fontSize: \'var(--fs-eyebrow)\' }}'
);

code = code.replace(
  'className="text-3xl font-serif text-brand-charcoal hover:text-brand-gold transition-colors"',
  'className="font-serif text-brand-charcoal hover:text-brand-gold transition-colors" style={{ fontSize: \'var(--fs-heading)\' }}'
);

fs.writeFileSync(file, code);
