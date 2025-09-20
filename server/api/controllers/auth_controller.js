import admin from '../config/firebase.js';
import errorCodes from '../config/errorCodes.js';

/**
 * @description Verifies a Firebase ID token from the client and authenticates the user.
 * This is the second step in the phone auth flow. The client first uses the Firebase
 * client-side SDK to send an OTP and get an ID token upon successful verification.
 * @param {object} req - Express request object. Body should contain { idToken: "..." }.
 * @param {object} res - Express response object.
 */
export const loginWithPhoneNumber = async (req, res) => {
	try {
		const idToken = req.body && req.body.idToken;

		if (!idToken) {
			throw errorCodes.MISSING_ID_TOKEN;
		}

		// Verify the ID token using the Firebase Admin SDK.
		// This will throw an error if the token is invalid (e.g., expired, malformed).
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		const { uid, phone_number } = decodedToken;

		// --- Business Logic ---
		// At this point, the user is authenticated with Firebase.
		// You should now find or create a user in your own database
		// using the `uid` as a unique identifier.
		// After finding/creating the user, generate a session token for your application (e.g., a JWT).

		// For this example, we'll just return the decoded token info.
		return res.done({
			message: 'User authenticated successfully!',
			user: {
				uid,
				phoneNumber: phone_number
			}
			// In a real app, you'd also send your own app's token here:
			// token: yourGeneratedJwtToken
		});
	} catch (error) {
		console.error('Firebase login error:', error);

		return res.error(error);
	}
};
