import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "react-native";
import PDFReader from "rn-pdf-reader-js";

export default function ViewDocumentsScreen({ route }) {
  const { url } = route.params;

  return (
    <PDFReader
      source={{
        uri: url,
      }}
    />
  );
}