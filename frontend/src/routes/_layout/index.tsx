import React from 'react';
import Header from '@/components/Landing/Header';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import Pricing from '@/components/Landing/Pricing';
import Benefits from '@/components/Landing/Benefits';
import Footer from '@/components/Landing/Footer';

import { createFileRoute } from "@tanstack/react-router"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/_layout/")({
  component: Index,
})

export default Index;
