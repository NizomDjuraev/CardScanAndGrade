import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowDimensions = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Replace with your image's dimensions
const initialPositionX = (windowDimensions.width - imageDimensions.width) / 2;
const initialPositionY = (windowDimensions.height - imageDimensions.height) / 2;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Replace with your image's URI
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
        let newX = Math.max(initialPositionX, Math.min(cropArea.x + gestureState.dx, initialPositionX + imageDimensions.width - cropArea.width));
        let newY = Math.max(initialPositionY, Math.min(cropArea.y + gestureState.dy, initialPositionY + imageDimensions.height - cropArea.height));
        setCropArea(prev => ({
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
        let newWidth = Math.min(imageDimensions.width, Math.max(50, cropArea.width + gestureState.dx));
        let newHeight = Math.min(imageDimensions.height, Math.max(50, cropArea.height + gestureState.dy));
        if (cropArea.x + newWidth > initialPositionX + imageDimensions.width) {
          newWidth = initialPositionX + imageDimensions.width - cropArea.x;
        }
        if (cropArea.y + newHeight > initialPositionY + imageDimensions.height) {
          newHeight = initialPositionY + imageDimensions.height - cropArea.y;
        }
        setCropArea(prev => ({
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
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponder.panHandlers} style={[styles.cropArea, {
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
        }]}>
          <View {...resizePanResponder.panHandlers} style={styles.resizeHandle} />
        </View>
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
    width: windowDimensions.width,
    height: windowDimensions.height,
    position: 'relative',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageDimensions.width,
    height: imageDimensions.height,
    position: 'absolute',
    top: initialPositionY,
    left: initialPositionX,
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
    zIndex: 5, // Make sure this view is above the image
  },
  resizeHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 0,
    right: 0,
    backgroundColor: 'blue',
    opacity: 0.5,
    zIndex: 10, // Make sure the resize handle is above the crop area
  },
});

export default AdjustBordersScreen;
