import { StyleSheet, View, Text, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Send, Sparkles } from 'lucide-react-native';

export default function AskScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Ask Assistant</Text>
                </View>

                <ScrollView contentContainerStyle={styles.chatContainer}>
                    <View style={styles.aiMessage}>
                        <View style={styles.aiIconRow}>
                            <Sparkles size={16} color={Colors.dark.tint} />
                            <Text style={styles.aiName}>KRISHi AI</Text>
                        </View>
                        <Text style={styles.messageText}>
                            Hello! I can analyze your field data, answer agronomy questions, or help you find local support. What do you need help with?
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.inputArea}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your question..."
                            placeholderTextColor={Colors.dark.textSecondary}
                            multiline
                        />
                        <View style={styles.sendButton}>
                            <Send color={Colors.dark.background} size={20} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        padding: 16,
        paddingTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.surfaceAlt,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    chatContainer: {
        padding: 16,
        flexGrow: 1,
    },
    aiMessage: {
        backgroundColor: Colors.dark.surfaceAlt,
        padding: 16,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        maxWidth: '85%',
    },
    aiIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    aiName: {
        fontWeight: '600',
        color: Colors.dark.text,
        fontSize: 14,
    },
    messageText: {
        color: Colors.dark.text,
        fontSize: 16,
        lineHeight: 24,
    },
    inputArea: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 16 : 24,
        backgroundColor: Colors.dark.background,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.surfaceAlt,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: Colors.dark.surface,
        borderRadius: 24,
        padding: 8,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: Colors.dark.surfaceAlt,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        color: Colors.dark.text,
        fontSize: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.tint,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        marginBottom: 2,
    },
});
