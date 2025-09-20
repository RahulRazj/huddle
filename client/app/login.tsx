import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = () => {
    const fullPhoneNumber = `+${callingCode}${phone}`;
    // In a real app, you would call your backend to verify the phone number
    // and get a session token in return.
    signIn(`dummy-token-for-${fullPhoneNumber}`);
  };

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || '91');
    setPickerVisible(false);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsInputFocused(false);
      }}
      accessible={false}
    >
      <View style={styles.mainContainer}>
        <ImageBackground
          source={require('@/assets/images/login.png')}
          style={styles.imageContainer}
          resizeMode="cover"
        >
          {isInputFocused && (
            <BlurView
              intensity={15}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          )}
          <LinearGradient
            // This gradient fades the image into the dark background below
            colors={['transparent', 'rgba(16, 28, 34, 0.5)', '#101c22']}
            style={styles.gradient}
          />
        </ImageBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.subtitle}>
              We'll text you a code to verify your phone.
            </Text>

            {/* Phone Input */}
            <View style={styles.inputWrapper}>
              <TouchableOpacity onPress={() => setPickerVisible(true)}>
                <Text style={styles.prefix}>+{callingCode}</Text>
              </TouchableOpacity>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                onSelect={onSelectCountry}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                containerButtonStyle={{ display: 'none' }}
                theme={{
                  backgroundColor: '#101c22',
                  onBackgroundTextColor: '#FFFFFF',
                  filterPlaceholderTextColor: 'rgba(255,255,255,0.6)',
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              {phone.length > 0 && (
                <TouchableOpacity onPress={() => setPhone('')} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#101c22',
  },
  imageContainer: {
    height: '70%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  prefix: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    marginRight: 8,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1193d4',
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1193d4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  terms: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
  link: {
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
});
