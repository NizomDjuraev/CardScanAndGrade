import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      {capturedPhoto ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedPhoto }} style={{ flex: 1 }} />
          <TouchableOpacity onPress={retakePicture} style={{ position: 'absolute', top: 20, left: 20 }}>
            <Text style={{ fontSize: 18, color: 'white' }}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={{ flex: 1 }} ref={cameraRef}>
          <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={takePicture}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}
