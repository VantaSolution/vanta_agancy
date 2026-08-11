import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { Intro } from '@/components/public/Intro';
import { Services } from '@/components/public/Services';
import { Capabilities } from '@/components/public/Capabilities';
import { Process } from '@/components/public/Process';
import { Technology } from '@/components/public/Technology';
import { Portfolio } from '@/components/public/Portfolio';
import { About } from '@/components/public/About';
import { CallToAction } from '@/components/public/CallToAction';
import { Contact } from '@/components/public/Contact';
import { Footer } from '@/components/public/Footer';

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Capabilities />
        <Process />
        <Technology />
        <Portfolio />
        <About />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
