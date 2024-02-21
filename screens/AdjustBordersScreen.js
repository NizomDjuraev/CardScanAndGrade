import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, PanResponder, Dimensions, Button } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  const [margins, setMargins] = useState({
    left: imageX,
    top: imageY,
    right: windowWidth - (imageX + imageWidth),
    bottom: windowHeight - (imageY + imageHeight),
  });

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        setMargins((prev) => {
          let change = gestureState.dx;
          if (edge === 'top' || edge === 'bottom') {
            change = gestureState.dy;
          }

          let newMargin = prev[edge] + change;

          // Constrain the margins to the image area
          if (edge === 'left' || edge === 'right') {
            const maxHorizontalMargin = windowWidth - imageWidth;
            newMargin = Math.min(Math.max(0, newMargin), maxHorizontalMargin);
          } else {
            const maxVerticalMargin = windowHeight - imageHeight;
            newMargin = Math.min(Math.max(0, newMargin), maxVerticalMargin);
          }

          return { ...prev, [edge]: newMargin };
        });
      },
    });
  };

  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Margins submitted:', margins);
  };

  // Calculate centering score
  const centeringScore = {
    horizontal: ((margins.left - (windowWidth - margins.right - imageWidth)) / imageWidth) * 100,
    vertical: ((margins.top - (windowHeight - margins.bottom - imageHeight)) / imageHeight) * 100,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginTop: imageY - margins.top, marginLeft: imageX - margins.left }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.border, { left: margins.left - imageX, top: -10, bottom: -10, width: 20 }]} />
        <View {...panResponders.top.panHandlers} style={[styles.border, { top: margins.top - imageY, left: -10, right: -10, height: 20 }]} />
        <View {...panResponders.right.panHandlers} style={[styles.border, { right: windowWidth - margins.right - imageWidth - imageX, top: -10, bottom: -10, width: 20 }]} />
        <View {...panResponders.bottom.panHandlers} style={[styles.border, { bottom: windowHeight - margins.bottom - imageHeight - imageY, left: -10, right: -10, height: 20 }]} />
      </View>
      <Text style={styles.centeringText}>Horizontal Centering: {centeringScore.horizontal.toFixed(2)}%</Text>
      <Text style={styles.centeringText}>Vertical Centering: {centeringScore.vertical.toFixed(2)}%</Text>
      <Button title="Submit Margins" onPress={handleSubmit} />
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
    backgroundColor: 'black', // Change border color to black
    // Note: React Native does not directly support dotted borders in the same way as CSS
    // For a dotted effect, consider using a repeating background image or a custom drawing approach
    margin: -10, // Keep the extended touchable area
    padding: 10, // Retain the larger touch target size
    width: 20, // Increase the visual width for vertical borders
    height: 20, // Increase the visual height for horizontal borders
  },
  centeringText: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
