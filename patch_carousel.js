const fs = require('fs');
let code = fs.readFileSync('/app/applet/components/home/FeaturedCarousel.tsx', 'utf8');

// 1. Remove the useLayoutEffect for scroll jump
code = code.replace(
  /const prevPageRef = useRef\(currentPage\);\s*useLayoutEffect\(\(\) => \{[\s\S]*?\}, \[currentPage\]\);/,
  ''
);

// 2. Add data-lenis-prevent="true" to the modal containers
code = code.replace(
  'className="fixed inset-0 z-[100]',
  'data-lenis-prevent="true"\n            className="fixed inset-0 z-[100]'
);

code = code.replace(
  'className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto',
  'data-lenis-prevent="true"\n              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto'
);

fs.writeFileSync('/app/applet/components/home/FeaturedCarousel.tsx', code);
