import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput
} from 'react-native';

const AdjustBordersScreen = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    // Placeholder image URI for testing purposes
    const placeholderImageUri = 'https://via.placeholder.com/300';

    // Input states
    const [originX, setOriginX] = useState('0');
    const [originY, setOriginY] = useState('0');
    const [width, setWidth] = useState('100');
    const [height, setHeight] = useState('100');

    const handleAdjustBorders = () => {
        // Example logic for adjusting borders
        setIsProcessing(true);
        console.log(`Adjusting borders with: originX: ${originX}, originY: ${originY}, width: ${width}, height: ${height}`);
        // Simulate processing time
        setTimeout(() => {
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Adjust Image Borders</Text>
                <Image source={{ uri: placeholderImageUri }} style={styles.previewImage} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setOriginX}
                        value={originX}
                        keyboardType='numeric'
                        placeholder='Origin X'
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setOriginY}
                        value={originY}
                        keyboardType='numeric'
                        placeholder='Origin Y'
                    />
                    {/* Inputs for Width and Height */}
                    {/* ... */}
                </View>
                <Button title='Adjust Borders' onPress={handleAdjustBorders} />
                {isProcessing && <Text style={styles.processingText}>Processing...</Text>}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
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
    // Add additional styling as needed
});

export default AdjustBordersScreen;


