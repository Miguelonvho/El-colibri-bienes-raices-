import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Properties from "@/components/landing/Properties";
import About from "@/components/landing/About";
import WhyUs from "@/components/landing/WhyUs";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import ContactCTA from "@/components/landing/ContactCTA";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import Footer from "@/components/landing/Footer";
import { SECCIONES } from "@/config/secciones";

export default function Index() {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />
      <main>
        <Hero />
        <Properties />
        {SECCIONES.nosotros && <About />}
        {SECCIONES.porQueElegirnos && <WhyUs />}
        {SECCIONES.testimonios && <Testimonials />}
        {SECCIONES.preguntas && <FAQ />}
        {SECCIONES.contacto && <ContactCTA />}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
