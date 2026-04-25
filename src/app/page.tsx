import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import SoftAurora from "@/components/ui/SoftAurora";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
        <SoftAurora 
          color1="#00F0FF" 
          color2="#7A5FFF" 
          speed={0.4} 
        />
      </div>
      <div className="w-full h-full flex flex-col gap-12 pb-20 relative z-10">
        <HeroSection />
        <FeaturesSection />
      </div>
    </>
  );
}
