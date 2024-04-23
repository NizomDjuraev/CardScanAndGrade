import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // Import useRoute

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const imageWidth = 360;
const imageHeight = 360;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = ({ navigation }) => {
  const route = useRoute(); // Use the useRoute hook to access the current route
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    // Update the image URI state when the route params change
    if (route.params && route.params.imageData) {
      setImageUri(route.params.imageData.uri);
    }
  }, [route.params]);

  const [margins, setMargins] = useState({
    left: imageX,
    top: imageY,
    right: windowWidth - (imageX + imageWidth),
    bottom: windowHeight - (imageY + imageHeight),
  });

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        setMargins((prev) => {
          let change;
          if (edge === "left" || edge === "right") {
            change = gestureState.dx;
            if (edge === "left") {
              // For left border, subtract the change to decrease the margin
              return { ...prev, [edge]: Math.max(0, prev[edge] - change) };
            } else {
              // For right border, add the change to increase the margin
              return { ...prev, [edge]: Math.max(0, prev[edge] + change) };
            }
          } else {
            // For top and bottom borders
            change = gestureState.dy;
            return { ...prev, [edge]: Math.max(0, prev[edge] + change) };
          }
        });
      },
      onPanResponderRelease: () => {
        // No action needed on release as per current requirements
      },
    });
  };

  const panResponders = {
    left: createPanResponder("left"),
    top: createPanResponder("top"),
    right: createPanResponder("right"),
    bottom: createPanResponder("bottom"),
  };

  const centeringScore = {
    horizontal: ((margins.left - margins.right) / imageWidth) * 100,
    vertical: ((margins.top - margins.bottom) / imageHeight) * 100,
  };

  const nextButton = async () => {
    navigation.navigate("Annotate", { imageData: { uri: imageUri } });
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View
          style={[
            styles.imageContainer,
            {
              marginTop: imageY - margins.top,
              marginLeft: imageX - margins.left,
            },
          ]}
        >
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View
            {...panResponders.left.panHandlers}
            style={[
              styles.border,
              { left: margins.left - imageX, top: 0, bottom: 0, width: 2 },
            ]}
          />
          <View
            {...panResponders.top.panHandlers}
            style={[
              styles.border,
              { top: margins.top - imageY, left: 0, right: 0, height: 2},
            ]}
          />
          <View
            {...panResponders.right.panHandlers}
            style={[
              styles.border,
              {
                right: windowWidth - margins.right - imageWidth - imageX,
                top: 0,
                bottom: 0,
                width: 2,
              },
            ]}
          />
          <View
            {...panResponders.bottom.panHandlers}
            style={[
              styles.border,
              {
                bottom: windowHeight - margins.bottom - imageHeight - imageY,
                left: 0,
                right: 0,
                height: 2,
              },
            ]}
          />
        </View>
      ) : null}
      <Text style={styles.centeringText}>
        Horizontal Centering: {centeringScore.horizontal.toFixed(2)}%
      </Text>
      <Text style={styles.centeringText}>
        Vertical Centering: {centeringScore.vertical.toFixed(2)}%
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={nextButton} style={styles.next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    position: "relative",
    borderWidth: 1,
    borderColor: "grey",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  border: {
    position: "absolute",
    backgroundColor: "blue",
    padding: 5,
  },
  centeringText: {
    fontSize: 16,
    color: "black",
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  next: {
    padding: 10,
  },
});

export default AdjustBordersScreen;
