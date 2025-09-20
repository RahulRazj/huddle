import admin from 'firebase-admin';

// IMPORTANT:
// 1. In your Firebase project console, go to Project settings > Service accounts.
// 2. Generate a new private key and download the resulting JSON file.
// 3. Save this file securely on your server (e.g., outside your project directory).
//    **DO NOT commit this file to your version control (e.g., Git).**
// 4. Set an environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the full path of this file.
//    Example for Linux/macOS: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"`
//    Example for Windows (PowerShell): `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"`

try {
	// The Firebase Admin SDK will automatically find and use the credentials
	// from the GOOGLE_APPLICATION_CREDENTIALS environment variable.
	admin.initializeApp();

	console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
	console.error('Firebase Admin SDK initialization failed:', error);
	// If Firebase fails to initialize, the application cannot handle authentication.
	// It's a critical failure, so we exit the process.
	process.exit(1);
}

export default admin;
