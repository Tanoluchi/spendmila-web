import React from 'react';
import { Check } from 'lucide-react';
import CatMascot from './CatMascot';

const Benefits: React.FC = () => {
  const testimonials = [
    {
      quote: "SpendMila has completely changed how I manage my finances. I can finally see where my money is going!",
      author: "Alex Johnson",
      role: "Freelancer"
    },
    {
      quote: "The budget tracking feature helped me save for my vacation without even trying. Highly recommend!",
      author: "Morgan Lee",
      role: "Teacher"
    },
    {
      quote: "I've tried many finance apps, but SpendMila is by far the most intuitive and helpful one I've used.",
      author: "Jamie Rivera",
      role: "Small Business Owner"
    }
  ];

  const benefits = [
    "Save more with visual budget tracking",
    "Reduce financial stress with automatic categorization",
    "Achieve your financial goals with milestone tracking",
    "Get personalized insights on spending habits",
    "Make smarter decisions with spending analysis"
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-gray-50 px-6 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Why People <span className="text-purple">Love</span> SpendMila</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Join thousands of users who have transformed their financial habits with our app.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Benefits side */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
            <div className="flex items-center mb-6">
              <CatMascot size="sm" className="mr-3" />
              <h3 className="text-2xl font-bold dark:text-white">Benefits You'll Experience</h3>
            </div>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple text-white dark:bg-purple-dark">
                      <Check size={14} />
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-purple-light rounded-lg p-6 dark:bg-purple/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg dark:text-white">Average user saves</h4>
                <span className="text-2xl font-bold text-purple">$2,400</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our users report saving an average of $2,400 in the first year of using SpendMila for budget tracking.
              </p>
            </div>
          </div>

          {/* Testimonials side */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`
                  bg-white p-6 rounded-lg shadow-sm border border-gray-100
                  ${index === 1 ? 'transform md:translate-x-12' : ''}
                  dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30
                `}
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 dark:text-gray-300">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple to-purple-dark rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Star = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default Benefits;
