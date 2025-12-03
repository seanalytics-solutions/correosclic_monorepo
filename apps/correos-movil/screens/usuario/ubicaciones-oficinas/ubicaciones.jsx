import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Linking,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

export default function UbicacionScreen() {
  const IP = process.env.EXPO_PUBLIC_API_URL;
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesOriginales, setSucursalesOriginales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [mapaInicializado, setMapaInicializado] = useState(false); // 🆕 Track Map Ready
  const mapRef = useRef(null);
  const navigation = useNavigation(); // --- Utilities ---

  const calcularDistancia = (coord1, coord2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.latitude * Math.PI) / 180) *
        Math.cos((coord2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const ordenarPorDistancia = (sucursales, ubicacion) => {
    return sucursales
      .map((sucursal) => {
        // Manejar el caso donde las coordenadas no existen
        if (
          !sucursal.coordenadas?.latitude ||
          !sucursal.coordenadas?.longitude
        ) {
          return { ...sucursal, distancia: Infinity };
        }
        return {
          ...sucursal,
          distancia: calcularDistancia(ubicacion, sucursal.coordenadas),
        };
      })
      .sort((a, b) => a.distancia - b.distancia);
  }; // --- Data Fetching ---

  const obtenerSucursales = async (query = "") => {
    try {
      setCargandoBusqueda(query !== "");

      const url = query
        ? `${IP}/api/oficinas/buscar/${encodeURIComponent(query)}`
        : `${IP}/api/oficinas`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar oficinas");
      }

      const data = await response.json(); // Transformar y Deduplicar datos

      const dataDeduplicada = [];
      const domiciliosVistos = new Set();

      data.forEach((item) => {
        const domicilioNormalizado = item.domicilio
          ?.toLowerCase()
          .replace(/\s+/g, " ")
          .trim();
        const coordenadas = {
          latitude: parseFloat(item.latitud),
          longitude: parseFloat(item.longitud),
        };

        if (
          domicilioNormalizado &&
          !domiciliosVistos.has(domicilioNormalizado) &&
          !isNaN(coordenadas.latitude) &&
          !isNaN(coordenadas.longitude)
        ) {
          // ⚠️ Validar coordenadas antes de añadir
          domiciliosVistos.add(domicilioNormalizado);
          dataDeduplicada.push({ ...item, coordenadas });
        }
      }); // Ordenar por distancia si hay ubicación del usuario y no es una búsqueda

      let sucursalesOrdenadas = dataDeduplicada;
      if (ubicacionUsuario && query === "") {
        sucursalesOrdenadas = ordenarPorDistancia(
          dataDeduplicada,
          ubicacionUsuario,
        );
      }

      setSucursales(sucursalesOrdenadas); // Guardar datos originales solo en la primera carga

      if (query === "") {
        setSucursalesOriginales(sucursalesOrdenadas);
      } // Seleccionar la primera sucursal si es una búsqueda y hay resultados

      if (query !== "") {
        setSucursalSeleccionada(
          sucursalesOrdenadas.length > 0 ? sucursalesOrdenadas[0] : null,
        );
      } else if (
        sucursalSeleccionada &&
        !sucursalesOrdenadas.find(
          (s) => s.id_oficina === sucursalSeleccionada.id_oficina,
        )
      ) {
        // Deseleccionar si la sucursal ya no está en la lista (e.g., al limpiar búsqueda)
        setSucursalSeleccionada(null);
      }
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
      setSucursales([]);
      setSucursalSeleccionada(null);
      Alert.alert("Error de Conexión", "No se pudieron cargar las sucursales.");
    } finally {
      setCargando(false);
      setCargandoBusqueda(false);
    }
  }; // --- Location Handling ---

  const obtenerUbicacionActual = async () => {
    try {
      setCargandoUbicacion(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const coordenadas = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUbicacionUsuario(coordenadas); // Reordenar sucursales si ya existen

      if (sucursalesOriginales.length > 0) {
        const sucursalesOrdenadas = ordenarPorDistancia(
          sucursalesOriginales,
          coordenadas,
        );
        setSucursales(sucursalesOrdenadas);
      }
    } catch (error) {
      console.error("Error al obtener ubicación:", error);
      Alert.alert(
        "Error de ubicación",
        "No se pudo obtener tu ubicación actual. Verifica que el GPS esté activado.",
      );
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const solicitarPermisoUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permisos de ubicación",
          "Para mostrar las sucursales cercanas, necesitamos acceso a tu ubicación.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Configuración", onPress: () => Linking.openSettings() },
          ],
        ); // Cargar sucursales sin ubicación
        await obtenerSucursales();
        return;
      }

      await obtenerUbicacionActual();
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
      await obtenerSucursales();
    }
  }; // Obtener ubicación y sucursales al montar

  useEffect(() => {
    solicitarPermisoUbicacion();
  }, []); // Cuando se obtiene la ubicación (en la primera carga o por el botón de cerca)

  useEffect(() => {
    if (ubicacionUsuario && !cargando) {
      // Centrar el mapa en la ubicación del usuario después de la carga inicial
      centrarEnUbicacionUsuario(ubicacionUsuario);
    }
  }, [ubicacionUsuario, cargando]); // --- Map Interaction Callbacks ---
  // 🔑 Usamos useCallback para estabilizar la función y evitar re-renders innecesarios

  const centrarEnSucursal = useCallback((sucursal) => {
    if (mapRef.current && sucursal?.coordenadas) {
      mapRef.current.animateToRegion({
        ...sucursal.coordenadas,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSucursalSeleccionada(sucursal);
    }
  }, []);

  const centrarEnUbicacionUsuario = useCallback((coords) => {
    if (!coords.latitude || !coords.longitude) return;

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800,
      );
    }
  }, []);

  const ajustarVistaParaTodosLosResultados = (sucursales) => {
    if (!mapRef.current || sucursales.length === 0) return;

    const coords = sucursales
      .filter((s) => s.coordenadas && !isNaN(s.coordenadas.latitude)) // Filtrar coordenadas inválidas
      .map((s) => s.coordenadas);

    if (coords.length === 0) return;

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  }; // --- User Actions ---

  const buscarSucursales = async (query) => {
    const texto = query.trim();

    if (texto === "") {
      setSucursales(sucursalesOriginales);
      setSucursalSeleccionada(null);
      return;
    }

    await obtenerSucursales(texto); // Centrar el mapa en los resultados

    if (mapRef.current) {
      if (sucursales.length === 1) {
        centrarEnSucursal(sucursales[0]);
      } else if (sucursales.length > 1) {
        ajustarVistaParaTodosLosResultados(sucursales);
      }
    }
  };

  const manejarSubmitEditing = () => {
    const texto = textoBusqueda.trim();
    if (texto === "") {
      setSucursales(sucursalesOriginales);
      setSucursalSeleccionada(null);
    } else {
      buscarSucursales(texto);
    }
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda("");
    setSucursales(sucursalesOriginales);
    setSucursalSeleccionada(null);
  }; // 🔑 Usamos useCallback para estabilizar la función

  const buscarCercanas = useCallback(async () => {
    try {
      setCargandoUbicacion(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu ubicación para encontrar sucursales cercanas.",
          [{ text: "OK" }],
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      const nuevaUbicacion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUbicacionUsuario(nuevaUbicacion);
      setTextoBusqueda("");
      setSucursalSeleccionada(null); // Ordenar sucursales por cercanía

      if (sucursalesOriginales.length > 0) {
        const sucursalesOrdenadas = ordenarPorDistancia(
          sucursalesOriginales,
          nuevaUbicacion,
        );
        setSucursales(sucursalesOrdenadas);
      } // Centrar en la ubicación del usuario (se hará en el useEffect)

      centrarEnUbicacionUsuario(nuevaUbicacion);
    } catch (error) {
      console.error("Error al obtener ubicación:", error);
      Alert.alert(
        "Error de ubicación",
        "No se pudo obtener tu ubicación. Verifica que el GPS esté activado.",
        [{ text: "OK" }],
      );
    } finally {
      setCargandoUbicacion(false);
    }
  }, [sucursalesOriginales, centrarEnUbicacionUsuario]);

  const abrirIndicaciones = () => {
    if (sucursalSeleccionada?.coordenadas) {
      const { latitude, longitude } = sucursalSeleccionada.coordenadas; // Corregir la URL para Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  }; // --- Computed Values ---
  // Región inicial del mapa

  const obtenerRegionInicial = useMemo(() => {
    if (ubicacionUsuario) {
      return {
        latitude: ubicacionUsuario.latitude,
        longitude: ubicacionUsuario.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    } // Región por defecto (CDMX)
    return {
      latitude: 19.4326,
      longitude: -99.1332,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [ubicacionUsuario]); // --- Render Logic ---
  // Pantalla de carga inicial

  if (cargando) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#DE1484" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Cargando sucursales...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          { paddingTop: Constants.statusBarHeight + 10 },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o código postal..."
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={manejarSubmitEditing}
            blurOnSubmit={true}
          />
          {cargandoBusqueda && (
            <ActivityIndicator
              size="small"
              color="#DE1484"
              style={styles.searchLoader}
            />
          )}
          {textoBusqueda.length > 0 && !cargandoBusqueda && (
            <TouchableOpacity
              onPress={limpiarBusqueda}
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={buscarCercanas}
          disabled={cargandoUbicacion}
        >
          {cargandoUbicacion ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="my-location" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      {!cargando && sucursales.length > 0 && (
        <MapView
          ref={mapRef}
          style={styles.mapa}
          initialRegion={obtenerRegionInicial}
          showsUserLocation={!!ubicacionUsuario}
          showsMyLocationButton={false} // ❌ ELIMINADO: onRegionChangeComplete={setRegionVisible}
          // Para evitar el loop de re-renders y crashes durante el zoom/pan.
          onMapReady={() => setMapaInicializado(true)} // 🆕 Marcar el mapa como listo
        >
          {sucursales.map((s) => (
            <Marker // 🔑 Clave robusta para evitar errores de React/Mapas
              key={s.id_oficina?.toString() || s.domicilio}
              coordinate={s.coordenadas}
              pinColor={
                sucursalSeleccionada?.id_oficina === s.id_oficina
                  ? "#0066ff"
                  : "#DE1484"
              } // Cambiar color si está seleccionada
              onPress={() => centrarEnSucursal(s)}
            />
          ))}
        </MapView>
      )}
      {/* Información de sucursal seleccionada */}
      {sucursalSeleccionada && (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={28} color="#DE1484" />
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>
                {sucursalSeleccionada.nombre_cuo || "Sucursal"}
              </Text>
              <Text style={styles.direccion}>
                {sucursalSeleccionada.domicilio}
              </Text>
              <Text style={styles.codigoPostal}>
                CP: {sucursalSeleccionada.codigo_postal}
              </Text>
              {sucursalSeleccionada.distancia !== Infinity && (
                <Text style={styles.distancia}>
                  📍
                  {sucursalSeleccionada.distancia.toFixed(1)} km de distancia
                </Text>
              )}
              {sucursalSeleccionada.horario_atencion && (
                <View style={styles.infoIconRow}>
                  <Feather
                    name="clock"
                    size={18}
                    color="#DE1484"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.horario}>
                    {sucursalSeleccionada.horario_atencion} 
                  </Text>
                </View>
              )}
              {sucursalSeleccionada.telefono && (
                <View style={styles.infoIconRow}>
                  <FontAwesome
                    name="phone"
                    size={18}
                    color="#DE1484"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.telefono}>
                    {sucursalSeleccionada.telefono}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.boton} onPress={abrirIndicaciones}>
            <Text style={styles.botonTexto}>Obtener indicaciones</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Lista de sucursales */}
      {sucursales.length > 0 && (
        <FlatList // Filtrar la seleccionada para que no aparezca duplicada
          data={sucursales.filter(
            (s) =>
              !sucursalSeleccionada ||
              s.id_oficina !== sucursalSeleccionada.id_oficina,
          )}
          keyExtractor={(item) => item.id_oficina?.toString() || item.domicilio} // Clave robusta
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sugerenciaItem}
              onPress={() => centrarEnSucursal(item)}
            >
              <MaterialIcons
                name="location-on"
                size={22}
                color="#DE1484"
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.sugerenciaNombre}>{item.nombre_cuo}</Text>
                <Text style={styles.sugerenciaDireccion}>{item.domicilio}</Text>
                <View style={styles.sugerenciaFooter}>
                  <Text style={styles.sugerenciaCP}>
                    CP: {item.codigo_postal}
                  </Text>
                  {item.distancia !== Infinity && (
                    <Text style={styles.sugerenciaDistancia}>
                      {item.distancia.toFixed(1)} km
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchLoader: {
    marginLeft: 10,
  },
  clearButton: {
    marginLeft: 10,
    padding: 4,
  },
  locationButton: {
    backgroundColor: "#DE1484",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapa: {
    width: "100%",
    height: 280,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: -30,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  nombre: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
  },
  direccion: {
    color: "#333",
    marginBottom: 2,
  },
  codigoPostal: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  distancia: {
    color: "#DE1484",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoIconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  horario: {
    color: "#333",
    fontSize: 14,
  },
  telefono: {
    color: "#333",
    fontSize: 14,
  },
  boton: {
    backgroundColor: "#DE1484",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sugerenciaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sugerenciaNombre: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  sugerenciaDireccion: {
    color: "#333",
    fontSize: 13,
    marginBottom: 4,
  },
  sugerenciaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sugerenciaCP: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  sugerenciaDistancia: {
    color: "#DE1484",
    fontSize: 12,
    fontWeight: "600",
  },

  backButton: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
