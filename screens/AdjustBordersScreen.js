import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';



const imageWidth = 281;
const imageHeight = 500;

const AdjustBordersScreen = ({ navigation }) => {
  const route = useRoute();
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    if (route.params && route.params.imageData) {
      setImageUri(route.params.imageData.uri);
    }
  }, [route.params]);

  const nextButton = async () => {
    navigation.navigate("Annotate", { imageData: { uri: imageUri } });
  };

  const [squareDimensions, setSquareDimensions] = useState({
    width: 100,
    height: 100,
    top: 50,
    left: 50,

    
  });

  const [secondSquareDimensions, setSecondSquareDimensions] = useState({
    width: 80,
    height: 80,
    top: 150,
    left: 150,
  });

  const panResponderLeft = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = squareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + 20 &&
        y0 >= top && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && dx < 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dx } = gestureState;
      const newWidth = Math.max(50, squareDimensions.width - dx);
      setSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        width: newWidth,
        left: prevDimensions.left + dx
      }));
    }
  });

  const panResponderRight = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = squareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left + width - 20 && x0 <= left + width &&
        y0 >= top && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && dx > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dx } = gestureState;
      const newWidth = Math.max(50, squareDimensions.width + dx);
      setSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        width: newWidth,
      }));
    }
  });

  const panResponderTop = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = squareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + width &&
        y0 >= top && y0 <= top + 20
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dy) > Math.abs(dx) && dy < 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dy } = gestureState;
      const newHeight = Math.max(50, squareDimensions.height - dy);
      setSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        height: newHeight,
        top: prevDimensions.top + dy
      }));
    }
  });

  const panResponderBottom = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = squareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + width &&
        y0 >= top + height - 20 && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dy) > Math.abs(dx) && dy > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dy } = gestureState;
      const newHeight = Math.max(50, squareDimensions.height + dy);
      setSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        height: newHeight,
      }));
    }
  });

  const edgeResponderLeft = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = secondSquareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + 20 &&
        y0 >= top && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && dx < 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dx } = gestureState;
      const newWidth = Math.max(50, secondSquareDimensions.width - dx);
      setSecondSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        width: newWidth,
        left: prevDimensions.left + dx
      }));
    }
  });

  const edgeResponderRight = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = secondSquareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left + width - 20 && x0 <= left + width &&
        y0 >= top && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) && dx > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dx } = gestureState;
      const newWidth = Math.max(50, secondSquareDimensions.width + dx);
      setSecondSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        width: newWidth,
      }));
    }
  });

  const edgeResponderTop = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = secondSquareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + width &&
        y0 >= top && y0 <= top + 20
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dy) > Math.abs(dx) && dy < 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dy } = gestureState;
      const newHeight = Math.max(50, secondSquareDimensions.height - dy);
      setSecondSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        height: newHeight,
        top: prevDimensions.top + dy
      }));
    }
  });

  const edgeResponderBottom = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const { left, top, width, height } = secondSquareDimensions;
      const { x0, y0 } = gestureState;
      return (
        x0 >= left && x0 <= left + width &&
        y0 >= top + height - 20 && y0 <= top + height
      );
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dy) > Math.abs(dx) && dy > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      const { dy } = gestureState;
      const newHeight = Math.max(50, secondSquareDimensions.height + dy);
      setSecondSquareDimensions(prevDimensions => ({
        ...prevDimensions,
        height: newHeight,
      }));
    }
  });

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View {...panResponderLeft.panHandlers} style={[styles.resizableSquare, styles.leftResizer, { height: squareDimensions.height, top: squareDimensions.top, left: squareDimensions.left }]} />
          <View {...panResponderRight.panHandlers} style={[styles.resizableSquare, styles.rightResizer, { height: squareDimensions.height, top: squareDimensions.top+10, left: squareDimensions.left + squareDimensions.width }]} />
          <View {...panResponderTop.panHandlers} style={[styles.resizableSquare, styles.topResizer, { width: squareDimensions.width, top: squareDimensions.top, left: squareDimensions.left+10}]} />
          <View {...panResponderBottom.panHandlers} style={[styles.resizableSquare, styles.bottomResizer, { width: squareDimensions.width, top: squareDimensions.top + squareDimensions.height, left: squareDimensions.left }]} />

          <View {...edgeResponderLeft.panHandlers} style={[styles.resizableEdges, styles.leftEdge, { height: secondSquareDimensions.height, top: secondSquareDimensions.top, left: secondSquareDimensions.left  }]} />
          <View {...edgeResponderRight.panHandlers} style={[styles.resizableEdges, styles.rightEdge, { height: secondSquareDimensions.height, top: secondSquareDimensions.top+10, left: secondSquareDimensions.left + secondSquareDimensions.width }]} />
          <View {...edgeResponderTop.panHandlers} style={[styles.resizableEdges, styles.topEdge, { width: secondSquareDimensions.width, top: secondSquareDimensions.top , left: secondSquareDimensions.left+10 }]} />
          <View {...edgeResponderBottom.panHandlers} style={[styles.resizableEdges, styles.bottomEdge, { width: secondSquareDimensions.width, top: secondSquareDimensions.top + secondSquareDimensions.height, left: secondSquareDimensions.left }]} />
        </View>
      ) : null}
     
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={nextButton} style={styles.next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
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
    width: imageWidth,
    height: imageHeight,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  resizableSquare: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    zIndex: 1000,
  },
  leftResizer: {
    width: 10,
  },
  rightResizer: {
    width: 10,
  },
  topResizer: {
    height: 10,
  },
  bottomResizer: {
    height: 10,
  },

  resizableEdges: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.5)',
    zIndex: 1000,
  },
  leftEdge: {
    width: 10,
  },
  rightEdge: {
    width: 10,
  },
  topEdge: {
    height: 10,
  },
  bottomEdge: {
    height: 10,
  },

  next: {
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdjustBordersScreen;
