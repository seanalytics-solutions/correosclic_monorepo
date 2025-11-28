import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ClerkProvider } from "@clerk/clerk-expo";
import AuthNavigator from "./navigation/authNavigator";
import AppNavigator from "./navigation/appNavigatior";
import DistributorNavigator from "./navigation/distributorNavigator";
import { AuthProvider, useMyAuth } from "./context/AuthContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

function RootNavigation() {
  const { isAuthenticated, userRol } = useMyAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRol === "usuario" || userRol === "vendedor" ? (
        <AppNavigator />
      ) : userRol === "repartidor" ? (
        <DistributorNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  console.log({
    CLERK_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <AuthProvider>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          merchantIdentifier="merchant.com.tuapp"
        >
          <RootNavigation />
        </StripeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
