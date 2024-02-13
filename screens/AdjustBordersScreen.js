import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, PanResponder, Dimensions } from 'react-native';

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

  // Update margins within the valid bounds
  const updateMargins = (edge, change) => {
    setMargins((prev) => {
      let newMargins = { ...prev };
      switch (edge) {
        case 'left':
          newMargins.left = Math.min(Math.max(0, prev.left + change), imageWidth - prev.right - 2);
          break;
        case 'right':
          newMargins.right = Math.min(Math.max(0, prev.right - change), imageWidth - prev.left - 2);
          break;
        case 'top':
          newMargins.top = Math.min(Math.max(0, prev.top + change), imageHeight - prev.bottom - 2);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(Math.max(0, prev.bottom - change), imageHeight - prev.top - 2);
          break;
        default:
          break;
      }
      return newMargins;
    });
  };

  // PanResponder logic
  const createPanResponder = (edge) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const change = (edge === 'left' || edge === 'right') ? gestureState.dx : gestureState.dy;
      updateMargins(edge, change);
    },
    onPanResponderRelease: () => {
      // No action needed on release
    },
  });

  // Initialize panResponders only once
  const [panResponders, setPanResponders] = useState({});
  useEffect(() => {
    setPanResponders({
      left: createPanResponder('left'),
      right: createPanResponder('right'),
      top: createPanResponder('top'),
      bottom: createPanResponder('bottom'),
    });
  }, []);

    // Calculate the centering score
  const calculateCentering = () => {
    const horizontalCentering = ((margins.left - margins.right) / imageWidth) * 100;
    const verticalCentering = ((margins.top - margins.bottom) / imageHeight) * 100;
    return {
      horizontal: horizontalCentering.toFixed(2),
      vertical: verticalCentering.toFixed(2),
    };
  };

  // Render the draggable borders and the image
  const renderBorders = () => (
    <>
      <View {...panResponders.left.panHandlers} style={[styles.border, { left: -1, top: 0, bottom: 0, width: 2 }]} />
      <View {...panResponders.top.panHandlers} style={[styles.border, { top: -1, left: 0, right: 0, height: 2 }]} />
      <View {...panResponders.right.panHandlers} style={[styles.border, { right: -1, top: 0, bottom: 0, width: 2 }]} />
      <View {...panResponders.bottom.panHandlers} style={[styles.border, { bottom: -1, left: 0, right: 0, height: 2 }]} />
    </>
  );

  const centering = calculateCentering();

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, {
        marginLeft: margins.left,
        marginTop: margins.top,
        marginRight: margins.right,
        marginBottom: margins.bottom,
      }]}>
        {renderBorders()}
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <View style={styles.centeringInfo}>
        <Text style={styles.centeringText}>Horizontal Centering: {centering.horizontal}%</Text>
        <Text style={styles.centeringText}>Vertical Centering: {centering.vertical}%</Text>
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
    width: windowWidth,
    height: windowHeight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: 'contain',
  },
  border: {
    position: 'absolute',
    backgroundColor: 'blue',
  },
  centeringInfo: {
    position: 'absolute',
    bottom: 20,
  },
  centeringText: {
    fontSize: 16,
    color: 'black',
  },
});

export default AdjustBordersScreen;
