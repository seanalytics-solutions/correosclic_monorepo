import { useNavigation, useRoute } from "@react-navigation/native";
import AppHeader from "../../components/common/AppHeader";
import { useEffect, useState } from "react";
import { obtenerFactura } from "../../api/miscompras";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Text } from "../../components/ui/Text";
import { View, ActivityIndicator, ScrollView, StyleSheet } from "react-native";

const InvoiceDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { invoiceId } = route.params || {};
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (!invoiceId) return;
    obtenerFactura(invoiceId)
      .then((data) => setInvoiceDetails(data))
      .catch((error) => console.error(error));
  }, [invoiceId]);

  if (!invoiceDetails) {
    return (
      <>
        <AppHeader title="Factura" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  const invoice = invoiceDetails?.[0];
  const isPaid = invoice?.status === "PAGADA";

  return (
    <>
      <AppHeader title="Factura" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container}>
        {/* Header Card - Invoice Number & Status */}
        <Card style={styles.card}>
          <CardHeader>
            <Text size="xl" fontWeight="bold" color="title">
              {invoice?.numero_factura ?? "Sin número"}
            </Text>
            <View style={styles.statusBadge}>
              <Text
                size="small"
                fontWeight="600"
                style={{ color: isPaid ? "#16a34a" : "#dc2626" }}
              >
                {invoice?.status ?? "—"}
              </Text>
            </View>
          </CardHeader>
        </Card>

        {/* Financial Details Card */}
        <Card style={styles.card}>
          <CardHeader>
            <Text size="large" fontWeight="600" color="title">
              Detalles Financieros
            </Text>
          </CardHeader>
          <CardContent style={styles.detailsGrid}>
            <DetailRow
              label="Precio"
              value={`$${invoice?.precio ?? "0.00"}`}
              highlight
            />
            <DetailRow label="Sucursal" value={invoice?.sucursal ?? "—"} />
            <DetailRow
              label="Fecha de creación"
              value={
                invoice?.fecha_creacion
                  ? new Date(invoice.fecha_creacion).toLocaleDateString()
                  : "—"
              }
            />
            <DetailRow
              label="Fecha de vencimiento"
              value={
                invoice?.fecha_vencimiento
                  ? new Date(invoice.fecha_vencimiento).toLocaleDateString()
                  : "—"
              }
            />
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card style={styles.card}>
          <CardHeader>
            <Text size="large" fontWeight="600" color="title">
              Productos
            </Text>
          </CardHeader>
          <CardContent>
            {invoice?.productos?.length > 0 ? (
              <View style={styles.productsList}>
                {invoice.productos.map((p: string, i: number) => (
                  <View key={i} style={styles.productItem}>
                    <Text color="muted" style={styles.bullet}>
                      •
                    </Text>
                    <Text style={styles.productText}>{p}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text color="muted">No hay productos registrados</Text>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </>
  );
};

// Reusable detail row component
const DetailRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text color="muted" size="small">
      {label}
    </Text>
    <Text
      fontWeight={highlight ? "700" : "600"}
      size={highlight ? "large" : "default"}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "column",
    gap: 4,
  },
  productsList: {
    gap: 8,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    marginTop: 2,
  },
  productText: {
    flex: 1,
  },
});

export default InvoiceDetailsScreen;
