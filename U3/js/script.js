//Globala variabler.

var i, newTiles, startKnapp, nyaKortKnapp, rutor, dragord, counter, array, fylldaRutor, dragOrdId, 
totalPoäng, cookiePoäng, totalSpel, cookieSpel, totPoäng, totSpel, msgElem, cookie, delning, tecken;

function init() {

    newTiles = document.getElementById("newTiles").getElementsByTagName("img");//Referensarray till bilderna
    //för 4 nya brickor.
    rutor = document.getElementById("board").getElementsByTagName("img");//Referensarray för bildrutor
    //som en bricka ska dras till.
    startKnapp = document.getElementById("newGameBtn");//Referens till startknappen.
    startKnapp.onclick = startaSpel;//Funktionen 'startaSpel' anropas vid tryck på 'startKnapp'.
    nyaKortKnapp = document.getElementById("newTilesBtn");//Referens till knapp för att generera nya kort.
    nyaKortKnapp.onclick = nyaKort;//Funktionen 'nyaKort' anropas vid tryck på 'nyKortKnapp'.
    startKnapp.disabled = false;//Startknapp startar som aktiv.
    nyaKortKnapp.disabled = true;//Knappen för nya kort startar som inaktiv.
    totalPoäng = document.getElementById("totPoints");//Referens till span-element som innehåller totalt antal poäng.
    totalSpel = document.getElementById("countGames");//Referens till span-element som innehåller totalt antal spel.
    msgElem = document.getElementById("message");//Referens till div-område för utskrift till användaren.
    tecken = document.getElementsByClassName("mark");//Referens till alla element som innehar klassen 'mark'.
    /*De poäng och antal spel som eventuellt finns lagrade hämtas. 
    Om annat än 0 finns ersätter deras olika värden de nollor som syns för antal poäng och spel i 'index.html'.
    Cookien, som lagras båda antal spel och poäng, delas genom att använda ',' som skiljare.*/
    cookie = getCookie("spelcookie");
     
    if (cookie!= null) {
        delning = cookie.split(",");
        cookiePoäng = delning[0];//Antal poäng fås genom att den värdet innan ',' i cookien lagrade poäng.
        cookieSpel = delning[1];//Antal spel fås genom att den värdet efter ',' i cookien lagrade antal spel.
        totalSpel.innerHTML = cookieSpel;//Det totalt antalet spel och poäng skrivs ut på deras avsedda platser.
        totalPoäng.innerHTML = cookiePoäng;
    }

}//init

window.addEventListener("load",init);//Funktionen 'init' anropas när sidan laddas.

function startaSpel () {
    /*De poäng och antal spel som eventuellt finns lagrade hämtas även om spelet startas om. 
    Om annat än 0 finns ersätter deras olika värden de nollor som syns för antal poäng och spel i 'index.html'. De lagrade värderna läggs också in i variablerna
    'totPoäng' och 'totSpel', så att nya spel och poäng kan adderas till de gamla värderna och sedan lagras som cookies.
    Då spelet startas inaktiveras startknappen och knappen för nya kort aktiveras istället.*/
    cookie = getCookie("spelcookie");
     
    for (i = 0; i < tecken.length; i++) tecken[i].innerHTML = "";//De bockar eller kryss som finns efter tidigare 
    //omgångar tas bort genom att använda deras gemensamma klassnamn.

    totPoäng = parseInt(totalPoäng.innerHTML);//Det totala antalet poäng tas ur utskriften av detta på sidan.
    totSpel = parseInt(totalSpel.innerHTML);//Det totala antalet spel tas ur utskriften av detta på sidan.
    fylldaRutor = 0;//En räknare för antal fyllda rutor, som vid antalet 16 (alla fyllda), kommer avsluta spelet.
    startKnapp.disabled = true;//Startknappen inaktiveras.
    nyaKortKnapp.disabled = false;//Nyakortknappen aktiveras.
    for (i = 0; i < rutor.length; i++) {
        /*Alla rutor fylls med den angivna tomma bilden. Från eventuella tidigare omgångar tas klassen 'filled' bort
        och ersätts av 'empty'.*/
        rutor[i].src = "img/empty.png";
        rutor[i].classList.add("empty");
        rutor[i].classList.remove("filled");
    }
    msgElem.innerHTML = "";//Tidigare utskrift av antalet poäng för en spelrunda tas bort.
    array = [];//Array för de nummer som dragits för en aktuell runda.
}

