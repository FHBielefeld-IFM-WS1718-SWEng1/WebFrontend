function openTab(evt, Name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(Name).style.display = "block";
    evt.currentTarget.className += " active";

    document.getElementById("Abstimmungen_Ansehen").style.visibility = "hidden";
    document.getElementById("Abstimmungen_Erstellen").style.visibility = "hidden";
    document.getElementById("Gaesteliste_Checkin").style.visibility = "hidden";
}

function Bla(txtOption) {
// Get the element with id="defaultOpen" and click on it
    document.getElementById(txtOption).click();
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function DeleteObject() {
    document.getElementById("Abstimmungen_Ansehen").style.visibility = "hidden";
    document.getElementById("Abstimmungen_Erstellen").style.visibility = "visible";
}

function ToggleObject() {
    document.getElementById("Abstimmungen_Erstellen").style.visibility = "hidden";
    document.getElementById("Abstimmungen_Ansehen").style.visibility = "visible";
}

function ToggleObj_2() {
    document.getElementById("Abstimmung_Allgemein").style.visibility = "hidden";
    document.getElementById("Abstimmungen_Ansehen").style.visibility = "hidden";
    /*hidden vorher*/
    document.getElementById("Abstimmungen_Erstellen").style.visibility = "visible";
    /*visible vorher*/
}

function ChangeObj3() {
    document.getElementById("Gaesteliste_Main").style.visibility = "hidden";
    document.getElementById("Gaesteliste_Checkin").style.visibility = "visible";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


window.onload = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {text: ""},
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: 79.45, label: "Salami"},
                {y: 7.31, label: "Margheritha"},
                {y: 7.06, label: "Schinken"},
                {y: 4.91, label: "Hawai"},
                {y: 1.26, label: "Thunfisch"}
            ]
        }]
    });
    chart.render();
}
