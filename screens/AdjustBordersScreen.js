import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Placeholder image URI
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // After the image layout is set, initialize the crop area
  useEffect(() => {
    setCropArea({
      x: imageLayout.x,
      y: imageLayout.y,
      width: 100, // Initial width of the crop area
      height: 100, // Initial height of the crop area
    });
  }, [imageLayout]);

  // PanResponder for moving the crop area within the image boundaries
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setCropArea(prev => {
        let newX = prev.x + gestureState.dx;
        let newY = prev.y + gestureState.dy;

        // Constrain newX and newY to the image bounds
        newX = Math.max(imageLayout.x, Math.min(newX, imageLayout.x + imageLayout.width - cropArea.width));
        newY = Math.max(imageLayout.y, Math.min(newY, imageLayout.y + imageLayout.height - cropArea.height));

        return { ...prev, x: newX, y: newY };
      });
    },
    onPanResponderTerminationRequest: () => false,
  });

  // Function to crop the image
  const cropImage = async () => {
    try {
      // Translate the crop area's position to the image's coordinate system
      const cropX = cropArea.x - imageLayout.x;
      const cropY = cropArea.y - imageLayout.y;

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
      setImageUri(manipResult.uri); // Update the imageUri state with the new cropped image
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Change the background color to something other than gray
  },
  imageContainer: {
    width: 300, // This should match the actual width of your image
    height: 300, // This should match the actual height of your image
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // If you have a border or some sort of outline on the image container, add it here
  },
  image: {
    width: '100%', // This will stretch the image to fill the container
    height: '100%', // This will stretch the image to fill the container
    resizeMode: 'contain', // This ensures the image aspect ratio is maintained
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    // You can set initial width and height here or dynamically update them in the component logic
    width: 100, // Starting width for the crop area
    height: 100, // Starting height for the crop area
  },
  button: {
    marginTop: 20, // Add some spacing above the button
  },
  debugText: {
    color: 'white', // Ensure the debug text is visible against the background
    margin: 5, // Add some spacing around the text
  },
  // Any additional styles for other elements should go here
});

export default styles;

export default AdjustBordersScreen;