function nyaKort () {
/*4 nya kort har givits, knappen för att få nya kort inaktiveras då tills räknaren 'counter', med startvärde 0,
 når 4. Ett nummer mellan 1 och 40 slumpas fram. Om detta ej finns i 'array' läggs det till. 'array' innehåller alla
 siffror som givits i spelrundan, medan 'array2' endast innehåller de 4 siffror som dragits vid den 
 senaste knapptryckningen. På detta sätt kan sedan rätt index tilldelas en bild. Skulle enbart 'array' användas
 skulle enbart de 4 första siffrorna ges varje gång eftersom det motsvarar längden på de 4 nya korten.*/
    nyaKortKnapp.disabled = true;
    let array2 = [];
    counter = 0;
    for (i = 0; i < 4; i++) {
        let nummer = Math.floor(Math.random() * 40) + 1;
        if (!array.includes(nummer)) {
            array.push(nummer);
            array2.push(nummer);
        }

        else i--;//Om det slumpmässigt valda talet redan finns i 'array' minskas värdet på 'i' med 1 och ett
        //nytt nummer slumpas fram, så att antalet nya kort blir rätt.

    } 

    for (i = 0; i < newTiles.length; i++) {
        /*Platserna för nya kort fylls med en bild, som hittas tack vare att bildens namn motsvarar ett nummer i 'array2'.
        Korterns platser tilldelas klassen 'filled' och sätts till 'draggable'. För senare identifikation tilldelas
        ett id till varje kort som motsvarar dess nummer. Detta används senare för att få ut ett nummervärde ur bilderna.
        2 olika funktioner anropas också när ett kort börjar respektive slutar dras.*/
        newTiles[i].src = "img/" + array2[i] + ".png";
        newTiles[i].setAttribute("class", "filled");
        newTiles[i].draggable = true;
        newTiles[i].id = array2[i];
        newTiles[i].addEventListener("dragstart",draOrd);
        newTiles[i].addEventListener("dragend",slutaDraOrd);
    }
}

function draOrd () {
    /*När ett ord börjar dras genomsöks alla rutor. Om de ej innehåller klassen 'filled', vilket i detta fall
    innebär att de är tomma, så ges de tomma rutorna olika eventlisteners för 'dragover', 'dragleave' och 'drop'.*/
    for (i = 0; i < rutor.length; i++) {
       if (!rutor[i].classList.contains("filled")) {
            rutor[i].addEventListener("dragover",överRuta);
            rutor[i].addEventListener("dragleave",lämnaRuta);
            rutor[i].addEventListener("drop",överRuta);
       }  
    }
    dragord = this.src;//Det ord som dras id och src sparas i variabler för senare användning.
    dragOrdId = this.id;

}

function slutaDraOrd () {
    for (i = 0; i < rutor.length; i++) {//Eventlisterners för lagda kort tas bort så att de ej längre kan flyttas.
        rutor[i].removeEventListener("dragover",överRuta);
        rutor[i].removeEventListener("dragleave",lämnaRuta);
        rutor[i].removeEventListener("drop",överRuta);
    }
}

function överRuta (e) {//Skickar med eventobjektet som ett ingående argument för att använda 'e.type == "drop"'.
    e.preventDefault();//Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.
    this.style.backgroundColor = "green";//När ett kort hålls över en ruta byts bakgrundsfärgen för rutan till grön.

    /*När eventobjektet släpps används de variabler för src och id som sparades för objektet, och
    spelrutan får då samma värden.
    Klassen 'filled'* läggs till och 'empty' tas bort. Färgen som sattes till grön ovan ändras då till transparent, 
    då den annars kvarstod som grön trots klassändringarna. Räknaren som går upp till 4 och antalet fyllda rutor
    adderas med 1 till sitt tidigare värde.*/
    if (e.type == "drop") {
        this.src = dragord;
        this.id = dragOrdId;
        this.style.backgroundColor = "transparent";
        this.classList.add("filled");
        this.classList.remove("empty");
        counter ++;
        fylldaRutor++;

        for (i = 0; i < newTiles.length; i++) {
            /*De 4 korten genomsöks, om det släppta ordet finns bland dem sätts det till 'draggable = false',
            bilden fylls med en tom bild och klassen sätts till 'empty'.*/
            if (this.src == newTiles[i].src) {
                newTiles[i].draggable = false;
                newTiles[i].src = "img/empty.png";
                newTiles[i].setAttribute("class", "empty");
            }
        }

        for (i = 0; i < rutor.length; i++) {
            /*Spelplanens rutor genomsöks, om det finns rutor som är tomma och räknaren når 4 aktiveras knappen
            för nya kort.*/
            if (rutor[i].classList.contains("empty") && counter == 4) {
                nyaKortKnapp.disabled = false;
            }
        }

        if (fylldaRutor == 16) {//Om inga tomma rutor finns kvar inaktiveras knappen för nya kort, och startknappen 
            //aktiveras. Funktionen 'räknaPoäng anropas också.'
            nyaKortKnapp.disabled = true;
            startKnapp.disabled = false;
            räknaPoäng();
        }
    }
}

function lämnaRuta (e) {//När event-objektet lämnar en ruta ändras färgen tillbaks till transparent.
    e.preventDefault();//Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.
    this.style.backgroundColor = "transparent";
}

