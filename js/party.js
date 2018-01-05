const contentVue=new Vue ({
    el: '#party_description',
    data: {
        partyname: "Testparty",
        gastgeber: "PartyPlaner",
        ort: "D329",
        uhrzeit: "28.09.2018 17 Uhr",
        beschreibung: "Testbeschreibung"
    },
    methods: {
        mapsAufrufen(){
            var link="https://www.google.com/maps?daddr=" + contentVue.ort
            window.open(link);
        }
    }
});

//https://www.google.com/maps?daddr=Berlin