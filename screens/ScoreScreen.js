import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ScoreScreen() {
  const handleExitButtonClick = () => {
    // add button logic here
    console.log("exit button pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}></View>
      <View style={styles.middleBackground}></View>
      <View style={styles.bottomBackground}></View>

      <View style={styles.overlayBox}>
        {/* exit button */}
        <TouchableOpacity
          onPress={handleExitButtonClick}
          style={styles.exitButtonContainer}
        >
          <Ionicons name="close-circle-outline" size={35} color="#1D9DB9" />
        </TouchableOpacity>

        {/* Text above image container */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Bryce Harper</Text>
        </View>

        {/* container for image */}
        <View style={styles.cardImageContainer}>
          <Image
            style={styles.cardImage}
            source={{
              uri: "https://m.media-amazon.com/images/I/71-orZ7bqqL.jpg",
            }}
          />
        </View>

        {/* container for front and toggle buttons */}
        <View style={styles.frontToggleContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Front</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Toggle</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollble dark grey box of card information */}
        <ScrollView style={styles.scrollableInformation}>
          <Text style={styles.informationText}>Information</Text>

          <View style={styles.informationBox}>
            <Text style={styles.informationText}>Year</Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>Brand</Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>Set</Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>Number</Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>Variation</Text>
          </View>
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
  },
  middleBackground: {
    flex: 6,
    backgroundColor: "#959595",
  },
  bottomBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  overlayBox: {
    position: "absolute",
    top: "6%",
    bottom: "5%",
    left: "5%",
    right: "5%",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  cardImageContainer: {
    backgroundColor: "#1D9DB9",
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  cardImage: {
    width: "95%",
    height: "95%",
    resizeMode: "cover",
  },
  exitButtonContainer: {
    position: "absolute",
    top: 5,
    left: 6,
    zIndex: 1,
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  frontToggleContainer: {
    backgroundColor: "#272727",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D9DB9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: "70%",
    width: "30%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  scrollableInformation: {
    backgroundColor: "#C6C6C6",
  },
  informationBox: {
    backgroundColor: "white",
    padding: 3,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  informationText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
});
