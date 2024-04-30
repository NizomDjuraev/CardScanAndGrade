import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, PanResponder, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';
import RNPickerSelect from "react-native-picker-select";

export default function AnnotateScreen({ navigation }) {
  const route = useRoute();
  const [imageUri, setImageUri] = useState("");
  useEffect(() => {
    if (route.params && route.params.imageData.uri) {
      setImageUri(route.params.imageData.uri);
    }
  }, [route.params]);

  const [circles, setCircles] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);
  const [circleColor, setCircleColor] = useState("black"); 
  const [buttonPressed, setButtonPressed] = useState(false); 

  const handlePanResponderMove = (event, gesture) => {
    if (currentCircle) {
      const radius = Math.sqrt(
        Math.pow(gesture.moveX - currentCircle.startX, 2) +
          Math.pow(gesture.moveY - currentCircle.startY, 2)
      );
      const updatedCircles = circles.map((circle) =>
        circle.id === currentCircle.id ? { ...circle, r: radius } : circle
      );
      setCircles(updatedCircles);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gesture) => {
      const { width, height } = Dimensions.get('window');
      const imageWidth = 300;
      const imageHeight = 450;
      const scaleX = imageWidth / width;
      const scaleY = imageHeight / height;
      const newCircle = {
        id: Date.now(),
        startX: gesture.x0,
        startY: gesture.y0,
        cx: gesture.x0 * scaleX,
        cy: gesture.y0 * scaleY,
        r: (gesture.dx / 2),
        color: buttonPressed ? circleColor : "transparent",
      };
      setCurrentCircle(newCircle);
      setCircles([...circles, newCircle]);
    },
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: () => {
      setCurrentCircle(null);
    },
  });

  const changeCircleColor = (color) => {
    setButtonPressed(true);
    setCircleColor(color);
  };

  const undoButton = () => {
    const undoneCircles = [...circles];
    undoneCircles.pop();
    setCircles(undoneCircles);
  }

  const nextButton = async () => {
    navigation.navigate("Score", { imageData: { uri: imageUri } })
  }

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />

        <Svg height="100%" width="100%" style={styles.svgContainer}>
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill='transparent'
              stroke={circle.color}
              strokeWidth={2}
            />
          ))}
        </Svg>

          <View style={styles.gestureContainer} {...panResponder.panHandlers} />
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <RNPickerSelect
        onValueChange={(value) => changeCircleColor(value)}
        items={[
          { label: "Category 1", value: "red" },
          { label: "Category 2", value: "green" },
          { label: "Category 3", value: "blue" },
          { label: "Category 4", value: "brown" },
          ]}
          style={{
            inputAndroid: {
              height: 50,
              width: 200,
              backgroundColor: "white",
              paddingHorizontal: 10,
              borderRadius: 4,
            },
            inputIOS: {
              height: 50,
              width: 200,
              backgroundColor: "white",
              paddingHorizontal: 10,
              borderRadius: 4,
            },
          }}
        />
        <TouchableOpacity onPress={undoButton} style={styles.button}>
          <Text style={styles.buttonText}>undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextButton} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: "center",
  },
  imageContainer: {
    width: 300,
    height: 300,
    position: 'center',
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gestureContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "black",
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  next: {
    padding: 10,
    backgroundColor: "black",
  },
});
