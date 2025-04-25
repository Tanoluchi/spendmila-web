
import React from 'react';
import CatMascot from './CatMascot';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <CatMascot size="sm" className="mr-2" />
              <span className="text-xl font-bold">SpendMila</span>
            </div>
            <p className="text-gray-400 mb-4">
              The purrfect companion for your financial journey. Track, save, and grow your wealth with SpendMila.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-purple">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-purple">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple">Download App</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple">Roadmap</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple">Security</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-purple" />
                <a href="mailto:hello@spendmila.com" className="text-gray-400 hover:text-purple">hello@spendmila.com</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-purple" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-purple">+1 (123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <MessageSquare size={16} className="mr-2 text-purple" />
                <a href="#" className="text-gray-400 hover:text-purple">Live Chat</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} SpendMila. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple">Terms</a>
            <a href="#" className="text-gray-400 hover:text-purple">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-purple">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
