import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';

const AdjustBordersScreen = ({ route, navigation }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageUri, setImageUri] = useState(route.params.imageUri); // Assuming imageUri is passed from the previous screen

    const handleAdjustBorders = () => {
        setIsProcessing(true);

        // Simulate image processing delay
        setTimeout(() => {
            setIsProcessing(false);
            // Here you would normally call the actual image manipulation logic
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adjust Image Borders</Text>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
            <Button title='Adjust Borders' onPress={handleAdjustBorders} style={styles.button} />
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
        margin: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    processingText: {
        marginTop: 20,
        fontSize: 16,
        color: 'grey',
    },
    // Add additional styling as needed
});

export default AdjustBordersScreen;

