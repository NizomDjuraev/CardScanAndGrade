import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Button, Text, Dimensions } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AdjustBordersScreen = () => {
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/300');
  const [isResizing, setIsResizing] = useState(false);
  const imageWidth = 300;
  const imageHeight = 300;
  const imageX = (windowWidth - imageWidth) / 2;
  const imageY = (windowHeight - imageHeight) / 2;

  const [cropArea, setCropArea] = useState({
    x: imageX,
    y: imageY,
    width: 100,
    height: 100,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (isResizing) {
        const newWidth = Math.max(50, cropArea.width + gestureState.dx);
        const newHeight = Math.max(50, cropArea.height + gestureState.dy);
        setCropArea(prev => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
      } else {
        const newX = Math.max(imageX, Math.min(gestureState.moveX - cropArea.width / 2, imageX + imageWidth - cropArea.width));
        const newY = Math.max(imageY, Math.min(gestureState.moveY - cropArea.height / 2, imageY + imageHeight - cropArea.height));
        setCropArea(prev => ({
          ...prev,
          x: newX,
          y: newY,
        }));
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
      <View style={[styles.imageContainer, { marginTop: imageY }]}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image}
        />
        <View
          {...panResponder.panHandlers}
          style={[styles.cropArea, { left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }]}
        >
          {/* Bottom-right corner handle for resizing */}
          <View style={styles.resizeHandle} />
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey', // To visualize the container area
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cropArea: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'blue',
    // The width and height will be dynamically updated
  },
  resizeHandle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    opacity: 0.5,
  },
  debugText: {
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;

