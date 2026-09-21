const fs = require('fs');
let code = fs.readFileSync('/app/applet/components/home/FeaturedCarousel.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">',
  '<div className="min-h-[1400px] sm:min-h-[900px] lg:min-h-[950px]"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">'
);

code = code.replace(
  '        {/* Pagination Controls */}',
  '        </div>\n        {/* Pagination Controls */}'
);

fs.writeFileSync('/app/applet/components/home/FeaturedCarousel.tsx', code);