function räknaPoäng () {
    //Antal spel och poäng för aktuell runda sätts till 0, deras värden adderas senare till de totala antalen 
    //och sparas i olika cookies.
    let antalSpel = 0;//Variabel för aktuellt spel.
    let points = 0;//Variabel för aktuellt spels poäng.

    /*För alla 8 olika rader, som har varsitt klassnamn, hämtas varje korts id via en variabel med alla
    element av klassen (s1, s2 osv.) och läggs i 2 likadana arrayer. 
    En av dem kommer sorteras i nummerordning och jämföras med originalet för att se om den aktuella raden
    lades i nummerordning eller ej. */
   
    let s1 = document.getElementsByClassName("s1");
    let a1 = [], a1b = [];
    for (i = 0; i < s1.length; i++) {
        a1.push(s1[i].id);
    }

    a1b = a1.slice(); 

    let s2 = document.getElementsByClassName("s2");
    let a2 = [], a2b = [];
    for (i = 0; i < s2.length; i++) {
        a2.push(s2[i].id);
    }
    a2b = a2.slice();

    let s3 = document.getElementsByClassName("s3");
    let a3 = [], a3b = [];
    for (i = 0; i < s3.length; i++) {
        a3.push(s3[i].id);
    }
    a3b = a3.slice();

    let s4 = document.getElementsByClassName("s4");
    let a4 = [], a4b = [];
    for (i = 0; i < s4.length; i++) {
        a4.push(s4[i].id);
    }
    a4b = a4.slice();

    let s5 = document.getElementsByClassName("s5");
    let a5 = [], a5b = [];
    for (i = 0; i < s5.length; i++) {
        a5.push(s5[i].id);
    }
    a5b = a5.slice();

    let s6 = document.getElementsByClassName("s6");
    let a6 = [], a6b = [];
    for (i = 0; i < s6.length; i++) {
        a6.push(s6[i].id);
    }
    a6b = a6.slice();

    let s7 = document.getElementsByClassName("s7");
    let a7 = [], a7b = [];
    for (i = 0; i < s7.length; i++) {
        a7.push(s7[i].id);
    }
    a7b = a7.slice();

    let s8 = document.getElementsByClassName("s8");
    let a8 = [], a8b = [];
    for (i = 0; i < s8.length; i++) {
        a8.push(s8[i].id);
    }
    a8b = a8.slice();

    /*Arrayerna jämförs genom att arraykopian sorteras i nummerordning och båda arrayer omvandlas till strängar.
    Om de matchar ökas antalet poäng med 1 och det motsvarande fältet för kryss eller bock fylls med bock. 
    Matchar de ej skrivs istället ett kryss in.*/

    if (a1.toString() === a1b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[0].innerHTML = "&#9989";
    } else tecken[0].innerHTML = "&#10060;";
    if (a2.toString() === a2b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[1].innerHTML = "&#9989";
    } else tecken[1].innerHTML = "&#10060;";
    if (a3.toString() === a3b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[2].innerHTML = "&#9989";
    } else tecken[2].innerHTML = "&#10060;";
    if (a4.toString() === a4b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[3].innerHTML = "&#9989";
    } else tecken[3].innerHTML = "&#10060;";
    if (a5.toString() === a5b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[4].innerHTML = "&#9989";
    } else tecken[4].innerHTML = "&#10060;";
    if (a6.toString() === a6b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[5].innerHTML = "&#9989";
    } else tecken[5].innerHTML = "&#10060;";
    if (a7.toString() === a7b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[6].innerHTML = "&#9989";
    } else tecken[6].innerHTML = "&#10060;";
    if (a8.toString() === a8b.sort(function(a, b){return a-b;}).toString()) {
        points++;
        tecken[7].innerHTML = "&#9989";
    } else tecken[7].innerHTML = "&#10060;";

    antalSpel++; //Antal spel ökas med 1.
    let cookieArray = [];//Array för poäng och antal spel, som ska skickas i en cookie.
    totSpel += antalSpel; //Det aktuella spelets poäng och antal spel adderas till totalsummorna för dessa.
    totPoäng += points;
    cookieArray.push(totPoäng);//Värdena läggs i arrayen.
    cookieArray.push(totSpel);

    msgElem.innerHTML = "Du fick " + points + " poäng av 8 möjliga.";//Antalet poäng skrivs ut.

    totalSpel.innerHTML = totSpel;//Det totalt antalet spel och poäng skrivs ut på deras avsedda platser.
    totalPoäng.innerHTML = totPoäng;
   
    /*Det totalt antalet poäng och spel läggs i en cookie, som med hjälp av 'cookies.js' enkelt tilldelas
    siffran 30 för 30 dagars utgångstid.*/
    setCookie("spelcookie", cookieArray, 30);

}
