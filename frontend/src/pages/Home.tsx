import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../sections/HeroSection";
import WhyAdderSection from "../sections/WhyAdderSection";
import CharactersSection from "../sections/CharactersSection";
import ProcessSection from "../sections/ProcessSection";
import GallerySection from "../sections/GallerySection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Smooth scroll with Lenis
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ticker & ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
    };
  }, []);

  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <WhyAdderSection />
      <CharactersSection />
      <ProcessSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
