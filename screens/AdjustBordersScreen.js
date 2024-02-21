import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';

const windowDimensions = Dimensions.get('window');
const imageWidth = 300;
const imageHeight = 300;

const AdjustBordersScreen = () => {
  // Margins state to hold the offsets
  const [margins, setMargins] = useState({
    top: 0,
    bottom: imageHeight,
    left: 0,
    right: imageWidth,
  });

  // Helper to update margins based on the movement
  const updateMargin = (direction, change) => {
    setMargins((prevMargins) => {
      let newMargins = { ...prevMargins };
      switch (direction) {
        case 'left':
          newMargins.left = Math.max(0, Math.min(newMargins.left + change, prevMargins.right - 10));
          break;
        case 'right':
          newMargins.right = Math.max(newMargins.right + change, prevMargins.left + 10);
          break;
        case 'top':
          newMargins.top = Math.max(0, Math.min(newMargins.top + change, prevMargins.bottom - 10));
          break;
        case 'bottom':
          newMargins.bottom = Math.max(newMargins.bottom + change, prevMargins.top + 10);
          break;
      }
      return newMargins;
    });
  };

  // Creating pan responders for each margin
  const createPanResponder = (direction) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (['left', 'right'].includes(direction)) {
        updateMargin(direction, gesture.dx);
      } else {
        updateMargin(direction, gesture.dy);
      }
    },
  });

  const leftPanResponder = createPanResponder('left');
  const rightPanResponder = createPanResponder('right');
  const topPanResponder = createPanResponder('top');
  const bottomPanResponder = createPanResponder('bottom');

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Image */}
        <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />

        {/* Margin Handlers */}
        <View {...leftPanResponder.panHandlers} style={[styles.handler, styles.leftHandler, { left: margins.left - 20 }]} />
        <View {...topPanResponder.panHandlers} style={[styles.handler, styles.topHandler, { top: margins.top - 20 }]} />
        <View {...rightPanResponder.panHandlers} style={[styles.handler, styles.rightHandler, { right: (imageWidth - margins.right) - 20 }]} />
        <View {...bottomPanResponder.panHandlers} style={[styles.handler, styles.bottomHandler, { bottom: (imageHeight - margins.bottom) - 20 }]} />
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
    width: imageWidth,
    height: imageHeight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  handler: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent for visibility
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHandler: {
    marginLeft: -20,
  },
  rightHandler: {
    marginRight: -20,
  },
  topHandler: {
    marginTop: -20,
  },
  bottomHandler: {
    marginBottom: -20,
  },
});

export default AdjustBordersScreen;
