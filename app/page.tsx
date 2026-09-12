import { Hero } from '@/components/home/Hero';
import { Story } from '@/components/home/Story';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { Craftsmanship } from '@/components/home/Craftsmanship';

export default function Page() {
  return (
    <>
      <Hero />
      <Story />
      <Craftsmanship />
      <FeaturedCarousel />
    </>
  );
}
