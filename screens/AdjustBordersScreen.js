import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const imageWidth = 300; // The width of the image
const imageHeight = 300; // The height of the image
const minimumCropDimensions = 50; // The minimum width and height of the crop area

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  });

  // PanResponder for moving the crop area
  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(0, Math.min(cropArea.x + gestureState.dx, imageWidth - cropArea.width));
        const newY = Math.max(0, Math.min(cropArea.y + gestureState.dy, imageHeight - cropArea.height));
        setCropArea({ ...cropArea, x: newX, y: newY });
      },
    })
  ).current;

  // PanResponder for resizing the crop area
  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newWidth = Math.min(Math.max(cropArea.width + gestureState.dx, minimumCropDimensions), imageWidth - cropArea.x);
        const newHeight = Math.min(Math.max(cropArea.height + gestureState.dy, minimumCropDimensions), imageHeight - cropArea.y);
        setCropArea({ ...cropArea, width: newWidth, height: newHeight });
      },
    })
  ).current;

  const cropImage = async () => {
    try {
      const result = await ImageManipulator.manipulateAsync(
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
      setImageUri(result.uri); // Update the imageUri with the cropped image uri
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View
        {...movePanResponder.panHandlers}
        style={[styles.cropArea, { top: cropArea.y, left: cropArea.x, width: cropArea.width, height: cropArea.height }]}
      >
        <View {...resizePanResponder.panHandlers} style={styles.corner} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Crop Image" onPress={cropImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
  },
  corner: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
