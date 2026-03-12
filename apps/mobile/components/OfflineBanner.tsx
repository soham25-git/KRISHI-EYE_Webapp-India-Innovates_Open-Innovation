import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export function OfflineBanner() {
    return (
        <View style={styles.container}>
            <WifiOff color={Colors.dark.text} size={16} />
            <Text style={styles.text}>You are offline</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.warning,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    text: {
        color: '#000', // Warning banner text should contrast well
        fontWeight: '600',
        fontSize: 14,
    },
});
