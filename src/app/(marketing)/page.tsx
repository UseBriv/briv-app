import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { Marquee } from "./_components/Marquee";
import { AiDemo } from "./_components/AiDemo";
import { Bento } from "./_components/Bento";
import { Workflow } from "./_components/Workflow";
import { Pricing } from "./_components/Pricing";
import { FinalCta } from "./_components/FinalCta";
import { Footer } from "./_components/Footer";

export default function MarketingHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <AiDemo />
        <Bento />
        <Workflow />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
