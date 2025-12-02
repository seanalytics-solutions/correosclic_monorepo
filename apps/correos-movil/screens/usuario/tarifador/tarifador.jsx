import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

const TarificadorMexpost = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Nacional");
  const [codigoOrigen, setCodigoOrigen] = useState("");
  const [codigoDestino, setCodigoDestino] = useState("");
  const [paisOrigen] = useState("México");
  const [paises, setPaises] = useState([]);
  const [paisDestino, setPaisDestino] = useState(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [infoPais, setInfoPais] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [peso, setPeso] = useState("");
  const [alto, setAlto] = useState("");
  const [ancho, setAncho] = useState("");
  const [largo, setLargo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState(null);
  const [cotizacionData, setCotizacionData] = useState(null);
  // Aseguramos que 'costo' tenga un valor por defecto seguro
  const costo = cotizacionData?.costoTotal || 0;
  // No necesitamos email aquí, ya que el pago va en GuiaFormulario
  // const email = "cliente@example.com";
  const [profileId, setProfileId] = useState(null);
  const [modalAnim] = useState(new Animated.Value(0));
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Definimos las dimensiones máximas
  const max_peso = 50;
  const max_alto = 300;
  const max_ancho = 300;
  const max_largo = 300;

  //obtener profileId
  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("No se encontró el ID del usuario.");
        if (!API_URL) throw new Error("La URL de la API no está configurada.");

        const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
        const profileId = profileRes.data?.id;
        setProfileId(profileId); // ✅ Guardamos solo el profileId
      } catch (err) {
        console.error("Error al cargar el profileId:", err);
      }
    };

    fetchProfileId();
  }, []);

  useEffect(() => {
    if (!showCountryModal) return;
    fetch(`${API_URL}/api/shipping-rates/paises-internacionales`)
      .then((res) => res.json())
      .then((data) => setPaises(data))
      .catch(() => setPaises([]));
  }, [showCountryModal]);

  //Funcion para validad los C.P y calculo de distancia
  const handleSearchNacional = async () => {
    if (!codigoOrigen || !codigoDestino) {
      Alert.alert("Error", "Por favor ingresa ambos códigos postales");
      return;
    }
    if (codigoOrigen.length !== 5 || codigoDestino.length !== 5) {
      Alert.alert("Error", "Los códigos postales deben tener 5 dígitos");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/shipping-rates/calculate-distance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigoOrigen, codigoDestino }),
        },
      );
      const data = await response.json();

      if (response.ok) {
        setDatosEnvio(data);
        setShowResults(true);
      } else {
        if (data.message.includes("Código postal inválido")) {
          Alert.alert("Error", data.message); // Error específico de C.P.
        } else {
          Alert.alert("Error", "No se pudo calcular la distancia");
        }
      }
    } catch {
      Alert.alert("Error", "Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  // Cambia handleSearchInternacional para que solo busque y muestre zona/desc. después de cerrar el modal
  const handleSearchInternacional = async () => {
    if (!paisDestino || !paisDestino.name) {
      Alert.alert("Error", "Selecciona un país válido");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/shipping-rates/consultar-pais`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paisDestino: paisDestino.name }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "No se pudo obtener la zona");
      setInfoPais(data);
      setShowResults(true); // Muestra zona y descripción
      setShowCountryModal(false); // Cierra el modal
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo obtener la zona");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === "Nacional") handleSearchNacional();
    // Para internacional, solo abre el modal (la búsqueda se hace en el modal)
    else setShowCountryModal(true);
  };

  const handleCotizarNacional = async () => {
    if (!peso || !alto || !ancho || !largo) {
      Alert.alert("Error", "Por favor completa todas las dimensiones y peso");
      return;
    }
    setLoadingQuote(true);
    try {
      const response = await fetch(`${API_URL}/api/shipping-rates/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso: parseFloat(peso),
          alto: parseFloat(alto),
          ancho: parseFloat(ancho),
          largo: parseFloat(largo),
          tipoServicio: "nacional",
          codigoOrigen,
          codigoDestino,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setCotizacionData(data);
        setShowQuote(true);
      } else {
        Alert.alert(
          "Error",
          data.message || "No se pudo realizar la cotización",
        );
      }
    } catch {
      Alert.alert("Error", "Error de conexión. Verifica tu internet.");
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleCotizarInternacional = async () => {
    if (!peso || !alto || !ancho || !largo) {
      Alert.alert(
        "Campos vacíos",
        "Es necesario completar todas las dimensiones y peso.",
      );
      return;
    }
    if (!paisDestino || !paisDestino.name) {
      Alert.alert("Error", "Selecciona un país válido");
      return;
    }
    setLoadingQuote(true);
    try {
      const response = await fetch(
        `${API_URL}/api/shipping-rates/cotizar-internacional`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paisDestino: paisDestino.name,
            peso: parseFloat(peso),
            alto: parseFloat(alto),
            ancho: parseFloat(ancho),
            largo: parseFloat(largo),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "No se pudo obtener tarifa");
      setCotizacionData(data);
      setShowQuote(true);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo calcular tarifa");
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleLimpiar = () => {
    setCodigoOrigen("");
    setCodigoDestino("");
    setPaisDestino(null);
    setShowResults(false);
    setShowQuote(false);
    setPeso("");
    setAlto("");
    setAncho("");
    setLargo("");
    setDatosEnvio(null);
    setCotizacionData(null);
    setInfoPais(null);
  };

  const handleNuevaConsulta = () => {
    setShowQuote(false);
    setPeso("");
    setAlto("");
    setAncho("");
    setLargo("");
    setCotizacionData(null);
  };

  /**
   * ✅ NUEVA FUNCIÓN: Navega a la pantalla de formulario/pago.
   * Pasa todos los datos de la cotización calculada.
   */
  const handleProceedToForm = () => {
    if (!cotizacionData) {
      Alert.alert("Error", "No se encontró la cotización para continuar.");
      return;
    }

    const navigationData = {
      tipoEnvio: activeTab,
      costoTotal: activeTab === "Nacional" ? costo : cotizacionData.total,
      detallesCotizacion: {
        peso: parseFloat(peso),
        alto: parseFloat(alto),
        ancho: parseFloat(ancho),
        largo: parseFloat(largo),
        codigoOrigen,
        codigoDestino,
        paisDestino: paisDestino?.name,
        // Incluye todos los datos de la cotización que necesites en GuiaFormulario
        ...cotizacionData,
      },
      profileId,
    };

    // 🛑 Navega a GuiaFormulario. La generación de PDF y el pago ocurren AQUÍ.
    navigation.navigate("GuiaFormulario", navigationData);
  };

  const handleBack = () => {
    if (showQuote) {
      setShowQuote(false);
    } else if (showResults) {
      setShowResults(false);
    } else {
      navigation.goBack(); // ← regresa si ya no hay nada que cerrar
    }
  };

  const handleTabChange = (tab) => {
    if (!showResults) {
      setActiveTab(tab);
      handleLimpiar();
    }
  };

  const renderCountryItem = ({ item }) => {
    const isSelected = paisDestino?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.countryItemSelected]}
        onPress={() => setPaisDestino(isSelected ? null : item)}
      >
        <Text
          style={[styles.countryText, isSelected && styles.countryTextSelected]}
        >
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={20}
            color="#e91e63"
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>
    );
  };

  // Animación al abrir/cerrar el modal
  useEffect(() => {
    if (showCountryModal) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showCountryModal]);

  // Calcula la posición vertical del modal
  const modalTranslateY = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0], // Desliza desde abajo hasta su posición
  });

  // Referencias para los campos
  const pesoRef = useRef(null);
  const altoRef = useRef(null);
  const anchoRef = useRef(null);
  const largoRef = useRef(null);

  // Función para cambiar de campo automáticamente
  const focusNextField = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // --- RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* Header fijo */}
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS === "android" ? Constants.statusBarHeight : 0,
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>
            Tarificador de envíos{"\n"}
            <Text style={styles.subtitle}>MEXPOST</Text>
          </Text>
        </View>

        {/* Contenido scrolleable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tabs */}
          <View
            style={[
              styles.tabContainer,
              showQuote && styles.tabContainerWithBorder,
            ]}
          >
            <TouchableOpacity
              style={[styles.tab, activeTab === "Nacional" && styles.activeTab]}
              onPress={() => handleTabChange("Nacional")}
              disabled={showResults}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Nacional" && styles.activeTabText,
                ]}
              >
                Nacional
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "Internacional" && styles.activeTab,
              ]}
              onPress={() => handleTabChange("Internacional")}
              disabled={showResults}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Internacional" && styles.activeTabText,
                ]}
              >
                Internacional
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View
            style={[
              styles.formContainer,
              showQuote && styles.formContainerWithBorder,
            ]}
          >
            {activeTab === "Nacional" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Código postal de origen"
                  placeholderTextColor="#999"
                  value={codigoOrigen}
                  onChangeText={setCodigoOrigen}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!showQuote && !loading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Código postal de destino"
                  placeholderTextColor="#999"
                  value={codigoDestino}
                  onChangeText={setCodigoDestino}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!showQuote && !loading}
                />
              </>
            ) : (
              <TouchableOpacity
                style={styles.inputTouch} // Usar un estilo diferente para el botón de país
                onPress={() => setShowCountryModal(true)}
                disabled={showQuote || loading}
              >
                <Text
                  style={[
                    styles.inputText,
                    paisDestino
                      ? styles.inputTextFilled
                      : styles.inputTextPlaceholder,
                  ]}
                >
                  {paisDestino?.name || "Selecciona un país"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            )}

            {activeTab === "Nacional" && !showResults && (
              <TouchableOpacity
                style={[styles.searchButton, loading && styles.disabledButton]}
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            )}
            {/* El botón de búsqueda internacional está en el modal */}
          </View>

          {/* Results Section */}
          {showResults && (
            <View style={styles.resultsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Datos de envío</Text>
                <TouchableOpacity onPress={handleLimpiar}>
                  <Text style={styles.limpiarButton}>Nueva consulta</Text>
                </TouchableOpacity>
              </View>

              {activeTab === "Nacional" && datosEnvio && (
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Origen:</Text>
                    <Text style={styles.infoValue}>
                      {datosEnvio.ciudadOrigen}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Destino:</Text>
                    <Text style={styles.infoValue}>
                      {datosEnvio.ciudadDestino}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zona:</Text>
                    <Text style={styles.infoValue}>
                      {datosEnvio.zona?.nombre}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Servicio:</Text>
                    <Text style={styles.infoValue}>
                      {datosEnvio.servicio || "Estándar"}
                    </Text>
                  </View>
                </View>
              )}

              {activeTab === "Internacional" && infoPais && (
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>País Destino:</Text>
                    <Text style={styles.infoValue}>{paisDestino.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zona:</Text>
                    <Text style={styles.infoValue}>{infoPais.zona}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripción de zona:</Text>
                    <Text style={styles.infoValue}>
                      {infoPais.descripcionZona}
                    </Text>
                  </View>
                </View>
              )}

              {!showQuote && (
                <View style={styles.dimensionsSection}>
                  <Text style={styles.sectionTitle}>Dimensiones y peso</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={pesoRef}
                      style={styles.input}
                      placeholder="Peso en kg"
                      placeholderTextColor="#999"
                      value={peso}
                      onChangeText={(val) => {
                        const numericVal = val.replace(/[^0-9.]/g, "");
                        if (parseFloat(numericVal) > max_peso) {
                          Alert.alert(
                            "Límite excedido",
                            `El peso máximo permitido es ${max_peso} kg. Pruebe con un valor menor.`,
                          );
                          return;
                        }
                        setPeso(numericVal);
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(altoRef)}
                      blurOnSubmit={false}
                    />
                    {peso !== "" && <Text style={styles.unitLabel}>kg</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={altoRef}
                      style={styles.input}
                      placeholder="Alto en cm"
                      placeholderTextColor="#999"
                      value={alto}
                      onChangeText={(val) => {
                        const numericVal = val.replace(/[^0-9.]/g, "");
                        if (parseFloat(numericVal) > max_alto) {
                          Alert.alert(
                            "Límite excedido",
                            `El alto máximo permitido es ${max_alto} cm. Pruebe con un valor menor.`,
                          );
                          return;
                        }
                        setAlto(numericVal);
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(anchoRef)}
                      blurOnSubmit={false}
                    />
                    {alto !== "" && <Text style={styles.unitLabel}>cm</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={anchoRef}
                      style={styles.input}
                      placeholder="Ancho en cm"
                      placeholderTextColor="#999"
                      value={ancho}
                      onChangeText={(val) => {
                        const numericVal = val.replace(/[^0-9.]/g, "");
                        if (parseFloat(numericVal) > max_ancho) {
                          Alert.alert(
                            "Límite excedido",
                            `El ancho máximo permitido es ${max_ancho} cm. Pruebe con un valor menor.`,
                          );
                          return;
                        }
                        setAncho(numericVal);
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(largoRef)}
                      blurOnSubmit={false}
                    />
                    {ancho !== "" && <Text style={styles.unitLabel}>cm</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={largoRef}
                      style={styles.input}
                      placeholder="Largo en cm"
                      placeholderTextColor="#999"
                      value={largo}
                      onChangeText={(val) => {
                        const numericVal = val.replace(/[^0-9.]/g, "");
                        if (parseFloat(numericVal) > max_largo) {
                          Alert.alert(
                            "Límite excedido",
                            `El largo máximo permitido es ${max_largo} cm. Pruebe con un valor menor.`,
                          );
                          return;
                        }
                        setLargo(numericVal);
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                    />
                    {largo !== "" && <Text style={styles.unitLabel}>cm</Text>}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.searchButton,
                      loadingQuote && styles.disabledButton,
                    ]}
                    onPress={
                      activeTab === "Internacional"
                        ? handleCotizarInternacional
                        : handleCotizarNacional
                    }
                    disabled={loadingQuote}
                  >
                    {loadingQuote ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.searchButtonText}>Cotizar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {showQuote && cotizacionData && (
                <View style={styles.quoteSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      Detalles del servicio
                    </Text>
                    <TouchableOpacity onPress={handleNuevaConsulta}>
                      <Text style={styles.limpiarButton}>Nueva consulta</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.detallesContainer}>
                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Tipo de envío:</Text>
                      <Text style={styles.detalleValue}>{activeTab}</Text>
                    </View>

                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Peso físico:</Text>
                      <Text style={styles.detalleValue}>
                        {cotizacionData.pesoFisico} kg
                      </Text>
                    </View>

                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Peso volumétrico:</Text>
                      <Text style={styles.detalleValue}>
                        {cotizacionData.pesoVolumetrico} kg
                      </Text>
                    </View>

                    {activeTab === "Nacional" ? (
                      <>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>
                            Tarifa sin IVA:
                          </Text>
                          <Text style={styles.detalleValue}>
                            MXN {cotizacionData.tarifaSinIVA || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>IVA:</Text>
                          <Text style={styles.detalleValue}>
                            MXN {cotizacionData.iva || "N/A"}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>Precio base:</Text>
                          <Text style={styles.detalleValue}>
                            USD {cotizacionData.precioBase?.toFixed(2) || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>IVA:</Text>
                          <Text style={styles.detalleValue}>
                            USD {cotizacionData.iva?.toFixed(2) || "N/A"}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Costo total y botón de navegación */}
                  <View style={styles.costoTotalContainer}>
                    <Text style={styles.costoTotalLabel}>Costo del envío:</Text>
                    <Text style={styles.costoTotalValue}>
                      {activeTab === "Nacional"
                        ? `MXN ${costo || "N/A"}`
                        : `USD ${cotizacionData.total || "N/A"}`}
                    </Text>
                  </View>

                  {/* ✅ SECCIÓN DEL BOTÓN DE NAVEGACIÓN (NO PAGO) */}
                  <View style={styles.paymentButtonContainer}>
                    <Text style={styles.continuePaymentMessage}>
                      **Continúe** para llenar los datos de envío y **realizar
                      el pago** en la siguiente pantalla.
                    </Text>
                    <TouchableOpacity
                      style={styles.proceedButton}
                      onPress={handleProceedToForm}
                    >
                      <Text style={styles.proceedButtonText}>
                        Continuar para Pagar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Espaciado adicional para Android */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Modal de países */}
        <Modal
          visible={showCountryModal}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View style={[styles.modalOverlay]}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: modalTranslateY }] },
                styles.modalShadow,
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Seleccionar país de destino
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowCountryModal(false)}
                >
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={paises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCountryItem}
                ListEmptyComponent={() => (
                  <Text style={styles.modalListEmptyText}>
                    Cargando países...
                  </Text>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
              />
              <View style={styles.floatingButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.floatingButton,
                    !paisDestino && styles.floatingButtonDisabled,
                  ]}
                  onPress={handleSearchInternacional}
                  disabled={!paisDestino}
                  activeOpacity={0.7}
                >
                  <Text style={styles.floatingButtonText}>Buscar país</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#e91e63", // Pink color for emphasis
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "android" ? 30 : 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  tabContainerWithBorder: {
    borderWidth: 1, // Reducido para que se vea menos prominente cuando hay resultados
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#e91e63", // Active tab indicator color
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#000",
  },
  formContainer: {
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  formContainerWithBorder: {
    // No queremos un borde alrededor del form cuando ya hay cotización
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#f9f9f9",
    flex: 1, // Necesario para View estilo inputContainer
  },
  inputTouch: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  inputTextPlaceholder: {
    color: "#999",
  },
  inputTextFilled: {
    color: "#000",
  },
  inputIcon: {
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#f0a6c7",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  limpiarButton: {
    color: "#e91e63",
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    color: "#000",
    maxWidth: "60%",
    textAlign: "right",
  },
  dimensionsSection: {
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  unitLabel: {
    position: "absolute",
    right: 15,
    color: "#999",
    fontSize: 16,
  },
  quoteSection: {
    // Estilos para la sección de cotización
  },
  detallesContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detalleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  detalleLabel: {
    fontSize: 15,
    color: "#555",
  },
  detalleValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
  },
  costoTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e91e63",
    marginBottom: 15,
  },
  costoTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  costoTotalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#e91e63",
  },
  paymentButtonContainer: {
    paddingVertical: 10,
    // Aquí es donde solía ir el CheckoutButton
  },
  // ✅ NUEVOS ESTILOS PARA EL BOTÓN DE NAVEGACIÓN
  proceedButton: {
    backgroundColor: "#1e90ff", // Color azul para la acción
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  continuePaymentMessage: {
    color: "#333",
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  bottomSpacer: {
    height: 50,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: screenHeight * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  modalShadow: {
    // Sombra para Android e iOS
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  modalCloseButton: {
    padding: 5,
  },
  countryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countryItemSelected: {
    backgroundColor: "#fce4ec", // Light pink background for selection
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  countryText: {
    fontSize: 16,
    color: "#333",
  },
  countryTextSelected: {
    fontWeight: "bold",
    color: "#e91e63",
  },
  modalListEmptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
  floatingButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  floatingButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  floatingButtonDisabled: {
    backgroundColor: "#f0a6c7",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TarificadorMexpost;
