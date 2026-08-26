// Responsive image using fill + sizes inside a sized, positioned container.
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="relative aspect-[16/9] w-full">
      <Image
        src="/banner.jpg"
        alt="Seasonal sale banner"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="object-cover"
      />
    </div>
  );
}
