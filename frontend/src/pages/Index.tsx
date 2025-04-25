import React from 'react';
import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import Benefits from '../components/Landing/Benefits';
import Footer from '../components/Landing/Footer';

const Index: React.FC = () => {
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

export default Index; 