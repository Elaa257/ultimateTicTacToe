
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

Außerdem gibt es ein Queue-Monotoring, durch welches Admins überwachen können, welche User sich gerade in der Queue befinden. Diese Queue-Übersicht wird jedes Mal geupdated, wenn ein Spieler die Queue betritt oder verlässt.


### User Connection und Authentifizierung

Bei der Verbindung mit dem WebSocket-Server wird die JWT-Authentifizierung überprüft. Wenn das Token gültig ist, wird der Nutzer mit seinen Informationen in die Warteschlange aufgenommen. Andernfalls wird die Verbindung abgelehnt. Dies stellt sicher, dass nur authentifizierte Spieler am Matchmaking teilnehmen können.