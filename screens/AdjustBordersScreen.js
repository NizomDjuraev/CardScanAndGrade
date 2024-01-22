import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx || gestureState.dy) {
          // User is dragging to move the crop area
          setCropArea((prev) => {
            const newX = Math.max(0, Math.min(prev.x + gestureState.dx, screenWidth - prev.width));
            const newY = Math.max(0, Math.min(prev.y + gestureState.dy, screenHeight - prev.height));
            return { ...prev, x: newX, y: newY };
          });
        }
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
              originX: cropArea.x,
              originY: cropArea.y,
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

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
      />
      <View
        {...panResponder.panHandlers}
        style={[styles.cropArea, { 
          top: cropArea.y, 
          left: cropArea.x, 
          width: cropArea.width, 
          height: cropArea.height 
        }]}
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
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
  },
  cropButton: {
    marginTop: 20,
  },
});

export default AdjustBordersScreen;

