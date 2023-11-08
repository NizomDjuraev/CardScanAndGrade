import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  const retakePicture = () => {
    setCapturedPhoto(null);
  };

  const openCameraRoll = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("This app doesn have permission to access your camera roll");
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true) {
      return;
    }
  
    setCapturedPhoto(pickerResult.uri);
  };


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <TouchableOpacity onPress={retakePicture} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraFooter}>
            <TouchableOpacity onPress={openCameraRoll} style={styles.iconButton}>
              <MaterialIcons name="insert-photo" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} style={styles.takePictureButton} />
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  cameraFooter: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  takePictureButton: {
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#1D9DB9',
    borderRadius: 35,
  },
  cameraRollButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1D9DB9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraRollButtonText: {
    color: 'white',
    fontSize: 16,
  },
  placeholderButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1D9DB9',
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});