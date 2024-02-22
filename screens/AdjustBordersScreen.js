import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Dimensions, Button } from 'react-native';

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

  const adjustMargin = (edge, change) => {
    setMargins((prevMargins) => {
      let newMargins = { ...prevMargins };
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

  // Pan responders for each margin
  const createPanResponder = (edge) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const change = edge === 'left' || edge === 'right' ? gestureState.dx : gestureState.dy;
      adjustMargin(edge, change);
    },
  });

  const panResponders = {
    left: createPanResponder('left'),
    top: createPanResponder('top'),
    right: createPanResponder('right'),
    bottom: createPanResponder('bottom'),
  };

  // Dotted lines for each margin
  const renderDottedLine = (edge) => {
    const length = edge === 'left' || edge === 'right' ? margins.bottom - margins.top : margins.right - margins.left;
    const numDots = Math.floor(length / 10);
    const dots = Array.from({ length: numDots }).map((_, index) => (
      <View key={index} style={[styles.dot, edge === 'top' || edge === 'bottom' ? styles.horizontalDot : styles.verticalDot]} />
    ));

    const lineStyle = [styles.dottedLine, styles[`${edge}Line`], {
      width: edge === 'left' || edge === 'right' ? 2 : length,
      height: edge === 'top' || edge === 'bottom' ? 2 : length,
      [edge]: edge === 'right' ? imageWidth - margins.right : margins[edge],
    }];

    return (
      <View {...panResponders[edge].panHandlers} style={lineStyle}>
        {dots}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {['left', 'top', 'right', 'bottom'].map(renderDottedLine)}
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
    width: imageWidth,
    height: imageHeight,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLine: {
    top: 0,
  },
  bottomLine: {
    bottom: 0,
  },
  leftLine: {
    left: 0,
    flexDirection: 'column',
  },
  rightLine: {
    right: 0,
    flexDirection: 'column',
  },
  dot: {
    backgroundColor: 'black',
    borderRadius: 1,
  },
  horizontalDot: {
    width: 2,
    height: 2,
    marginHorizontal: 2,
  },
  verticalDot: {
    width: 2,
    height: 2,
    marginVertical: 2,
  },
});

export default AdjustBordersScreen;
