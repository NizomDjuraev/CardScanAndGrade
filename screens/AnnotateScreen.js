import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, PanResponder, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';

export default function AnnotateScreen( { navigation }) {
  const route = useRoute();
  const [imageUri, setImageUri] = useState('');
  useEffect(() => {
    if(route.params && route.params.imageData.uri){
      setImageUri(route.params.imageData.uri);
    }
  }, [route.params]);
  
  const [circles, setCircles] = useState([]);
  const [currentCircle, setCurrentCircle] = useState(null);
  const [circleColor, setCircleColor] = useState('black'); 
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
      const newCircle = {
        id: Date.now(),
        startX: gesture.x0,
        startY: gesture.y0,
        cx: gesture.x0,
        cy: gesture.y0,
        r: gesture.dx / 2,
        color: buttonPressed ? circleColor : 'transparent', 
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

  const nextButton = async () => {
    navigation.navigate('Score', {imageData: { uri: imageUri} });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

        <Svg height="100%" width="100%" style={styles.svgContainer}>
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              cx={circle.cx - 40}
              cy={circle.cy - 80}
              r={circle.r - 20}
              fill='transparent'
              stroke={circle.color}
              strokeWidth={2}
            />
          ))}
        </Svg>

        <View style={styles.gestureContainer} {...panResponder.panHandlers} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => changeCircleColor('red')} style={[styles.button, { backgroundColor: 'red' }]}>
          <Text style={styles.buttonText}>Category 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeCircleColor('green')} style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Category 2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeCircleColor('blue')} style={[styles.button, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>Category 3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeCircleColor('brown')} style={[styles.button, { backgroundColor: 'brown'}]}>
          <Text style={styles.buttonText}>Category 4</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextButton} style={styles.next}>
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
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  next: {
    padding: 10,
    backgroundColor: 'black',
  }
});
