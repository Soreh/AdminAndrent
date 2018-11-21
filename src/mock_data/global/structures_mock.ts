import { Structure } from "../../models/global/structure.interface";

const structuresList : Structure[] = [
    {
        key : 'struct_1',
        modules : [
            {
                module_key : 'module_1',
                config_key : 'config_1',
            }
        ],
        users : [
            {
                user_key : 'user_1',
                isAdmin : true,
            }
        ],
        name : "Les Riches-Claires",
        contact : {
            street : "Rue des Riches-Claires",
            number : 24,
            city : "Bruxelles"
        }
    },
    {
        key : 'struct_2',
        modules : [
            {
                module_key : 'module_2',
                config_key : 'config_1',
            }
        ],
        users : [
            {
                user_key : 'user_1',
                isAdmin : false,
            }
        ],
        name : "Panach'Club",
        contact : {
            street : "Rue Général Tombeur",
            number : 55,
            city : "Bruxelles"
        }
    },
];

export const MOCK_STRUCTURES = structuresList;