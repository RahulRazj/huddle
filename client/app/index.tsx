import { HelloWave } from '@/components/hello-wave';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

function ImageHeader() {
  return (
    <Image
      source={require('@/assets/images/ride.png')}
      style={styles.reactLogo}
      contentFit='cover'
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.fullScreenBackground}>
      <ImageHeader />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>Huddle!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.subTitle}>
        <ThemedText style={styles.subTitleText}>
          Stay together. Ride smarter.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.bottomButtonContainer}>
        <ThemedText style={styles.getStartedButton} onPress={() => router.push('/login')}>
          Get Started
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

}

const styles = StyleSheet.create({
  titleText: {
    color: '#c8dbe0ff',
    fontWeight: 'bold',
  },
  fullScreenBackground: {
    flex: 1,
    backgroundColor: '#1D3D47',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // Move content up above the button
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: 'transparent',
  },
  subTitle: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  subTitleText: {
    fontSize: 18,
    color: '#A1CEDC',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
    backgroundColor: 'transparent',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 220,
    width: 260,
    marginLeft: 0,
    marginTop: 0,
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    backgroundColor: '#1D3D47'
  },
  getStartedButton: {
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    fontSize: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
    textAlign: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
