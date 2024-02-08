import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Constants for the image dimensions and initial position
const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = 100; // Adjust this as needed

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [cropArea, setCropArea] = useState({
    x: imageX,
    y: imageY,
    width: 100,
    height: 100,
  });
  const [isResizing, setIsResizing] = useState(false);

  // PanResponder to handle the movement of the crop area
  const movePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (!isResizing) {
        const newX = Math.max(imageX, Math.min(gestureState.moveX - gestureState.dx, imageX + imageWidth - cropArea.width));
        const newY = Math.max(imageY, Math.min(gestureState.moveY - gestureState.dy, imageY + imageHeight - cropArea.height));
        setCropArea(prev => ({
          ...prev,
          x: newX,
          y: newY,
        }));
      }
    },
  });

  // PanResponder to handle resizing of the crop area
  const resizePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (isResizing) {
        const newWidth = Math.max(50, Math.min(imageWidth, cropArea.width + gestureState.dx));
        const newHeight = Math.max(50, Math.min(imageHeight, cropArea.height + gestureState.dy));
        setCropArea(prev => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
      }
    },
    onPanResponderGrant: () => {
      setIsResizing(true);
    },
    onPanResponderRelease: () => {
      setIsResizing(false);
    },
  });

  const cropImage = async () => {
    try {
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
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { marginTop: imageY }]}
      />
      <View
        {...movePanResponder.panHandlers}
        style={[styles.cropArea, {
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height
        }]}
      >
        <View
          {...resizePanResponder.panHandlers}
          style={styles.resizeHandle}
        />
      </View>
      <Button title="Crop Image" onPress={cropImage} />
      <Text>Crop Area X: {cropArea.x}, Y: {cropArea.y}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
  },
// ...
  resizeHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
  debugText: {
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
