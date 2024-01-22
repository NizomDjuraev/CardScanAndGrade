import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const screen = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Assuming the image is 300x300
const dragDampening = 0.5; // Adjust this value to decrease sensitivity

const AdjustBordersScreen = () => {
  // Calculate initial position to center the crop area over the image
  const initialPositionX = (screen.width - imageDimensions.width) / 2;
  const initialPositionY = (screen.height - imageDimensions.height) / 2;
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
        setCropArea((prev) => {
          const newX = Math.max(0, Math.min(prev.x + (gestureState.dx * dragDampening), screen.width - prev.width));
          const newY = Math.max(0, Math.min(prev.y + (gestureState.dy * dragDampening), screen.height - prev.height));
          return { ...prev, x: newX, y: newY };
        });
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const cropImage = async () => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropArea.x - initialPositionX, // Adjust the crop origin based on the initial position
              originY: cropArea.y - initialPositionY,
              width: cropArea.width,
              height: cropArea.height,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setImageUri(result.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // Styles need to be inside the component to access the initialPositionX and initialPositionY variables
  const dynamicStyles = StyleSheet.create({
    image: {
      position: 'absolute',
      top: initialPositionY,
      left: initialPositionX,
      width: imageDimensions.width,
      height: imageDimensions.height,
      resizeMode: 'contain',
    },
    cropArea: {
      position: 'absolute',
      top: cropArea.y,
      left: cropArea.x,
      width: cropArea.width,
      height: cropArea.height,
      borderWidth: 1,
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={dynamicStyles.image}
      />
      <View
        {...panResponder.panHandlers}
        style={dynamicStyles.cropArea}
      />
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
  cropButton: {
    position: 'absolute',
    bottom: 20,
  },
});

export default AdjustBordersScreen;
