import Image from 'next/image';
import Link from 'next/link';

const collections = [
  {
    category: 'Chairs & Seating',
    items: [
      {
        id: 'c1',
        title: 'The Osaka Chair',
        material: 'Solid Walnut & Top-Grain Leather',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'c2',
        title: 'Kyoto Lounge Sofa',
        material: 'Bouclé Fabric & Oak Base',
        image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=800&auto=format&fit=crop',
      }
    ]
  },
  {
    category: 'Tables & Dining',
    items: [
      {
        id: 'c4',
        title: 'Nara Dining Table',
        material: 'Reclaimed Teak Wood',
        image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'c5',
        title: 'Sapporo Accent Table',
        material: 'Travertine & Black Steel',
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800&auto=format&fit=crop',
      }
    ]
  },
  {
    category: 'Bedroom & Storage',
    items: [
      {
        id: 'c3',
        title: 'Zen Platform Bed',
        material: 'Ash Wood & Linen Headboard',
        image: 'https://images.unsplash.com/photo-1505693416022-14c1c15f903a?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'c6',
        title: 'Hiroshima Sideboard',
        material: 'White Oak & Rattan',
        image: 'https://images.unsplash.com/photo-1595514535415-84e1b73eeb95?q=80&w=800&auto=format&fit=crop',
      }
    ]
  }
];

export default function CollectionsPage() {
  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-6">Collections</h1>
          <p className="text-brand-charcoal/70 text-lg leading-relaxed font-light">
            Explore our curated collections by category. Each piece is made to order and customizable to suit your interior vision.
          </p>
        </header>

        <div className="space-y-32">
          {collections.map((collection) => (
            <section key={collection.category}>
              <div className="flex items-center justify-between mb-12 border-b border-brand-charcoal/10 pb-6">
                <h2 className="font-serif text-3xl text-brand-charcoal">{collection.category}</h2>
                <Link 
                  href="/contact" 
                  className="hidden md:inline-block text-xs uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors font-medium"
                >
                  Inquire for Bespoke
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {collection.items.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-beige mb-6">
                      <Image 
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-serif text-2xl text-brand-charcoal">{item.title}</h3>
                      <p className="text-sm text-brand-charcoal/60 uppercase tracking-wider">{item.material}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
