Vue.component('login', {
    template: '#login-form',
    data: function () {
        return {
            username: '',
            email: '',
            pw: '',
            pw_check: ''
        }
    },
    methods: {
        login() {
            if (this.$root.register) {
                mail=this.email;
                console.log("Register new user", this.username, mail, this.pw, this.pw_check);
                if((tmail).match(REGEXEMAIL)){
                    if (this.pw !== this.pw_check) {
                        console.log("passwörter stimmen nicht überein");
                        this.$root.setInfo("Passwörter stimmen nicht überein.", true);
                    }
                    else {
                        const rooty = this.$root;
                        postRequest("register",
                            JSON.stringify({"name": this.username, "email": mail, "password": this.pw}),
                            function (data) {
                                console.log("Register return, " + data);
                                if (data.error) {
                                    if (data.error === "Email must be unique")
                                        rooty.setInfo("Diese E-Mail ist bereits registriert.", true);
                                    else
                                        rooty.setInfo("Fehler bei der Registrierung<br>Bitte Support kontaktieren.", true);
                                }
                                else {
                                    rooty.setInfo("Registrierung erfolgreich!<br>Sie können sich jetzt einloggen.", false);
                                    rooty.switchToLogin();
                                }
                            });
                    }
                }
                else{
                    rooty.setInfo("Falsches E-Mail Adressen Format",true);
                }
            }
            else {
                console.log("Login existing user", this.email, this.pw);
                const rooty = this.$root;
                mail=this.email;
                  if (mail.toString().match(REGEXEMAIL)){
                      papla_login(mail, this.pw, function (success) {
                          if (!success)
                              rooty.setInfo("Die Login Daten sind ungültig "+this.email+" "+mail, true);
                          else {
                              str = window.location.href;
                              str = str.replace(/(\/[\w]+\.html)[\S]*/g, "/home.html");
                              window.location.replace(str);
                             }
                         }
                      );
                 }
                 else {
                      rooty.setInfo("Falsches E-Mail Adressen Format", true);
                  }


}
}
}
})
;

const rootVue = new Vue({
    el: '.container',
    data: {
        register: true,
        info: "",
        error: "",
        arrow: 1
    },
    methods: {
        switchToLogin() {
            this.register = false;
        },
        switchToRegister() {
            this.register = true;
        },
        setInfo(message, error) {
            if (error) {
                this.info = "";
                this.error = message;
            }
            else {
                this.error = "";
                this.info = message;
            }
        },
        clearInfo() {
            this.info = "";
            this.error = "";
        }
    }
});

window.onscroll = function (ev) {
    rootVue.arrow = 0;
    if (window.pageYOffset <= 0) {
        rootVue.arrow = 1;
    }
    else if (window.pageYOffset >= document.body.offsetHeight - window.innerHeight) {
        rootVue.arrow = 2;
    }
};


function importScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}

const REGEXEMAIL =/([\w\.\-\/\_\\!#$%&'*+=?^_`{|}~\[\]]+@[\w\.\-\/\_\\!#$%&'*+=?^_`{|}~\[\]]+\.[\w][\w]+)/g;