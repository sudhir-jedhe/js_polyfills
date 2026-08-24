// Above-the-fold hero image marked priority to protect LCP.
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Image
        src="/hero.jpg"
        alt="New summer collection"
        width={1600}
        height={900}
        priority
      />

      {/* Below-the-fold: default lazy loading is correct here. */}
      <section>
        <Image src="/feature-1.jpg" alt="Feature one" width={600} height={400} />
        <Image src="/feature-2.jpg" alt="Feature two" width={600} height={400} />
      </section>
    </>
  );
}
