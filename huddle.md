# **Huddle: App Documentation**

---

### **1. Introduction**

#### **1.1. Project Vision**

**Huddle** is a mobile application designed to help friends, family, and groups stay connected and coordinated during car or bike rides. The app ensures no one gets left behind by providing **real-time location tracking** and **proximity-based alerts**. The core philosophy is to create a seamless and safe riding experience by leveraging modern mobile and web technologies.

#### **1.2. Target Audience**

-   **Cycling Groups:** Friends or clubs on long bike rides who need to maintain a formation.
-   **Motorcycle Clubs:** Riders traveling in a convoy who need to be aware of their fellow riders' positions.
-   **Car Convoys:** Families or friends on a road trip with multiple vehicles.
-   **Ride-Sharing Groups:** Individuals using multiple vehicles for a trip.

---

### **2. Functional Requirements**

| ID        | Feature                | Description                                                                                                                                                                               |
| :-------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-01** | User Authentication    | Users must be able to securely sign up and log in using their phone number. This is essential for privacy and user identification.                                                        |
| **FR-02** | Contact Integration    | The app will request access to the user's contacts to simplify the process of inviting friends to a ride.                                                                                 |
| **FR-03** | Manual Entry           | If a user denies contact access or a contact isn't in their phone, they can manually add riders by providing a name and phone number.                                                     |
| **FR-04** | Group/Ride Creation    | A user can create a new ride group, define a name for it, and select participants.                                                                                                        |
| **FR-05** | Ride Invitation System | When a group is created, an invitation is sent to the selected riders. The ride becomes active only after the invited members explicitly **accept** the invitation.                       |
| **FR-06** | Live Location Tracking | The app must track the live GPS location of each accepted rider in the group. This must function in the foreground and background.                                                        |
| **FR-07** | Distance Configuration | The group creator can set a single, maximum allowed distance (e.g., 3 km) between riders that applies to the entire group.                                                                |
| **FR-08** | Proximity Alerts       | If the distance between any two consecutive riders exceeds the configured limit, a push notification will be sent to the rider immediately in front of the one who has fallen behind.     |
| **FR-09** | "Stopped Moving" Alert | If any rider's location remains unchanged for a specified duration (e.g., 30 seconds), a push notification will be sent to all other members of the group.                                |
| **FR-10** | Real-Time Map View     | The app's primary interface will feature a map that displays the live locations of all active riders in the group.                                                                        |
| **FR-11** | Ride Management        | Users can start and end a ride. Ending a ride will stop location sharing and alerts for that user. The ride session ends for the entire group when all participants have exited the ride. |

---

### **3. Non-Functional Requirements**

| ID         | Attribute          | Description                                                                                                                                                                 |
| :--------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NFR-01** | Performance        | Location data must be processed and displayed in near real-time with minimal latency. Alerts should be triggered within seconds of a condition being met.                   |
| **NFR-02** | Scalability        | The backend system must be able to handle thousands of concurrent users and groups without degradation in performance.                                                      |
| **NFR-03** | Battery Efficiency | The app's background location tracking must be highly optimized to minimize battery consumption.                                                                            |
| **NFR-04** | Security           | All user data, including live location, must be encrypted in transit and at rest. Authentication must be robust, and data access must be strictly limited to group members. |
| **NFR-05** | Cross-Platform     | The app will be built using **React Native with Expo**, ensuring it is available on both iOS and Android from a single codebase.                                            |
| **NFR-06** | Usability          | The user interface must be intuitive and easy to use, even while on a ride, with large buttons and clear indicators.                                                        |

---

### **4. Technology Stack**

#### **4.1. Frontend**

-   **Framework:** **React Native with Expo** - chosen for its cross-platform capabilities, simplified development workflow, and access to native features via its managed ecosystem.
-   **Navigation:** React Navigation for handling app screens and flow.
-   **State Management:** Redux or Zustand for managing application state, especially for real-time location data.
-   **Map Integration:** `react-native-maps` for embedding and interacting with maps (Google Maps on Android, MapKit on iOS). This library works seamlessly within **Expo Development Builds**.
-   **Location Services:** The **Expo SDK**, specifically `expo-location` and `expo-task-manager`, for robust, battery-efficient background location tracking. This requires a **custom Expo Development Build**.

