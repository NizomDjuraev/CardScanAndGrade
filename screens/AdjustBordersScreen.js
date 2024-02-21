import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';

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
    right: imageX,
    bottom: imageY,
  });

  const createPanResponder = (edge) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        
        setMargins((prevMargins) => {
          let newMargins = { ...prevMargins };

          switch (edge) {
            case 'left':
              newMargins.left = Math.min(Math.max(0, prevMargins.left + dx), imageWidth - (prevMargins.right + 2));
              break;
            case 'top':
              newMargins.top = Math.min(Math.max(0, prevMargins.top + dy), imageHeight - (prevMargins.bottom + 2));
              break;
            case 'right':
              newMargins.right = Math.min(Math.max(0, prevMargins.right - dx), imageWidth - (prevMargins.left + 2));
              break;
            case 'bottom':
              newMargins.bottom = Math.min(Math.max(0, prevMargins.bottom - dy), imageHeight - (prevMargins.top + 2));
              break;
          }

          return newMargins;
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

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginTop: margins.top, marginLeft: margins.left, marginRight: margins.right, marginBottom: margins.bottom }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.marginLine, styles.marginLineVertical, { left: -20 }]} />
        <View {...panResponders.top.panHandlers} style={[styles.marginLine, styles.marginLineHorizontal, { top: -20 }]} />
        <View {...panResponders.right.panHandlers} style={[styles.marginLine, styles.marginLineVertical, { right: -20 }]} />
        <View {...panResponders.bottom.panHandlers} style={[styles.marginLine, styles.marginLineHorizontal, { bottom: -20 }]} />
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
    position: 'relative',
    width: imageWidth, // Keep image width static
    height: imageHeight, // Keep image height static
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  marginLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0)', // Transparent lines for touch area, not visual
  },
  marginLineVertical: {
    height: '100%',
    width: 40, // Wider touch area for easier interaction
    top: 0,
  },
  marginLineHorizontal: {
    width: '100%',
    height: 40, // Wider touch area for easier interaction
    left: 0,
  },
});

export default AdjustBordersScreen;
