import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const imageWidth = 300;
  const imageHeight = 300;
  const imageX = (windowWidth - imageWidth) / 2;
  const imageY = (windowHeight - imageHeight) / 2; // Adjust this if the image is not centered vertically

  // Initialize crop area state relative to the image position
  const [cropArea, setCropArea] = useState({
    x: imageX,
    y: imageY,
    width: 100, // Initial width of the crop area
    height: 100, // Initial height of the crop area
  });

  // PanResponder for moving the crop area within the image boundaries
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
  // Calculate the center point of the crop area based on the gesture
      const centerPointX = gestureState.moveX;
      const centerPointY = gestureState.moveY;
  
  // Calculate the new X and Y for the crop area, ensuring it stays within the image
      const newX = Math.min(Math.max(centerPointX - cropArea.width / 2, imageX), imageX + imageWidth - cropArea.width);
      const newY = Math.min(Math.max(centerPointY - cropArea.height / 2, imageY), imageY + imageHeight - cropArea.height);
  
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },


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
