import HeroSection from '../components/HeroSection.jsx';
import ProjectsSection from '../components/ProjectsSection.jsx';
import Seo from '../seo/Seo';
import { ORG_SCHEMA } from '../seo/schema';

export default function Home() {
  return (
    <>
      <Seo
        title="VVVA Developer | Premium Residential Plots in Hassan, Karnataka"
        description="VVVA Developer — Hassan's most trusted plot developer since 2015. DTCP & RERA approved residential plots. 500+ families. Starting ₹15 Lakh. Call +91-98456-59193."
        canonical="/"
        schema={ORG_SCHEMA}
      />
      <main>
        <HeroSection />
        <ProjectsSection />
      </main>
    </>
  );
}
