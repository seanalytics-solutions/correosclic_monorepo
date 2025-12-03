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
import AsyncStorage from "@react-native-async-storage/async-storage";
// Removed: import Input from "./Input"; // No longer needed

const GuiaFormulario = ({ route, navigation }) => {
  const { tipoEnvio, costoTotal, detallesCotizacion, profileId } =
    route.params || {};

  if (!detallesCotizacion) {
    Alert.alert(
      "Error de datos",
      "No se encontraron los detalles de la cotización. Volviendo al tarifador.",
    );
    navigation.goBack();
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#e91e63" />
    );
  }

  const { codigoOrigen, codigoDestino, paisDestino, peso, alto, ancho, largo } =
    detallesCotizacion;

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
      codigoPostal: codigoOrigen || "",
      localidad: "",
      estado: "",
      pais: "México",
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
      codigoPostal: codigoDestino || "",
      localidad: "",
      estado: "",
      pais: tipoEnvio === "Internacional" ? paisDestino : "México",
    },
  });

  const [valorDeclarado, setValorDeclarado] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // --- Funciones de Lógica de Formulario y API (Sin cambios) ---

  const validarCampos = () => {
    // ... (Your validation logic remains here) ...
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
    // ... (Your API submission logic remains here) ...
    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    const paquete = {
      alto_cm: parseFloat(alto),
      ancho_cm: parseFloat(ancho),
      largo_cm: parseFloat(largo),
    };

    const pesoFloat = parseFloat(peso);

    const endpoint =
      tipoEnvio === "Internacional"
        ? `${API_URL}/api/guias/generar-pdf-internacional`
        : `${API_URL}/api/guias/generar-pdf-nacional`;

    const userId = await AsyncStorage.getItem("userId");

    const datosGuia = {
      remitente,
      destinatario,
      paquete,
      peso: pesoFloat,
      valorDeclarado: parseFloat(valorDeclarado) || 0,
      profileId: userId,
      costoTotal: costoTotal,
      zona:
        tipoEnvio === "Nacional"
          ? detallesCotizacion?.datosEnvio?.zona?.nombre
          : detallesCotizacion?.infoPais?.zona,
    };

    try {
      if (!API_URL) {
        throw new Error("URL de API no configurada");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(datosGuia),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      const pdfArrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(pdfArrayBuffer);
      const base64data = fromByteArray(uint8Array);

      const fileName = `guia-${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64data, {
        encoding: "base64",
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: "application/pdf" });
      }

      Alert.alert(
        "Éxito 🎉",
        "Guía de envío generada y lista para compartir.",
        [{ text: "OK", onPress: () => navigation.popToTop() }],
      );
    } catch (err) {
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

  const isFormReady = () => {
    // ... (Your form readiness logic remains here) ...
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
      if (!campo.valor || String(campo.valor).trim() === "") {
        return false;
      }
    }
    return true;
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
          keyboardShouldPersistTaps="handled" // Added this for reliability
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

          {/* Resumen del envío (Sin cambios) */}
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

          {/* Formulario Remitente - USANDO TEXTINPUT */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Datos del remitente</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nombres"
              value={remitente.nombres}
              onChangeText={(v) => setRemitente((r) => ({ ...r, nombres: v }))}
              // 'required' is handled by validation function, not a prop for TextInput
            />

            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={remitente.apellidos}
              onChangeText={(v) =>
                setRemitente((r) => ({ ...r, apellidos: v }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={remitente.telefono}
              onChangeText={(v) => setRemitente((r) => ({ ...r, telefono: v }))}
              keyboardType="phone-pad"
            />

            <View style={styles.subsectionHeader}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.subsectionTitle}>Dirección (Origen)</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Calle"
              value={remitente.direccion.calle}
              onChangeText={(v) =>
                setRemitente((r) => ({
                  ...r,
                  direccion: { ...r.direccion, calle: v },
                }))
              }
            />

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Número"
                  value={remitente.direccion.numero}
                  onChangeText={(v) =>
                    setRemitente((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numero: v },
                    }))
                  }
                />
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Número Interior (Opcional)"
                  value={remitente.direccion.numeroInterior}
                  onChangeText={(v) =>
                    setRemitente((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numeroInterior: v },
                    }))
                  }
                />
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Colonia/Asentamiento"
              value={remitente.direccion.asentamiento}
              onChangeText={(v) =>
                setRemitente((r) => ({
                  ...r,
                  direccion: { ...r.direccion, asentamiento: v },
                }))
              }
            />

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput // Deshabilitado
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Código Postal"
                  value={remitente.direccion.codigoPostal}
                  editable={false} // Prop para deshabilitar
                />
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Localidad (Opcional)"
                  value={remitente.direccion.localidad}
                  onChangeText={(v) =>
                    setRemitente((r) => ({
                      ...r,
                      direccion: { ...r.direccion, localidad: v },
                    }))
                  }
                />
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Estado (Opcional)"
              value={remitente.direccion.estado}
              onChangeText={(v) =>
                setRemitente((r) => ({
                  ...r,
                  direccion: { ...r.direccion, estado: v },
                }))
              }
            />
          </View>

          {/* Formulario Destinatario - USANDO TEXTINPUT */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#e91e63" />
              <Text style={styles.sectionTitle}>Datos del destinatario</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nombres"
              value={destinatario.nombres}
              onChangeText={(v) =>
                setDestinatario((r) => ({ ...r, nombres: v }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={destinatario.apellidos}
              onChangeText={(v) =>
                setDestinatario((r) => ({ ...r, apellidos: v }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={destinatario.telefono}
              onChangeText={(v) =>
                setDestinatario((r) => ({ ...r, telefono: v }))
              }
              keyboardType="phone-pad"
            />

            <View style={styles.subsectionHeader}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.subsectionTitle}>Dirección (Destino)</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Calle"
              value={destinatario.direccion.calle}
              onChangeText={(v) =>
                setDestinatario((r) => ({
                  ...r,
                  direccion: { ...r.direccion, calle: v },
                }))
              }
            />

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Número"
                  value={destinatario.direccion.numero}
                  onChangeText={(v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numero: v },
                    }))
                  }
                />
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Número Interior (Opcional)"
                  value={destinatario.direccion.numeroInterior}
                  onChangeText={(v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, numeroInterior: v },
                    }))
                  }
                />
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Colonia/Asentamiento"
              value={destinatario.direccion.asentamiento}
              onChangeText={(v) =>
                setDestinatario((r) => ({
                  ...r,
                  direccion: { ...r.direccion, asentamiento: v },
                }))
              }
            />

            <View style={styles.rowInputs}>
              <View style={styles.inputHalf}>
                <TextInput // Deshabilitado
                  style={[styles.input, styles.disabledInput]}
                  placeholder="Código Postal / País"
                  value={
                    tipoEnvio === "Nacional"
                      ? destinatario.direccion.codigoPostal
                      : destinatario.direccion.pais
                  }
                  editable={false} // Prop para deshabilitar
                />
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  style={styles.input}
                  placeholder="Localidad (Opcional)"
                  value={destinatario.direccion.localidad}
                  onChangeText={(v) =>
                    setDestinatario((r) => ({
                      ...r,
                      direccion: { ...r.direccion, localidad: v },
                    }))
                  }
                />
              </View>
            </View>

            {tipoEnvio === "Nacional" && (
              <TextInput
                style={styles.input}
                placeholder="Estado (Opcional)"
                value={destinatario.direccion.estado}
                onChangeText={(v) =>
                  setDestinatario((r) => ({
                    ...r,
                    direccion: { ...r.direccion, estado: v },
                  }))
                }
              />
            )}
          </View>

          {/* Valor Declarado - USANDO TEXTINPUT */}
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

            <TextInput
              style={styles.input}
              placeholder={`Valor declarado (${
                tipoEnvio === "Nacional" ? "MXN" : "USD"
              })`}
              value={valorDeclarado}
              onChangeText={setValorDeclarado}
              keyboardType="numeric"
            />
          </View>

          {/* Botones de Pago / Generar Guía (Sin cambios) */}
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
                  Alert.alert("Error", "Hubo un problema con el pago");
                }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Se mantienen los estilos originales para el resto de los componentes
const styles = StyleSheet.create({
  // ... (Your existing styles remain here) ...
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#e91e63",
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
  // ⚠️ IMPORTANT: styles.input is used directly here
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
    backgroundColor: "#e6f7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#1e90ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  infoTextValue: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});

export default GuiaFormulario;
