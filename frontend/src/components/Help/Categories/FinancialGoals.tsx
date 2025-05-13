import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const FinancialGoals: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Metas Financieras</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">¿Por qué establecer metas financieras?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Las metas financieras te dan dirección y propósito a tus finanzas. Te ayudan a trabajar hacia objetivos específicos, 
            ya sea ahorrar para unas vacaciones, una entrada para una casa, la educación de tus hijos o tu jubilación.
          </p>
          <img 
            src="/images/help/goals-overview.png" 
            alt="Ejemplo de metas financieras" 
            className="rounded-lg border shadow-sm w-full"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Crear una nueva meta financiera</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Accede a la sección de metas:</span> Desde el menú de navegación, selecciona "Metas".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Añade una nueva meta:</span> Haz clic en el botón "Añadir meta".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Define tu meta:</span>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Nombre (ej. "Fondo de emergencia", "Vacaciones en Italia")</li>
                <li>Monto objetivo (la cantidad total que deseas ahorrar)</li>
                <li>Monto inicial (si ya tienes algo ahorrado)</li>
                <li>Fecha objetivo (para cuando quieres alcanzar la meta)</li>
                <li>Prioridad (baja, media, alta)</li>
                <li>Icono y color (opcional, para personalizar)</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Guarda tu meta:</span> Haz clic en "Guardar".
            </li>
          </ol>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Tipos de metas financieras</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="short-term">
              <AccordionTrigger className="text-sm font-medium">Metas a corto plazo (menos de 1 año)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Son objetivos financieros que planeas alcanzar en menos de un año:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Fondo para emergencias (3-6 meses de gastos)</li>
                  <li>Vacaciones</li>
                  <li>Compras importantes (electrónicos, muebles)</li>
                  <li>Impuestos o deudas a corto plazo</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Para estas metas, SpendMila recomienda mantener los fondos en cuentas de fácil acceso como cuentas de ahorro.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="medium-term">
              <AccordionTrigger className="text-sm font-medium">Metas a mediano plazo (1-5 años)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Son objetivos que requieren un horizonte de planificación más amplio:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Entrada para una casa</li>
                  <li>Compra de un vehículo</li>
                  <li>Pago de estudios</li>
                  <li>Inicio de un negocio</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Para estas metas, considera opciones como depósitos a plazo fijo o fondos de inversión conservadores.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="long-term">
              <AccordionTrigger className="text-sm font-medium">Metas a largo plazo (más de 5 años)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Son objetivos que requieren años de planificación y ahorro consistente:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Jubilación</li>
                  <li>Educación universitaria de los hijos</li>
                  <li>Compra de una segunda propiedad</li>
                  <li>Independencia financiera</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Para estas metas, SpendMila sugiere considerar inversiones con mayor potencial de rendimiento, como fondos mutuos o ETFs.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Seguimiento de metas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila te muestra automáticamente tu progreso hacia cada meta con barras de progreso visuales y 
            cálculos que te indican:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Progreso actual:</span> El porcentaje completado hacia tu meta.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Monto ahorrado:</span> Cuánto has ahorrado hasta el momento.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Monto restante:</span> Cuánto te falta por ahorrar.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Tiempo restante:</span> Cuánto tiempo queda hasta tu fecha objetivo.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Monto mensual recomendado:</span> Cuánto deberías ahorrar cada mes para alcanzar tu meta a tiempo.
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Agregar fondos a una meta</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Ve a la página de <strong>Metas</strong></li>
            <li>Encuentra la meta a la que deseas agregar fondos</li>
            <li>Haz clic en el botón <strong>Añadir fondos</strong></li>
            <li>Ingresa el monto que deseas agregar</li>
            <li>Selecciona la cuenta de origen (opcional)</li>
            <li>Haz clic en <strong>Guardar</strong></li>
          </ol>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-400">
            <strong>Consejo:</strong> Considera configurar transferencias automáticas regulares hacia tus metas más importantes para asegurar que las cumplas a tiempo.
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Consejos para establecer metas efectivas</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Sé específico:</span> "Ahorrar $10,000 para un viaje a Japón" es mejor que "Ahorrar para vacaciones".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Establece metas SMART:</span> Específicas, Medibles, Alcanzables, Relevantes y con Tiempo definido.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Prioriza tus metas:</span> No todas las metas tienen la misma importancia. Enfócate primero en las esenciales.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Divide metas grandes:</span> Si una meta es muy grande, divídela en submetas más pequeñas y manejables.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Celebra tus logros:</span> Reconoce y celebra cuando alcances hitos importantes en tus metas.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Impacto en tus finanzas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Las metas financieras en SpendMila se integran completamente con el resto de tus finanzas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Conexión con presupuestos:</span> Puedes crear categorías de presupuesto específicas para tus metas.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Registro de contribuciones:</span> Cada contribución a una meta se registra como una transacción, manteniendo un historial detallado.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Análisis de progreso:</span> Los informes financieros incluyen el progreso de tus metas para una visión completa de tu salud financiera.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Notificaciones:</span> Recibe recordatorios para realizar contribuciones y alertas cuando te acercas a la fecha límite.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoals;