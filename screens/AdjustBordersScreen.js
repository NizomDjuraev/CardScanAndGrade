import React, { useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Text, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Constants for the image dimensions and initial position
const imageWidth = 300;
const imageHeight = 300;
const imageX = (windowWidth - imageWidth) / 2;
const imageY = (windowHeight - imageHeight) / 2;

const AdjustBordersScreen = () => {
  const [imageUri] = useState('https://via.placeholder.com/300');
  const [borders, setBorders] = useState({
    left: imageX,
    top: imageY,
    right: imageX + imageWidth,
    bottom: imageY + imageHeight,
  });

  const createBorderPanResponder = (borderName) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newBorders = { ...borders };
        switch (borderName) {
          case 'left':
            newBorders.left = Math.min(newBorders.right - 50, Math.max(imageX, gestureState.moveX));
            break;
          case 'top':
            newBorders.top = Math.min(newBorders.bottom - 50, Math.max(imageY, gestureState.moveY));
            break;
          case 'right':
            newBorders.right = Math.max(newBorders.left + 50, Math.min(imageX + imageWidth, gestureState.moveX));
            break;
          case 'bottom':
            newBorders.bottom = Math.max(newBorders.top + 50, Math.min(imageY + imageHeight, gestureState.moveY));
            break;
        }
        setBorders(newBorders);
      },
      onPanResponderTerminationRequest: () => false,
    });
  };

  // Handlers for moving the border lines
  const leftPanResponder = createBorderPanResponder('left');
  const topPanResponder = createBorderPanResponder('top');
  const rightPanResponder = createBorderPanResponder('right');
  const bottomPanResponder = createBorderPanResponder('bottom');

  // Calculate the centering based on the position of the borders
  const calculateCentering = () => {
    const leftMargin = borders.left - imageX;
    const rightMargin = imageWidth - (borders.right - imageX);
    const topMargin = borders.top - imageY;
    const bottomMargin = imageHeight - (borders.bottom - imageY);

    // Calculate centering as the difference between opposing margins
    // as a percentage of the total width or height.
    const horizontalCentering = ((rightMargin - leftMargin) / (leftMargin + rightMargin)) * 100;
    const verticalCentering = ((bottomMargin - topMargin) / (topMargin + bottomMargin)) * 100;

    // Ensure centering is within the range -100 to 100
    // Negative values mean the image is off-center to the left or top
    // Positive values mean the image is off-center to the right or bottom
    return {
      horizontalCentering: Math.max(-100, Math.min(100, horizontalCentering)),
      verticalCentering: Math.max(-100, Math.min(100, verticalCentering)),
    };
  };

  // Function to submit centering data
  const submitCentering = () => {
    const centering = calculateCentering();
    // Here you would handle the submission of the centering data
    console.log(centering);
  };

  // Render the draggable border lines
  const renderBorderLines = () => (
    <>
      <View
        {...leftPanResponder.panHandlers}
        style={[styles.borderLineVertical, { left: borders.left - 1 }]}
      />
      <View
        {...topPanResponder.panHandlers}
        style={[styles.borderLineHorizontal, { top: borders.top - 1 }]}
      />
      <View
        {...rightPanResponder.panHandlers}
        style={[styles.borderLineVertical, { left: borders.right - 1 }]}
      />
      <View
        {...bottomPanResponder.panHandlers}
        style={[styles.borderLineHorizontal, { top: borders.bottom - 1 }]}
      />
    </>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {renderBorderLines()}
      </View>
      <Text style={styles.debugText} onPress={submitCentering}>
        Submit Centering
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    position: 'relative',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
  borderLineVertical: {
    position: 'absolute',
    top: imageY,
    height: imageHeight,
    width: 2,
    backgroundColor: 'red',
  },
  borderLineHorizontal: {
    position: 'absolute',
    left: imageX,
    width: imageWidth,
    height: 2,
    backgroundColor: 'red',
  },
  debugText: {
    color: 'black',
    marginTop: 20,
  },
});

export default AdjustBordersScreen;
