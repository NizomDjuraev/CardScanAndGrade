import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, PanResponder, Dimensions, Button } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = 300;
const imageHeight = 300;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  const [margins, setMargins] = useState({
    left: 0,
    top: 0,
    right: imageWidth,
    bottom: imageHeight,
  });

  const updateMargin = (edge, change) => {
    setMargins((currentMargins) => {
      const newMargins = { ...currentMargins };
      switch (edge) {
        case 'left':
          newMargins.left = Math.max(0, Math.min(newMargins.left + change, newMargins.right - 10));
          break;
        case 'right':
          newMargins.right = Math.max(newMargins.left + 10, Math.min(imageWidth, newMargins.right + change));
          break;
        case 'top':
          newMargins.top = Math.max(0, Math.min(newMargins.top + change, newMargins.bottom - 10));
          break;
        case 'bottom':
          newMargins.bottom = Math.max(newMargins.top + 10, Math.min(imageHeight, newMargins.bottom + change));
          break;
      }
      return newMargins;
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy !== 0 && (gestureState.moveY > margins.top && gestureState.moveY < margins.bottom)) {
        updateMargin('top', gestureState.dy);
        updateMargin('bottom', gestureState.dy);
      }
      if (gestureState.dx !== 0 && (gestureState.moveX > margins.left && gestureState.moveX < margins.right)) {
        updateMargin('left', gestureState.dx);
        updateMargin('right', gestureState.dx);
      }
    },
  });

  // Function to generate dotted lines
  const generateDots = (orientation, length) => {
    let dots = [];
    const numDots = Math.floor(length / 10);
    for (let i = 0; i < numDots; i++) {
      dots.push(<View key={i} style={[styles.dot, orientation === 'horizontal' ? styles.dotHorizontal : styles.dotVertical]} />);
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers} style={[styles.imageContainer, { marginLeft: margins.left, marginTop: margins.top, width: margins.right - margins.left, height: margins.bottom - margins.top }]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={[styles.dottedLine, styles.dottedLineTop]}>{generateDots('horizontal', margins.right - margins.left)}</View>
        <View style={[styles.dottedLine, styles.dottedLineLeft]}>{generateDots('vertical', margins.bottom - margins.top)}</View>
        <View style={[styles.dottedLine, styles.dottedLineRight, { right: 0 }]}>{generateDots('vertical', margins.bottom - margins.top)}</View>
        <View style={[styles.dottedLine, styles.dottedLineBottom, { bottom: 0 }]}>{generateDots('horizontal', margins.right - margins.left)}</View>
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
    borderWidth: 1,
    borderColor: 'grey',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dottedLine: {
    position: 'absolute',
    flexDirection: 'row',
  },
  dottedLineTop: {
    top: -1,
    left: 0,
  },
  dottedLineLeft: {
    top: 0,
    left: -1,
    flexDirection: 'column',
  },
  dottedLineRight: {
    top: 0,
    flexDirection: 'column',
  },
  dottedLineBottom: {
    left: 0,
  },
  dot: {
    backgroundColor: 'black',
    borderRadius: 50,
  },
  dotHorizontal: {
    width: 2,
    height: 2,
    marginHorizontal: 4,
  },
  dotVertical: {
    width: 2,
    height: 2,
    marginVertical: 4,
  },
});

export default AdjustBordersScreen;
