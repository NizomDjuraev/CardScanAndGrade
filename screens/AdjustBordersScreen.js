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

  const updateMargin = (edge, change) => {
    setMargins((currentMargins) => {
      let newMargins = { ...currentMargins };
      const maxRight = imageWidth - newMargins.left;
      const maxBottom = imageHeight - newMargins.top;

      switch (edge) {
        case 'left':
          newMargins.left = Math.min(Math.max(0, newMargins.left + change), maxRight);
          break;
        case 'right':
          newMargins.right = Math.min(Math.max(0, newMargins.right - change), maxRight);
          break;
        case 'top':
          newMargins.top = Math.min(Math.max(0, newMargins.top + change), maxBottom);
          break;
        case 'bottom':
          newMargins.bottom = Math.min(Math.max(0, newMargins.bottom - change), maxBottom);
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
    });
  };

  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  // Function to generate dotted lines
  const generateDots = (orientation) => {
    let dots = [];
    const numDots = orientation === 'horizontal' ? Math.floor(imageWidth / 10) : Math.floor(imageHeight / 10);
    for (let i = 0; i < numDots; i++) {
      dots.push(
        <View key={i} style={[styles.dot, orientation === 'horizontal' ? styles.dotHorizontal : styles.dotVertical]} />
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { marginLeft: margins.left, marginTop: margins.top }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View {...panResponders.left.panHandlers} style={[styles.marginTouchable, styles.marginLeft]}>
          {generateDots('vertical')}
        </View>
        <View {...panResponders.top.panHandlers} style={[styles.marginTouchable, styles.marginTop]}>
          {generateDots('horizontal')}
        </View>
        <View {...panResponders.right.panHandlers} style={[styles.marginTouchable, styles.marginRight]}>
          {generateDots('vertical')}
        </View>
        <View {...panResponders.bottom.panHandlers} style={[styles.marginTouchable, styles.marginBottom]}>
          {generateDots('horizontal')}
        </View>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  marginTouchable: {
    position: 'absolute',
    backgroundColor: 'transparent', // Ensure dots are visible, not the touchable area
  },
  marginLeft: {
    left: 0,
    width: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  marginRight: {
    right: 0,
    width: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  marginTop: {
    top: 0,
    height: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom: {
    bottom: 0,
    height: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    backgroundColor: 'black',
    borderRadius: 50,
  },
  dotHorizontal: {
    width: 2,
    height: 2,
  },
  dotVertical: {
    width: 2,
    height: 2,
  },
});

export default AdjustBordersScreen;
