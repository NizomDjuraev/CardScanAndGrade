import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Assuming the image is centered on the screen
const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  // Margins initialized to simulate no initial adjustment
  const [margins, setMargins] = useState({
    left: 0,
    top: 0,
    right: imageWidth,
    bottom: imageHeight,
  });

  const adjustMargin = (direction, change) => {
    setMargins((currentMargins) => {
      const newMargins = { ...currentMargins };
      switch (direction) {
        case 'left':
          newMargins.left = Math.max(0, newMargins.left + change);
          break;
        case 'right':
          newMargins.right = Math.min(imageWidth, newMargins.right + change);
          break;
        case 'top':
          newMargins.top = Math.max(0, newMargins.top + change);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(imageHeight, newMargins.bottom + change);
          break;
      }
      return newMargins;
    });
  };

  // Handlers for each margin's pan responder
  const panResponder = (direction) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (direction === 'left' || direction === 'right') {
        adjustMargin(direction, gestureState.dx);
      } else {
        adjustMargin(direction, gestureState.dy);
      }
    },
    onPanResponderRelease: () => {
      // Optionally, handle the release of the margin adjustment here
    },
  });

  // Create pan responders for each margin
  const leftPanResponder = panResponder('left');
  const rightPanResponder = panResponder('right');
  const topPanResponder = panResponder('top');
  const bottomPanResponder = panResponder('bottom');

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginTop: imageY, marginLeft: imageX }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...leftPanResponder.panHandlers} style={[styles.touchArea, { left: margins.left - 20 }]} />
        <View {...topPanResponder.panHandlers} style={[styles.touchArea, { top: margins.top - 20 }]} />
        <View {...rightPanResponder.panHandlers} style={[styles.touchArea, { right: windowWidth - margins.right - imageX - 20 }]} />
        <View {...bottomPanResponder.panHandlers} style={[styles.touchArea, { bottom: windowHeight - margins.bottom - imageY - 20 }]} />
      </View>
      <Button title="Submit Margins" onPress={() => console.log('Adjusted Margins:', margins)} />
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
    position: 'relative',
    width: imageWidth,
    height: imageHeight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  touchArea: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)', // Transparent touch area
  },
});

export default AdjustBordersScreen;

