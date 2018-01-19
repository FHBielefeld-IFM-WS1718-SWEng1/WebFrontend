var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

const contentVue = new Vue({
    el: '#content',
    data: {
        partyId: -1,
        partyname: "",
        description: "",
        gastgeber: "",
        ort: "",
        startDatum: "",
        startZeit: "",
        endDatum: "",
        endZeit: "",
        image: "img/logo.png",
        imageChanged: false,
        imagePath: "",
        guests: null,
        tasks: null,

        addTask: false,
        owner: true,
        isCreation: true
    },
    methods: {
        updateParty() {
            if (!this.imageChanged)
                this.doUpdate();
            else { //Wenn das Nutzerbild geändert wurde ist der Vorgang etwas komplizierter
                let imageTruncated = this.image.substring(this.image.indexOf("base64")+7);
                postRequest("image/?api=" + localStorage.getItem("apiKey"), JSON.stringify({"data": imageTruncated}), function (data) {
                    if (data.filename) {
                        contentVue.imageChanged = false;
                        contentVue.imagePath = data.filename;
                    }
                    contentVue.doUpdate();
                });
            }
        },
        doUpdate() {
            let partyObject = {
                "name": this.name,
                "description": this.description,
                "startDate": this.startDatum + "T" + this.startZeit + "Z",
                "endDate": this.endDatum + "T" + this.endZeit + "Z",
                "picture": this.imagePath
            };
            putRequest("party/" + this.partyId + "?api=" + localStorage.getItem("apiKey"), JSON.stringify(partyObject), function (data) {
            console.log("udpated: "+JSON.stringify(data));
            });
        },
        mapsAufrufen() {
            var link = "https://www.google.com/maps?daddr=" + this.ort;
            window.open(link);
        }
    },
    created: function () {
        let split = /(id=)(\d+)/g.exec(window.location.href);
        const apiKey = localStorage.getItem("apiKey");
        this.partyId = (split != null && split.length > 0) ? split[2] : -1;
        this.gastgeber = localStorage.getItem("userName");
        if (this.partyId !== -1) //Existierende Party
            getRequest("party/" + this.partyId + "?api=" + apiKey, function (data) {
                if (!data.error) {
                    contentVue.isCreation = false;
                    contentVue.partyname = data.name;
                    contentVue.description = data.description;
                    contentVue.gastgeber = data.ersteller.name;

                    contentVue.ort = data.location;
                    if (data.startDate) {
                        let splitTime = data.startDate.split("T");
                        contentVue.startDatum = splitTime[0];
                        contentVue.startZeit = splitTime[1].substring(0, splitTime[1].length - 1);
                    }
                    if (data.endDate) {
                        let splitTime = data.startDate.split("T");
                        contentVue.endDatum = splitTime[0];
                        contentVue.endZeit = splitTime[1].substring(0, splitTime[1].length - 1);
                    }

                    contentVue.guests = data.guests;

                    contentVue.tasks = data.tasks;

                    if (data.picture) {
                        contentVue.imagePath = data.picture;
                        getRequest("image/" + data.picture + "?api=" + apiKey, function (data) {
                            if (data.data) {
                                contentVue.image = "data:image/png;base64," + data.data;
                            }
                        });
                    }

                    //Parties die angefangen haben können nicht geändert werden
                    if (data.ersteller.id !== parseInt(localStorage.getItem("userId")) || new Date(data.startDate) < new Date())
                        contentVue.owner = false;
                }
            });
    }
});

if (contentVue.owner) {
    function selectProfilePicture(evt) {
        var dateien = evt.target.files;
        var uploadDatei = dateien[0];

        // Ein Objekt um Dateien einzulesen
        var reader = new FileReader();

        // Wenn der Dateiinhalt ausgelesen wurde...
        reader.onload = function (theFileData) {
            if (theFileData.target.result !== contentVue.image) {
                contentVue.image = theFileData.target.result; // Ergebnis vom FileReader auslesen
                contentVue.imageChanged = true;
            }
        };
        // Die Datei einlesen und in eine Data-URL konvertieren
        reader.readAsDataURL(uploadDatei);
    }

    document.getElementById('uploadButton').addEventListener('change', selectProfilePicture, false);
}
