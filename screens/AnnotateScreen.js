import React, { useState } from 'react';
import { View, Image, StyleSheet, PanResponder, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function AnnotateScreen () {
  const [imageUri] = useState('https://via.placeholder.com/300');  
  const [circles, setCircles] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);

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
      const newCircle = {
        id: Date.now(),
        startX: gesture.x0,
        startY: gesture.y0,
        cx: gesture.x0,
        cy: gesture.y0,
        r: gesture.dx/2,
      };
      setCurrentCircle(newCircle);
      setCircles([...circles, newCircle]);
    },
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: () => {
      setCurrentCircle(null);
    },
  });

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

      <Svg height="100%" width="100%" style={styles.svgContainer}>
        {circles.map((circle) => (
          <Circle key={circle.id} cx={circle.cx - 40} cy={circle.cy - 80} r={circle.r - 20} fill="transparent" stroke="black" strokeWidth={2} />
        ))}
      </Svg>

      <View style={styles.gestureContainer} {...panResponder.panHandlers} />
      <Text title="Next" style={styles.Text} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
  },
  imageContainer: {
    width: 300,
    height: 300,
    position: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gestureContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  Text: {
    color: "black",
    textAlign: "center",
  },
});

