import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const screen = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // The dimensions of your image
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          // User is dragging to move the crop area
          let newX = Math.max(initialPositionX, Math.min(cropArea.x + gestureState.dx, initialPositionX + imageDimensions.width - cropArea.width));
          let newY = Math.max(initialPositionY, Math.min(cropArea.y + gestureState.dy, initialPositionY + imageDimensions.height - cropArea.height));
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

  const cropImage = async () => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropArea.x - initialPositionX,
              originY: cropArea.y - initialPositionY,
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
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponder.panHandlers} style={[styles.cropArea, {
          top: cropArea.y - initialPositionY, 
          left: cropArea.x - initialPositionX,
          width: cropArea.width, 
          height: cropArea.height 
        }]} />
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
  imageContainer: {
    width: imageDimensions.width,
    height: imageDimensions.height,
    position: 'relative', // Contain the absolute children
    alignSelf: 'center',
    marginTop: initialPositionY, // Adjust for the actual layout of your screen
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
  },
});

export default AdjustBordersScreen;
