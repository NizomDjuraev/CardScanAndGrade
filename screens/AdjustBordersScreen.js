import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowDimensions = Dimensions.get('window');
const imageDimensions = { width: 300, height: 300 }; // Replace with your image's dimensions

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Replace with your image's URI
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  // Calculate the maximum x and y values for the crop area
  const maxX = windowDimensions.width - imageDimensions.width;
  const maxY = windowDimensions.height - imageDimensions.height;

  // PanResponder for moving the crop area within the image boundaries
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setCropArea(prev => {
        let newX = prev.x + gestureState.dx;
        let newY = prev.y + gestureState.dy;

        newX = Math.max(0, Math.min(newX, maxX)); // Ensure newX is within image boundaries
        newY = Math.max(0, Math.min(newY, maxY)); // Ensure newY is within image boundaries

        return { ...prev, x: newX, y: newY };
      });
    },
    onPanResponderTerminationRequest: () => false,
  });

  // PanResponder for resizing the crop area within the image boundaries
  const resizePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setCropArea(prev => {
        let newWidth = prev.width + gestureState.dx;
        let newHeight = prev.height + gestureState.dy;

        newWidth = Math.max(50, Math.min(newWidth, imageDimensions.width - prev.x)); // Adjust width within image
        newHeight = Math.max(50, Math.min(newHeight, imageDimensions.height - prev.y)); // Adjust height within image

        return { ...prev, width: newWidth, height: newHeight };
      });
    },
    onPanResponderTerminationRequest: () => false,
  });

  // Function to crop the image
  const cropImage = async () => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{
          crop: {
            originX: cropArea.x,
            originY: cropArea.y,
            width: cropArea.width,
            height: cropArea.height,
          },
        }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setImageUri(manipResult.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };
};


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View
          {...panResponder.panHandlers}
          style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
        >
          <View {...resizePanResponder.panHandlers} style={styles.resizeHandle} />
        </View>
      </View>
      <Button title="Crop Image" onPress={cropImage} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 50, // Adjust this as needed
  },
  imageContainer: {
    width: imageDimensions.width,
    height: imageDimensions.height,
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,255,0.3)',
  },
  resizeHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
  button: {
    marginTop: 20, // Space between the crop area and the button
  },
});

export default AdjustBordersScreen;
