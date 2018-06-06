# ivis6iCbb_IVISPRO

### Was soll gezeigt werden

Die Verteilung der 6 grossen Weltreligionen aufgebrochen auf die Länder.
Dazu wurden 6 worldmaps erstellt, jede repräsentiert eine Religion.

Die Sättigung der Farbe stellt den Prozentualen Anteil and die gesamt Bevölkerung dar.
Umso gesättigter die Farbe, desto höher ist der Anteil der Religion.

Die Farben der Religion wurden aufgrund der Hauptfarben der Religion festgelegt.

### Meine verwendeten Daten

Die aufbereiteten Daten sind hier abgelegt:
[Daten](/data/national-clean.csv)

##### Herausforderungen
Die Daten waren allgemein sehr gut strukturiert.

Für jedes Land gab es nach Jahre aufgeteilt (1945 - 2010) die Daten zu jeder der 6 Hauptreligion 
und mehr. In absoluten und prozentualen Angaben. Je nach Land gab es nicht für jedes Jahr Angaben zur Religion.

Um die Länder zu identifizieren ist ein ISO-Code hinterlegt. Jedoch passte der nicht mit der 
json [Worldmap](/data/world-countries.json) überrein. Das world-country.json verwendet zur 
Identifizierung des Landes den ISO-3166 ALPHA-3 Code. Der Code in meinen Daten war nicht eindeutig zu identifizieren.

Ein weiteres Problem war, dass sich die Weltkarte im Verlauf der Jahre geändert hatte. 
So zum Beispiel war Deutschland noch zweigeteilt und Jugoslavien existierte noch 
(Es war doch einige Zeit nötig alle Länder zu finden, die Probleme machten und sie danach auch zu fixen). 
Oft konnte ich die Daten eines Landes rekonstruieren und auf die heutige Karte matchen.
Ost- und Westdeutschland fasste ich zum Beispiel einfach zusammen. Andere Datensätze musste ich komplett löschen.
So konnte ich Jugoslavien nicht auf die heutigen Länder aufteilen.


Unglücklicherweise gehen so Daten verloren, die eventuell noch spannend waren. 
Bei einem Projekt mit grösserem Umfang, würde ich die Daten auf eine aktuelle Karte des Jahres abbilden.

Leider war dies im jetzigen Umfang nicht möglich.



### Schlusswort

D3 ist eine coole Sache und das Projekt hat Spass gemacht.

Meine bisher eher rudimentären JS Fähigkeiten konnte ich in Verlauf dieses Projektes verbessern.
Ich bin stolz eine funktionierende Applikation zum Laufen gebracht zu haben und kann mir durchaus vorstellen, das Ganze in 
meiner Freizeit als Übung noch zu verbessern.
