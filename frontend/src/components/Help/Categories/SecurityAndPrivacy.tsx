import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const SecurityAndPrivacy: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Seguridad y Privacidad</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">Tu seguridad es nuestra prioridad</h4>
          <p className="text-sm text-muted-foreground mb-3">
            En SpendMila, la seguridad de tu información financiera y datos personales es nuestra máxima prioridad. Implementamos medidas
            de seguridad robustas para proteger tu información y garantizar que tengas una experiencia segura al gestionar tus finanzas.
          </p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Medidas de protección de datos</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="encryption">
              <AccordionTrigger className="text-sm font-medium">Encriptación de datos</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Utilizamos encriptación de nivel bancario para proteger tus datos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Encriptación AES-256 para toda la información almacenada</li>
                  <li>Conexiones TLS/SSL para todas las transmisiones de datos</li>
                  <li>Protección de API con tokens de seguridad</li>
                  <li>Información financiera confidencial nunca almacenada en texto claro</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="access-control">
              <AccordionTrigger className="text-sm font-medium">Control de acceso</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Implementamos estrictas políticas de control de acceso:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Autenticación de dos factores (2FA) disponible y recomendada</li>
                  <li>Bloqueo de cuentas después de múltiples intentos fallidos</li>
                  <li>Detección de dispositivos nuevos o sospechosos</li>
                  <li>Cierre automático de sesión por inactividad</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="secure-infrastructure">
              <AccordionTrigger className="text-sm font-medium">Infraestructura segura</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Nuestra infraestructura técnica está diseñada con la seguridad como prioridad:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Servidores alojados en centros de datos certificados</li>
                  <li>Monitoreo continuo de seguridad 24/7</li>
                  <li>Pruebas regulares de penetración por expertos en seguridad</li>
                  <li>Actualizaciones y parches de seguridad instalados inmediatamente</li>
                  <li>Respaldos cifrados y distribuidos geográficamente</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Configuración de seguridad de tu cuenta</h4>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Activar autenticación de dos factores (2FA):</span>
              <ol className="list-decimal list-inside ml-5 mt-2">
                <li>Accede a "Configuración" desde el menú de usuario</li>
                <li>Selecciona "Seguridad"</li>
                <li>Activa "Autenticación de dos factores"</li>
                <li>Sigue las instrucciones para configurar tu aplicación de autenticación (Google Authenticator, Authy, etc.)</li>
              </ol>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Crear una contraseña segura:</span>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Usa al menos 12 caracteres</li>
                <li>Combina letras mayúsculas y minúsculas, números y símbolos</li>
                <li>Evita información personal o palabras comunes</li>
                <li>No reutilices contraseñas de otros servicios</li>
              </ul>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Administrar dispositivos autorizados:</span>
              <ol className="list-decimal list-inside ml-5 mt-2">
                <li>Ve a "Configuración" {">"}  "Seguridad" {">"}  "Dispositivos conectados"</li>
                <li>Revisa la lista de dispositivos que han accedido a tu cuenta</li>
                <li>Elimina cualquier dispositivo que no reconozcas o ya no utilices</li>
              </ol>
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Configurar alertas de seguridad:</span>
              <p className="ml-5 mt-2 text-sm text-muted-foreground">
                Puedes configurar alertas para recibir notificaciones sobre actividades importantes en tu cuenta:
              </p>
              <ul className="list-disc list-inside ml-5 mt-2">
                <li>Inicios de sesión desde nuevos dispositivos</li>
                <li>Cambios en la configuración de seguridad</li>
                <li>Transacciones grandes o inusuales</li>
                <li>Intentos fallidos de inicio de sesión</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Privacidad de tus datos</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="data-collection">
              <AccordionTrigger className="text-sm font-medium">Información que recopilamos</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  SpendMila recopila únicamente la información necesaria para proporcionar nuestro servicio:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Información de registro (nombre, correo electrónico, etc.)</li>
                  <li>Datos financieros que tú proporcionas o autorizas importar</li>
                  <li>Información de uso para mejorar la aplicación</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Para obtener información detallada, consulta nuestra <a href="/privacy-policy" className="text-primary hover:underline">Política de Privacidad</a> completa.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-use">
              <AccordionTrigger className="text-sm font-medium">Cómo utilizamos tus datos</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Utilizamos tus datos exclusivamente para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Personalizar tu experiencia en la aplicación</li>
                  <li>Analizar tendencias y patrones de gasto (siempre de forma anonimizada)</li>
                  <li>Cumplir con requisitos legales y regulatorios</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md text-sm text-blue-700 dark:text-blue-400">
                  <strong>Compromiso:</strong> Nunca vendemos ni compartimos tus datos personales con terceros para fines publicitarios.
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-control">
              <AccordionTrigger className="text-sm font-medium">Control sobre tus datos</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Tú mantienes control total sobre tus datos en SpendMila:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Puedes acceder y descargar tus datos en cualquier momento</li>
                  <li>Tienes derecho a solicitar la eliminación de tu cuenta y datos</li>
                  <li>Puedes ajustar tus preferencias de privacidad en la configuración</li>
                  <li>Controlas qué cuentas se conectan y qué datos se importan</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Para gestionar tus datos, ve a "Configuración" {">"}  "Privacidad y Datos".
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Mejores prácticas de seguridad</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Recomendamos estas prácticas para mantener tu cuenta segura:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li className="pl-2">
              <span className="font-medium text-foreground">Mantente alerta:</span> Nunca compartas tus credenciales de inicio de sesión. SpendMila nunca te solicitará tu contraseña por correo electrónico o teléfono.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Actualiza regularmente:</span> Mantente al día con las últimas versiones de la aplicación y tu navegador.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Usa redes seguras:</span> Evita acceder a tu cuenta desde redes Wi-Fi públicas o no seguras.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Revisa regularmente:</span> Monitorea tus transacciones y actividad de cuenta con frecuencia.
            </li>
            <li className="pl-2">
              <span className="font-medium text-foreground">Cierra sesión:</span> Siempre cierra sesión cuando uses un dispositivo compartido o público.
            </li>
          </ul>
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Aviso de seguridad:</strong> Si sospechas que tu cuenta ha sido comprometida, cambia tu contraseña inmediatamente y contacta a nuestro equipo de soporte a través de <a href="mailto:security@spendmila.com" className="text-primary hover:underline">security@spendmila.com</a>.
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Preguntas comunes sobre seguridad</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="secure-data">
              <AccordionTrigger className="text-sm font-medium">¿Es seguro conectar mis cuentas bancarias?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Sí, SpendMila utiliza tecnología de cifrado bancario y conexiones de solo lectura para conectar tus cuentas. No almacenamos tus credenciales bancarias y utilizamos servicios de agregación financiera certificados y seguros para acceder a tus datos. Nunca tenemos acceso para realizar transacciones en tus cuentas.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="delete-account">
              <AccordionTrigger className="text-sm font-medium">¿Cómo puedo eliminar mi cuenta y mis datos?</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Accede a "Configuración" desde el menú de usuario</li>
                  <li>Desplázate hasta el final de la página</li>
                  <li>Selecciona "Eliminar mi cuenta"</li>
                  <li>Sigue las instrucciones para confirmar la eliminación</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  Cuando eliminas tu cuenta, todos tus datos personales se borran permanentemente de nuestros servidores en un plazo de 30 días, de acuerdo con nuestra política de retención de datos.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-breach">
              <AccordionTrigger className="text-sm font-medium">¿Qué ocurre si hay una violación de datos?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Tomamos medidas exhaustivas para prevenir violaciones de datos. Sin embargo, en el improbable caso de que ocurra:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-2">
                  <li>Te notificaremos inmediatamente sobre el incidente</li>
                  <li>Te informaremos qué datos podrían haber sido afectados</li>
                  <li>Te proporcionaremos pasos claros sobre qué hacer</li>
                  <li>Colaboraremos con las autoridades competentes</li>
                  <li>Implementaremos medidas adicionales para prevenir incidentes futuros</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SecurityAndPrivacy;