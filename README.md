
# The Ultimate TicTacToe

## 1) Overview

Ultimate TicTacToe is a dynamic web-based application designed for competitive Tic Tac Toe players, offering a range of features including a ranking system, real-time multiplayer functionality, and a queue-based matchmaking system. The project leverages a modern tech stack to deliver a smooth and engaging user experience:

- **Angular** for the Frontend
- **NestJS** for the Backend
- **SQLite** for the Database
- **Socket.io** for Real-Time, Two-Way Communication

We structured the project into two primary building blocks: the frontend and the backend, ensuring a clear separation of concerns for each functionality within the system. This modular approach enhances maintainability and scalability as the application grows.

On the backend, we organized our system into distinct modules, each responsible for a specific feature:

- **`auth`**: Manages the authentication system using JWT.
- **`DTOs`**: Handles data transfer objects for smooth communication between different layers.
- **`game`**: Contains the logic and rules for the Tic Tac Toe game.
- **`queue`**: Manages matchmaking logic for pairing players based on their Elo ratings.
- **`user`**: Provides user-management functionality, including profile updates and statistics.

For the frontend, we adopted a **mobile-first design approach** to ensure a seamless experience across all device sizes. Each page and interface component is designed with responsiveness in mind, ensuring optimal usability on mobile devices, while gracefully scaling up to larger screen sizes. The frontend is composed of standalone components, each responsible for a specific part of the user interface, supported by services that handle API requests to the backend and real-time WebSocket events for multiplayer interactions.

The following components where created for the different building blocks of the user Interface:

- **`admin-page`**: This component provides an interface for administrators to manage users, monitor queues, and oversee matchmaking activity. It is a dashboard-like interface where admins can control key aspects of the platform.
- **`assets`**: This folder contains static assets such as images, icons, and other media files that are used throughout the application for UI elements, branding, and design consistency.
- **`auth`**: The authentication component manages user login, registration, and logout processes. It interacts with the backend to handle user credentials and manage authentication state using JWT tokens.
- **`footer`**: The footer component provides a consistent footer across all pages of the application. It may include links to terms of service, privacy policies, and other important navigational links.
- **`home`**: The home component serves as the landing page for the application. It welcomes users with an overview of the platform, providing access to main functionalities like starting a game or viewing the leaderboard.
- **`loading`**: This component displays a loading spinner or indicator during asynchronous operations, such as waiting for server responses or loading game data, ensuring users are aware of background processes.
- **`nav-bar`**: The navigation bar component is responsible for the top-level navigation of the application, providing links to important sections such as the home page, profile, admin page, and other core functionalities.
- **`page-not-found`**: This component handles 404 errors and displays a user-friendly message when users attempt to navigate to a page that does not exist, ensuring a smooth user experience.
- **`profile`**: The profile component displays user-specific information, such as their match history, Elo ranking, and personal details. It also allows users to update their profile settings and view their performance stats.
- **`queue-modal`**: This modal component is responsible for the matchmaking queue UI, allowing users to join or leave the queue for a match. It shows real-time updates on the matchmaking status and a countdown when a match is found.




 
---

## 2) The Authentication System

In our application, we implemented a JWT (JSON Web Token) based authentication system instead of a session-based approach. This decision was driven by the need for scalability and efficiency. JWT allows us to manage authentication without relying on a server-side session database, which would introduce complexity when scaling across multiple instances. With JWT, we can maintain a stateless system where each server can independently verify tokens without requiring shared session data.

When a user registers, their details are sent to our NestJS backend, where the password is securely hashed and stored in the database. After successful registration, we generate a JWT token containing the user's information (ID, email, role), which is signed with the server's secret key and returned to the frontend. The token is stored in an `httpOnly` cookie, ensuring it is inaccessible by JavaScript and protected from client-side attacks.

When the user logs in, they provide their credentials, which are validated against the database. A new JWT token is generated and stored in the same secure manner. From then on, every request made by the user automatically includes the token, allowing the backend to authenticate the user without maintaining session state. The validity of the JWT token is checked by a guard in NestJS, ensuring that only authenticated users can access protected routes. If the token is invalid or missing, a 401 Unauthorized response is returned, and the frontend redirects the user to the login page.

