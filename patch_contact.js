const fs = require('fs');
const file = '/app/applet/app/contact/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<div className="pt-32 pb-24 px-6 lg:px-12 bg-brand-ivory min-h-screen">',
  '<div className="section-fit pt-32 px-6 lg:px-12 bg-brand-ivory">'
);

code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">',
  '<div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: \'var(--space-gap-xl)\' }}>'
);

code = code.replace(
  '<h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-8">Let&apos;s bring your vision to life.</h1>',
  '<h1 className="font-serif text-brand-charcoal" style={{ fontSize: \'var(--fs-heading)\', marginBottom: \'var(--space-gap-lg)\' }}>Let&apos;s bring your vision to life.</h1>'
);

code = code.replace(
  '<p className="text-brand-charcoal/70 text-lg leading-relaxed font-light mb-12">',
  '<p className="text-brand-charcoal/70 leading-relaxed font-light" style={{ fontSize: \'var(--fs-body)\', marginBottom: \'var(--space-gap-xl)\' }}>'
);

code = code.replace(
  /<h3 className="text-sm uppercase tracking-widest text-brand-gold font-medium mb-2">/g,
  '<h3 className="uppercase tracking-widest text-brand-gold font-medium mb-2" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

code = code.replace(
  '<h2 className="font-serif text-2xl text-brand-charcoal mb-8">Send an Inquiry</h2>',
  '<h2 className="font-serif text-brand-charcoal" style={{ fontSize: \'var(--fs-label-xl)\', marginBottom: \'var(--space-gap-lg)\' }}>Send an Inquiry</h2>'
);

code = code.replace(
  '<h3 className="font-serif text-2xl mb-2">Thank You</h3>',
  '<h3 className="font-serif mb-2" style={{ fontSize: \'var(--fs-label-xl)\' }}>Thank You</h3>'
);

code = code.replace(
  /className="text-xs uppercase tracking-widest text-brand-charcoal\/70"/g,
  'className="uppercase tracking-widest text-brand-charcoal/70" style={{ fontSize: \'var(--fs-eyebrow)\' }}'
);

code = code.replace(
  '<button type="submit" disabled={loading} className="w-full bg-brand-charcoal text-brand-ivory py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-4 disabled:opacity-50">',
  '<button type="submit" disabled={loading} className="w-full bg-brand-charcoal text-brand-ivory py-4 font-medium uppercase tracking-widest hover:bg-brand-gold transition-colors mt-4 disabled:opacity-50" style={{ fontSize: \'var(--fs-eyebrow)\' }}>'
);

code = code.replace(
  '<button \n                  onClick',
  '<button \n                  style={{ fontSize: \'var(--fs-eyebrow)\' }}\n                  onClick'
);

fs.writeFileSync(file, code);
