import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const DebtManagement: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Gestión de Deudas</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">Control de tus deudas con SpendMila</h4>
          <p className="text-sm text-muted-foreground mb-3">
            La sección de Deudas te permite hacer seguimiento de todos tus préstamos, tarjetas de crédito y otras deudas en un solo lugar, 
            ayudándote a visualizar tu situación financiera completa y a crear estrategias efectivas para liberarte de deudas.
          </p>
          <img 
            src="/images/help/debt-overview.png" 
            alt="Panel de control de deudas" 
            className="rounded-lg border shadow-sm w-full"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Añadir una nueva deuda</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Accede a la sección de deudas:</span> Desde el menú de navegación, selecciona "Deudas".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Añade una nueva deuda:</span> Haz clic en el botón "Añadir deuda".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Completa los detalles:</span>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Nombre de la deuda (ej. "Préstamo hipotecario", "Tarjeta Visa")</li>
                <li>Tipo de deuda (Hipoteca, Préstamo personal, Tarjeta de crédito, etc.)</li>
                <li>Saldo actual (monto que debes actualmente)</li>
                <li>Tasa de interés anual</li>
                <li>Pago mínimo mensual</li>
                <li>Fecha de vencimiento de pagos</li>
                <li>Información adicional (opcional)</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Guarda la deuda:</span> Haz clic en "Guardar".
            </li>
          </ol>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Tipos de deudas que puedes registrar</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="credit-cards">
              <AccordionTrigger className="text-sm font-medium">Tarjetas de crédito</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Registro y seguimiento de todas tus tarjetas de crédito:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Seguimiento del saldo pendiente</li>
                  <li>Cálculo de intereses acumulados</li>
                  <li>Fechas de corte y pago</li>
                  <li>Pago mínimo vs. pago total</li>
                  <li>Límite de crédito y porcentaje de utilización</li>
                </ul>
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Consejo:</strong> Intenta mantener tu utilización de tarjetas por debajo del 30% de tu límite para mantener un buen puntaje crediticio.
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="loans">
              <AccordionTrigger className="text-sm font-medium">Préstamos (hipotecarios, personales, automotrices)</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Seguimiento detallado de todos tus préstamos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Calendario de amortización</li>
                  <li>Desglose de cada pago (capital vs. intereses)</li>
                  <li>Tiempo restante del préstamo</li>
                  <li>Opciones de pago anticipado y su impacto</li>
                  <li>Recordatorios de fechas de pago</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md text-sm text-blue-700 dark:text-blue-400">
                  <strong>Ventaja:</strong> SpendMila te muestra cómo pequeños pagos adicionales pueden reducir significativamente el tiempo y los intereses totales de tu préstamo.
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="personal-debts">
              <AccordionTrigger className="text-sm font-medium">Deudas personales</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Registro de dinero prestado o tomado de amigos y familiares:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Registro de quién te prestó o a quién le prestaste</li>
                  <li>Fechas acordadas de devolución</li>
                  <li>Seguimiento de pagos parciales</li>
                  <li>Notas adicionales sobre los acuerdos</li>
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esto te ayuda a mantener claras tus obligaciones personales y evitar malentendidos con seres queridos.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="other-debts">
              <AccordionTrigger className="text-sm font-medium">Otras deudas</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  SpendMila te permite registrar cualquier otro tipo de deuda:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Préstamos estudiantiles</li>
                  <li>Deudas médicas</li>
                  <li>Impuestos pendientes</li>
                  <li>Planes de pago a comercios</li>
                  <li>Cualquier otro compromiso financiero</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Estrategias para pagar deudas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila te ofrece herramientas para implementar estrategias efectivas de pago de deudas:
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="avalanche">
              <AccordionTrigger className="text-sm font-medium">Método Avalancha</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Este método prioriza el pago de deudas con las tasas de interés más altas primero, mientras se hacen los pagos mínimos en todas las demás deudas.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Beneficio:</strong> Minimiza el interés total pagado y generalmente es la estrategia matemáticamente más eficiente.                            
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ordena tus deudas de mayor a menor tasa de interés</li>
                  <li>Paga el mínimo en todas tus deudas</li>
                  <li>Destina todo el dinero extra a la deuda con la tasa de interés más alta</li>
                  <li>Una vez pagada la primera deuda, pasa todo ese dinero adicional a la siguiente deuda con mayor tasa</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="snowball">
              <AccordionTrigger className="text-sm font-medium">Método Bola de Nieve</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Este método prioriza el pago de las deudas más pequeñas primero, independientemente de la tasa de interés.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Beneficio:</strong> Proporciona victorias rápidas que generan motivación psicológica para continuar pagando deudas.                            
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ordena tus deudas de menor a mayor saldo</li>
                  <li>Paga el mínimo en todas tus deudas</li>
                  <li>Destina todo el dinero extra a la deuda con el saldo más pequeño</li>
                  <li>Una vez pagada la primera deuda, pasa todo ese dinero adicional a la siguiente deuda más pequeña</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="consolidation">
              <AccordionTrigger className="text-sm font-medium">Consolidación de Deudas</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Combinar múltiples deudas en una sola, idealmente con una tasa de interés más baja.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Beneficio:</strong> Simplifica los pagos y potencialmente reduce la tasa de interés.                          
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Préstamos de consolidación</li>
                  <li>Transferencias de saldo a tarjetas con 0% de interés introductorio</li>
                  <li>Líneas de crédito personal</li>
                </ul>
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Precaución:</strong> Asegúrate de entender todas las tarifas y condiciones asociadas con la consolidación de deudas.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Registrar pagos de deudas</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Ve a la página de <strong>Deudas</strong></li>
            <li>Encuentra la deuda a la que deseas registrar un pago</li>
            <li>Haz clic en el botón <strong>Registrar pago</strong></li>
            <li>Ingresa el monto del pago</li>
            <li>Selecciona la fecha del pago</li>
            <li>Selecciona la cuenta desde la que se realizó el pago (opcional)</li>
            <li>Haz clic en <strong>Guardar</strong></li>
          </ol>
          <div className="mt-3 p-3 bg-muted rounded-md text-sm">
            <strong>Nota:</strong> Cada pago registrado actualizará automáticamente el saldo pendiente de la deuda y recalculará tu progreso.
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Análisis de deudas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila proporciona herramientas de análisis para visualizar y comprender mejor tu situación de deudas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Panel de deudas:</span> Visión general de todas tus deudas, con saldos, tasas y fechas de pago.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Gráficos de progreso:</span> Visualización de cómo tus pagos reducen el saldo total a lo largo del tiempo.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Simulador de escenarios:</span> Cómo diferentes estrategias o pagos adicionales afectarán tu plan de pago.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Calculadora de libertad financiera:</span> Estimación de cuándo podrás estar libre de deudas.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            Para acceder a estas herramientas, ve a la página de <strong>Deudas</strong> y selecciona la pestaña <strong>Análisis</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebtManagement;