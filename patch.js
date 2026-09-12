const fs = require('fs');
const path = '/app/applet/components/home/FeaturedCarousel.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add useLayoutEffect and useRef
content = content.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect, useLayoutEffect, useRef } from 'react';"
);

// 2. Add the layout effect inside FeaturedCarousel
const hookCode = `
  const prevPageRef = useRef(currentPage);
  useLayoutEffect(() => {
    if (currentPage !== prevPageRef.current) {
      prevPageRef.current = currentPage;
      const section = document.getElementById('collection');
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    }
  }, [currentPage]);
`;

// Insert after activeCategory state
content = content.replace(
  "const [currentPage, setCurrentPage] = useState(0);",
  "const [currentPage, setCurrentPage] = useState(0);\n" + hookCode
);

fs.writeFileSync(path, content);
