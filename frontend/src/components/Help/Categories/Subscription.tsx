import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const Subscription: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Suscripciones</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">¿Qué son las suscripciones en SpendMila?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            La sección de Suscripciones te permite hacer un seguimiento de todos tus servicios recurrentes (Netflix, Spotify, gimnasio, etc.),
            ayudándote a visualizar cuánto gastas mensualmente en estos servicios y a identificar posibles áreas de ahorro.
          </p>
          <img 
            src="/images/help/subscriptions-overview.png" 
            alt="Panel de suscripciones" 
            className="rounded-lg border shadow-sm w-full"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Beneficios de registrar tus suscripciones</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Visión consolidada:</span> Todas tus suscripciones en un solo lugar.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Control de gastos:</span> Identifica fácilmente cuánto gastas en total en servicios recurrentes.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Recordatorios:</span> Recibe alertas antes de que se procesen los pagos de tus suscripciones.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Detección de suscripciones no utilizadas:</span> Identifica servicios que ya no utilizas y podrías cancelar.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Planificación presupuestaria:</span> Incluye automáticamente tus suscripciones en tu presupuesto mensual.
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Añadir una nueva suscripción</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Accede a la sección de suscripciones:</span> Desde el menú de navegación, selecciona "Suscripciones".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Añade una nueva suscripción:</span> Haz clic en el botón "Añadir suscripción".
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Completa los detalles:</span>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Nombre del servicio (ej. "Netflix", "Gimnasio")</li>
                <li>Categoría (Entretenimiento, Servicios, Salud, etc.)</li>
                <li>Monto mensual</li>
                <li>Frecuencia de pago (mensual, trimestral, anual)</li>
                <li>Fecha de próximo pago</li>
                <li>Cuenta desde la que se realiza el pago</li>
                <li>Notas adicionales (opcional)</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Guarda la suscripción:</span> Haz clic en "Guardar".
            </li>
          </ol>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-400">
            <strong>Consejo:</strong> Algunas suscripciones populares ya están preconfiguradas con sus logotipos y categorías. Puedes buscarlas en el campo de nombre para agilizar la creación.
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Gestionar suscripciones existentes</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="edit-subscription">
              <AccordionTrigger className="text-sm font-medium">Editar una suscripción</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Suscripciones</strong></li>
                  <li>Encuentra la suscripción que deseas modificar</li>
                  <li>Haz clic en el icono de <strong>Editar</strong> (lápiz)</li>
                  <li>Actualiza los detalles necesarios</li>
                  <li>Haz clic en <strong>Guardar</strong> para aplicar los cambios</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  Puedes modificar cualquier aspecto de la suscripción, incluyendo el monto, la frecuencia o la fecha de renovación.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="pause-subscription">
              <AccordionTrigger className="text-sm font-medium">Pausar una suscripción</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Si tienes una suscripción temporalmente pausada (por ejemplo, durante unas vacaciones), puedes marcarla como pausada:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Suscripciones</strong></li>
                  <li>Encuentra la suscripción que deseas pausar</li>
                  <li>Haz clic en el icono de <strong>Menú</strong> (tres puntos)</li>
                  <li>Selecciona <strong>Pausar suscripción</strong></li>
                  <li>Indica la fecha en que planeas reactivarla (opcional)</li>
                  <li>Confirma la acción</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  Las suscripciones pausadas no se contarán en tus gastos recurrentes mientras estén en ese estado.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cancel-subscription">
              <AccordionTrigger className="text-sm font-medium">Cancelar/Eliminar una suscripción</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Cuando ya no necesites seguir una suscripción, puedes eliminarla del sistema:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Suscripciones</strong></li>
                  <li>Encuentra la suscripción que deseas eliminar</li>
                  <li>Haz clic en el icono de <strong>Eliminar</strong> (papelera)</li>
                  <li>Confirma la eliminación</li>
                </ol>
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Importante:</strong> Recuerda que eliminar la suscripción en SpendMila no cancela automáticamente el servicio con el proveedor. Asegúrate de cancelar el servicio directamente con el proveedor antes de eliminarlo de SpendMila.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Registrar pagos de suscripciones</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila ofrece dos formas de registrar los pagos de tus suscripciones:
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="automatic-tracking">
              <AccordionTrigger className="text-sm font-medium">Seguimiento automático</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  SpendMila puede detectar automáticamente los pagos de suscripciones en tus transacciones:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Conecta tus cuentas bancarias o tarjetas a SpendMila</li>
                  <li>Configura la detección automática en la configuración de suscripciones</li>
                  <li>Define patrones de reconocimiento para cada suscripción</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  El sistema identificará automáticamente los pagos y los asociará con la suscripción correspondiente, actualizando la fecha del próximo pago.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="manual-tracking">
              <AccordionTrigger className="text-sm font-medium">Registro manual</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  También puedes registrar manualmente los pagos de suscripciones:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Suscripciones</strong></li>
                  <li>Encuentra la suscripción para la que deseas registrar un pago</li>
                  <li>Haz clic en <strong>Registrar pago</strong></li>
                  <li>Ingresa la fecha y el monto del pago</li>
                  <li>Selecciona la cuenta desde la que se realizó el pago</li>
                  <li>Haz clic en <strong>Guardar</strong></li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  El sistema actualizará automáticamente la fecha del próximo pago basado en la frecuencia configurada.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Análisis de suscripciones</h4>
          <p className="text-sm text-muted-foreground mb-3">
            SpendMila te proporciona herramientas para analizar el impacto de tus suscripciones en tus finanzas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Gasto total en suscripciones:</span> Visualiza cuánto gastas mensual, trimestral y anualmente en todos tus servicios combinados.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Desglose por categorías:</span> Identifica qué tipos de suscripciones consumen más de tu presupuesto.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Historial de pagos:</span> Revisa el historial completo de pagos para cada suscripción.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Calendario de pagos:</span> Visualiza en un calendario cuándo vencen tus diferentes suscripciones a lo largo del mes.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Recomendaciones de ahorro:</span> Recibe sugerencias sobre posibles suscripciones a cancelar o planes alternativos más económicos.
            </li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md text-sm text-green-700 dark:text-green-400">
            <strong>Dato interesante:</strong> El usuario promedio subestima cuánto gasta en suscripciones en aproximadamente un 40%. El seguimiento detallado en SpendMila te ayuda a tener una visión clara y precisa de estos gastos recurrentes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;