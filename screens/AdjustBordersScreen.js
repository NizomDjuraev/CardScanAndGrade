import React, { useState, useMemo } from 'react';
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

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const change = (edge === 'left' || edge === 'right') ? gestureState.dx : gestureState.dy;
        updateMargins(edge, change);
      },
      onPanResponderRelease: () => {
        // No action needed on release
      },
    });
  };

  const updateMargins = (edge, change) => {
    setMargins((prev) => {
      let newMargins = { ...prev };
      switch (edge) {
        case 'left':
          newMargins.left = Math.max(0, prev.left + change);
          break;
        case 'right':
          newMargins.right = Math.max(0, prev.right - change);
          break;
        case 'top':
          newMargins.top = Math.max(0, prev.top + change);
          break;
        case 'bottom':
          newMargins.bottom = Math.max(0, prev.bottom - change);
          break;
      }
      return newMargins;
    });
  };

  const panResponders = useMemo(() => ({
    left: createPanResponder('left'),
    right: createPanResponder('right'),
    top: createPanResponder('top'),
    bottom: createPanResponder('bottom'),
  }), []);

  const calculateCentering = () => {
    const horizontalCentering = ((margins.left - margins.right) / imageWidth) * 100;
    const verticalCentering = ((margins.top - margins.bottom) / imageHeight) * 100;
    return {
      horizontal: Math.abs(horizontalCentering).toFixed(2), // Using Math.abs to ensure positive values
      vertical: Math.abs(verticalCentering).toFixed(2),
    };
  };

  const centering = calculateCentering();

  const getBorderStyle = (key, margins) => {
    switch (key) {
      case 'left':
        return { left: -1, top: 0, bottom: 0, width: 2 };
      case 'right':
        return { right: -1, top: 0, bottom: 0, width: 2 };
      case 'top':
        return { top: -1, left: 0, right: 0, height: 2 };
      case 'bottom':
        return { bottom: -1, left: 0, right: 0, height: 2 };
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, {
        marginLeft: margins.left,
        marginTop: margins.top,
        marginRight: margins.right,
        marginBottom: margins.bottom,
      }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {Object.keys(panResponders).map((key) => (
          <View {...panResponders[key].panHandlers} key={key} style={[styles.border, getBorderStyle(key, margins)]} />
        ))}
      </View>
      <Text style={styles.centeringText}>Horizontal Centering: {centering.horizontal}%</Text>
      <Text style={styles.centeringText}>Vertical Centering: {centering.vertical}%</Text>
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
  centeringText: {
    fontSize: 16,
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
