import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-12 pb-20">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
