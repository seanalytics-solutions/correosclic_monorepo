'use client';

import { Plantilla } from '@/components/plantilla';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
export default function PoliticasDePrivacidad() {
  return (
    <Plantilla>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          AVISO DE <span className="text-pink-500">PRIVACIDAD</span>
        </h1>

        <Tabs defaultValue="comprador" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="comprador">Comprador</TabsTrigger>
            <TabsTrigger value="vendedor">Vendedor</TabsTrigger>
          </TabsList>

          {/* Aviso de Privacidad - Comprador */}
          <TabsContent value="comprador">
            <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
              <p>
                De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, <strong>Correos Click</strong> pone a su disposición el siguiente aviso de privacidad.
              </p>

              <p>
                <strong>Correos Click</strong>, es responsable del uso y protección de sus datos personales, en este sentido y atendiendo las obligaciones legales establecidas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, a través de este instrumento se informa a los titulares de los datos, la información que de ellos se recaba y los fines que se les darán a dicha información.
              </p>

              <p>
                Además de lo anterior, informamos a usted que Correos Click, tiene su domicilio ubicado en: <em>[Domicilio por definir]</em>.
              </p>

              <p>
                Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades, las cuales son necesarias para concretar nuestra relación con usted, así como para atender los servicios y/o pedidos que solicite:
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Envíos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Servicio de Envío:</strong> El envío de su paquete se realizará utilizando el servicio estándar de Mexpost, conforme a lo establecido en el Manual de Procedimientos del Servicio Mexpost.
                </li>
                <li>
                  <strong>Costo del Envío:</strong> El costo del envío será el establecido para el servicio estándar de mensajería y paquetería de Mexpost, de acuerdo con el ejercicio fiscal vigente.
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Comisión por Venta</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Usuarios Vendedores Generales:</strong> Por el uso de la plataforma, "CorreosClic" cobrará una comisión del 5% sobre el valor del producto que comercialice.
                </li>
                <li>
                  <strong>Usuarios Vendedores en Zonas de Alta y Muy Alta Marginación Inscritos en Programas Sociales del Gobierno:</strong> Si usted es un vendedor residente en zonas de alta o muy alta marginación, inscrito en los padrones productivos de Programas Sociales del Gobierno Federal, Estatal o Municipal, y cuenta con un convenio de colaboración con el Servicio Postal Mexicano, quedará exento del pago de la comisión por el uso de la plataforma.
                </li>
                <li>
                  <strong>Usuarios Compradores:</strong> Se cobrará una comisión del 5% en el caso de mercancías generales y del 10% en el caso de mercancías ofrecidas por vendedores residentes en zonas de alta o muy alta marginación inscritas en programas sociales del Gobierno, sobre el valor del producto adquirido.
                </li>
              </ul>

              <p className="bg-gray-100 p-4 rounded-lg">
                <strong>Importante:</strong> Todas las tarifas y precios en la plataforma ya incluyen el IVA (Impuesto al Valor Agregado).
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos Personales Recabados</h2>
              <p>Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de la vivienda</li>
                <li>Fecha de nacimiento</li>
                <li>Código postal</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos Personales Sensibles</h2>
              <p>
                Además de estos datos personales, se hará uso de datos personales sensibles, para lo cual necesitaremos su consentimiento y autorización expresa para utilizarlos. Dicha autorización deberá otorgarla vía correo electrónico a la dirección <a href="mailto:contacto@correodemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correodemexico.gob.mx</a>, manifestando mediante un escrito libre firmado por el titular de los datos personales sensibles, donde declare haber leído el aviso de privacidad y estar de acuerdo con el uso que se hará de sus datos personales sensibles.
              </p>

              <p>Los datos personales sensibles que se recabarán son los siguientes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de la vivienda</li>
                <li>Fecha de nacimiento</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Protección de Datos</h2>
              <p>
                Por otra parte, informamos a usted, que sus datos personales no serán compartidos con ninguna autoridad, empresa, organización o persona distintas a nosotros y serán utilizados exclusivamente para los fines señalados.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Derechos ARCO</h2>
              <p>
                Usted tiene en todo momento el derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>). De igual manera, tiene derecho a que su información se elimine de nuestro registro o base de datos cuando considere que la misma no está siendo utilizada adecuadamente (<strong>Cancelación</strong>); así como también a oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>). Estos derechos se conocen como derechos ARCO.
              </p>

              <p>
                Para el ejercicio de cualquiera de los derechos ARCO, se deberá presentar la solicitud respectiva a través del siguiente correo electrónico: <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a>
              </p>

              <p>La solicitud del ejercicio de estos derechos debe contener la siguiente información:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre del solicitante</li>
                <li>Teléfono del solicitante</li>
                <li>Contenido o motivo de la solicitud</li>
              </ul>

              <p>
                La respuesta a la solicitud se dará en un plazo de 15 días a partir de la recepción de la solicitud y se comunicará vía correo electrónico.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos de Contacto</h2>
              <p>Los datos de contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO, son los siguientes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>CAC:</strong> Centro de Atención a Clientes</li>
                <li><strong>Domicilio:</strong> Oficinas de Correos de México ubicadas en Vicente García Torres No. 235, El Rosedal, C.P. 04330, Alcaldía Coyoacán, Ciudad de México.</li>
                <li><strong>Correo electrónico:</strong> <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a></li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Revocación del Consentimiento</h2>
              <p>
                Cabe mencionar, que en cualquier momento usted puede revocar su consentimiento para el uso de sus datos personales. Del mismo modo, usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Así mismo, usted deberá considerar que para ciertos fines la revocación de su consentimiento implicará que no podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.
              </p>

              <p>
                Para revocar el consentimiento que usted otorga en este acto o para limitar su divulgación, se deberá presentar la solicitud respectiva a través del siguiente correo electrónico: <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a>
              </p>

              <p>Estas solicitudes deberán contener la siguiente información:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre del solicitante</li>
                <li>Teléfono del solicitante</li>
                <li>Contenido o motivo de la solicitud</li>
              </ul>

              <p>
                La respuesta a la solicitud se dará en un plazo de 15 días a partir de la recepción de la solicitud y se comunicará vía correo electrónico.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cambios al Aviso de Privacidad</h2>
              <p>
                En caso de cambios en nuestro modelo de negocio, o por otras causas, nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, sin embargo, usted puede solicitar información sobre si el mismo ha sufrido algún cambio a través del siguiente correo electrónico: <a href="mailto:contactocc@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contactocc@correosdemexico.gob.mx</a>
              </p>
            </div>
          </TabsContent>

          {/* Aviso de Privacidad - Vendedor */}
          <TabsContent value="vendedor">
            <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
              <p>
                De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, <strong>Correos Click</strong> pone a su disposición el siguiente aviso de privacidad.
              </p>

              <p>
                <strong>Correos Click</strong>, es responsable del uso y protección de sus datos personales, en este sentido y atendiendo las obligaciones legales establecidas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, a través de este instrumento se informa a los titulares de los datos, la información que de ellos se recaba y los fines que se les darán a dicha información.
              </p>

              <p>
                Además de lo anterior, informamos a usted que Correos Click, tiene su domicilio ubicado en: <em>[Domicilio por definir]</em>.
              </p>

              <p>
                Los datos personales que recabamos de usted serán utilizados para las siguientes finalidades, las cuales son necesarias para concretar nuestra relación con usted, así como para atender los servicios y/o pedidos que solicite:
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Envíos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Servicio de Envío:</strong> El envío de su paquete se realizará utilizando el servicio estándar de Mexpost, conforme a lo establecido en el Manual de Procedimientos del Servicio Mexpost.
                </li>
                <li>
                  <strong>Costo del Envío:</strong> El costo del envío será el establecido para el servicio estándar de mensajería y paquetería de Mexpost, de acuerdo con el ejercicio fiscal vigente.
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Comisión por Venta</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Usuarios Vendedores Generales:</strong> Por el uso de la plataforma, "CorreosClic" cobrará una comisión del 5% sobre el valor del producto que comercialice.
                </li>
                <li>
                  <strong>Usuarios Vendedores en Zonas de Alta y Muy Alta Marginación Inscritos en Programas Sociales del Gobierno:</strong> Si usted es un vendedor residente en zonas de alta o muy alta marginación, inscrito en los padrones productivos de Programas Sociales del Gobierno Federal, Estatal o Municipal, y cuenta con un convenio de colaboración con el Servicio Postal Mexicano, quedará exento del pago de la comisión por el uso de la plataforma.
                </li>
                <li>
                  <strong>Usuarios Compradores:</strong> Se cobrará una comisión del 5% en el caso de mercancías generales y del 10% en el caso de mercancías ofrecidas por vendedores residentes en zonas de alta o muy alta marginación inscritas en programas sociales del Gobierno, sobre el valor del producto adquirido.
                </li>
              </ul>

              <p className="bg-gray-100 p-4 rounded-lg">
                <strong>Importante:</strong> Todas las tarifas y precios en la plataforma ya incluyen el IVA (Impuesto al Valor Agregado).
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos Personales Recabados</h2>
              <p>Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Nombre del banco</li>
                <li>R.F.C con Homoclave</li>
                <li>Domicilio Fiscal</li>
                <li>Cuenta bancaria</li>
                <li>Número de teléfono</li>
                <li>Dirección de la vivienda</li>
                <li>Fecha de nacimiento</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos Personales Sensibles</h2>
              <p>
                Además de estos datos personales, se hará uso de datos personales sensibles, para lo cual necesitaremos su consentimiento y autorización expresa para utilizarlos. Dicha autorización deberá otorgarla vía correo electrónico a la dirección <a href="mailto:contacto@correodemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correodemexico.gob.mx</a>, manifestando mediante un escrito libre firmado por el titular de los datos personales sensibles, donde declare haber leído el aviso de privacidad y estar de acuerdo con el uso que se hará de sus datos personales sensibles.
              </p>

              <p>Los datos personales sensibles que se recabarán son los siguientes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Nombre del banco</li>
                <li>R.F.C con Homoclave</li>
                <li>Domicilio Fiscal</li>
                <li>Cuenta bancaria</li>
                <li>Número de teléfono</li>
                <li>Dirección de la vivienda</li>
                <li>Fecha de nacimiento</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Protección de Datos</h2>
              <p>
                Por otra parte, informamos a usted, que sus datos personales no serán compartidos con ninguna autoridad, empresa, organización o persona distintas a nosotros y serán utilizados exclusivamente para los fines señalados.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Derechos ARCO</h2>
              <p>
                Usted tiene en todo momento el derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>). De igual manera, tiene derecho a que su información se elimine de nuestro registro o base de datos cuando considere que la misma no está siendo utilizada adecuadamente (<strong>Cancelación</strong>); así como también a oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>). Estos derechos se conocen como derechos ARCO.
              </p>

              <p>
                Para el ejercicio de cualquiera de los derechos ARCO, se deberá presentar la solicitud respectiva a través del siguiente correo electrónico: <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a>
              </p>

              <p>La solicitud del ejercicio de estos derechos debe contener la siguiente información:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre del solicitante</li>
                <li>Teléfono del solicitante</li>
                <li>Contenido o motivo de la solicitud</li>
              </ul>

              <p>
                La respuesta a la solicitud se dará en un plazo de 15 días a partir de la recepción de la solicitud y se comunicará vía correo electrónico.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Datos de Contacto</h2>
              <p>Los datos de contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO, son los siguientes:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>CAC:</strong> Centro de Atención a Clientes</li>
                <li><strong>Domicilio:</strong> Oficinas de Correos de México ubicadas en Vicente García Torres No. 235, El Rosedal, C.P. 04330, Alcaldía Coyoacán, Ciudad de México.</li>
                <li><strong>Correo electrónico:</strong> <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a></li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Revocación del Consentimiento</h2>
              <p>
                Cabe mencionar, que en cualquier momento usted puede revocar su consentimiento para el uso de sus datos personales. Del mismo modo, usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Así mismo, usted deberá considerar que para ciertos fines la revocación de su consentimiento implicará que no podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.
              </p>

              <p>
                Para revocar el consentimiento que usted otorga en este acto o para limitar su divulgación, se deberá presentar la solicitud respectiva a través del siguiente correo electrónico: <a href="mailto:contacto@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contacto@correosdemexico.gob.mx</a>
              </p>

              <p>Estas solicitudes deberán contener la siguiente información:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre del solicitante</li>
                <li>Teléfono del solicitante</li>
                <li>Contenido o motivo de la solicitud</li>
              </ul>

              <p>
                La respuesta a la solicitud se dará en un plazo de 15 días a partir de la recepción de la solicitud y se comunicará vía correo electrónico.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cambios al Aviso de Privacidad</h2>
              <p>
                En caso de cambios en nuestro modelo de negocio, o por otras causas, nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, sin embargo, usted puede solicitar información sobre si el mismo ha sufrido algún cambio a través del siguiente correo electrónico: <a href="mailto:contactocc@correosdemexico.gob.mx" className="text-pink-500 hover:underline">contactocc@correosdemexico.gob.mx</a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Plantilla>
  );
}
