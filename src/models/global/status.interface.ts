export class Status {
    labels;

    constructor(){
        if ( !this.labels ) {
            this.labels = [
                {
                    code : 1,
                    label : "A envoyer",
                },
                {
                    code : 2,
                    label : "Envoyé",
                },
                {
                    code : 3,
                    label : "Approuvé",
                },
                {
                    code : 4,
                    label : "Confirmé",
                    color: 'confirmed_color',
                },
                {
                    code : 5,
                    label : "Payement en attente",
                },
                {
                    code : 6,
                    label : "Demande",
                    color : 'ask_color',
                },
                {
                    code : 7,
                    label : "A confirmer",
                },
                {
                    code : 8,
                    label : "Payé",
                },
                {
                    code : 9,
                    label : "À faire",
                },
                {
                    code : 10,
                    label : "Option",
                    color : 'option_color',
                },
                {
                    code : 11,
                    label : "Terminé",
                    color : 'over_color',
                },
                {
                    code : 12,
                    label : "Annulé",
                    color : 'canceled_color',
                }
            ];
        } else {
            return this;
        }
    };

    getLabel(code): string {
        return this.labels.filter(status => status.code === code)[0].label;
    }

    getColor(code): string {
        console.log("getColor");
        let colorClass = "";
        if (this.labels.filter(status => status.code === code)[0].color) {
            colorClass = this.labels.filter(status => status.code === code)[0].color;
        } 
        console.log(colorClass);
        return colorClass;
    }
}

export const STATUSCODE = {
    toBeSend : 1,
    send : 2,
    approved : 3,
    confirmed : 4,
    toBePaid : 5,
    firstContact : 6,
    toBeConfirmed : 7,
    paid : 8,
    toDO : 9,
    option : 10,
    over : 11,
    canceled : 12,
}

export const STATUS = new Status();