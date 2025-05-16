import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from '@tanstack/react-router';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/assets/images/logo.png" alt="SpendMila Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-purple-dark dark:text-purple">SpendMila</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple">Pricing</a>
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple">Why SpendMila</a>
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" className="text-purple border-purple hover:bg-purple hover:text-white dark:text-purple dark:border-purple dark:hover:bg-purple-dark">Login</Button>
            </Link>
            <Button className="bg-purple hover:bg-purple-dark dark:bg-purple-dark dark:hover:bg-purple">Sign Up</Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ml-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a 
              href="#features" 
              className="block py-2 text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="block py-2 text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#benefits" 
              className="block py-2 text-sm font-medium text-gray-600 hover:text-purple dark:text-gray-300 dark:hover:text-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Why SpendMila
            </a>
            <div className="pt-2 space-y-2">
              <Link to="/login" className="block w-full">
                <Button variant="outline" className="w-full text-purple border-purple hover:bg-purple hover:text-white dark:text-purple dark:border-purple dark:hover:bg-purple-dark">
                  Login
                </Button>
              </Link>
              <Button className="w-full bg-purple hover:bg-purple-dark dark:bg-purple-dark dark:hover:bg-purple">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
