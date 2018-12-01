import { Rental } from "../../models/rentals/rental.interface";
import { STATUSCODE } from "../../models/global/status.interface";

const rentalsList: Rental[] = [
    {
        struct_key  : "struct_1",
        id          : 'mock1',
        name        : "Ecole de Danse de Grimbergen Seb",
        contact     : [
            {
                name: "Pierre", 
                surname: "Pignolet", 
                mail:"pierre.p@gmail.com", 
                tel:"02/542 25 82",
                main: true,
            },
            {
                name: "Béatrice", 
                surname: "Pinglot", 
                mail:"bea.p@gmail.com", 
                tel:"02/542 25 82",
            },
        ],
        client      : {
            name: "Pierre",
            surname: "Pignolet",
            email:"pierre.p@gmail.com",
            tel:"02/542 25 82"
        },
        location    : {
            id: 1,
            label : "Salle Viala",
        },
        status      : STATUSCODE.confirmed,
        payment_status : STATUSCODE.toBePaid,
        dates       : "23/11/18",
        schedule    : "",
        notes       : "",
        log       : [
            {
                author: "Seb",
                date: "23/11/18 à 14h55",
                msg: "All went fine !",
            },
        ],
        date_label  : "23/11/18 à 14h55",
        quotation_args   : {
            statusCode  : STATUSCODE.toBeSend,
            total : { 
                amount : 1135,
                cost : 489
            },
            discount : 180,
            details     : [
                {
                    units : 2,
                    optionID : 1,
                },
                {
                    units : 1,
                    optionID : 0,
                    variousCatID : 1,
                    variousAmount : 145,
                    variousCost : 85,
                    variousLabel : "2 heures de régie complémentaires, cleaning plateau",
                    variousChargeTypeId : 'type1',
                    variousChargeId : 1,
                },  
                {
                    units : 1,
                    optionID : 3,
                },
                {
                    units : 1,
                    optionID : 0,
                    variousCatID : 4,
                    variousAmount : 80,
                    variousCost : 45,
                    variousLabel : "1h supp de Mise à disposition de la Salle Viala avec régisseur",
                    variousChargeTypeId : 'type1',
                    variousChargeId : 2,
                },   
            ],
            
            //rentalId    : 'mock1',
            
            
            verbose : {
                amount : 1175,
                discount : 180,
                categories : [
                    {
                        label: "Salles",
                        lines: [
                            {
                                label : "Mise à disposition de la salle Viala le 13 novembre",
                                amount : 1045,
                            }
                        ],
                    },
                    {
                        label: "Options",
                        lines: [
                            {
                                label : "Vidéo-projecteur",
                                amount : 40,
                            },
                            {
                                label : "Mise à disposition du bar",
                                amount : 90,
                            }
                        ]
                    }
                ]
            }
        },
        invoice     : {
            status : STATUSCODE.toBeSend,
            details : {
                amount : 2450,
                status : STATUSCODE.toBePaid,
            },
        },
        contract    : {
            status : STATUSCODE.toBeSend,
            details : {
                signed : true,
            },
        },
        advance_invoice : {
            status : STATUSCODE.toBeSend,
            details : {
                amount : 245,
                status : STATUSCODE.toBePaid,
            }
        }
    },
    {
        struct_key  : "struct_1",
        id          : 'mock2',
        name        : "Conférence Maison Médicale Seb",
        contact     : [
            {
                name: "Pierre", 
                surname: "Dumoulin", 
                mail:"dumou@gmail.com", 
                tel:"02/542 25 82",
                main: true,
            }
        ],
        location    : {
            id: 1,
            label : "Salle Viala",
        },
        status      : STATUSCODE.firstContact,
        payment_status : STATUSCODE.paid,
        dates       : "23/11/18",
        log       : [
            {
                author: "Seb",
                date: "23/11/18 à 14h55",
                msg: "First contact made, option taken",
            },
        ],
        
    },
    {
        struct_key  : "struct_2",
        id          : 'mock3',
        name        : "Conférence Maison Médicale Zabou",
        contact     : [
            {
                name: "Pierre", 
                surname: "Dumoulin", 
                mail:"dumou@gmail.com", 
                tel:"02/542 25 82",
                main: true,
            }
        ],
        location    : {
            id: 1,
            label : "Salle Viala",
        },
        status      : STATUSCODE.firstContact,
        payment_status : STATUSCODE.paid,
        dates       : "23/11/18",
        log       : [
            {
                author: "Seb",
                date: "23/11/18 à 14h55",
                msg: "First contact made, option taken",
            },
        ],
        
    },
];

export const RENTALS_MOCK = rentalsList;