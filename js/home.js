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
        let dateNow = new Date();
        getRequest("party?api=" + apiKey, function (data) {
            if (!data.error && data.parties) {
                for (let i in data.parties) {
                    let party = data.parties[i];
                    let date = new Date(party.endDate ? party.endDate : party.startDate);
                    if (date > dateNow)//Nur Parties anzeigen die noch nicht vorbei sind
                        contentVue.parties.push(party);
                }
            }
        });
    }
});