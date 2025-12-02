import { useNavigation } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../../components/common/AppHeader";
import { Text, Card, IconButton } from "../../components/ui";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GuiasDePago() {
  const navigation = useNavigation();
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await axios.get(
          `${apiUrl}/api/guias/usuario/${userId}`,
        );
        setGuias(response.data.data);
      } catch (error) {
        console.log("ERROR:", error);
        Alert.alert("Error", "No se pudieron cargar las guías");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleDownloadPDF = async (pdfUrl, trackingNumber) => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert("Error", "No se puede abrir el PDF");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo descargar el PDF");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En proceso":
        return "#FFA500";
      case "Entregado":
        return "#4CAF50";
      case "Cancelado":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader title="Guías de pago" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Cargando guías...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Guías de pago" onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {guias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay guías disponibles</Text>
          </View>
        ) : (
          guias.map((guia) => (
            <Card key={guia.numero_de_rastreo} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.trackingContainer}>
                  <Text style={styles.trackingLabel}>Número de rastreo</Text>
                  <Text style={styles.trackingNumber}>
                    {guia.numero_de_rastreo}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(guia.situacion_actual) },
                  ]}
                >
                  <Text style={styles.statusText}>{guia.situacion_actual}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {guia.remitente && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Remitente</Text>
                  <Text style={styles.sectionContent}>{guia.remitente}</Text>
                </View>
              )}

              {guia.destinatario && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Destinatario</Text>
                  <Text style={styles.sectionContent}>{guia.destinatario}</Text>
                </View>
              )}

              {(guia.ciudad_destino || guia.estado_destino) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Destino</Text>
                  <Text style={styles.sectionContent}>
                    {[guia.ciudad_destino, guia.estado_destino]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </View>
              )}

              <View style={styles.row}>
                {guia.peso_kg && (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Peso</Text>
                    <Text style={styles.infoValue}>{guia.peso_kg} kg</Text>
                  </View>
                )}
                {guia.valor_declarado && (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Valor declarado</Text>
                    <Text style={styles.infoValue}>
                      ${guia.valor_declarado}
                    </Text>
                  </View>
                )}
              </View>

              {guia.fecha_creacion && (
                <View style={styles.section}>
                  <Text style={styles.dateLabel}>Fecha de creación</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(guia.fecha_creacion)}
                  </Text>
                </View>
              )}

              {guia.ultimo_estado && (
                <View style={styles.section}>
                  <Text style={styles.dateLabel}>Último movimiento</Text>
                  <Text style={styles.sectionContent}>
                    {guia.ultimo_estado}
                  </Text>
                  {guia.fecha_ultimo_movimiento && (
                    <Text style={styles.dateValue}>
                      {formatDate(guia.fecha_ultimo_movimiento)}
                    </Text>
                  )}
                </View>
              )}

              {guia.pdf_url && (
                <View style={styles.actionContainer}>
                  <IconButton
                    type="default"
                    size="default"
                    onPress={() =>
                      handleDownloadPDF(guia.pdf_url, guia.numero_de_rastreo)
                    }
                    style={styles.downloadButton}
                  >
                    <MaterialIcons name="download" size={20} color="#FFFFFF" />
                  </IconButton>
                  <Text style={styles.downloadText}>Descargar PDF</Text>
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  trackingContainer: {
    flex: 1,
  },
  trackingLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    color: "#333",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  downloadButton: {
    marginRight: 8,
  },
  downloadText: {
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "500",
  },
});
