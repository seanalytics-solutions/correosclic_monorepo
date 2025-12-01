import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { fromByteArray } from "base64-js";
import Constants from "expo-constants";
import CheckoutButton from "../../../components/Boton-pago-tariffador/CheckoutButton";

const GuiaFormulario = ({ route, navigation }) => {
  // 🎯 FIX: Se desestructura el objeto 'route.params' para acceder a los datos
  // que fueron pasados desde TarificadorMexpost.
  const { tipoEnvio, costoTotal, detallesCotizacion, profileId } =
    route.params || {};

  // ⚠️ Validación inicial de datos: Si no hay detalles de cotización, se alerta y regresa.
  if (!detallesCotizacion) {
    Alert.alert(
      "Error de datos",
      "No se encontraron los detalles de la cotización. Volviendo al tarifador.",
    );
    navigation.goBack();
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#e91e63" />
    ); // Muestra un spinner mientras regresa
  }

  // Se extraen los datos de la cotización para usarlos en los estados iniciales
  const {
    codigoOrigen,
    codigoDestino,
    paisDestino, // Solo para referencia, el código CP del destinatario no aplica en intl.
    peso,
    alto,
    ancho,
    largo,
    // Puedes extraer más detalles de cotización si los necesitas:
    // pesoFisico, pesoVolumetrico, iva, tarifaSinIVA, etc.
  } = detallesCotizacion;

  // Estados para remitente y destinatario
  const [remitente, setRemitente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      numeroInterior: "",
      asentamiento: "",
      // Usamos el CP de origen de la cotización (que es obligatorio)
      codigoPostal: codigoOrigen || "",
      localidad: "",
      estado: "",
      pais: "México", // El remitente siempre es de México
    },
  });

  const [destinatario, setDestinatario] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      numeroInterior: "",
      asentamiento: "",
      // Usamos el CP de destino de la cotización
      codigoPostal: codigoDestino || "",
      localidad: "",
      estado: "",
      // 🎯 Si es internacional, el país es el de destino; si es nacional, es México.
      pais: tipoEnvio === "Internacional" ? paisDestino : "México",
    },
  });

  const [valorDeclarado, setValorDeclarado] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // --- Funciones de Lógica de Formulario y API ---

  // Validación de campos requeridos (sin cambios)
  const validarCampos = () => {
    // ... (Tu lógica de validación actual es correcta)
    const camposRequeridos = [
      { valor: remitente.nombres, nombre: "Nombres del remitente" },
      { valor: remitente.apellidos, nombre: "Apellidos del remitente" },
      { valor: remitente.telefono, nombre: "Teléfono del remitente" },
      { valor: remitente.direccion.calle, nombre: "Calle del remitente" },
      { valor: remitente.direccion.numero, nombre: "Número del remitente" },
      {
        valor: remitente.direccion.asentamiento,
        nombre: "Colonia del remitente",
      },
      { valor: destinatario.nombres, nombre: "Nombres del destinatario" },
      { valor: destinatario.apellidos, nombre: "Apellidos del destinatario" },
      { valor: destinatario.telefono, nombre: "Teléfono del destinatario" },
      { valor: destinatario.direccion.calle, nombre: "Calle del destinatario" },
      {
        valor: destinatario.direccion.numero,
        nombre: "Número del destinatario",
      },
      {
        valor: destinatario.direccion.asentamiento,
        nombre: "Colonia del destinatario",
      },
    ];

    for (const campo of camposRequeridos) {
      if (!campo.valor || campo.valor.trim() === "") {
        Alert.alert("Campo requerido", `Por favor completa: ${campo.nombre}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    // 🎯 PAYLOAD: Arma el objeto para el backend
    // Se utilizan las variables de estado `alto`, `ancho`, `largo` y `peso` extraídas
    // de `detallesCotizacion` para el envío a la API.

    const paquete = {
      alto_cm: parseFloat(alto),
      ancho_cm: parseFloat(ancho),
      largo_cm: parseFloat(largo),
    };

    const pesoFloat = parseFloat(peso);

    // Se determina el endpoint
    const endpoint =
      tipoEnvio === "Internacional"
        ? `${API_URL}/api/guias/generar-pdf-internacional`
        : `${API_URL}/api/guias/generar-pdf-nacional`;

    const datosGuia = {
      remitente,
      destinatario,
      paquete,
      peso: pesoFloat,
      valorDeclarado: parseFloat(valorDeclarado) || 0,
      // Se agregan datos necesarios para el backend (e.g., para referencia o facturación)
      profileId: profileId,
      costoTotal: costoTotal,
      // Pasa la zona, solo si existe y es nacional, como referencia
      zona:
        tipoEnvio === "Nacional"
          ? detallesCotizacion?.datosEnvio?.zona?.nombre
          : detallesCotizacion?.infoPais?.zona,
    };

    console.log("Datos a enviar:", JSON.stringify(datosGuia, null, 2));

    try {
      if (!API_URL) {
        throw new Error("URL de API no configurada");
      }

      console.log("Enviando request a:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(datosGuia),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      // --- Manejo y Compartición del PDF ---

      const pdfArrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(pdfArrayBuffer);
      const base64data = fromByteArray(uint8Array);

      const fileName = `guia-${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64data, {
        encoding: "base64",
      });

      console.log("PDF guardado en:", fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: "application/pdf" });
      }

      Alert.alert(
        "Éxito 🎉",
        "Guía de envío generada y lista para compartir.",
        [
          { text: "OK", onPress: () => navigation.popToTop() }, // Regresa al inicio o al flujo principal
        ],
      );
    } catch (err) {
      console.error("Error completo:", err);
      Alert.alert(
        "Error",
        err.message ||
          "No se pudo generar el PDF. Verifica tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // El renderInput se mantiene igual
  const renderInput = (
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    maxLength = null,
    required = false,
  ) => (
    <TextInput
      style={styles.input}
      placeholder={`${placeholder}${required ? " *" : ""}`}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      // editable={!loading}
    />
  );

  // Lógica para determinar si el formulario está listo para el envío
  const isFormReady = () => {
    // La misma lógica de campos requeridos de validarCampos
    const camposRequeridos = [
      { valor: remitente.nombres, nombre: "Nombres del remitente" },
      { valor: remitente.apellidos, nombre: "Apellidos del remitente" },
      { valor: remitente.telefono, nombre: "Teléfono del remitente" },
      { valor: remitente.direccion.calle, nombre: "Calle del remitente" },
      { valor: remitente.direccion.numero, nombre: "Número del remitente" },
      {
        valor: remitente.direccion.asentamiento,
        nombre: "Colonia del remitente",
      },
      { valor: destinatario.nombres, nombre: "Nombres del destinatario" },
      { valor: destinatario.apellidos, nombre: "Apellidos del destinatario" },
      { valor: destinatario.telefono, nombre: "Teléfono del destinatario" },
      { valor: destinatario.direccion.calle, nombre: "Calle del destinatario" },
      {
        valor: destinatario.direccion.numero,
        nombre: "Número del destinatario",
      },
      {
        valor: destinatario.direccion.asentamiento,
        nombre: "Colonia del destinatario",
      },
    ];

    // Verifica que todos los campos requeridos tengan un valor no vacío o no solo espacios en blanco
    for (const campo of camposRequeridos) {
      if (!campo.valor || String(campo.valor).trim() === "") {
        return false; // El formulario NO está listo
      }
    }
    return true; // El formulario SÍ está listo
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={[styles.header, { paddingTop: Constants.statusBarHeight }]}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>
              Generar guía de envío{"\n"}
              <Text style={styles.subtitle}>{tipoEnvio} - MEXPOST</Text>
            </Text>
          </View>

          {/* Resumen del envío */}
          <View style={styles.resumenContainer}>
            <Text style={styles.sectionTitle}>Resumen de la compra</Text>
            <View style={styles.resumenGrid}>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Origen</Text>
                <Text style={styles.resumenValue}>{codigoOrigen}</Text>
              </View>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Destino</Text>
                <Text style={styles.resumenValue}>
                  {tipoEnvio === "Nacional" ? codigoDestino : paisDestino}
                </Text>
              </View>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Peso</Text>
                <Text style={styles.resumenValue}>{peso} kg</Text>
              </View>
              <View style={styles.resumenItem}>
                <Text style={styles.resumenLabel}>Dimensiones (L×A×H)</Text>
                <Text style={styles.resumenValue}>
                  {largo}×{ancho}×{alto} cm
                </Text>
              </View>
            </View>
            <View style={styles.costoContainer}>
              <Text style={styles.costoLabel}>Costo total pagado:</Text>
              <Text style={styles.costoValue}>
                {tipoEnvio === "Nacional"
                  ? `MXN $${costoTotal}`
                  : `USD $${costoTotal}`}
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#1e90ff"
            />
            <Text style={styles.infoText}>
              Asegúrate de que la **dirección de origen** corresponda al CP **
              {codigoOrigen}** y la **dirección de destino** a **
              {tipoEnvio === "Nacional" ? codigoDestino : paisDestino}** para
              evitar rechazos.
            </Text>
          </View>

          {/* Formulario Remitente */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Datos del remitente</Text>
            </View>

            {renderInput(
              "Nombres",
              remitente.nombres,
              (v) => setRemitente((r) => ({ ...r, nombres: v })),
              "default",
              null,
              true,
            )}

            {renderInput(
              "Apellidos",
              remitente.apellidos,
              (v) => setRemitente((r) => ({ ...r, apellidos: v })),
              "default",
              null,
              true,
            )}

            {renderInput(
              "Teléfono",
              remitente.telefono,
              (v) => setRemitente((r) => ({ ...r, telefono: v })),
              "phone-pad",
              null,
              true,
            )}

            <View style={styles.subsectionHeader}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.subsectionTitle}>Dirección (Origen)</Text>
            </View>

            {renderInput(
              "Calle",
              remitente.direccion.calle,
              (v) =>
                setRemitente((r) => ({
                  ...r,
                  direccion: { ...r.direccion, calle: v },
                })),
              "default",
              null,
              true,
            )}

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                {renderInput(
                  "Número",
                  remitente.direccion.numero,
                  (v) =>
                    setRemitente((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numero: v },
                    })),
                  "default",
                  null,
                  true,
                )}
              </View>
              <View style={styles.inputHalf}>
                {renderInput(
                  "Número Interior",
                  remitente.direccion.numeroInterior,
                  (v) =>
                    setRemitente((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numeroInterior: v },
                    })),
                )}
              </View>
            </View>

            {renderInput(
              "Colonia/Asentamiento",
              remitente.direccion.asentamiento,
              (v) =>
                setRemitente((r) => ({
                  ...r,
                  direccion: { ...r.direccion, asentamiento: v },
                })),
              "default",
              null,
              true,
            )}

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Código Postal"
                  placeholderTextColor="#999"
                  value={remitente.direccion.codigoPostal}
                  editable={false}
                />
              </View>
              <View style={styles.inputHalf}>
                {renderInput("Localidad", remitente.direccion.localidad, (v) =>
                  setRemitente((r) => ({
                    ...r,
                    direccion: { ...r.direccion, localidad: v },
                  })),
                )}
              </View>
            </View>

            {renderInput("Estado", remitente.direccion.estado, (v) =>
              setRemitente((r) => ({
                ...r,
                direccion: { ...r.direccion, estado: v },
              })),
            )}
          </View>

          {/* Formulario Destinatario */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Datos del destinatario</Text>
            </View>

            {renderInput(
              "Nombres",
              destinatario.nombres,
              (v) => setDestinatario((r) => ({ ...r, nombres: v })),
              "default",
              null,
              true,
            )}

            {renderInput(
              "Apellidos",
              destinatario.apellidos,
              (v) => setDestinatario((r) => ({ ...r, apellidos: v })),
              "default",
              null,
              true,
            )}

            {renderInput(
              "Teléfono",
              destinatario.telefono,
              (v) => setDestinatario((r) => ({ ...r, telefono: v })),
              "phone-pad",
              null,
              true,
            )}

            <View style={styles.subsectionHeader}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.subsectionTitle}>Dirección (Destino)</Text>
            </View>

            {renderInput(
              "Calle",
              destinatario.direccion.calle,
              (v) =>
                setDestinatario((r) => ({
                  ...r,
                  direccion: { ...r.direccion, calle: v },
                })),
              "default",
              null,
              true,
            )}

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                {renderInput(
                  "Número",
                  destinatario.direccion.numero,
                  (v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numero: v },
                    })),
                  "default",
                  null,
                  true,
                )}
              </View>
              <View style={styles.inputHalf}>
                {renderInput(
                  "Número Interior",
                  destinatario.direccion.numeroInterior,
                  (v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numeroInterior: v },
                    })),
                )}
              </View>
            </View>

            {renderInput(
              "Colonia/Asentamiento",
              destinatario.direccion.asentamiento,
              (v) =>
                setDestinatario((r) => ({
                  ...r,
                  direccion: { ...r.direccion, asentamiento: v },
                })),
              "default",
              null,
              true,
            )}

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Código Postal / País"
                  placeholderTextColor="#999"
                  // Muestra el CP para nacional y el País para internacional
                  value={
                    tipoEnvio === "Nacional"
                      ? destinatario.direccion.codigoPostal
                      : destinatario.direccion.pais
                  }
                  editable={false}
                />
              </View>
              <View style={styles.inputHalf}>
                {renderInput(
                  "Localidad",
                  destinatario.direccion.localidad,
                  (v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, localidad: v },
                    })),
                )}
              </View>
            </View>

            {tipoEnvio === "Nacional" &&
              renderInput("Estado", destinatario.direccion.estado, (v) =>
                setDestinatario((r) => ({
                  ...r,
                  direccion: { ...r.direccion, estado: v },
                })),
              )}
          </View>

          {/* Valor Declarado */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash-outline" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>
                Valor declarado (Opcional)
              </Text>
            </View>
            <Text style={styles.infoTextValue}>
              Este valor se usa para calcular el seguro del envío. Ingresa el
              valor comercial real del contenido en **
              {tipoEnvio === "Nacional" ? "MXN" : "USD"}**.
            </Text>

            {renderInput(
              `Valor declarado (${tipoEnvio === "Nacional" ? "MXN" : "USD"})`,
              valorDeclarado,
              setValorDeclarado,
              "numeric",
            )}
          </View>

          {}

          {hasPaid ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.generateButtonText}>
                      Generar y Compartir Guía
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.buttonContainer,
                !isFormReady() && {
                  opacity: 0.5,
                },
              ]}
            >
              <CheckoutButton
                amount={costoTotal}
                disabled={!isFormReady()}
                email={"cliente@example.com"}
                profileId={profileId}
                onPaymentSuccess={(paymentResult) => {
                  setHasPaid(true);
                }}
                onPaymentError={(error) => {
                  console.error("Error en pago:", error);
                  Alert.alert("Error", "Hubo un problema con el pago");
                }}
              />
            </View>
          )}

          {/* Botón de generar PDF */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Se agregó el estilo 'infoBox' y se corrigió 'subtitle' para evitar error de color.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 5,
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 24, // Ajustado para que quepa bien en dos líneas
    fontWeight: "bold",
    color: "#e91e63", // Pink color for emphasis
  },
  resumenContainer: {
    marginHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  resumenGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resumenItem: {
    width: "48%",
    marginBottom: 12,
  },
  resumenLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  resumenValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  costoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  costoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  costoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 6,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
    borderWidth: 1,
    borderColor: "transparent",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#666",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  generateButton: {
    backgroundColor: "#e91e63",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 52,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 20,
    backgroundColor: "#e6f7ff", // Light blue background
    borderLeftWidth: 4,
    borderLeftColor: "#1e90ff", // Blue border
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flexShrink: 1, // Permite que el texto se ajuste
  },
  infoTextValue: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});

export default GuiaFormulario;
