# Databank reva beursapplicatie

Deze repository bevat de methodes en modellen voor het opslaan van alle data van de reva beursapplicaties. Zo moet er data opgeslagen worden van

- Categorieën 
- Exposanten
- Groepen
- Vragen
- Instellingen
- Gebruikers

## Express

Aangezien Express lightweight is in tegenstelling tot andere REST API's zoals Web API ging de voorkeur bij het selecteren van de backend technologie hierbij naar Express. Om die reden is het ook eenvoudig fouten op te sporen aangezien die vaak typo's zijn. Ook wordt door het kiezen van een javascript backend de taal tussen web en backend hetzelfde gehouden

## Het opstellen en opstarten van de applicatie

Deze instructies zullen u helpen bij het opstellen van de applicatie lokaal op uw computer. 

### Voorwaarden

Voor het downloaden en installeren van de repository is het noodzakelijk een git installatie te hebben. Deze is downloadbaar op [Github](https://git-scm.com/downloads)

### Stap 1 - clonen repository

Indien Git geïnstalleerd is zal de repository met het project moeten gecloned worden. Hiervoor moet er in de command line het volgende commando uitgevoerd worden

```
git clone https://github.com/HoGent-Projecten3/projecten3-1819-backend-groep8-reva.git
```

### Stap 2 - installeren modules

Na het clonen van de repository is het vereist alle modules te installeren die in het project gebruikt worden. Hiervoor moet er vanuit de command line eerst genavigeerd worden naar de project-folder met het volgende commando: 

```
cd projecten3-1819-angular-groep8-reva/
```

Vervolgens worden de vereiste modules geïnstalleerd door het volgende commando uit te voeren:

```
npm install
```

Na het uitvoeren van dit commando verschijnt waarschijnlijk onderstaande boodschap.

> found 2 moderate severity vulnerabilities

Om dit probleem op te lossen runnen we het commando:

```
npm audit fix
```

### Stap 3 - opstarten webapplicatie

Eenmaal alle modules geïnstalleerd zijn kan de backend opgestart worden. Om de applicatie op te starten wordt het volgende command uitgevoerd:  

```
npm run start-local
```

De backend staat dan online wanneer het volgende zichtbaar is:

```
[nodemon] 1.17.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./bin/www`
 ___      ___             ____
|   \    |     \       / /    \
| ___\   |___   \     / /______\
|     \  |       \   / /        \
|      \ |___     \./ /          \
====================================
:: Node.js Backend ::  (v0.2.6.ALHPA)
```

De backend draait vervolgens op de url [http://localhost:3000/](http://localhost:3000/)

## Mappenstructuur

Alle modules van de rollen zijn in het project te vinden in de folder `src/app/content/pages`. In deze folder is de volgende onderverling gemaakt: 

| Map     | Functionaliteit                                              |
| ------- | :----------------------------------------------------------- |
| Models  | Deze map bevat alle mongoose modellen die gebruikt worden bij het opslaan van de gegevens. |
| Routes  | In deze map zitten alle bestanden waarin de API routes gedefinieerd staan. De bestanden zijn gegroepeerd per bestaande rol in beide applicaties. Dit wilt bijvoorbeeld zeggen dat in het bestand `admin.js` de API calls staan voor de administrator. Een ander voorbeeld is `student.js`. Hierin staan de API calls die de groepen doen via de Reva app. (bijvoorbeeld voor het antwoorden van een vraag) |
| Uploads | Deze map bevat de foto's die de groepen via de app kunnen uploaden. Groepsfoto's en foto's als antwoord op vragen |

## Authors

Zes derdejaars studenten Toegepaste Informatica - Programmeren - Mobiele Applicaties

- Alexander Willems - [ciwie36963](https://github.com/ciwie36963)
- Cedric Arickx - [Ganondus](https://github.com/ganondus)
- Jens De Wulf - [Jensdewulf](https://github.com/Jensdewulf/)

- Jelle Geers - [JelleGeers](https://github.com/jellegeers)
- Karel Heyndrickx - [KarelHeyndrickx](https://github.com/karelheyndrickx)
- Matthias De Fré - Hoofd backend-programmeur - [MatthiasDeFre](https://github.com/MatthiasDeFre)

## License

Dit project is eigendom van Projecten III - team 8 - 2018 van HoGent .