import React from 'react';
import { 
  DollarSign, 
  Settings, 
  Star, 
  CreditCard, 
  Home, 
  MessageSquare 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/30">
      <div className="w-12 h-12 bg-purple-light rounded-lg flex items-center justify-center text-purple mb-4 dark:bg-purple/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <DollarSign size={24} />,
      title: "Budget Tracking",
      description: "Set and monitor your budget with easy-to-follow charts and visual summaries."
    },
    {
      icon: <CreditCard size={24} />,
      title: "Expense Categories",
      description: "Automatically categorize expenses and track spending patterns over time."
    },
    {
      icon: <Star size={24} />,
      title: "Savings Goals",
      description: "Create personalized savings goals and track your progress with customizable milestones."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Bill Reminders",
      description: "Never miss a payment with automatic notifications for upcoming bills."
    },
    {
      icon: <Home size={24} />,
      title: "Financial Insights",
      description: "Get personalized recommendations to improve your financial health."
    },
    {
      icon: <Settings size={24} />,
      title: "Bank Integration",
      description: "Securely connect your accounts for automatic expense tracking and updates."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50 px-6 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Features That Make Money Management <span className="text-purple">Simple</span></h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            SpendMila comes packed with all the tools you need to take control of your finances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
