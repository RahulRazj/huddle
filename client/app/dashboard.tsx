import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';

export default function DashboardScreen() {
    const { signOut } = useAuth();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Welcome to Huddle!</ThemedText>
            <ThemedText>You are now logged in.</ThemedText>
            <TouchableOpacity style={styles.button} onPress={signOut}>
                <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#162447',
    },
    button: {
        backgroundColor: '#FF6B35',
        borderRadius: 32,
        paddingVertical: 14,
        paddingHorizontal: 48,
        alignItems: 'center',
        marginTop: 32,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});