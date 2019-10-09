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
                    label : "Envoyé(e)",
                },
                {
                    code : 3,
                    label : "Approuvé(e)",
                },
                {
                    code : 4,
                    label : "Demande",
                    color : 'ask_color',
                },
                {
                    code : 5,
                    label : "Payement en attente",
                },
                {
                    code : 6,
                    label : "Confirmé(e)",
                    color: 'confirmed_color',
                },
                {
                    code : 7,
                    label : "A confirmer",
                },
                {
                    code : 8,
                    label : "Payé(e)",
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
                    label : "Terminé(e)",
                    color : 'over_color',
                },
                {
                    code : 12,
                    label : "Annulé(e)",
                    color : 'canceled_color',
                },
                {
                    code : 13,
                    label : "En Cours",
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
        //console.log("getColor");
        let colorClass = "";
        if (this.labels.filter(status => status.code === code)[0].color) {
            colorClass = this.labels.filter(status => status.code === code)[0].color;
        } 
        //console.log(colorClass);
        return colorClass;
    }
}

export const STATUSCODE = {
    toBeSend : 1,
    send : 2,
    approved : 3,
    firstContact : 4,
    toBePaid : 5,
    confirmed : 6,
    toBeConfirmed : 7,
    paid : 8,
    toDO : 9,
    option : 10,
    over : 11,
    canceled : 12,
    processing : 13,
}

export const STATUS = new Status();