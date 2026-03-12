import { StyleSheet, View, Text, Switch, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/Card';
import { Map as MapIcon, Play } from 'lucide-react-native';
import { useState } from 'react';

export default function MapScreen() {
    const [reducedMotion, setReducedMotion] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Live Field View</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Reduced Motion</Text>
                    <Switch
                        value={reducedMotion}
                        onValueChange={setReducedMotion}
                        trackColor={{ false: Colors.dark.surfaceAlt, true: Colors.dark.tint }}
                    />
                </View>
            </View>

            <View style={styles.mapShell}>
                {/* Placeholder for actual Map implementation */}
                <MapIcon color={Colors.dark.surfaceAlt} size={120} />
                <Text style={styles.mapPlaceholderText}>
                    Map Visualization Layer
                </Text>
                <Text style={styles.mapSubText}>
                    (Awaiting integration of animated playback and heatmap)
                </Text>
            </View>

            <View style={styles.playbackControls}>
                <Card style={styles.playbackCard}>
                    <View style={styles.playRow}>
                        <View style={styles.playButtonIcon}>
                            <Play color={Colors.dark.background} size={24} fill={Colors.dark.background} />
                        </View>
                        <View>
                            <Text style={styles.playTitle}>Tractor 1 - Spraying</Text>
                            <Text style={styles.playSubtitle}>Active 2 hours ago</Text>
                        </View>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    mapShell: {
        flex: 1,
        backgroundColor: '#0c1222', // Deeper shade for map area
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    mapPlaceholderText: {
        marginTop: 24,
        fontSize: 20,
        fontWeight: '600',
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    mapSubText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.dark.icon,
        textAlign: 'center',
    },
    playbackControls: {
        padding: 16,
        paddingBottom: 24,
    },
    playbackCard: {
        padding: 20,
    },
    playRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    playButtonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.text,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    playSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    progressBar: {
        height: 4,
        backgroundColor: Colors.dark.surfaceAlt,
        borderRadius: 2,
        marginTop: 20,
    },
    progressFill: {
        height: '100%',
        width: '45%',
        backgroundColor: Colors.dark.tint,
        borderRadius: 2,
    },
});
