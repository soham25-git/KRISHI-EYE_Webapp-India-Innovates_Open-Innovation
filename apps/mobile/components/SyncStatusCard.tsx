import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudOff, CloudDrizzle, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Card } from './Card';

type SyncStatus = 'offline' | 'syncing' | 'synced';

interface SyncStatusCardProps {
    status: SyncStatus;
    lastSyncedText: string;
}

export function SyncStatusCard({ status, lastSyncedText }: SyncStatusCardProps) {
    const isOffline = status === 'offline';
    const isSyncing = status === 'syncing';

    return (
        <Card style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {isOffline && <CloudOff color={Colors.dark.warning} size={24} />}
                    {isSyncing && <CloudDrizzle color={Colors.dark.info} size={24} />}
                    {!isOffline && !isSyncing && <CheckCircle2 color={Colors.dark.success} size={24} />}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {isOffline ? 'Working Offline' : isSyncing ? 'Syncing...' : 'Up to Date'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {status === 'offline'
                            ? 'Changes will sync when reconnected.'
                            : lastSyncedText}
                    </Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
        padding: 8,
        backgroundColor: Colors.dark.surfaceAlt,
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
});
