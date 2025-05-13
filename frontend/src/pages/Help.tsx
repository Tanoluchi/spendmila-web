import { useState } from 'react';
import {
  GettingStarted,
  AccountsAndTransactions,
  Budgeting,
  FinancialGoals,
  DebtManagement,
  SecurityAndPrivacy,
  FAQ,
  Subscription
} from '../components/Help/Categories';

function Help() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Centro de Ayuda</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Contactar Soporte
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-4 sticky top-6">
            <h3 className="text-lg font-medium mb-4">Categorías de Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'getting-started' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('getting-started')}
                >
                  Primeros Pasos
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'accounts' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('accounts')}
                >
                  Cuentas & Transacciones
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'budgeting' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('budgeting')}
                >
                  Presupuestos
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'goals' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('goals')}
                >
                  Metas Financieras
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'debts' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('debts')}
                >
                  Gestión de Deudas
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'subscription' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('subscription')}
                >
                  Suscripciones
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'security' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('security')}
                >
                  Seguridad & Privacidad
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'faq' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('faq')}
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-4">
            {activeCategory === 'getting-started' && <GettingStarted />}
            {activeCategory === 'accounts' && <AccountsAndTransactions />}
            {activeCategory === 'budgeting' && <Budgeting />}
            {activeCategory === 'goals' && <FinancialGoals />}
            {activeCategory === 'debts' && <DebtManagement />}
            {activeCategory === 'subscription' && <Subscription />}
            {activeCategory === 'security' && <SecurityAndPrivacy />}
            {activeCategory === 'faq' && <FAQ />}
            
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h4 className="font-medium mb-2">¿Necesitas más ayuda?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta o problema que puedas tener.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Chat en vivo
                </button>
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Soporte por email
                </button>
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Base de conocimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
