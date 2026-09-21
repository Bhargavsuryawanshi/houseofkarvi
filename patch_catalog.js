const fs = require('fs');
const file = '/app/applet/app/catalog/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<div className="pt-32 pb-24 px-6 lg:px-12 bg-brand-ivory min-h-screen">',
  '<div className="section-fit pt-32 px-6 lg:px-12 bg-brand-ivory">'
);

code = code.replace(
  '<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">',
  '<div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center" style={{ gap: \'var(--space-gap-xl)\' }}>'
);

code = code.replace(
  '<header className="mb-10">',
  '<header style={{ marginBottom: \'var(--space-gap-xl)\' }}>'
);

code = code.replace(
  '<h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Exclusive Catalog</h1>',
  '<h1 className="font-serif text-brand-charcoal mb-6" style={{ fontSize: \'var(--fs-heading)\' }}>Exclusive Catalog</h1>'
);

code = code.replace(
  '<p className="text-brand-charcoal/70 text-lg leading-relaxed font-light">',
  '<p className="text-brand-charcoal/70 leading-relaxed font-light" style={{ fontSize: \'var(--fs-body)\' }}>'
);

code = code.replace(
  /className="text-xs uppercase tracking-widest text-brand-charcoal\/70"/g,
  'className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: \'var(--fs-eyebrow)\' }}'
);

code = code.replace(
  '<button type="submit" className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-6">',
  '<button type="submit" className="w-full bg-brand-charcoal text-brand-ivory py-4 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-6" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

code = code.replace(
  '<h3 className="font-serif text-2xl text-brand-charcoal mb-4">Thank You</h3>',
  '<h3 className="font-serif text-brand-charcoal mb-4" style={{ fontSize: \'var(--fs-label-xl)\' }}>Thank You</h3>'
);

code = code.replace(
  '<p className="text-brand-charcoal/70 text-sm mb-6">',
  '<p className="text-brand-charcoal/70 mb-6" style={{ fontSize: \'var(--fs-body)\' }}>'
);

code = code.replace(
  '<a href="#" className="inline-block bg-brand-gold text-white py-3 px-8 text-sm font-medium uppercase tracking-widest hover:bg-brand-charcoal transition-colors">',
  '<a href="#" className="inline-block bg-brand-gold text-white py-3 px-8 font-medium uppercase tracking-widest hover:bg-brand-charcoal transition-colors" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

fs.writeFileSync(file, code);
