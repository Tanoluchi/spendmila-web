import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';

const AccountsAndTransactions: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Cuentas & Transacciones</h3>
      
      <div className="space-y-6">
        <div className="mb-6">
          <h4 className="font-medium mb-2">Gestión de cuentas</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Las cuentas en SpendMila representan tus cuentas bancarias, tarjetas de crédito, efectivo y otros activos financieros.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="add-account">
              <AccordionTrigger className="text-sm font-medium">¿Cómo añadir una nueva cuenta?</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Dirígete a la página de <strong>Cuentas</strong> desde la barra de navegación</li>
                  <li>Haz clic en el botón <strong>Añadir cuenta</strong> en la esquina superior derecha</li>
                  <li>Completa el formulario con los siguientes datos:
                    <ul className="list-disc list-inside ml-5 mt-2">
                      <li>Nombre de la cuenta (ej. "Cuenta de ahorros")</li>
                      <li>Tipo de cuenta (Corriente, Ahorros, Tarjeta de crédito, etc.)</li>
                      <li>Saldo inicial</li>
                      <li>Moneda</li>
                      <li>Descripción (opcional)</li>
                    </ul>
                  </li>
                  <li>Haz clic en <strong>Guardar</strong> para crear la cuenta</li>
                </ol>
                <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                  <strong>Consejo:</strong> Para mejor organización, usa nombres descriptivos para tus cuentas como "BBVA - Ahorro" o "Tarjeta Santander".
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="edit-account">
              <AccordionTrigger className="text-sm font-medium">¿Cómo editar o eliminar una cuenta?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-3">Para editar una cuenta:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                  <li>Ve a la página de <strong>Cuentas</strong></li>
                  <li>Encuentra la cuenta que deseas modificar</li>
                  <li>Haz clic en el icono de <strong>Editar</strong> (lápiz) junto a la cuenta</li>
                  <li>Actualiza la información necesaria</li>
                  <li>Haz clic en <strong>Guardar</strong> para confirmar los cambios</li>
                </ol>
                
                <p className="text-sm text-muted-foreground mb-3">Para eliminar una cuenta:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Cuentas</strong></li>
                  <li>Encuentra la cuenta que deseas eliminar</li>
                  <li>Haz clic en el icono de <strong>Eliminar</strong> (papelera) junto a la cuenta</li>
                  <li>Confirma la eliminación en el diálogo de confirmación</li>
                </ol>
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md text-sm text-red-700 dark:text-red-400">
                  <strong>Importante:</strong> Al eliminar una cuenta, también se eliminarán todas las transacciones asociadas a ella. Esta acción no se puede deshacer.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Gestión de transacciones</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Las transacciones son el núcleo de SpendMila, representando tus ingresos, gastos y transferencias entre cuentas.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="add-transaction">
              <AccordionTrigger className="text-sm font-medium">¿Cómo registrar una nueva transacción?</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Transacciones</strong> desde la barra de navegación</li>
                  <li>Haz clic en el botón <strong>Añadir transacción</strong></li>
                  <li>Completa el formulario con los siguientes datos:
                    <ul className="list-disc list-inside ml-5 mt-2">
                      <li>Tipo de transacción (Ingreso, Gasto o Transferencia)</li>
                      <li>Monto</li>
                      <li>Fecha</li>
                      <li>Cuenta</li>
                      <li>Categoría</li>
                      <li>Descripción (opcional)</li>
                    </ul>
                  </li>
                  <li>Haz clic en <strong>Guardar</strong> para registrar la transacción</li>
                </ol>
                <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                  <strong>Consejo:</strong> Puedes añadir transacciones también desde la página de <strong>Cuentas</strong> haciendo clic en el botón de acción rápida en cada tarjeta de cuenta.
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="transaction-types">
              <AccordionTrigger className="text-sm font-medium">Tipos de transacciones explicados</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                    <span className="font-medium text-green-700 dark:text-green-400 block mb-1">Ingreso</span>
                    Dinero que entra a tu cuenta (salario, venta, regalo, etc.). Aumenta el saldo de la cuenta seleccionada.
                  </li>
                  <li className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800">
                    <span className="font-medium text-red-700 dark:text-red-400 block mb-1">Gasto</span>
                    Dinero que sale de tu cuenta (compras, facturas, etc.). Disminuye el saldo de la cuenta seleccionada.
                  </li>
                  <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <span className="font-medium text-blue-700 dark:text-blue-400 block mb-1">Transferencia</span>
                    Movimiento de dinero entre tus propias cuentas. Disminuye el saldo de una cuenta y aumenta el de otra.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="edit-transaction">
              <AccordionTrigger className="text-sm font-medium">¿Cómo editar o eliminar transacciones?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-3">Para editar una transacción:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                  <li>Ve a la página de <strong>Transacciones</strong></li>
                  <li>Encuentra la transacción que deseas modificar</li>
                  <li>Haz clic en el icono de <strong>Editar</strong> (lápiz) junto a la transacción</li>
                  <li>Actualiza la información necesaria</li>
                  <li>Haz clic en <strong>Guardar</strong> para confirmar los cambios</li>
                </ol>
                
                <p className="text-sm text-muted-foreground mb-3">Para eliminar una transacción:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Ve a la página de <strong>Transacciones</strong></li>
                  <li>Encuentra la transacción que deseas eliminar</li>
                  <li>Haz clic en el icono de <strong>Eliminar</strong> (papelera) junto a la transacción</li>
                  <li>Confirma la eliminación en el diálogo de confirmación</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AccountsAndTransactions;