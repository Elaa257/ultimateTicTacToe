
# The Ultimate TicTacToe

## 1) Überblick

Ultimate TicTacToe ist eine moderne Webanwendung für ambitionierte Tic-Tac-Toe-Spieler, die zahlreiche Funktionen bietet, darunter ein Echtzeit-Multiplayer und ein warteschlangenbasiertes Matchmaking. Die Anwendung nutzt eine zeitgemäße Technologie, um eine flüssige und ansprechende Benutzererfahrung zu ermöglichen:

- **Angular mit Angular Materials** für das Frontend
- **NestJS** für das Backend
- **SQLite mit TypeORM** für die Datenbank
- **Socket.io** für Echtzeit-Kommunikation

Das Projekt ist klar in zwei Hauptbereiche unterteilt: Frontend und Backend. Diese Struktur sorgt für eine saubere Trennung der Verantwortlichkeiten und erleichtert die Wartung sowie die Skalierbarkeit der Anwendung.  
Das Backend ist in verschiedene Module aufgeteilt, die jeweils spezifische Funktionen abdecken:  

- **`auth`**: Verwaltet die Benutzeranmeldung und -authentifizierung mittels JWT
- **`game`**: Enthält die Logik und Regeln für das Tic-Tac-Toe-Spiel.
- **`queue`**: Verwaltet die Spielervermittlung basierend auf dem Elo-Rating der Spieler.
- **`user`**: Bietet Funktionen zur Benutzerverwaltung, einschließlich Profilaktualisierungen und statistischer Auswertungen.

Im Frontend wurde ein **Mobile-First-Design** gewählt, um die Benutzererfahrung auf mobilen Geräten zu optimieren. Dabei wurde sichergestellt, dass die Anwendung auch auf größeren Bildschirmen gut funktioniert. Die Benutzeroberfläche besteht aus eigenständigen Komponenten, die jeweils für bestimmte Bereiche verantwortlich sind. Diese Komponenten kommunizieren mit dem Backend über APIs und WebSockets, um die Multiplayer-Interaktionen zu ermöglichen.  


Zu den Komponenten der Benutzeroberfläche gehören:

- **`admin-page`**: Ermöglicht Administratoren die Verwaltung von Nutzern sowie die Überwachung der Matchmaking-Queue und der aktuellen laufenden Spiele.
- **`assets`**: Beinhaltet alle statischen Ressourcen wie Bilder und Icons.
- **`auth`**: Verwaltung von Benutzer-Login, -Registrierung und -Logout, interagiert mit dem Backend zur Authentifizierung.
- **`footer`**: Bietet eine einheitliche Fußzeile auf allen Seiten der Anwendung mit wichtigen Links.
- **`home`**: Die Startseite, die den Nutzern einen Überblick über die Plattform und den Zugang zu den Hauptfunktionen bietet.
- **`loading`**: Zeigt einen Ladeindikator bei lang andauernden Prozessen an.
- **`nav-bar`**: Die Navigationsleiste bietet Zugriff auf wichtige Bereiche wie Startseite, Profil und Verwaltung.
- **`page-not-found`**: Kümmert sich um 404 errors and zeigt eine nutzerfreundliche Nachricht an, wenn ein User versucht, auf eine nicht verfügbare Seite zuzugreifen.
- **`profile`**: Zeigt Informationen wie Spielhistorie, Elo-Rang und Statistiken eines Nutzers an. Hier können Nutzer auch ihre Profileinstellungen ändern.
- **`queue-modal`**: Die UI-Komponente für das Matchmaking, in der Nutzer der Warteschlange beitreten oder diese verlassen können. Sie zeigt Echtzeit-Updates zum Status der Spielvermittlung.




 
---

## 2) Das Authentifizierungssysstem

Statt auf eine sitzungsbasierte Authentifizierung zu setzen, verwendet unsere Anwendung ein JWT-basiertes System. Diese Wahl fördert die Skalierbarkeit und Effizienz. Mit JWT können wir die Authentifizierung verwalten, ohne auf eine serverseitige Sitzungsverwaltung zurückgreifen zu müssen, was insbesondere bei einer Verteilung auf mehrere Server von Vorteil ist.  

Wenn sich ein Nutzer registriert, werden seine Daten an unser NestJS-Backend übermittelt, wo das Passwort sicher gehasht und in der Datenbank gespeichert wird. Nach der erfolgreichen Registrierung wird ein JWT-Token generiert, der die Informationen des Nutzers (ID, E-Mail, Rolle) enthält. Dieses Token wird im httpOnly-Cookie gespeichert, um es vor clientseitigen Angriffen zu schützen.  

Nach dem Login sendet der Nutzer bei jeder Anfrage automatisch dieses Token, um sich zu authentifizieren. Das Backend überprüft dabei die Gültigkeit des Tokens. Ist das Token ungültig oder fehlt es, wird der Zugriff verweigert, und der Nutzer wird zur Login-Seite weitergeleitet.  

Im Frontend haben wir einen Mechanismus integriert, der automatisch überprüft, ob eine Anfrage mit dem Status 401 (nicht autorisiert) zurückkommt, um den Nutzer gegebenenfalls wieder auf die Login-Seite zu schicken. Beim Logout wird das Token durch das Löschen des Cookies ungültig gemacht.

Dieser Ansatz bietet Vorteile in puncto Sicherheit und Skalierbarkeit, da jede Anfrage bereits alle notwendigen Authentifizierungsdaten enthält, ohne dass eine Sitzungsverfolgung auf dem Server erforderlich ist.

---

## 3) Die Matchmaking Queue

Unser Matchmaking-System ist darauf ausgelegt, Spieler basierend auf ihrem Elo-Rating zu paaren und so faire Matches in Echtzeit zu gewährleisten. Für die Echtzeit-Kommunikation nutzen wir WebSockets, was eine permanente Verbindung zwischen Client und Server ermöglicht, ohne dass ständig neue HTTP-Anfragen gesendet werden müssen.  

### Queue System Überblick

Sobald sich ein Spieler über WebSocket mit dem Server verbindet, wird er durch sein JWT-Token authentifiziert. Nach erfolgreicher Authentifizierung kann der Spieler der Matchmaking-Warteschlange beitreten. Das System sucht nach einem Gegner, dessen Elo-Rating sich in einem Bereich von ±99 Punkten befindet. Sobald ein passender Gegner gefunden wurde, werden beide Spieler benachrichtigt, und das Spiel beginnt nach einem Countdown.
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
