import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to use the camera.
                </Text>
                <Pressable style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant permission</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing="back">
                <View style={styles.overlay}>
                    <Pressable
                        style={styles.exitButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Exit</Text>
                    </Pressable>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 60,
    },
    exitButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0D7A5F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
