import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import AppHeader from "../../../components/common/AppHeader";

export default function Politicas() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppHeader
        title="Términos y condiciones"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>AVISO DE PRIVACIDAD</Text>

        <Text style={styles.paragraph}>
          De conformidad con lo establecido en la Ley Federal de Protección de
          Datos Personales en Posesión de los Particulares, Correos Click pone a
          su disposición el siguiente aviso de privacidad.
        </Text>

        <Text style={styles.paragraph}>
          Correos Click, es responsable del uso y protección de sus datos
          personales, en este sentido y atendiendo las obligaciones legales
          establecidas en la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares, a través de este instrumento se informa
          a los titulares de los datos, la información que de ellos se recaba y
          los fines que se les darán a dicha información.
        </Text>

        <Text style={styles.paragraph}>
          Además de lo anterior, informamos a usted que Correos Click, tiene su
          domicilio ubicado en: [Domicilio por definir].
        </Text>

        <Text style={styles.paragraph}>
          Los datos personales que recabamos de usted serán utilizados para las
          siguientes finalidades, las cuales son necesarias para concretar
          nuestra relación con usted, así como para atender los servicios y/o
          pedidos que solicite:
        </Text>

        <Text style={styles.important}>
          Importante: Todas las tarifas y precios en la plataforma ya incluyen
          el IVA (Impuesto al Valor Agregado).
        </Text>

        <Text style={styles.paragraph}>
          Para llevar a cabo las finalidades descritas en el presente aviso de
          privacidad, utilizaremos los siguientes datos personales:
        </Text>

        <Text style={styles.paragraph}>
          Además de estos datos personales, se hará uso de datos personales
          sensibles, para lo cual necesitaremos su consentimiento y autorización
          expresa para utilizarlos. Dicha autorización deberá otorgarla vía
          correo electrónico a la dirección{" "}
          <Text style={styles.link}>contacto@correodemexico.gob.mx</Text>,
          manifestando mediante un escrito libre firmado por el titular de los
          datos personales sensibles, donde declare haber leído el aviso de
          privacidad y estar de acuerdo con el uso que se hará de sus datos
          personales sensibles.
        </Text>

        <Text style={styles.paragraph}>
          Los datos personales sensibles que se recabarán son los siguientes:
        </Text>

        <Text style={styles.paragraph}>
          Por otra parte, informamos a usted, que sus datos personales no serán
          compartidos con ninguna autoridad, empresa, organización o persona
          distintas a nosotros y serán utilizados exclusivamente para los fines
          señalados.
        </Text>

        <Text style={styles.sectionTitle}>Derechos ARCO</Text>

        <Text style={styles.paragraph}>
          Usted tiene en todo momento el derecho a conocer qué datos personales
          tenemos de usted, para qué los utilizamos y las condiciones del uso
          que les damos (Acceso). Asimismo, es su derecho solicitar la
          corrección de su información personal en caso de que esté
          desactualizada, sea inexacta o incompleta (Rectificación). De igual
          manera, tiene derecho a que su información se elimine de nuestro
          registro o base de datos cuando considere que la misma no está siendo
          utilizada adecuadamente (Cancelación); así como también a oponerse al
          uso de sus datos personales para fines específicos (Oposición). Estos
          derechos se conocen como derechos ARCO.
        </Text>

        <Text style={styles.paragraph}>
          Para el ejercicio de cualquiera de los derechos ARCO, se deberá
          presentar la solicitud respectiva a través del siguiente correo
          electrónico:{" "}
          <Text style={styles.link}>contacto@correosdemexico.gob.mx</Text>
        </Text>

        <Text style={styles.paragraph}>
          La solicitud del ejercicio de estos derechos debe contener la
          siguiente información:
        </Text>

        <Text style={styles.paragraph}>
          La respuesta a la solicitud se dará en un plazo de 15 días a partir de
          la recepción de la solicitud y se comunicará vía correo electrónico.
        </Text>

        <Text style={styles.paragraph}>
          Los datos de contacto de la persona o departamento de datos
          personales, que está a cargo de dar trámite a las solicitudes de
          derechos ARCO, son los siguientes:
        </Text>

        <Text style={styles.sectionTitle}>Revocación del Consentimiento</Text>

        <Text style={styles.paragraph}>
          Cabe mencionar, que en cualquier momento usted puede revocar su
          consentimiento para el uso de sus datos personales. Del mismo modo,
          usted puede revocar el consentimiento que, en su caso, nos haya
          otorgado para el tratamiento de sus datos personales. Así mismo, usted
          deberá considerar que para ciertos fines la revocación de su
          consentimiento implicará que no podamos seguir prestando el servicio
          que nos solicitó, o la conclusión de su relación con nosotros.
        </Text>

        <Text style={styles.paragraph}>
          Para revocar el consentimiento que usted otorga en este acto o para
          limitar su divulgación, se deberá presentar la solicitud respectiva a
          través del siguiente correo electrónico:{" "}
          <Text style={styles.link}>contacto@correosdemexico.gob.mx</Text>
        </Text>

        <Text style={styles.paragraph}>
          Estas solicitudes deberán contener la siguiente información:
        </Text>

        <Text style={styles.paragraph}>
          La respuesta a la solicitud se dará en un plazo de 15 días a partir de
          la recepción de la solicitud y se comunicará vía correo electrónico.
        </Text>

        <Text style={styles.sectionTitle}>Cambios al Aviso de Privacidad</Text>

        <Text style={styles.paragraph}>
          En caso de cambios en nuestro modelo de negocio, o por otras causas,
          nos comprometemos a mantenerlo informado sobre los cambios que pueda
          sufrir el presente aviso de privacidad, sin embargo, usted puede
          solicitar información sobre si el mismo ha sufrido algún cambio a
          través del siguiente correo electrónico:{" "}
          <Text style={styles.link}>contactocc@correosdemexico.gob.mx</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: moderateScale(20),
    paddingBottom: moderateScale(40),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateScale(20),
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
    color: "#333",
  },
  paragraph: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(15),
    color: "#555",
    textAlign: "justify",
  },
  important: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(15),
    color: "#d9534f",
    fontWeight: "600",
    textAlign: "justify",
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
