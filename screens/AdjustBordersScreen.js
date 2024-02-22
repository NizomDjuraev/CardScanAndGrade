import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';

const windowDimensions = Dimensions.get('window');
const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowDimensions.width - imageWidth) / 2; // Center horizontally
const imageY = (windowDimensions.height - imageHeight) / 2; // Center vertically

const AdjustBordersScreen = () => {
  const [margins, setMargins] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  // Ensure margin adjustments do not allow the handlers to go off the photo
  const updateMargin = (direction, change) => {
    setMargins((currentMargins) => {
      let newMargins = { ...currentMargins };
      switch (direction) {
        case 'left':
          newMargins.left = Math.min(Math.max(0, newMargins.left + change), imageWidth - newMargins.right);
          break;
        case 'right':
          newMargins.right = Math.min(Math.max(0, newMargins.right - change), imageWidth - newMargins.left);
          break;
        case 'top':
          newMargins.top = Math.min(Math.max(0, newMargins.top + change), imageHeight - newMargins.bottom);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(Math.max(0, newMargins.bottom - change), imageHeight - newMargins.top);
          break;
      }
      return newMargins;
    });
  };

  // Handlers for pan responders
  const panResponder = (direction) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const change = direction === 'top' || direction === 'bottom' ? gestureState.dy : gestureState.dx;
      updateMargin(direction, change);
    },
  });

  // Create pan responders for each direction
  const leftPanResponder = panResponder('left').panHandlers;
  const rightPanResponder = panResponder('right').panHandlers;
  const topPanResponder = panResponder('top').panHandlers;
  const bottomPanResponder = panResponder('bottom').panHandlers;

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { top: imageY, left: imageX }]}>
        {/* Margin Lines */}
        <View style={[styles.marginLine, { top: -margins.top - 1, left: -margins.left - 1, right: -margins.right - 1, height: 2 }]} />
        <View style={[styles.marginLine, { left: -margins.left - 1, top: -margins.top - 1, bottom: -margins.bottom - 1, width: 2 }]} />
        <View style={[styles.marginLine, { right: -margins.right - 1, top: -margins.top - 1, bottom: -margins.bottom - 1, width: 2 }]} />
        <View style={[styles.marginLine, { bottom: -margins.bottom - 1, left: -margins.left - 1, right: -margins.right - 1, height: 2 }]} />

        {/* Handlers for Adjusting Margins */}
        <View {...topPanResponder} style={[styles.handler, { top: -20 - margins.top }]} />
        <View {...leftPanResponder} style={[styles.handler, { left: -20 - margins.left }]} />
        <View {...rightPanResponder} style={[styles.handler, { right: -20 - margins.right }]} />
        <View {...bottomPanResponder} style={[styles.handler, { bottom: -20 - margins.bottom }]} />

        <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
      </View>
      <Button title="Submit Margins" onPress={() => console.log('Margins:', margins)} />
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
    position: 'absolute',
    width: imageWidth,
    height: imageHeight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  handler: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'blue',
  },
  marginLine: {
    position: 'absolute',
    backgroundColor: 'red',
  },
});

export default AdjustBordersScreen;
