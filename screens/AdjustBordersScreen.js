import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';

const AdjustBordersScreen = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Placeholder image URI for testing purposes
    const placeholderImageUri = 'https://via.placeholder.com/300'; // Replace with any valid image URI

    const handleAdjustBorders = () => {
        // Your logic for adjusting the borders will go here
        setIsProcessing(true);
        console.log('Adjust borders clicked');
        // Simulate processing time
        setTimeout(() => {
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adjust Image Borders</Text>
            <Image source={{ uri: placeholderImageUri }} style={styles.previewImage} />
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
        color: 'white',
    },
    processingText: {
        marginTop: 20,
        fontSize: 16,
        color: 'grey',
    },
});

export default AdjustBordersScreen;

