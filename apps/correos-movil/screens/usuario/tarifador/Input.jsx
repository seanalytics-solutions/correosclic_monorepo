import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength = null,
  required = false,
  style = {}, // Allow custom styles to be passed
  disabled = false,
}) => {
  return (
    <TextInput
      style={[styles.input, style, disabled && styles.disabledInput]}
      placeholder={`${placeholder}${required ? " *" : ""}`}
      placeholderTextColor="#999"
      // Crucial: value must be a string and is passed directly
      value={value || ""}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      editable={!disabled}
    />
  );
};

// Use the same styles as defined in your main component for consistency
const styles = StyleSheet.create({
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
});

export default Input;
