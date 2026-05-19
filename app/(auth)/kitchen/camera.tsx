import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import jpegjs from 'jpeg-js';
import { useEffect, useRef, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../../../components/Card';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState<CameraCapturedPicture[]>([]);
    const [showExitModal, setShowExitModal] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [flashVisible, setFlashVisible] = useState(false);
    const [currentDiff, setCurrentDiff] = useState<number | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [ledOn, setLedOn] = useState(false);
    const cameraRef = useRef<CameraView | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const prevFrameRef = useRef<string | null>(null);
    const lastDetectionRef = useRef<number>(0);
    const COOLDOWN_MS = 3000;

    useEffect(() => {
        if (isCapturing) {
            intervalRef.current = setInterval(async () => {
                if (cameraRef.current) {
                    const photo = await cameraRef.current.takePictureAsync();
                    const small = await ImageManipulator.manipulateAsync(
                        photo.uri,
                        [{ resize: { width: 64 } }],
                        { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 0 }
                    );
                    console.log('Frame captured, base64 length:', small.base64?.length);
                    if (prevFrameRef.current && small.base64) {
                        const diff = computeDiff(prevFrameRef.current, small.base64);
                        setCurrentDiff(diff);
                        const now = Date.now();
                        if (diff > 0.2 && now - lastDetectionRef.current > COOLDOWN_MS) {
                            lastDetectionRef.current = now;
                            console.log('Movement detected', diff);
                            setTimeout(async () => {
                                if (cameraRef.current) {
                                    const settled = await cameraRef.current.takePictureAsync();
                                    setPhotos((prev) => [...prev, settled]);
                                    setFlashVisible(true);
                                    setTimeout(() => setFlashVisible(false), 150);
                                }
                            }, 500);
                        }
                    }
                    prevFrameRef.current = small.base64 ?? null;
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isCapturing]);

    useEffect(() => {
        if (!isCapturing) {
            setRecordingTime(0);
            setCurrentDiff(null);
            setLedOn(false);
            return;
        }
        const timerId = setInterval(() => setRecordingTime((t) => t + 1), 1000);
        const ledId = setInterval(() => setLedOn((on) => !on), 500);
        return () => {
            clearInterval(timerId);
            clearInterval(ledId);
        };
    }, [isCapturing]);

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    We need your permission to use the camera.
                </Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhotos((prevPhotos) => [...prevPhotos, photo]);
        }
    };

function computeDiff(a: string, b: string): number {
    const toBytes = (b64: string) => {
        const raw = b64.replace(/^data:image\/\w+;base64,/, '');
        const binary = atob(raw);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    };

    const frameA = jpegjs.decode(toBytes(a), { useTArray: true });
    const frameB = jpegjs.decode(toBytes(b), { useTArray: true });

    const total = frameA.data.length / 4; // RGBA, so /4 = pixel count
    let changed = 0;
    for (let i = 0; i < frameA.data.length; i += 4) {
        const dr = Math.abs(frameA.data[i]   - frameB.data[i]);
        const dg = Math.abs(frameA.data[i+1] - frameB.data[i+1]);
        const db = Math.abs(frameA.data[i+2] - frameB.data[i+2]);
        if (dr + dg + db > 30) changed++; // tolerance for camera noise
    }
    return changed / total; // 0 = identical, 1 = everything changed
}

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing="front" ref={cameraRef}>
                <View style={styles.recordingBar}>
                    <View style={[styles.led, ledOn && styles.ledOn]} />
                    <Text style={styles.recordingText}>REC</Text>
                    <Text style={styles.recordingText}>{formatTime(recordingTime)}</Text>
                    <Text style={styles.recordingText}>
                        Diff: {currentDiff !== null ? currentDiff.toFixed(2) : '—'}
                    </Text>
                </View>

                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <View style={styles.centerReticle} pointerEvents="none">
                    <View style={[styles.centerCorner, styles.centerCornerTL]} />
                    <View style={[styles.centerCorner, styles.centerCornerTR]} />
                    <View style={[styles.centerCorner, styles.centerCornerBL]} />
                    <View style={[styles.centerCorner, styles.centerCornerBR]} />
                </View>
                <View style={styles.overlay}>
                    <Text style={styles.counter}>
                        Photos: {photos.length}
                    </Text>
                    <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                        <Text style={styles.buttonText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={() => setIsCapturing((prev) => !prev)}>
                        <Text style={styles.buttonText}>{isCapturing ? 'Stop Auto' : 'Start Auto'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.exitButton}
                        onPress={() => { setIsCapturing(false); setShowExitModal(true); }}
                    >
                        <Text style={styles.buttonText}>Exit</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            {flashVisible && <View style={styles.flash} pointerEvents="none" />}

            <Modal visible={showExitModal} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <Card style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Review Photos</Text>
                        {photos.length === 0 ? (
                            <Text style={styles.modalEmptyText}>No photos taken.</Text>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.photoScroll}>
                                <View style={styles.photoGrid}>
                                    {photos.map((photo, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: photo.uri }}
                                            style={styles.thumbnail}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowExitModal(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.exitButton} onPress={() => { setShowExitModal(false); router.replace('/kitchen'); }}>
                                <Text style={styles.buttonText}>Exit</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </Modal>
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
    flash: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        opacity: 0.8,
    },
    recordingBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 12,
        zIndex: 10,
    },
    led: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    },
    ledOn: {
        backgroundColor: '#FF0000',
    },
    recordingText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: 'white',
    },
    cornerTL: {
        top: 100,
        left: 20,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    cornerTR: {
        top: 100,
        right: 20,
        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    cornerBL: {
        bottom: 100,
        left: 20,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    cornerBR: {
        bottom: 100,
        right: 20,
        borderBottomWidth: 3,
        borderRightWidth: 3,
    },
    centerReticle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 100,
        height: 100,
        marginTop: -50,
        marginLeft: -50,
    },
    centerCorner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: 'white',
    },
    centerCornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: 2,
        borderLeftWidth: 2,
    },
    centerCornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: 2,
        borderRightWidth: 2,
    },
    centerCornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
    },
    centerCornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 2,
        borderRightWidth: 2,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 60,
    },
    exitButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
        captureButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    counter: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 40,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        gap: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    modalEmptyText: {
        fontSize: 14,
        color: '#888',
    },
    photoScroll: {
        width: '100%',
        maxHeight: 300,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    thumbnail: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginRight: 8,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    cancelButtonText: {
        color: '#1A1A1A',
        fontSize: 16,
        fontWeight: '600',
    },
});
