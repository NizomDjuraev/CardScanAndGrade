import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  
  // Image dimensions and position are known and static
  const imageWidth = 300;
  const imageHeight = 300;
  const imageX = (windowWidth - imageWidth) / 2;
  const imageY = (windowHeight - imageHeight) / 2;

  // Directly initialize crop area state relative to the image position
  const [cropArea, setCropArea] = useState({
    x: imageX,
    y: imageY,
    width: 100,
    height: 100,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // Constrain the movement within the image boundaries
      const newX = Math.max(imageX, Math.min(gestureState.moveX - gestureState.dx, imageX + imageWidth - cropArea.width));
      const newY = Math.max(imageY, Math.min(gestureState.moveY - gestureState.dy, imageY + imageHeight - cropArea.height));
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
  });

  const cropImage = async () => {
    try {
      // Cropping coordinates adjusted to be relative to the image
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
      setImageUri(manipResult.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image}
        />
        <View
          {...panResponder.panHandlers}
          style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
        />
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
    width: imageWidth,
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
  },
  debugText: {
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
