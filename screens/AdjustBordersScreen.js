import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Your image URI here
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // PanResponder for moving the crop area within the image boundaries
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setCropArea(prev => {
        let newX = prev.x + gestureState.dx;
        let newY = prev.y + gestureState.dy;

        // Constrain newX and newY to the image bounds
        newX = Math.max(0, Math.min(newX, imageLayout.width - cropArea.width));
        newY = Math.max(0, Math.min(newY, imageLayout.height - cropArea.height));

        return { ...prev, x: newX, y: newY };
      });
    },
    onPanResponderTerminationRequest: () => false,
  });

  // Function to crop the image
  const cropImage = async () => {
    try {
      // Translate the crop area's position to the image's coordinate system
      const cropX = cropArea.x + imageLayout.x;
      const cropY = cropArea.y + imageLayout.y;

      // Ensure cropX and cropY are within the image
      if (cropX < 0 || cropY < 0 || cropX + cropArea.width > imageLayout.width || cropY + cropArea.height > imageLayout.height) {
        console.error('Crop area is out of the image bounds');
        return;
      }

      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{
          crop: {
            originX: cropX,
            originY: cropY,
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

  // Function to get image layout from onLayout event
  const onImageLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setImageLayout({ x, y, width, height });
  };

  return (
    <View style={styles.container}>
      <View onLayout={onImageLayout} style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View
          {...panResponder.panHandlers}
          style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
        />
      </View>
      <Button title="Crop Image" onPress={cropImage} />
      {/* Debugging text to show coordinates */}
      <Text>Crop Area X: {cropArea.x}</Text>
      <Text>Crop Area Y: {cropArea.y}</Text>
      <Text>Image Layout X: {imageLayout.x}</Text>
      <Text>Image Layout Y: {imageLayout.y}</Text>
      <Text>Image Width: {imageLayout.width}</Text>
      <Text>Image Height: {imageLayout.height}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%', // Set this to the actual width of the image container
    height: '100%', // Set this to the actual height of the image container
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%', // Set this to the actual width of the image
    height: '100%', // Set this to the actual height of the image
    position: 'absolute',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
  },
});

export default AdjustBordersScreen;
