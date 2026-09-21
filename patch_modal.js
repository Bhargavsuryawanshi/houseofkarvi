const fs = require('fs');
let code = fs.readFileSync('/app/applet/components/home/FeaturedCarousel.tsx', 'utf8');

code = code.replace(
  'className="w-full md:w-1/2 relative bg-[#e5e5e5] min-h-[40vh] md:min-h-full flex items-center justify-center p-8"',
  'className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full flex items-center justify-center overflow-hidden bg-white"'
);

code = code.replace(
  'className="object-contain mix-blend-multiply"',
  'className="object-cover"'
);

fs.writeFileSync('/app/applet/components/home/FeaturedCarousel.tsx', code);
