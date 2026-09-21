const fs = require('fs');
const file = '/app/applet/app/not-found.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<div className="flex flex-col items-center justify-center min-h-[60vh]">',
  '<div className="section-fit flex flex-col items-center text-center bg-brand-ivory">'
);

code = code.replace(
  '<h2 className="text-2xl font-bold mb-4">Not Found</h2>',
  '<h2 className="font-serif text-brand-charcoal mb-4" style={{ fontSize: \'var(--fs-heading)\' }}>Not Found</h2>'
);

code = code.replace(
  '<p className="mb-4">Could not find requested resource</p>',
  '<p className="text-brand-charcoal/70 mb-8" style={{ fontSize: \'var(--fs-body)\' }}>Could not find requested resource</p>'
);

code = code.replace(
  '<Link href="/" className="text-brand-charcoal underline">',
  '<Link href="/" className="inline-block bg-brand-charcoal text-white py-3 px-8 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

fs.writeFileSync(file, code);
