# The ultimateTicTacToe

Unser Ultimate TicTacToe wurde mit NestJS im Backend und Angular in Kombination mit Angular
Materials im Frontend umgesetzt. Wir haben uns für diese Kombination entschieden, da wir bereits
Erfahrungen mit Angular sammeln konnten, aber mit Angular Materials auch etwas Neues
kennenlernen wollten. Für unsere Datenhaltung verwenden wir SQLite in Verbindung mit TypeORM.
Über `http://localhost:3000/api` ist unsere OpenAPI-Doku, umgesetzt mit Swagger, erreichbar.

## Backend-Komponenten

Das Backend unterteilt sich in Komponenten zur Authentifizierung, zur Spiellogik, zur Verwaltung der
Queue und zur Verwaltung der Nutzer.

### Authentifizierungskomponente

Diese Komponente enthält die Routen zum Login, Logout, Registrieren sowie eine Route, um
zu überprüfen, ob ein Nutzer authentifiziert ist. Hierfür werden JSON Web-Tokens verwendet.
Wenn sich ein Nutzer registriert, werden seine Daten in der Datenbank abgelegt. Sein
Passwort wird zuvor verschlüsselt. Hierbei wird ihm seine Rolle zugewiesen (Spieler oder
Admin). Außerdem wird ein Access-Token generiert, welches in einem Cookie gespeichert
wird.  
Beim Login werden die angegebenen Daten mit der Datenbank abgeglichen und bei
erfolgreichem Login ebenfalls ein Access-Token zugeordnet und in einem Cookie gespeichert.
Beim Logout wird dieses wieder entfernt.  
Die Komponente enthält außerdem die erforderlichen Guards, um bestimmte Routen zu
schützen, die nur von einem eingeloggten Spieler oder Admin erreichbar sein sollen.

### Game-Komponente

Die Game-Komponente enthält die erforderliche Spiellogik für TicTacToe.
Zu jedem Spiel werden die beteiligten Spieler, das Spielbrett als Number-Array, das
Spielergebnis, welcher Spieler am Zug ist, ob das Spiel beendet ist und die Elo-Werte der
Spieler vor und nach dem Spiel gespeichert.  
Nach jedem Zug wird überprüft, ob das Spiel beendet ist und ob es einen Gewinner gibt. Die
Ergebnisse werden anschließend gespeichert und die Elo-Zahl der Spieler neu berechnet.
0 steht hierbei für einen Zug von Spieler 1 und 1 für einen Zug von Spieler 2. Um
festzustellen, ob es einen Gewinner gibt, wird jeweils die Summe der Werte aller Reihen,
Spalten und Diagonalen gebildet. Beträgt diese 0 oder 3, gibt es einen Gewinner. Sollten alle
Felder einen Wert besitzen, aber es keinen Gewinner geben, endet das Spiel unentschieden.  
[…]

### Queue-Komponente

[...]

### User-Komponente

Die User-Komponente kümmert sich um die Nutzer-Verwaltung.  
Sie stellt Routen zum Löschen des eigenen Spielprofils, zum Löschen eines bestimmten Users,
zur Rückgabe eines bestimmten Users, zur Rückgabe aller User, sowie zum Updaten des
eigenen Profils zur Verfügung.  
Je nach Anwendungskontext sind die Routen durch einen Role-Guard und/oder einen Auth-
Guard geschützt.  
Zu jedem User werden seine Email-Adresse, sein (gehashtes) Passwort, sein Nickname, seine
Rolle, seine Elo-Nummer, sein Profilbild und die Anzahl seiner gewonnenen, verlorenen oder
unentschieden geendeten Spiele gespeichert.  

## Frontend-Komponenten

[...]