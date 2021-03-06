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
        },
        updatePartyStatus(party, status, index) {
            let message = JSON.stringify({
                "partyid": party.id,
                "userid": localStorage.getItem("userId"),
                "status": status
            });
            const c_status = status;
            const c_index = index;
            putRequest("party/guest?api=" + localStorage.getItem("apiKey"), message, function (data) {
                if (!data.error && c_status === 2)
                    contentVue.parties.splice(c_index, 1);
                else if(!data.error && c_status === 1)
                {
                    let updated = contentVue.parties[c_index];
                    updated.status = 1;
                    contentVue.parties.$set(c_index, updated);
                }
            });
        }
    },
    created: function () {
        const apiKey = localStorage.getItem("apiKey");
        const userId = parseInt(localStorage.getItem("userId"));
        let dateNow = new Date();
        getRequest("party?api=" + apiKey, function (data) {
            if (data.error === "kein gültiger api schlüssel")
                clearStorage();
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
                            "status": party.user_id === userId ? -1 : 0,
                            "ersteller": party.ersteller
                        };
                        if (party.picture)
                            getRequest("image/" + party.picture + "?api=" + apiKey, function (data) {
                                if (data.data) {
                                    partyObject.image = data.data;
                                }
                            });
                        getRequest("party/" + party.id + "?api=" + apiKey, function (data) {
                            if (!data.error) {
                                for (let iGuest = 0; iGuest < data.guests.length; iGuest++)
                                    if (data.guests[iGuest].user_id === userId)
                                        partyObject.status = data.guests[iGuest].status;
                            }
                            contentVue.parties.push(partyObject);
                        });
                    }
                }
            }
        });
    }
});