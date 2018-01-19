var options = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

const contentVue = new Vue({
    el: '#party_description',
    data: {
        partyId: -1,
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
            var link = "https://www.google.com/maps?daddr=" + contentVue.ort;
            window.open(link);
        }
    },
    created: function () {
        let split = /(id=)(\d+)/g.exec(window.location.href);
        let apiKey = localStorage.getItem("apiKey");
        this.partyId = (split != null && split.length > 0) ? split[2] : -1;

        if (this.partyId !== -1) //Existierende Party
            getRequest("party/" + this.partyId + "?api=" + apiKey, function (data) {
                if (!data.error) {
                    contentVue.partyname = data.name;
                    contentVue.beschreibung = data.description;
                    contentVue.gastgeber = data.ersteller.name;
                    contentVue.ort = data.location;
                    contentVue.startzeit = data.startDate;
                    contentVue.endzeit = data.endDate;
                    // if (data.startDate != null) {
                    //     var date = new Date(data.startDate);
                    //     contentVue.startzeit = date.toLocaleDateString("de-de", options);
                    // }
                    // if (data.endDate != null) {
                    //     date = new Date(data.endDate);
                    //     contentVue.endzeit = date.toLocaleDateString("de-de", options)
                    // }
                    contentVue.owner = data.ersteller.id === parseInt(localStorage.getItem("userId"));

                    console.log("Is this the owner? "+contentVue.owner);
                }
            });
    }
});
