import MainVisual from "@/components/main-mainvisual";
import ModernSection from "@/components/main-modern";
import RecommendSection from "@/components/main-recommend";

export default function Home() {
  return (
    <div>
      <MainVisual></MainVisual>
      <ModernSection></ModernSection>
      <RecommendSection></RecommendSection>
    </div>
  );
}
