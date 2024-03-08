import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import PDFReader from "rn-pdf-reader-js";
import * as FileSystem from "expo-file-system";
import PdfRendererView from "react-native-pdf-renderer";
export default function ViewDocumentsScreen({ route }) {
  const { fileName } = route.params;
  const [pdfUri, setPdfUri] = useState(null);
  console.log("pdfURI", pdfUri);

  useEffect(() => {
    const loadPdfUri = async () => {
      try {
        const appDir = FileSystem.documentDirectory; // Dossier de l'application Expo
        const pdfUri = `${appDir}${fileName}`;
        setPdfUri(pdfUri);
      } catch (error) {
        console.error("Erreur lors du chargement du fichier PDF :", error);
      }
    };

    loadPdfUri();
  }, [fileName]);

  return (
    <View style={{ flex: 1 }}>
      {pdfUri && (
        <PDFReader
          source={{
            uri: pdfUri,
          }}
        />
      )}
    </View>
  );
}
