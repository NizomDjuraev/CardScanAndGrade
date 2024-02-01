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
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/300' }}
          style={styles.image}
          onLayout={(event) => console.log('Image layout:', event.nativeEvent.layout)}
        />
      </View>
      <Text style={styles.debugText}>Image should be above</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Set to white for better visibility
  },
  imageContainer: {
    width: 300, // Match the width of the image
    height: 300, // Match the height of the image
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey', // Temporary background to visualize the container
  },
  image: {
    width: '100%', 
    height: '100%',
  },
  debugText: {
    color: 'black', // Ensure it's visible against the white background
    marginTop: 20,
  },
});



export default AdjustBordersScreen;
