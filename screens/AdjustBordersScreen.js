import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowDimensions = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Replace with your image's dimensions

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Replace with your image's URI
  const [cropArea, setCropArea] = useState({
    x: (windowDimensions.width - imageDimensions.width) / 2,
    y: (windowDimensions.height - imageDimensions.height) / 2,
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  // Ref to keep track of the current crop area
  const cropAreaRef = useRef(cropArea);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Ensure the crop area stays within the bounds of the image
        const maxX = initialPositionX + imageDimensions.width - cropAreaRef.current.width;
        const maxY = initialPositionY + imageDimensions.height - cropAreaRef.current.height;
        const newX = Math.max(initialPositionX, Math.min(cropAreaRef.current.x + gestureState.dx, maxX));
        const newY = Math.max(initialPositionY, Math.min(cropAreaRef.current.y + gestureState.dy, maxY));

        setCropArea((prev) => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Ensure the resize handle stays within the bounds of the image
        const maxX = initialPositionX + imageDimensions.width - cropAreaRef.current.x;
        const maxY = initialPositionY + imageDimensions.height - cropAreaRef.current.y;
        const newWidth = Math.min(maxX, Math.max(50, cropAreaRef.current.width + gestureState.dx));
        const newHeight = Math.min(maxY, Math.max(50, cropAreaRef.current.height + gestureState.dy));

        setCropArea((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
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
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View {...panResponder.panHandlers} style={[styles.cropArea, {
        left: cropArea.x,
        top: cropArea.y,
        width: cropArea.width,
        height: cropArea.height,
      }]}>
        <View {...resizePanResponder.panHandlers} style={styles.resizeHandle} />
      </View>
      <Button title="Crop Image" onPress={cropImage} style={styles.cropButton} />
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
    bottom: 0,
    right: 0,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
  cropButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default AdjustBordersScreen;
