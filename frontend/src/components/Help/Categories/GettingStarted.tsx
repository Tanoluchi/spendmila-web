import React from 'react';

const GettingStarted: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Introducción a SpendMila</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">Bienvenido a SpendMila</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila es tu herramienta de gestión de finanzas personales diseñada para ayudarte a
            seguir tus gastos, administrar presupuestos, establecer metas financieras y tomar el control
            de tu vida financiera.
          </p>
          <img 
            src="/images/help/dashboard-overview.png" 
            alt="SpendMila Dashboard" 
            className="rounded-lg border shadow-sm w-full"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Primeros pasos</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Configuración inicial:</span> Después de registrarte, 
              configura tu perfil y preferencias de moneda en la página de Configuración.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Añadir cuentas:</span> Crea tus cuentas bancarias y 
              tarjetas para comenzar a hacer seguimiento de tu dinero.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Registrar transacciones:</span> Comienza a registrar tus 
              ingresos y gastos para obtener una visión clara de tus finanzas.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Crear presupuestos:</span> Establece presupuestos para 
              diferentes categorías para controlar tus gastos.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Definir metas:</span> Configura metas financieras para 
              ahorrar para eventos importantes o compras futuras.
            </li>
          </ol>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium mb-2 flex items-center text-blue-700 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Consejo para nuevos usuarios
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Recomendamos comenzar configurando tus cuentas y registrando algunas transacciones para familiarizarte con la
            aplicación. Después, explora la sección de presupuestos para establecer límites de gastos.
          </p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Navegación por la aplicación</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila está organizada en secciones principales, accesibles desde el menú de navegación:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Dashboard:</span> Obtén una vista general de tus finanzas.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Cuentas:</span> Gestiona tus cuentas bancarias y tarjetas.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Transacciones:</span> Registra y visualiza tus ingresos y gastos.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Presupuestos:</span> Crea y gestiona tus presupuestos por categorías.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Metas:</span> Establece y haz seguimiento de tus objetivos financieros.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Deudas:</span> Gestiona tus préstamos y estrategias de pago.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Suscripciones:</span> Controla tus pagos recurrentes.
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Video tutoriales</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-background rounded-md p-3">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <p className="text-sm font-medium">Introducción a SpendMila</p>
              <p className="text-xs text-muted-foreground">3:45</p>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <p className="text-sm font-medium">Cómo crear tu primer presupuesto</p>
              <p className="text-xs text-muted-foreground">5:20</p>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
              <p className="text-sm font-medium">Configuración de metas financieras</p>
              <p className="text-xs text-muted-foreground">4:10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;