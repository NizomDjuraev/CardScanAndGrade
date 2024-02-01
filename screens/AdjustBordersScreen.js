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
    setImageLayout({
      x: x,
      y: y,
      width: width,
      height: height
    });
  };


  if (!imageLayout) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          onLayout={onImageLayout}
        />
        {cropArea && (
          <View
            {...panResponder.panHandlers}
            style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
          />
        )}
      </View>
      <Button title="Crop Image" onPress={cropImage} />
      <Text style={styles.debugText}>Crop Area X: {cropArea.x}</Text>
      <Text style={styles.debugText}>Crop Area Y: {cropArea.y}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  debugText: {
    color: 'black',
    marginTop: 20,
  },
});



export default AdjustBordersScreen;
