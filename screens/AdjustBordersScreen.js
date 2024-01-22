import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });

  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setCropArea((prev) => ({
          ...prev,
          x: Math.max(0, Math.min(prev.x + gestureState.dx, Dimensions.get('window').width - prev.width)),
          y: Math.max(0, Math.min(prev.y + gestureState.dy, Dimensions.get('window').height - prev.height)),
        }));
      },
    })
  ).current;

  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setCropArea((prev) => ({
          ...prev,
          width: Math.max(50, prev.width + gestureState.dx),
          height: Math.max(50, prev.height + gestureState.dy),
        }));
      },
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
      setImageUri(result.uri); // Update the imageUri with the cropped image uri
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View
        {...movePanResponder.panHandlers}
        style={[styles.cropArea, { top: cropArea.y, left: cropArea.x, width: cropArea.width, height: cropArea.height }]}
      >
        <View {...resizePanResponder.panHandlers} style={styles.corner} />
      </View>
      <Button title="Crop Image" onPress={cropImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 300,
    height: 300,
    position: 'absolute',
    resizeMode: 'contain',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.1)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  corner: {
    width: 30,
    height: 30,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
});

export default AdjustBordersScreen;

