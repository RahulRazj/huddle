/**
 * It's a best practice to use environment variables for your API's base URL.
 * 1. Create a file named `.env` in the root of your `client` directory.
 * 2. Add the following line: EXPO_PUBLIC_API_URL=http://<YOUR_SERVER_IP>:3000/api
 * 3. Make sure to add `.env` to your `.gitignore` file.
 * 4. Replace <YOUR_SERVER_IP> with your actual local network IP. 'localhost' will not work on a physical device.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_BASE_URL) {
    // This warning will show in the Metro bundler console.
    console.warn('API base URL is not set. Please create a .env file with EXPO_PUBLIC_API_URL.');
}

// Define the structure of the user object returned from the login endpoint.
interface LoginUser {
    uid: string;
    phoneNumber: string;
}

/**
 * A helper function to handle fetch requests and standardized responses.
 * @param endpoint The API endpoint to call (e.g., '/auth/login').
 * @param options The options for the fetch call (method, headers, body).
 * @returns The JSON payload from the API.
 * @throws An error if the network response is not ok.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        // The server's custom error handler provides a `message`.
        throw new Error(data.message || 'An unknown API error occurred.');
    }

    // The server wraps successful responses in a `payload` object.
    return data.payload;
}

/**
 * Sends the Firebase ID token to the backend for verification and session creation.
 * @param idToken The Firebase ID token from the client.
 * @returns The user data from the backend.
 */
export const loginWithIdToken = (idToken: string): Promise<LoginUser> => {
    console.log('Logging in with ID token:', idToken);
    return apiFetch<LoginUser>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ idToken })
    });
};