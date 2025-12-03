import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "Correos de Mexico",
    slug: "correos-de-mexico",
    version: "1.0.8",
    scheme: "correosdemexico",
    assetBundlePatterns: ["**/*"],
    orientation: "portrait",
    icon: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.seanalytics.correosdemexico",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ["correosdemexico"],
          },
        ],
      },
      config: {
        googleMapsApiKey: "AIzaSyButMoZPZ-gQwBGtbVd8nOesfKCssnD6Sw",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage:
          "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.seanalytics.correosdemexico",
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "correosdemexico",
              host: "sso-callback",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      permissions: ["android.permission.CAMERA"],
      config: {
        googleMaps: {
          apiKey: "AIzaSyButMoZPZ-gQwBGtbVd8nOesfKCssnD6Sw",
        },
      },
    },
    web: {
      favicon: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
    },
    extra: {
      eas: {
        projectId: "a0f0754d-99de-4334-a9be-935e19938c4a",
      },
    },
    owner: "seanalytics",
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission:
            "La cámara se utiliza para escanear códigos QR y tomar fotos como evidencia de entrega. ¿Deseas permitir el acceso?",
          recordAudioAndroid: false,
        },
      ],
    ],
  };
};
