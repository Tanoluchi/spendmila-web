import React from 'react';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 overflow-hidden dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 dark:text-white">
              Track expenses <span className="text-purple">effortlessly</span> with SpendMila
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg dark:text-gray-300">
              Let Mila help you manage your finances, track expenses, and reach your savings goals with our easy-to-use app.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="text-base bg-purple hover:bg-purple-dark py-6 px-8 dark:bg-purple-dark dark:hover:bg-purple">
                Start for Free
              </Button>
              <Button variant="outline" className="text-base text-purple border-purple hover:bg-purple hover:text-white py-6 px-8 dark:text-purple dark:border-purple dark:hover:bg-purple-dark">
                See How it Works
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-purple-light rounded-full w-64 h-64 md:w-80 md:h-80 flex items-center justify-center dark:bg-purple/20">
                <img src="/assets/images/logo.png" alt="SpendMila Logo" className="w-20 h-20 z-10 animate-float" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-8 bg-purple/10 rounded-full w-40 h-40 z-0 dark:bg-purple/30"></div>
              <div className="absolute -top-4 -left-4 bg-purple/20 rounded-full w-20 h-20 z-0 dark:bg-purple/40"></div>
              
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-4 z-20 dark:bg-gray-800 dark:text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">+</div>
                  <p className="ml-2 font-medium">$328.50 saved this month</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 transform -translate-x-1/3 bg-white shadow-lg rounded-lg p-4 z-20 dark:bg-gray-800 dark:text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center text-white text-sm">🎯</div>
                  <p className="ml-2 font-medium">Goal: 85% complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
