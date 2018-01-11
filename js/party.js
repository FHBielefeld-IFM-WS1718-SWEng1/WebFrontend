const contentVue = new Vue({
    el: '#party_description',
    data: {
        partyname: "",
        gastgeber: "",
        ort: "",
        startzeit: "",
        endzeit: "",
        beschreibung: "",
        owner: false

    },
    methods: {
        mapsAufrufen() {
            var link = "https://www.google.com/maps?daddr=" + contentVue.ort
            window.open(link);
        }
    }
});
var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

var owner = false;

var apiKey = localStorage.getItem("apiKey");
var split = /(id=)(\d+)/g.exec(window.location.href);
var partyId = (split != null && split.length > 0) ? split[2] : loggedInId;
getRequest("party/" + partyId + "?api=" + apiKey, function (data) {
    if (!data.error) {
        contentVue.partyname = data.name;
        contentVue.beschreibung = data.description;
        contentVue.gastgeber = data.ersteller.name;
        contentVue.ort = data.location;
        if (data.startDate != null) {
            var date = new Date(data.startDate);
            contentVue.startzeit = date.toLocaleDateString("de-de", options);
        }
        if (data.endDate != null) {
            date = new Date(data.endDate);
            contentVue.endzeit = date.toLocaleDateString("de-de", options)
        }
        if (data.ersteller.id == localStorage.getItem("userId")) {
            contentVue.owner = true;
        }
        else {
            contentVue.owner = false;
        }
        contentVue.ort = this.owner;
    }

});
