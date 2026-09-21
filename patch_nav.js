const fs = require('fs');
let code = fs.readFileSync('/app/applet/components/layout/Navbar.tsx', 'utf8');

const scrollHandler = `
                onClick={(e) => {
                  if (link.href.startsWith('/#') && pathname === '/') {
                    e.preventDefault();
                    const id = link.href.split('#')[1];
                    const element = document.getElementById(id);
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}
`;

code = code.replace(
  'href={link.href}\n                className=',
  `href={link.href} ${scrollHandler} className=`
);

const mobileScrollHandler = `
                    onClick={(e) => {
                      if (link.href.startsWith('/#') && pathname === '/') {
                        e.preventDefault();
                        const id = link.href.split('#')[1];
                        const element = document.getElementById(id);
                        if (element) {
                          const y = element.getBoundingClientRect().top + window.scrollY - 80;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }
                      setMobileMenuOpen(false);
                    }}
`;

code = code.replace(
  'onClick={() => setMobileMenuOpen(false)}',
  mobileScrollHandler
);

fs.writeFileSync('/app/applet/components/layout/Navbar.tsx', code);
