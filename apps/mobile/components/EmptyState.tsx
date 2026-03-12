import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layers } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            {icon ? icon : <Layers color={Colors.dark.icon} size={48} />}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: Colors.dark.surfaceAlt,
        borderRadius: 16,
        marginVertical: 16,
    },
    title: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        textAlign: 'center',
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
