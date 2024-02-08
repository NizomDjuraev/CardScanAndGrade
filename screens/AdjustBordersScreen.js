import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Assuming a centered image for simplicity
const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = 100; // Adjust this as needed to ensure the image and button are always visible

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [isResizing, setIsResizing] = useState(false);

  const [cropArea, setCropArea] = useState({
    x: imageX + 50, // Start the crop area slightly inside the image
    y: imageY + 50,
    width: 100,
    height: 100,
  });

  const checkBoundsForMove = (x, y) => ({
    x: Math.max(imageX, Math.min(x, imageX + imageWidth - cropArea.width)),
    y: Math.max(imageY, Math.min(y, imageY + imageHeight - cropArea.height)),
  });

  const checkBoundsForResize = (width, height) => ({
    width: Math.max(50, Math.min(width, imageX + imageWidth - cropArea.x)),
    height: Math.max(50, Math.min(height, imageY + imageHeight - cropArea.y)),
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (isResizing) {
        const { width, height } = checkBoundsForResize(cropArea.width + gestureState.dx, cropArea.height + gestureState.dy);
        setCropArea(prev => ({ ...prev, width, height }));
      } else {
        const { x, y } = checkBoundsForMove(cropArea.x + gestureState.dx, cropArea.y + gestureState.dy);
        setCropArea(prev => ({ ...prev, x, y }));
      }
    },
    onPanResponderRelease: () => setIsResizing(false),
    onPanResponderGrant: (evt, gestureState) => {
      const { pageX, pageY } = evt.nativeEvent;
      const isWithinXBounds = pageX >= cropArea.x + cropArea.width - 20 && pageX <= cropArea.x + cropArea.width;
      const isWithinYBounds = pageY >= cropArea.y + cropArea.height - 20 && pageY <= cropArea.y + cropArea.height;
      setIsResizing(isWithinXBounds && isWithinYBounds);
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
        style={[styles.image, { marginLeft: imageX, marginTop: imageY }]}
      />
      <View
        {...panResponder.panHandlers}
        style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
      />
      <Button title="Crop Image" onPress={cropImage} style={{ marginTop: 20 }} />
      <Text style={styles.debugText}>Crop Area X: {cropArea.x}, Y: {cropArea.y}</Text>
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
  image: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: 'contain',
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
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
