import { RentalConfig } from "../../models/rentals/rentals-config.interface";

const configList : RentalConfig[] = [
    {
        key : 'config_1',
        categories : [
            {
                id : 1,
                label : "Salles"
            },
            {
                id: 2,
                label : "Options Techniques",
            },
            {
                id: 3,
                label : "Options d'accueil",
            },
            {
                id: 4,
                label : "Heures supplémentaires",
                isPostQuotation : true,
            }
        ],
        options : [
            {
                id : 1,
                label : 'Mise à dispositon de salle',
                catId : 1,
                amount : 450,
                cost : 170,
                isCalculated : false,
                infos : "Pour un service de 4 heures, avec un régisseur",
                chargeTypeId : "type1",
                chargeId : 1,
            },
            {
                id : 2,
                label : 'Vidéo projecteur',
                catId : 2,
                amount : 20,
                cost : 0,
                isCalculated : false,
            },
            {
                id : 3,
                label : 'Forfait bar',
                catId : 3,
                amount : 90,
                cost : 64,
                isCalculated : false,
                chargeTypeId : "type1",
                chargeId : 2,
            },
            {
                id : 4,
                label : 'Mise à dispositon de salle',
                catId : 4,
                amount : 450,
                cost : 170,
                isCalculated : false,
                chargeTypeId : "type1",
                chargeId : 1,
            },
        ],
        locations : [
            {
            id : 1,
            label : "Salle Viala", 
            },
            {
                id : 2,
                label : "Salle Marion", 
            },
        ],
        chargesTypes : [
            {
                id : 'type1',
                label : 'coûts personnel',
                chargesId : [1,2], // je reprends ici la liste des coûts, ça redouble l'information, mais ça peut faciliter le tri, mai sbon du coup chargestype et chargesTypeDetails sont interconnectés, pas sur que ce soit une bonne idée.
            },
            {
                id : 'type2',
                label : 'coûts fixes',
                chargesId : [3],
            },
            {
                id : 'type3',
                label : 'autres',
                chargesId : [],
            },
            {
                id : 'type4',
                label : 'aucun coût',
            }
        ],
        chargesTypeDetails : [
            {
                id: 0,
                label : "Aucun coût",
                amount : 0,
                cost : 0,
                chargeTypeId : 'type4'
            },
            {
                id : 1,
                label : 'Régisseur',
                amount : 55,
                cost : 42.5,
                chargeTypeId : 'type1',
            },
            {
                id : 2,
                label : 'Barman',
                amount : 20,
                cost : 16,
                chargeTypeId : 'type1',
            },
            {
                id : 3,
                label : 'Repas',
                amount : 25,
                cost : 15,
                chargeTypeId : 'type2',
            },
            {
                id : 4,
                label : 'Forfait régisseur conduite lumière',
                amount : 50,
                cost : 50,
                chargeTypeId : 'type3',
            }
        ],
    },
];

export const MOCK_RENTAL_CONFIG = configList;