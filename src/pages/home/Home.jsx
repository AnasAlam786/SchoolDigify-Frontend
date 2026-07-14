import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <LoginModal />

      <Hero />

      <Features />

      <Testimonials />

      <HowItWorks />

      <Pricing />

      <CTA />

      <Footer />
    </div>
  );
}