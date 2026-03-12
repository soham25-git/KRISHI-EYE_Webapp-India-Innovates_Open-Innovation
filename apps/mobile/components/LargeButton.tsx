import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface LargeButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

export function LargeButton({ title, variant = 'primary', icon, style, containerStyle, ...props }: LargeButtonProps) {

    const getBackgroundColor = () => {
        switch (variant) {
            case 'secondary': return Colors.dark.surfaceAlt;
            case 'outline': return 'transparent';
            default: return Colors.dark.tint;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline': return Colors.dark.tint;
            default: return Colors.dark.text;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outlineButton,
                containerStyle,
                style
            ]}
            activeOpacity={0.8}
            {...props}
        >
            {icon && <React.Fragment>{icon}</React.Fragment>}
            <Text style={[
                styles.text,
                { color: getTextColor() },
                icon ? { marginLeft: 8 } : {}
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 12,
        minHeight: 56, // Large touch target
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: Colors.dark.tint,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
});
