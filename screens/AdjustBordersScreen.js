import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Your image URI here
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

useEffect(() => {
  // Assuming the image is centered horizontally, we calculate the initial X as the image's starting X plus half the difference 
  // between the image width and the crop area width (to center the crop area over the image)
  const initialX = imageLayout.x + (imageLayout.width - cropArea.width) / 2;
  const initialY = imageLayout.y + (imageLayout.height - cropArea.height) / 2;

  setCropArea(prev => ({
    ...prev,
    x: initialX,
    y: initialY
  }));
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
    setImageLayout({
      x: (windowWidth - width) / 2, // Centered horizontally
      y: y, // Position from the top of the screen
      width: width,
      height: height
    });
  };

  return (
    <View style={styles.container}>
      <View onLayout={onImageLayout} style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View
          style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
          // ... (rest of the PanResponder handlers)
        />
      </View>
      <Button title="Crop Image" onPress={cropImage} />
      {/* Debugging text to show coordinates */}
      <Text>Crop Area X: {cropArea.x}</Text>
      <Text>Crop Area Y: {cropArea.y}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Assuming you want a black background
  },
  imageContainer: {
    // These dimensions should match the size of the image you are trying to crop
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevents the crop area from being drawn outside the image
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


export default AdjustBordersScreen;
