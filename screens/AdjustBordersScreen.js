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

  const cropAreaRef = useRef(cropArea);
  const resizeHandleRef = useRef({ x: 0, y: 0 });

  // PanResponder for dragging the crop area within the bounds of the image
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(
          imageDimensions.width / 2,
          Math.min(
            cropAreaRef.current.x + gestureState.dx,
            windowDimensions.width - imageDimensions.width / 2
          )
        );
        const newY = Math.max(
          imageDimensions.height / 2,
          Math.min(
            cropAreaRef.current.y + gestureState.dy,
            windowDimensions.height - imageDimensions.height / 2
          )
        );
        setCropArea((prev) => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      },
      onPanResponderRelease: () => {
        cropAreaRef.current = cropArea;
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // PanResponder for resizing the crop area using the handle
  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { x, y } = resizeHandleRef.current;
        let newWidth = Math.min(windowDimensions.width - cropArea.x, gestureState.moveX - x);
        let newHeight = Math.min(windowDimensions.height - cropArea.y, gestureState.moveY - y);
        setCropArea((prev) => ({
          ...prev,
          width: Math.max(50, newWidth),
          height: Math.max(50, newHeight),
        }));
      },
      onPanResponderGrant: (evt) => {
        resizeHandleRef.current = {
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
        };
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Function to crop the image using Expo Image Manipulator
  const cropImage = async () => {
    try {
      const cropConfig = {
        originX: cropArea.x - (windowDimensions.width - imageDimensions.width) / 2,
        originY: cropArea.y - (windowDimensions.height - imageDimensions.height) / 2,
        width: cropArea.width,
        height: cropArea.height,
      };
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
      <View {...panResponder.panHandlers} style={[styles.cropArea, {
        left: cropArea.x - cropArea.width / 2,
        top: cropArea.y - cropArea.height / 2,
        width: cropArea.width,
        height: cropArea.height,
      }]}>
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
});

export default AdjustBordersScreen;
