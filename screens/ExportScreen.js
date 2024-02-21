import React, { useRef } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Share } from "react-native";
import { captureRef } from "react-native-view-shot";

export default function ExportScreen() {
  const cardRef = useRef();

  const handleShare = async () => {
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 0.8,
      });

      Share.share({
        url: uri,
      });
    } catch (error) {
      console.error("Error sharing image: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} ref={cardRef}>
        <View style={styles.cardContainer}>
          {/* Front of the card */}
          <View style={styles.cardSide}>
            <Image
              style={styles.cardImage}
              source={{
                uri: "https://m.media-amazon.com/images/I/71-orZ7bqqL.jpg",
              }}
            />
          </View>
          {/* Back of the card */}
          <View style={styles.cardSide}>
            <Image
              style={styles.cardImage}
              source={{
                uri: "https://m.media-amazon.com/images/I/71-orZ7bqqL.jpg",
              }}
            />
          </View>
        </View>
        {/* Summary of information */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Card Summary</Text>
        </View>
      </View>
      {/* Share button */}
      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#adadad", // White background
    justifyContent: "center",
    alignItems: "center",
  },
  topBackground: {
    aspectRatio: 9 / 16, // Aspect ratio for iPhone screen
    width: "80%", // Adjusted width for screen space
    backgroundColor: "#d1d1d1", // White background
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 20,
  },
  cardSide: {
    width: "48%", // Adjusted to leave some space between the front and back of the card
    aspectRatio: 63 / 88, // Aspect ratio for the card sides, same as front of the card
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  summaryContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: "#1D9DB9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
  },
});