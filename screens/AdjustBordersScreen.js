import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const screen = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // The dimensions of your image

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const cropAreaRef = useRef({
    x: (screen.width - imageDimensions.width) / 2,
    y: (screen.height - imageDimensions.height) / 2,
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  const [cropArea, setCropArea] = useState(cropAreaRef.current);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          const newX = Math.max(0, Math.min(screen.width - cropArea.width, cropArea.x + gestureState.dx));
          const newY = Math.max(0, Math.min(screen.height - cropArea.height, cropArea.y + gestureState.dy));
          setCropArea((prev) => ({
            ...prev,
            x: newX,
            y: newY,
          }));
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          let touches = evt.nativeEvent.touches;
          let width = Math.abs(touches[0].pageX - touches[1].pageX);
          let height = Math.abs(touches[0].pageY - touches[1].pageY);
          setCropArea((prev) => ({
            ...prev,
            width: width > imageDimensions.width ? imageDimensions.width : width,
            height: height > imageDimensions.height ? imageDimensions.height : height,
          }));
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const cropImage = async () => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropArea.x,
              originY: cropArea.y,
              width: cropArea.width,
              height: cropArea.height,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setImageUri(manipResult.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View {...panResponder.panHandlers} style={[styles.cropArea, cropArea]} />
      <View {...resizePanResponder.panHandlers} style={[styles.resizeHandle, {
        left: cropArea.x + cropArea.width - 20,
        top: cropArea.y + cropArea.height - 20,
      }]} />
      <Button title="Crop Image" onPress={cropImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: imageDimensions.width,
    height: imageDimensions.height,
    position: 'absolute',
    top: (screen.height - imageDimensions.height) / 2,
    left: (screen.width - imageDimensions.width) / 2,
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
  },
  resizeHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
});

export default AdjustBordersScreen;
