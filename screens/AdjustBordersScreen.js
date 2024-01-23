import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowDimensions = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Placeholder dimensions for the image

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Placeholder image URI
  const [cropArea, setCropArea] = useState({
    x: (windowDimensions.width - imageDimensions.width) / 2,
    y: (windowDimensions.height - imageDimensions.height) / 2,
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Allow dragging only if a single finger is used
        if (evt.nativeEvent.touches.length === 1) {
          const newX = Math.max(0, Math.min(windowDimensions.width - imageDimensions.width, cropArea.x + gestureState.dx));
          const newY = Math.max(0, Math.min(windowDimensions.height - imageDimensions.height, cropArea.y + gestureState.dy));
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

  // This pan responder would be attached to a handle for resizing
  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Allow resizing only if two fingers are used
        if (evt.nativeEvent.touches.length === 2) {
          let touch1 = evt.nativeEvent.touches[0];
          let touch2 = evt.nativeEvent.touches[1];
          // Calculate the distance between the two fingers
          let width = Math.abs(touch1.pageX - touch2.pageX);
          let height = Math.abs(touch1.pageY - touch2.pageY);
          // Update the crop area size
          setCropArea((prev) => ({
            ...prev,
            width: Math.min(imageDimensions.width, width),
            height: Math.min(imageDimensions.height, height),
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
      <View {...panResponder.panHandlers} style={[styles.cropArea, {
        left: cropArea.x,
        top: cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
      }]} />
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
    top: (windowDimensions.height - imageDimensions.height) / 2,
    left: (windowDimensions.width - imageDimensions.width) / 2,
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
