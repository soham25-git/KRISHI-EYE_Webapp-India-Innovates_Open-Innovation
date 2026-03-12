import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '@/constants/Colors';
import { PhoneCall, Building2, ChevronRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { LoadingState } from '@/components/LoadingState';

export default function HelpScreen() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getSupportContacts().then(data => {
            setContacts(data);
            setLoading(false);
        });
    }, []);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.contactCard} onPress={() => handleCall(item.phone)} activeOpacity={0.7}>
            <View style={styles.contactIcon}>
                <Building2 color={Colors.dark.tint} size={24} />
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactType}>{item.type}</Text>
            </View>
            <View style={styles.actionButton}>
                <PhoneCall color={Colors.dark.success} size={20} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>Support Directory</Text>
                <Text style={styles.subtitle}>Find local help and agricultural offices</Text>
            </View>

            {loading ? (
                <LoadingState />
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <TouchableOpacity style={styles.createTicketButton} activeOpacity={0.8}>
                <Text style={styles.ticketButtonText}>Create Support Ticket</Text>
                <ChevronRight color={Colors.dark.background} size={20} />
            </TouchableOpacity>
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
        paddingTop: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
        paddingTop: 0,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.dark.surfaceAlt,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    contactType: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light success tint
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    createTicketButton: {
        margin: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.tint,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    ticketButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.background,
    },
});
