import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  // State to track margin line positions
  const [positions, setPositions] = useState({
    left: 0,
    top: 0,
    right: imageWidth,
    bottom: imageHeight,
  });

  // Function to create pan responder for each margin line
  const createPanResponder = (edge) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setPositions((prevPositions) => {
        const newPosition = { ...prevPositions };
        switch (edge) {
          case 'left':
            newPosition.left = Math.min(Math.max(0, prevPositions.left + gestureState.dx), newPosition.right - 10);
            break;
          case 'top':
            newPosition.top = Math.min(Math.max(0, prevPositions.top + gestureState.dy), newPosition.bottom - 10);
            break;
          case 'right':
            newPosition.right = Math.max(Math.min(imageWidth, prevPositions.right + gestureState.dx), newPosition.left + 10);
            break;
          case 'bottom':
            newPosition.bottom = Math.max(Math.min(imageHeight, prevPositions.bottom + gestureState.dy), newPosition.top + 10);
            break;
        }
        return newPosition;
      });
    },
  });

  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { top: imageY, left: imageX }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.draggableLine, styles.verticalLine, { left: positions.left }]} />
        <View {...panResponders.top.panHandlers} style={[styles.draggableLine, styles.horizontalLine, { top: positions.top }]} />
        <View {...panResponders.right.panHandlers} style={[styles.draggableLine, styles.verticalLine, { right: imageWidth - positions.right }]} />
        <View {...panResponders.bottom.panHandlers} style={[styles.draggableLine, styles.horizontalLine, { bottom: imageHeight - positions.bottom }]} />
      </View>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  draggableLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,0,0,0.5)', // Semi-transparent lines for visibility
  },
  verticalLine: {
    width: 2,
    height: '100%',
  },
  horizontalLine: {
    width: '100%',
    height: 2,
  },
});

export default AdjustBordersScreen;
