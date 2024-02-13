import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, PanResponder, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  // Initialize margins so the draggable borders start at the edges of the image
  const [margins, setMargins] = useState({ left: imageX, top: imageY, right: windowWidth - (imageX + imageWidth), bottom: windowHeight - (imageY + imageHeight) });

  // Create pan responders for each edge
  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        setMargins((prev) => {
          let change = gestureState.dx; // Default to horizontal movement
          if (edge === 'top' || edge === 'bottom') {
            change = gestureState.dy; // Adjust for vertical movement
          }

          const newMargin = Math.max(0, prev[edge] + change); // Prevent negative margins
          return { ...prev, [edge]: newMargin };
        });
      },
      onPanResponderRelease: () => {
        // No action needed on release as per current requirements
      },
    });
  };

  // PanResponders for each border
  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  // Calculate the centering score
  const centeringScore = {
    horizontal: ((margins.left - margins.right) / imageWidth) * 100,
    vertical: ((margins.top - margins.bottom) / imageHeight) * 100,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginTop: imageY - margins.top, marginLeft: imageX - margins.left }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.border, { left: margins.left - imageX, top: 0, bottom: 0, width: 2 }]} />
        <View {...panResponders.top.panHandlers} style={[styles.border, { top: margins.top - imageY, left: 0, right: 0, height: 2 }]} />
        <View {...panResponders.right.panHandlers} style={[styles.border, { right: windowWidth - margins.right - imageWidth - imageX, top: 0, bottom: 0, width: 2 }]} />
        <View {...panResponders.bottom.panHandlers} style={[styles.border, { bottom: windowHeight - margins.bottom - imageHeight - imageY, left: 0, right: 0, height: 2 }]} />
      </View>
      <Text style={styles.centeringText}>Horizontal Centering: {centeringScore.horizontal.toFixed(2)}%</Text>
      <Text style={styles.centeringText}>Vertical Centering: {centeringScore.vertical.toFixed(2)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'grey',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  border: {
    position: 'absolute',
    backgroundColor: 'blue',
  },
  centeringText: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