In the frontend, we implemented an Angular interceptor to check for 401 status codes in the response. If a 401 is detected, the user is redirected to the login page, ensuring they cannot access protected content. Additionally, the frontend includes a short caching mechanism to avoid unnecessary server checks, making the app more efficient.

When the user logs out, the frontend sends a request to the backend to clear the `httpOnly` cookie, effectively ending the session. Without the JWT token, the user is no longer authenticated and is redirected to the login page.

This JWT-based approach offers advantages such as improved security and scalability. The stateless nature of JWT allows for easier scaling, as each request includes all the necessary authentication data, eliminating the need for server-side session management. This system is ideal for our application's high-traffic environment, where efficiency and security are key.

---

## 3) The Matchmaking Queue

Our matchmaking system is designed to pair users based on their Elo ratings, facilitating an efficient and fair matching process in real time. The system relies on WebSockets for real-time communication between clients and the server, allowing users to join the matchmaking queue, be matched with other players, and start a game. WebSockets were chosen to provide a persistent connection for seamless interaction between the server and clients without the need for constant HTTP requests.

### Queue System Overview

When a user connects to the server via WebSocket, they are authenticated using a JWT token stored in their cookies. This token contains essential user information such as their ID and Elo rating. Once authenticated, users can join or leave the matchmaking queue, and the server will attempt to find a suitable match.

The system also provides real-time queue monitoring for administrators, allowing them to view which users are waiting for a match. The queue is updated every time a user joins or leaves, ensuring accurate and timely information is available to all connected clients, including admins.

### User Connection and Authentication

Upon connecting to the WebSocket server, the `handleConnection` method is triggered. The server extracts the JWT token from the user's cookies and verifies it using the `JwtService`. If the token is valid, the user's details (nickname, Elo rating) are retrieved from the database. If the token is invalid or the user is not found, the connection is terminated. This ensures that only authenticated users can interact with the matchmaking system.

### Joining the Queue

Once connected, users can emit a `join-queue` event to enter the matchmaking queue. The server processes this event by verifying the user's token and retrieving their information. If the user is not already in the queue, they are added, and the system attempts to find a match based on their Elo rating.

The matching algorithm searches for another user in the queue whose Elo rating is within a range of ±99 points. If a match is found, both users are notified, and their information is removed from the queue. If no match is found, the user remains in the queue, waiting for a suitable opponent.

### Real-Time Queue Updates

Whenever a user joins or leaves the queue, the server updates the queue and broadcasts this information to all connected administrators. Admins can request the current queue state by emitting a `get-queue` event. The server ensures that only users with the admin role can access this data by verifying their JWT token.

### Leaving the Queue

Users can emit a `leave-queue` event to exit the queue before a match is found. The server processes this by removing the user from the queue and notifying administrators of the updated queue state. Users also receive confirmation that they have successfully left the queue.

### Countdown and Game Start

When two users are matched, they are notified via the `player-joined` event, which triggers a 10-second countdown on the frontend. During this countdown, the frontend displays a timer, preparing the players for the upcoming match. After the countdown ends, the frontend emits a `start-game` event, and the user is redirected to the game screen.

### Admin Queue Monitoring

Admins can monitor the queue in real time by emitting a `get-queue` event. The server checks the admin's role using their JWT token and then responds with the current queue state. This feature gives admins full visibility of the queue, allowing them to manage the matchmaking process if necessary.

### Security Considerations

To ensure security, the JWT token is used throughout the matchmaking process for user authentication. The token is extracted from the user's cookies and verified with every connection and request, ensuring that only authorized users can participate. Admins are also restricted to viewing queue data based on their verified role. This prevents unauthorized access to sensitive queue information.

### Frontend WebSocket Handling

In the frontend, we use a WebSocket service to manage connections between the client and server. When the user opens the queue modal, they are automatically added to the queue by emitting the `join-queue` event. The frontend listens for the `player-joined` event to trigger the countdown to the game start.

If the user decides to leave the queue before a match is found, the modal emits a `leave-queue` event, which removes the user from the queue on the server side. Once the countdown finishes, the user is redirected to the game screen.
