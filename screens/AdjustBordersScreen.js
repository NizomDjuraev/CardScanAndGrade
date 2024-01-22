import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const AdjustBordersScreen = () => {
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });

  const cropAreaRef = useRef(cropArea);
  cropAreaRef.current = cropArea;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          // Single touch means move the entire crop area
          const maxX = windowWidth - cropAreaRef.current.width;
          const maxY = windowWidth - cropAreaRef.current.height; // Assuming a square view for simplicity
          setCropArea((previousCropArea) => ({
            ...previousCropArea,
            x: Math.max(0, Math.min(maxX, previousCropArea.x + gestureState.dx)),
            y: Math.max(0, Math.min(maxY, previousCropArea.y + gestureState.dy)),
          }));
        }
      },
    })
  ).current;

  const resizePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          // Single touch means we're resizing the crop area
          setCropArea((previousCropArea) => ({
            ...previousCropArea,
            width: Math.max(100, previousCropArea.width + gestureState.dx),
            height: Math.max(100, previousCropArea.height + gestureState.dy),
          }));
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
      <View
        {...panResponder.panHandlers}
        style={[styles.cropArea, { top: cropArea.y, left: cropArea.x, width: cropArea.width, height: cropArea.height }]}
      >
        <View
          {...resizePanResponder.panHandlers}
          style={styles.corner}
        />
      </View>
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


