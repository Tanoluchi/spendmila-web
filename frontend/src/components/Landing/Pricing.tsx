import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import CatMascot from './CatMascot';

interface PlanFeature {
  text: string;
  available: boolean;
}

interface PricingPlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  isPopular = false 
}) => {
  return (
    <div className={`
      flex flex-col bg-white rounded-lg border 
      ${isPopular ? 'border-purple shadow-lg' : 'border-gray-200'} 
      p-6 transition-transform hover:-translate-y-1 duration-300
      dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30
    `}>
      {isPopular && (
        <div className="mb-4 -mt-6 -mx-6 px-6 py-2 bg-purple text-white text-center text-sm rounded-t-lg dark:bg-purple-dark">
          Most Popular
        </div>
      )}
      
      <div className="flex items-center mb-4">
        {isPopular && <CatMascot size="sm" className="mr-2" />}
        <h3 className="text-xl font-bold dark:text-white">{name}</h3>
      </div>
      
      <div className="mb-4">
        <span className="text-3xl font-bold dark:text-white">{price}</span>
        <span className="text-gray-500 dark:text-gray-400">/{period}</span>
      </div>
      
      <p className="text-gray-600 mb-6 dark:text-gray-300">{description}</p>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className={`flex-shrink-0 w-5 h-5 mr-2 rounded-full flex items-center justify-center ${feature.available ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                {feature.available && <Check size={14} />}
              </span>
              <span className={feature.available ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className={isPopular ? 'bg-purple hover:bg-purple-dark dark:bg-purple-dark dark:hover:bg-purple' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'}
        variant={isPopular ? 'default' : 'outline'}
        size="lg"
      >
        Get Started
      </Button>
    </div>
  );
};

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for beginners who want to track their basic finances.",
      features: [
        { text: "Expense tracking", available: true },
        { text: "Monthly budget", available: true },
        { text: "Basic reports", available: true },
        { text: "Up to 2 accounts", available: true },
        { text: "Bank synchronization", available: false },
        { text: "Investment tracking", available: false },
        { text: "Custom categories", available: false },
        { text: "Priority support", available: false },
      ],
      isPopular: false
    },
    {
      name: "Basic",
      price: "$5.99",
      period: "month",
      description: "Great for individuals who want to take their finances seriously.",
      features: [
        { text: "Expense tracking", available: true },
        { text: "Monthly budget", available: true },
        { text: "Advanced reports", available: true },
        { text: "Up to 5 accounts", available: true },
        { text: "Bank synchronization", available: true },
        { text: "Investment tracking", available: false },
        { text: "Custom categories", available: true },
        { text: "Priority support", available: false },
      ],
      isPopular: true
    },
    {
      name: "Pro",
      price: "$12.99",
      period: "month",
      description: "For power users who want complete control over their finances.",
      features: [
        { text: "Expense tracking", available: true },
        { text: "Monthly budget", available: true },
        { text: "Advanced reports", available: true },
        { text: "Unlimited accounts", available: true },
        { text: "Bank synchronization", available: true },
        { text: "Investment tracking", available: true },
        { text: "Custom categories", available: true },
        { text: "Priority support", available: true },
      ],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-6 dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Choose the Plan That Fits Your <span className="text-purple">Needs</span></h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Whether you're just starting out or managing complex finances, we have a plan for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
