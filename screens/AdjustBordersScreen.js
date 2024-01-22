import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const screen = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Assuming the image is 300x300
const initialPositionX = (screen.width - imageDimensions.width) / 2; // Center horizontally
const initialPositionY = (screen.height - imageDimensions.height) / 2; // Center vertically

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [cropArea, setCropArea] = useState({
    x: initialPositionX,
    y: initialPositionY,
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  const cropAreaRef = useRef(cropArea);
  
  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          let newX = Math.max(initialPositionX, Math.min(cropAreaRef.current.x + gestureState.dx, initialPositionX + imageDimensions.width - cropAreaRef.current.width));
          let newY = Math.max(initialPositionY, Math.min(cropAreaRef.current.y + gestureState.dy, initialPositionY + imageDimensions.height - cropAreaRef.current.height));
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
        if (gestureState.numberActiveTouches === 1) {
          let newWidth = Math.max(50, Math.min(screen.width - cropAreaRef.current.x, cropAreaRef.current.width + gestureState.dx));
          let newHeight = Math.max(50, Math.min(screen.height - cropAreaRef.current.y, cropAreaRef.current.height + gestureState.dy));
          setCropArea((prev) => ({
            ...prev,
            width: newWidth,
            height: newHeight,
          }));
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const cropImage = async () => {
    const cropConfig = {
      originX: cropArea.x - initialPositionX,
      originY: cropArea.y - initialPositionY,
      width: cropArea.width,
      height: cropArea.height,
    };
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropConfig }],
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
      <View
        {...movePanResponder.panHandlers}
        style={[styles.cropArea, {
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
        }]}
      >
        <View {...resizePanResponder.panHandlers} style={styles.resizeHandle} />
      </View>
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
    left: initialPositionX,
    top: initialPositionY,
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
    right: -15,
    bottom: -15,
    width: 30,
    height: 30,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
});

export default AdjustBordersScreen;

