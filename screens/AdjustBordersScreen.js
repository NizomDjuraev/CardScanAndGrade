import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const AdjustBordersScreen = () => {
    const [imageUri, setImageUri] = useState('https://via.placeholder.com/300'); // Placeholder image URI
    const [isProcessing, setIsProcessing] = useState(false);

    // Input states for crop values
    const [originX, setOriginX] = useState('');
    const [originY, setOriginY] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const handleAdjustBorders = async () => {
        setIsProcessing(true);

        try {
            const result = await ImageManipulator.manipulateAsync(
                imageUri,
                [
                    {
                        crop: {
                            originX: parseInt(originX, 10) || 0,
                            originY: parseInt(originY, 10) || 0,
                            width: parseInt(width, 10) || 300, // Default values are assuming the placeholder image size
                            height: parseInt(height, 10) || 300,
                        },
                    },
                ],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            setImageUri(result.uri);
        } catch (error) {
            console.error('Error adjusting borders:', error);
            alert('Failed to adjust borders. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adjust Image Borders</Text>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setOriginX}
                    value={originX}
                    placeholder='Origin X'
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setOriginY}
                    value={originY}
                    placeholder='Origin Y'
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setWidth}
                    value={width}
                    placeholder='Width'
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setHeight}
                    value={height}
                    placeholder='Height'
                    keyboardType='numeric'
                />
            </View>
            <Button title='Adjust Borders' onPress={handleAdjustBorders} />
            {isProcessing && <Text style={styles.processingText}>Processing...</Text>}
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
    previewImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        width: '20%',
        textAlign: 'center',
    },
    processingText: {
        marginTop: 20,
        fontSize: 16,
        color: 'grey',
    },
    // Additional styles if needed
});

export default AdjustBordersScreen;


