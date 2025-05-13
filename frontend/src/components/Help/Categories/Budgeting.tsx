import React from 'react';

const Budgeting: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Presupuestos</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">¿Qué son los presupuestos?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Los presupuestos te permiten establecer límites de gasto para diferentes categorías, ayudándote a mantener tus finanzas bajo control y alcanzar tus objetivos de ahorro.
          </p>
          <img 
            src="/images/help/budget-example.png" 
            alt="Ejemplo de presupuesto" 
            className="rounded-lg border shadow-sm w-full"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Creando tu primer presupuesto</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Accede a la sección de presupuestos:</span> Desde el menú de navegación, selecciona "Presupuestos".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Crea un nuevo presupuesto:</span> Haz clic en el botón "Crear presupuesto".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Configura tu presupuesto:</span>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Selecciona un nombre para tu presupuesto (por ejemplo, "Presupuesto mensual")</li>
                <li>Establece un período (mensual, semanal, trimestral o anual)</li>
                <li>Añade categorías y asigna un monto límite a cada una</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Guarda tu presupuesto:</span> Haz clic en "Guardar".
            </li>
          </ol>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Consejos para un presupuesto efectivo</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Sé realista:</span> No establezcas límites imposibles de cumplir.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Prioriza gastos esenciales:</span> Asegúrate de cubrir primero necesidades básicas (vivienda, alimentación, servicios).
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Incluye ahorros:</span> Considera una categoría para ahorros como si fuera un gasto fijo.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Revisa regularmente:</span> Ajusta tu presupuesto según cambios en tus ingresos o gastos.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Usa la regla 50/30/20:</span> Destina 50% a necesidades, 30% a deseos y 20% a ahorros/pago de deudas.
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Seguimiento de presupuestos</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila muestra automáticamente tu progreso en cada categoría presupuestada:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-green-600 dark:text-green-400">Verde:</span> Estás dentro del presupuesto.
            </li>
            <li className="pl-2">
              <span className="font-medium text-yellow-600 dark:text-yellow-400">Amarillo:</span> Te estás acercando al límite (80% o más).
            </li>
            <li className="pl-2">
              <span className="font-medium text-red-600 dark:text-red-400">Rojo:</span> Has superado el presupuesto.
            </li>
          </ul>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-400">
            <strong>Consejo:</strong> Configura notificaciones para recibir alertas cuando estés cerca de alcanzar tus límites de presupuesto.
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Gestión de categorías</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Las categorías te permiten clasificar tus gastos e ingresos para un mejor análisis y planificación financiera:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Categorías predefinidas:</span> SpendMila incluye categorías comunes como Alimentación, Transporte, Entretenimiento, etc.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Categorías personalizadas:</span> Puedes crear tus propias categorías para adaptarlas a tus necesidades particulares.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Subcategorías:</span> Para una clasificación más detallada, puedes crear subcategorías dentro de cada categoría principal.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3 mb-2">Para gestionar tus categorías:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Ve a <strong>Configuración</strong> desde el menú de usuario</li>
            <li>Selecciona <strong>Categorías</strong></li>
            <li>Aquí puedes crear, editar, eliminar y reorganizar tus categorías</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Budgeting;