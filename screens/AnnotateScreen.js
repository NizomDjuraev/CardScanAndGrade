import React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';

export default function AnnotateScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
});