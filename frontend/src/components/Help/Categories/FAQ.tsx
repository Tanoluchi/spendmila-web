import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const FAQ: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Preguntas Frecuentes</h3>
      
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground mb-4">
          Aquí encontrarás respuestas a las preguntas más comunes de los usuarios de SpendMila. Si no encuentras respuesta a tu pregunta, no dudes en contactar a nuestro equipo de soporte.
        </p>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Preguntas generales</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-spendmila">
              <AccordionTrigger className="text-sm font-medium">¿Qué es SpendMila?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  SpendMila es una aplicación de gestión financiera personal diseñada para ayudarte a controlar tus finanzas, hacer seguimiento de tus gastos, crear presupuestos, establecer metas de ahorro, gestionar deudas y monitorear suscripciones recurrentes. Todo desde una interfaz intuitiva y amigable que te permite visualizar claramente tu situación financiera.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="how-much-cost">
              <AccordionTrigger className="text-sm font-medium">¿Cuánto cuesta usar SpendMila?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  SpendMila ofrece un plan gratuito que incluye funcionalidades básicas como el seguimiento de gastos, presupuestos simples y gestión de cuentas. Para acceder a funciones avanzadas como análisis detallados, sincronización con cuentas bancarias, respaldos automáticos y asistencia prioritaria, ofrecemos un plan de suscripción premium a $5.99 USD mensuales o $49.99 USD anuales (con un ahorro del 30%).
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-security">
              <AccordionTrigger className="text-sm font-medium">¿Cómo protegen mis datos financieros?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Tu seguridad es nuestra prioridad. Utilizamos encriptación de nivel bancario (AES-256), conexiones seguras (SSL/TLS) y autenticación de dos factores para proteger tus datos. Nunca almacenamos tus credenciales bancarias y utilizamos servicios de agregación financiera certificados para las conexiones con bancos. Puedes consultar más detalles en nuestra sección de Seguridad y Privacidad.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="devices-available">
              <AccordionTrigger className="text-sm font-medium">¿En qué dispositivos puedo usar SpendMila?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  SpendMila está disponible como aplicación web accesible desde cualquier navegador moderno, así como aplicaciones nativas para iOS y Android que puedes descargar desde App Store y Google Play respectivamente. Todos tus datos se sincronizan automáticamente entre dispositivos para que puedas acceder a tu información financiera donde y cuando lo necesites.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Cuentas y transacciones</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="add-account">
              <AccordionTrigger className="text-sm font-medium">¿Cómo añado una cuenta bancaria?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Para añadir una cuenta bancaria, ve a la sección "Cuentas" y haz clic en "Añadir cuenta". Puedes elegir entre añadir manualmente (ingresando nombre, tipo de cuenta y saldo) o conectar directamente con tu banco (disponible en el plan premium). Si decides conectar con tu banco, serás guiado a través de un proceso seguro para autorizar la conexión, que permitirá importar automáticamente transacciones y saldos.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="edit-transaction">
              <AccordionTrigger className="text-sm font-medium">¿Puedo editar o eliminar una transacción?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, puedes editar o eliminar cualquier transacción. En la sección "Transacciones", localiza la transacción que deseas modificar, haz clic en el icono de menú (tres puntos) y selecciona "Editar" o "Eliminar". Al editar, puedes cambiar cualquier detalle como la fecha, monto, categoría o descripción. Para transacciones importadas automáticamente desde conexiones bancarias, tus modificaciones se guardarán solo en SpendMila y no afectarán los registros de tu banco.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="recurring-transactions">
              <AccordionTrigger className="text-sm font-medium">¿Cómo registro transacciones recurrentes?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Para transacciones que ocurren regularmente (como un pago de alquiler o salario), puedes crear una transacción recurrente. Al añadir o editar una transacción, activa la opción "Transacción recurrente" y configura la frecuencia (semanal, mensual, etc.) y la duración (indefinida o hasta una fecha específica). SpendMila creará automáticamente estas transacciones según el calendario establecido, ahorrando tiempo y asegurando que tu registro financiero esté siempre actualizado.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="transaction-categories">
              <AccordionTrigger className="text-sm font-medium">¿Puedo personalizar las categorías de transacciones?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila te permite personalizar completamente el sistema de categorías. Ve a "Configuración" {">"}  "Categorías" para crear, editar o eliminar categorías y subcategorías según tus necesidades. Puedes asignar colores personalizados a cada categoría para facilitar la identificación visual en gráficos e informes. Además, puedes configurar reglas automáticas para asignar categorías a transacciones futuras basadas en patrones de texto en la descripción.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Presupuestos</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="budget-setup">
              <AccordionTrigger className="text-sm font-medium">¿Cómo configuro mi primer presupuesto?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Para crear un presupuesto, ve a la sección "Presupuestos" y haz clic en "Crear presupuesto". Puedes elegir entre un presupuesto mensual general o presupuestos específicos por categoría. Establece el monto límite para cada categoría y el periodo del presupuesto (mensual es lo más común). SpendMila te mostrará automáticamente el progreso de tus gastos en relación con tus límites establecidos y te enviará notificaciones cuando te acerques o superes esos límites.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="budget-adjustments">
              <AccordionTrigger className="text-sm font-medium">¿Puedo ajustar mi presupuesto a mitad de mes?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Por supuesto. Puedes modificar tus presupuestos en cualquier momento. Simplemente ve a la sección "Presupuestos", selecciona el presupuesto que quieres ajustar y haz clic en "Editar". Cualquier cambio que realices se aplicará inmediatamente y SpendMila recalculará tu progreso basándose en los nuevos límites. Esto es útil cuando surgen gastos inesperados o cuando tus circunstancias financieras cambian.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="budget-rollover">
              <AccordionTrigger className="text-sm font-medium">¿Se puede trasladar el saldo no utilizado de un presupuesto al mes siguiente?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila ofrece la función de "rollover" o traslado de saldo. Para activarla, edita tu presupuesto y activa la opción "Trasladar saldo no utilizado". Con esta opción, si gastas menos del límite en un periodo, la diferencia se añadirá automáticamente a tu presupuesto del periodo siguiente. Esta característica es especialmente útil para gastos variables o para ahorrar gradualmente para compras mayores.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Metas financieras</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="goal-tracking">
              <AccordionTrigger className="text-sm font-medium">¿Cómo puedo hacer seguimiento de mis metas de ahorro?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Para hacer seguimiento de tus metas de ahorro, ve a la sección "Metas" y crea una nueva meta especificando el nombre, monto objetivo, fecha límite y opcionalmente una imagen. Puedes registrar depósitos manualmente o vincular una cuenta de ahorro específica para seguimiento automático. SpendMila te mostrará gráficos de progreso, te calculará cuánto necesitas ahorrar periódicamente para alcanzar tu objetivo a tiempo y te enviará recordatorios para mantenerte en camino.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="goal-recommendations">
              <AccordionTrigger className="text-sm font-medium">¿SpendMila ofrece recomendaciones para alcanzar mis metas más rápido?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila analiza tus patrones de gasto e ingresos para ofrecerte recomendaciones personalizadas que te ayuden a alcanzar tus metas más rápido. En la página de detalles de cada meta, encontrarás una sección de "Recomendaciones" que puede incluir sugerencias como: categorías donde podrías reducir gastos, oportunidades para aumentar tus contribuciones basadas en excedentes en otras áreas, o recordatorios para destinar ingresos extra (como bonificaciones) hacia tus metas prioritarias.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="goal-sharing">
              <AccordionTrigger className="text-sm font-medium">¿Puedo compartir una meta con mi pareja o familia?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila permite crear metas compartidas. Al crear o editar una meta, selecciona la opción "Meta compartida" e introduce las direcciones de correo electrónico de las personas con las que quieres compartirla. Cada participante podrá ver el progreso y registrar contribuciones. Esta función es ideal para metas familiares como unas vacaciones, la compra de un auto o el fondo para educación de los hijos. Todos los participantes recibirán notificaciones sobre el progreso y las contribuciones realizadas.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Deudas</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="debt-strategies">
              <AccordionTrigger className="text-sm font-medium">¿Qué estrategias de pago de deudas recomienda SpendMila?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  SpendMila ofrece dos estrategias principales para pago de deudas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2">
                  <li><strong>Método Avalancha:</strong> Prioriza el pago de deudas con mayores tasas de interés primero, minimizando el interés total pagado.</li>
                  <li><strong>Método Bola de Nieve:</strong> Prioriza las deudas más pequeñas primero, generando victorias rápidas y motivación psicológica.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  En la sección "Deudas", puedes usar el "Planificador de pagos" para simular ambas estrategias con tus deudas actuales y ver cuál funcionaría mejor en tu situación específica, considerando factores como montos, tasas de interés y tu capacidad de pago mensual.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="interest-calculation">
              <AccordionTrigger className="text-sm font-medium">¿Cómo calcula SpendMila los intereses de mis deudas?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  SpendMila utiliza algoritmos financieros estándar para calcular los intereses basándose en el tipo de deuda:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2">
                  <li>Para préstamos con pagos fijos (hipotecas, préstamos personales), usamos amortización basada en la tasa de interés anual y el plazo del préstamo.</li>
                  <li>Para tarjetas de crédito, calculamos el interés compuesto basado en el saldo promedio diario y la tasa APR.</li>
                  <li>Para líneas de crédito, aplicamos el interés solo al monto utilizado.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  Puedes ver el desglose detallado de capital e intereses para cada pago en la sección de "Detalles" de cada deuda. Esto te ayuda a entender exactamente cuánto estás pagando en intereses versus el capital de la deuda.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Suscripciones</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subscription-detection">
              <AccordionTrigger className="text-sm font-medium">¿Puede SpendMila detectar automáticamente mis suscripciones?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila puede detectar automáticamente tus suscripciones si tienes tus cuentas bancarias o tarjetas de crédito conectadas (disponible en el plan premium). El sistema analiza tus transacciones recurrentes e identifica patrones que coinciden con servicios de suscripción comunes como Netflix, Spotify, gimnasios, etc. También puede detectar suscripciones menos obvias analizando pagos que ocurren en intervalos regulares por montos similares.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cuando se detecta una posible suscripción, recibirás una notificación para confirmarla y clasificarla adecuadamente.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="subscription-reminders">
              <AccordionTrigger className="text-sm font-medium">¿Puedo recibir recordatorios antes de que se renueven mis suscripciones?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, una de las características más útiles de la sección de Suscripciones es la configuración de recordatorios. Por defecto, SpendMila te enviará notificaciones 3 días antes de la fecha de renovación de cualquier suscripción, pero puedes personalizar este plazo para cada servicio individualmente. 
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Además, para suscripciones con períodos de prueba gratuitos, puedes configurar alertas especiales que te avisen antes de que finalice el período de prueba y comiences a pagar, ayudándote a evitar cargos no deseados.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Soporte</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="contact-support">
              <AccordionTrigger className="text-sm font-medium">¿Cómo puedo contactar al soporte técnico?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Puedes contactar a nuestro equipo de soporte de varias maneras:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2">
                  <li><strong>Chat en vivo:</strong> Disponible directamente en la aplicación haciendo clic en el icono de chat en la esquina inferior derecha.</li>
                  <li><strong>Correo electrónico:</strong> Envía tus consultas a <a href="mailto:soporte@spendmila.com" className="text-primary hover:underline">soporte@spendmila.com</a>.</li>
                  <li><strong>Centro de ayuda:</strong> Busca en nuestra extensa base de conocimientos en <a href="https://ayuda.spendmila.com" className="text-primary hover:underline">ayuda.spendmila.com</a>.</li>
                  <li><strong>Redes sociales:</strong> Envíanos mensajes directos a través de nuestras cuentas oficiales en Twitter o Facebook.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  El tiempo de respuesta promedio es de 24 horas para usuarios gratuitos y 4 horas para usuarios premium.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="feature-request">
              <AccordionTrigger className="text-sm font-medium">¿Puedo solicitar nuevas funciones para SpendMila?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Por supuesto. Valoramos enormemente los comentarios de nuestros usuarios para mejorar SpendMila. Puedes enviar solicitudes de funciones de varias maneras:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2">
                  <li>Desde la aplicación, ve a "Configuración" {">"}  "Comentarios" {">"}  "Sugerir una función".</li>
                  <li>Vota por funciones ya propuestas por otros usuarios en nuestro portal de comentarios.</li>
                  <li>Envía un correo a <a href="mailto:ideas@spendmila.com" className="text-primary hover:underline">ideas@spendmila.com</a>.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Revisamos todas las sugerencias y priorizamos las más solicitadas para futuras actualizaciones. Valoramos tu opinión para hacer de SpendMila la mejor herramienta financiera posible.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;