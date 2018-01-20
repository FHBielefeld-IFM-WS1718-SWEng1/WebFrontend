const contentVue = new Vue({
    el: '#content',
    data: {
        timeOptions: {year: 'numeric', month: 'short', day: 'numeric'},
        parties: []
    },
    methods: {
        getPartyTime(party) {
            let time = new Date(party.startDate);
            return time.toLocaleDateString('de-DE', this.timeOptions);
        }
    },
    created: function () {
        let apiKey = localStorage.getItem("apiKey");
        console.log("api: " + apiKey);
        let dateNow = new Date();
        getRequest("party?api=" + apiKey + "&guest=false", function (data) {
            if (!data.error && data.parties) {
                for (let i in data.parties) {
                    const party = data.parties[i];
                    let date = new Date(party.endDate ? party.endDate : party.startDate);
                    if (date > dateNow)//Nur Parties anzeigen die noch nicht vorbei sind
                    {
                        const partyObject = {
                            "id": party.id,
                            "name": party.name,
                            "user": party.user.name,
                            "location": party.location,
                            "time": new Date(party.startDate).toLocaleDateString('de-DE', this.timeOptions),
                            "description": party.description,
                        };
                        if (!party.picture)
                            contentVue.parties.push(partyObject);
                        else
                            getRequest("image/" + party.picture + "?api=" + apiKey, function (data) {
                                if (data.data) {
                                    partyObject.image = data.data;
                                }
                            });
                    }
                }
            }
        });
    }
});