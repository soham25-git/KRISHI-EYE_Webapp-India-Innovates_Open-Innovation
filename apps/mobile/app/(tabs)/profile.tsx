import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { UserCircle, Shield, Settings, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {

    const SettingsRow = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Icon color={Colors.dark.text} size={24} />
            </View>
            <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{title}</Text>
                {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
            </View>
            <ChevronRight color={Colors.dark.icon} size={20} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.profileHeader}>
                    <UserCircle color={Colors.dark.surfaceAlt} size={80} strokeWidth={1} />
                    <Text style={styles.name}>Farmer Demo</Text>
                    <Text style={styles.phone}>+91 98765 43210</Text>
                </View>

                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.section}>
                    <SettingsRow icon={Settings} title="General Settings" subtitle="Language, display, notifications" />
                    <View style={styles.divider} />
                    <SettingsRow icon={Shield} title="Privacy & Security" subtitle="Data access, OTP limits" />
                </View>

                <Text style={styles.sectionTitle}>App Details</Text>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowTitle}>Version</Text>
                        </View>
                        <Text style={styles.versionText}>1.0.0 (Expo Demo)</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
                    <LogOut color={Colors.dark.danger} size={20} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    container: {
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 32,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
        marginTop: 16,
    },
    phone: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.textSecondary,
        marginLeft: 8,
        marginBottom: 8,
        marginTop: 16,
    },
    section: {
        backgroundColor: Colors.dark.surface,
        borderRadius: 16,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.surfaceAlt,
        marginLeft: 56, // Align with text
    },
    iconContainer: {
        marginRight: 16,
    },
    rowContent: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.dark.text,
    },
    rowSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginTop: 2,
    },
    versionText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        padding: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.danger,
    },
});
