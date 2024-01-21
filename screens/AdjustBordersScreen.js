import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, TextInput } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const AdjustBordersScreen = ({ route, navigation }) => {
    const [adjustedUri, setAdjustedUri] = useState(null);
    const [cropParams, setCropParams] = useState({ originX: 0, originY: 0, width: 100, height: 100 });
    const imageUri = route.params.imageUri; // Placeholder image URI

    const handleAdjustBorders = async () => {
        try {
            const result = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ crop: cropParams }],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setAdjustedUri(result.uri);
        } catch (error) {
            console.error('Error adjusting image:', error);
        }
    };

    const updateCropParam = (param, value) => {
        setCropParams({...cropParams, [param]: parseInt(value) });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adjust Image Borders</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    onChangeText={(value) => updateCropParam('originX', value)}
                    placeholder="Origin X"
                    keyboardType="numeric"
                />
                <TextInput 
                    style={styles.input} 
                    onChangeText={(value) => updateCropParam('originY', value)}
                    placeholder="Origin Y"
                    keyboardType="numeric"
                />
                <TextInput 
                    style={styles.input} 
                    onChangeText={(value) => updateCropParam('width', value)}
                    placeholder="Width"
                    keyboardType="numeric"
                />
                <TextInput 
                    style={styles.input} 
                    onChangeText={(value) => updateCropParam('height', value)}
                    placeholder="Height"
                    keyboardType="numeric"
                />
            </View>
            {imageUri && !adjustedUri && (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}
            {adjustedUri && (
                <Image source={{ uri: adjustedUri }} style={styles.adjustedImage} />
            )}
            <Button title='Adjust Borders' onPress={handleAdjustBorders} style={styles.button} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginRight: 10,
        width: 70,
    },
    previewImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        margin: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    adjustedImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        margin: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    // Additional styling as needed
});

export default AdjustBordersScreen;