#### **4.2. Backend**

-   **Platform:** **Node.js** - for its high performance and scalability in handling real-time data.
-   **Web Framework:** **Express.js** - to build REST APIs for user authentication and ride management.
-   **Real-time Communication:** **Socket.IO** - this is crucial for the constant exchange of live location data between all clients and the server.
-   **Database:** **MongoDB** (NoSQL) or **PostgreSQL** (Relational). A NoSQL database is often a good fit for this type of unstructured, real-time data.
-   **Cloud Services:**
    -   **Firebase Authentication:** For secure and managed phone number-based sign-in. This integrates well with Expo.
    -   **Firebase Cloud Messaging (FCM):** For sending reliable push notifications to both iOS and Android devices. **Expo Notifications** and EAS services handle the complex configuration for you.

---

### **5. Project Workflow & Development Plan**

#### **Phase 1: Foundations & Backend (Weeks 1-3)**

-   **Project Setup:** Initialize a new **Expo** project using `npx create-expo-app`. Set up the Node.js backend and version control (Git).
-   **Authentication:** Implement the secure phone number-based authentication system using Firebase Authentication.
-   **Core APIs:** Build API endpoints for user creation, fetching contact data, and group creation.
-   **Database Schema:** Define the data models for `Users` and `Rides`. The `Ride` model will include `participants` with their individual `status` (`invited`, `accepted`, `declined`).
-   **Real-Time Server:** Set up the Socket.IO server to listen for client connections and location data emissions.

#### **Phase 2: Frontend & Core Features (Weeks 4-6)**

-   **UI/UX Development:** Build the user interface for all app screens (login, home, contact list, map view, etc.).
-   **Contact Integration:** Implement the functionality to access and display the user's phone contacts within the app. Expo has a library for this.
-   **Location Tracking:** Integrate the `expo-location` and `expo-task-manager` libraries. Implement logic to get permissions and start/stop background location updates.
-   **Map Integration:** Embed a map component using `react-native-maps` and write the logic to dynamically plot user locations received from the backend.
-   **Invitation Flow:** Develop the UI and logic for sending ride invitations and handling a user's acceptance or decline.

#### **Phase 3: Real-Time Logic & Alerts (Weeks 7-9)**

-   **Distance Calculation:** Implement a background Node.js service or a scheduled task to continuously calculate the distance between riders in active groups using the Haversine formula.
-   **Push Notifications:**
    -   Set up FCM in the backend and frontend using Expo's notification services.
    -   Write the server-side code to trigger **distance alerts** and **"stopped moving" alerts** via FCM.
    -   Implement the frontend logic to receive and display these push notifications using `expo-notifications`.
-   **Real-Time Data Flow:**
    -   When a user starts a ride, the app will emit their location to the Socket.IO server.
    -   The server broadcasts location updates to all accepted group members in real-time.
    -   The app's map view will update accordingly.

#### **Phase 4: Testing & Deployment (Weeks 10-12)**

-   **Alpha Testing:** Conduct internal testing with a **custom Expo Development Build**.
-   **End-to-End Testing:** Test the entire app flow, from creating a ride to receiving alerts, in real-world scenarios.
-   **Beta Testing:** Release the app to a small group of users to gather feedback and identify bugs.
-   **Performance Optimization:** Profile the app for battery usage and network efficiency.
-   **Deployment:** Use **Expo Application Services (EAS)** to build the app and publish it to the Apple App Store and Google Play Store. Deploy the Node.js backend to a cloud hosting service.

---

### **6. Future Enhancements**

-   **Ride History:** A feature to view past rides, including a timeline of locations and alerts.
-   **In-App Chat:** A simple chat feature for riders to communicate without leaving the app.
-   **Estimated Time of Arrival (ETA):** Calculate and display the estimated time for riders to reach a destination.
-   **Leaderboard/Stats:** Gamify the experience with stats on distance covered, speed, etc.
-   **Geofencing:** Ability to set a designated route or a destination, with alerts if a rider deviates from the path.
-   **Live Profile Icons:** The ability to see live tracking of all riders on the map view, with their profile pictures or a custom icon representing them. This will enhance visibility and personalization, making it easier to identify who is who in the group at a glance.
