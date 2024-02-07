import React from "react";
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Share } from "react-native";

export default function ExportScreen() {
  const handleShare = () => {
    Share.share({
      message: "Check out this awesome image!",
      url: "https://m.media-amazon.com/images/I/71-orZ7bqqL.jpg",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <View style={styles.cardContainer}>
          <Image
            style={styles.cardImage}
            source={{
              uri: "https://m.media-amazon.com/images/I/71-orZ7bqqL.jpg",
            }}
          />
        </View>
      </View>

      <View style={styles.exportOptionsContainer}>
        <ScrollView style={styles.exportOptions}>
          {/* Export options go here */}
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          {/* Add more export options as needed */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#959595",
    position: "relative",
  },
  topBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
  },
  cardContainer: {
    backgroundColor: "#1D9DB9",
    width: "50%", // Adjusted width to 50%
    aspectRatio: 0.69, // Aspect ratio for iPhone
    alignItems: "center",
    justifyContent: "center",
  },
  exportOptionsContainer: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  exportOptions: {
    backgroundColor: "#C6C6C6",
  },
  cardImage: {
    width: "95%",
    height: "95%",
    resizeMode: "cover",
  },
  shareButton: {
    backgroundColor: "#1D9DB9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
