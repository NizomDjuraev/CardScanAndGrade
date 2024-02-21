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
    left: 0,
    top: 0,
    right: windowWidth - imageWidth,
    bottom: windowHeight - imageHeight,
  });

  const updateMargin = (edge, change) => {
    setMargins((currentMargins) => {
      const newMargins = { ...currentMargins };
      switch (edge) {
        case 'left':
          newMargins.left = Math.min(Math.max(0, newMargins.left + change), imageWidth - newMargins.right - 10); // Ensure margin does not exceed image bounds
          break;
        case 'right':
          newMargins.right = Math.min(Math.max(0, newMargins.right - change), imageWidth - newMargins.left - 10);
          break;
        case 'top':
          newMargins.top = Math.min(Math.max(0, newMargins.top + change), imageHeight - newMargins.bottom - 10);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(Math.max(0, newMargins.bottom - change), imageHeight - newMargins.top - 10);
          break;
        default:
          break;
      }
      return newMargins;
    });
  };

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const change = edge === 'top' || edge === 'bottom' ? gesture.dy : gesture.dx;
        updateMargin(edge, change);
      },
      onPanResponderRelease: () => {
        // Optionally add code for when the pan responder releases the margin
      },
    });
  };

  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginLeft: margins.left, marginTop: margins.top }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.border, styles.leftBorder, { height: imageHeight - margins.top - margins.bottom }]} />
        <View {...panResponders.top.panHandlers} style={[styles.border, styles.topBorder, { width: imageWidth - margins.left - margins.right }]} />
        <View {...panResponders.right.panHandlers} style={[styles.border, styles.rightBorder, { height: imageHeight - margins.top - margins.bottom }]} />
        <View {...panResponders.bottom.panHandlers} style={[styles.border, styles.bottomBorder, { width: imageWidth - margins.left - margins.right }]} />
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
    borderWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden', // Ensure borders do not extend outside this container
  },
  image: {
    width: '100%',
    height: '100%',
  },
  border: {
    position: 'absolute',
    backgroundColor: 'black', // Solid color for visibility
  },
  leftBorder: {
    width: 2, // Visually smaller width
    left: 0,
    cursor: 'col-resize', // Improve UX with cursor hint
  },
  rightBorder: {
    width: 2,
    right: 0,
    cursor: 'col-resize',
  },
  topBorder: {
    height: 2,
    top: 0,
    cursor: 'row-resize',
  },
  bottomBorder: {
    height: 2,
    bottom: 0,
    cursor: 'row-resize',
  },
});

export default AdjustBordersScreen;
