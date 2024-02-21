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
    right: 0,
    bottom: 0,
  });

  const updateMargins = (edge, change) => {
    // Update margins ensuring they stay within the photo's boundaries
    setMargins((prev) => {
      let newMargins = { ...prev };
      switch (edge) {
        case 'left':
          newMargins.left = Math.min(Math.max(0, prev.left + change), imageWidth - prev.right);
          break;
        case 'right':
          newMargins.right = Math.min(Math.max(0, prev.right - change), imageWidth - prev.left);
          break;
        case 'top':
          newMargins.top = Math.min(Math.max(0, prev.top + change), imageHeight - prev.bottom);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(Math.max(0, prev.bottom - change), imageHeight - prev.top);
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
      onPanResponderMove: (event, gestureState) => {
        const change = edge === 'left' || edge === 'right' ? gestureState.dx : gestureState.dy;
        updateMargins(edge, change);
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
    console.log('Margins submitted:', margins);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginLeft: margins.left, marginTop: margins.top }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {Object.keys(panResponders).map((edge) => (
          <View
            key={edge}
            {...panResponders[edge].panHandlers}
            style={[
              styles.border,
              edge === 'left' || edge === 'right'
                ? { height: imageHeight, width: 20 }
                : { width: imageWidth, height: 20 },
              styles[edge],
            ]}
          />
        ))}
      </View>
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
    backgroundColor: 'black', // Changed to black for visibility
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
  },
  right: {
    right: 0,
    top: 0,
    bottom: 0,
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AdjustBordersScreen;
