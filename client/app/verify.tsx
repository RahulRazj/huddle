import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    PhoneAuthProvider,
    signInWithCredential,
    signOut,
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import { loginWithIdToken } from "../services/api";

export default function VerifyScreen() {
    const recaptchaVerifier = useRef(null);
    const router = useRouter();
    const { phoneNumber } =
        useLocalSearchParams<{ phoneNumber: string }>();
    const [verificationId, setVerificationId] = useState<string | null>(
        null
    );
    const [pins, setPins] = useState(["", "", "", "", "", ""]);
    const [isSending, setIsSending] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const { signIn } = useAuth();
    const inputs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        // Focus the first input on mount for better UX
        inputs.current[0]?.focus();
    }, []);

    useEffect(() => {
        const sendVerification = async () => {
            try {
                if (!recaptchaVerifier.current || !phoneNumber) {
                    throw new Error(
                        "Verification components not ready. Please try again."
                    );
                }
                await signOut(auth);
                const phoneProvider = new PhoneAuthProvider(auth);
                const verId = await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    recaptchaVerifier.current
                );
                console.log('Success', 'Verification code has been sent. - ', verId);
                setVerificationId(verId);
                console.debug("Success", "Verification code has been sent.");
            } catch (err: any) {
                console.error(
                    "Error",
                    err.message || "Something went wrong during verification."
                );
                router.back();
            } finally {
                setIsSending(false);
            }
        };

        sendVerification();
    }, [phoneNumber]);

    if (!phoneNumber) {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Phone Number Missing</Text>
                    <Text style={styles.subtitle}>
                        Could not get verification details. Please go back and try
                        again.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.replace("/login")}
                    >
                        <Text style={styles.buttonText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const confirmCode = async () => {
        const code = pins.join("");
        // Add guard to ensure code is complete before trying to verify
        if (!verificationId || isVerifying || code.length !== 6) return;

        setIsVerifying(true);
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            );
            const userCredential = await signInWithCredential(auth, credential);
            const idToken = await userCredential.user.getIdToken();
            const user = await loginWithIdToken(idToken);

            if (user && user.uid) {
                signIn(user.uid);
            } else {
                console.error("Error", "Invalid response from server.");
                throw new Error("Invalid response from server.");
            }
        } catch (err: any) {
            console.error("Error", `Something went wrong: ${err.message}`);
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePinChange = (text: string, index: number) => {
        const newPins = [...pins];
        newPins[index] = text;
        setPins(newPins);

        // If a digit is entered, move focus to the next input
        if (text.length === 1 && index < 5) {
            inputs.current[index + 1]?.focus();
        } else if (text.length === 0 && index > 0) {
            // If a digit is deleted, move focus to the previous input
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.mainContainer}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={auth.app.options}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingContainer}
                >
                    {isSending ? (
                        <View style={styles.contentContainer}>
                            <Text style={styles.title}>Sending code...</Text>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : (
                        <>
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => router.back()}
                                >
                                    <MaterialIcons
                                        name="arrow-back-ios-new"
                                        size={22}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.contentContainer}>
                                {/* Icon */}
                                <View style={styles.iconWrapper}>
                                    <MaterialIcons
                                        name="phonelink-lock"
                                        size={36}
                                        color="#1193d4"
                                    />
                                </View>

                                <Text style={styles.title}>Enter Verification Code</Text>
                                <Text style={styles.subtitle}>
                                    We&apos;ve sent a 6-digit code to{" "}
                                    <Text style={{ fontWeight: "600" }}>{phoneNumber}</Text>
                                </Text>

                                {/* OTP Inputs */}
                                <View style={styles.otpRow}>
                                    {pins.map((pin, i) => (
                                        <TextInput
                                            key={i}
                                            ref={(el) => (inputs.current[i] = el)}
                                            style={[styles.otpInput, focusedIndex === i && styles.otpInputFocused]}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            value={pin}
                                            onChangeText={(text) => handlePinChange(text, i)}
                                            onFocus={() => setFocusedIndex(i)}
                                            onBlur={() => setFocusedIndex(null)}
                                        />
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={confirmCode}
                                    disabled={isVerifying}
                                >
                                    <Text style={styles.buttonText}>
                                        {isVerifying ? "Verifying..." : "Verify"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={styles.resendText}>
                                        Didn&apos;t receive the code? Resend
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Huddle © 2025. All rights reserved.
                                </Text>
                            </View>
                        </>
                    )}
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#101c22",
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    header: {
        marginTop: 50,
        marginLeft: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    iconWrapper: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: "rgba(17,147,212,0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#fff",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        color: "rgba(255,255,255,0.7)",
        textAlign: "center",
        marginBottom: 24,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginBottom: 24,
    },
    otpInput: {
        width: 50,
        height: 60,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        borderWidth: 2,
        borderColor: "transparent",
    },
    otpInputFocused: {
        borderColor: '#1193d4',
    },
    button: {
        backgroundColor: "#1193d4",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#1193d4",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 16,
        paddingHorizontal: 40,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
    resendText: {
        color: "#1193d4",
        fontWeight: "600",
        fontSize: 14,
        marginTop: 6,
    },
    footer: {
        padding: 12,
        alignItems: "center",
    },
    footerText: {
        color: "rgba(148,163,184,0.5)",
        fontSize: 12,
    },
});
