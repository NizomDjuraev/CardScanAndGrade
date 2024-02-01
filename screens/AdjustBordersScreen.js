import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  
  // Image dimensions and position
  const imageWidth = 300;
  const imageHeight = 300;
  const imageX = (windowWidth - imageWidth) / 2;
  const imageY = (windowHeight - imageHeight) / 2;

  // Initialize crop area state relative to the image position
  const [imageLayout, setImageLayout] = useState(null);
  const [cropArea, setCropArea] = useState(null);

  useEffect(() => {
    if (imageLayout) {
      setCropArea({
        x: imageLayout.x,
        y: imageLayout.y,
        width: 100,
        height: 100,
      });
    }
  }, [imageLayout]);

  // PanResponder for moving the crop area within the image boundaries
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newX = Math.max(imageX, Math.min(gestureState.moveX - cropArea.width / 2, imageX + imageWidth - cropArea.width));
      const newY = Math.max(imageY, Math.min(gestureState.moveY - cropArea.height / 2, imageY + imageHeight - cropArea.height));
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
    onPanResponderRelease: () => {
      // Handle end of drag if needed
    },
  });

  // Function to crop the image
  const cropImage = async () => {
    try {
      // Ensure cropping coordinates are relative to the image
      const cropX = cropArea.x - imageX;
      const cropY = cropArea.y - imageY;

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

  // Function to get the layout of the image
  const onImageLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log("Image layout:", x, y, width, height); // Logging the layout for debugging
    setImageLayout({
      x: x,
      y: y,
      width: width,
      height: height
    });
  };

  // Conditional rendering to ensure cropArea is set
  if (!cropArea) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View onLayout={onImageLayout} style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {cropArea && (
          <View
            {...panResponder.panHandlers}
            style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
          />
        )}
      </View>
      <Button title="Crop Image" onPress={cropImage} />
      <Text style={styles.debugText}>Crop Area X: {cropArea ? cropArea.x : 'N/A'}</Text>
      <Text style={styles.debugText}>Crop Area Y: {cropArea ? cropArea.y : 'N/A'}</Text>
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
