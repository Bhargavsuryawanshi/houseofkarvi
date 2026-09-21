const fs = require('fs');
const file = '/app/applet/components/layout/Footer.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<footer className="bg-[#333232] text-white/90 pt-16 pb-16 px-6 lg:px-12 mt-20">',
  '<footer className="bg-[#333232] text-white/90 px-6 lg:px-12" style={{ paddingTop: \'var(--space-section-y)\', paddingBottom: \'var(--space-section-y)\', marginTop: \'var(--space-gap-xl)\' }}>'
);

code = code.replace(
  '<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">',
  '<div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 items-start" style={{ gap: \'var(--space-gap-lg)\' }}>'
);

code = code.replace(
  /<h4 className="text-white font-bold mb-4">/g,
  '<h4 className="text-white font-bold mb-4" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

code = code.replace(
  /<p className="text-sm font-light text-white\/70">/g,
  '<p className="font-light text-white/70" style={{ fontSize: \'var(--fs-body)\' }}>'
);

code = code.replace(
  '<ul className="space-y-2 text-sm font-light text-white/70">',
  '<ul className="space-y-2 font-light text-white/70" style={{ fontSize: \'var(--fs-body)\' }}>'
);

fs.writeFileSync(file, code);
