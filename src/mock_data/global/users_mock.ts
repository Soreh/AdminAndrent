import { UserProfile } from "../../models/global/user-profile.interface";

const usersList : UserProfile[] =
[
    {
        key : "user_1",
        name : "Seb",
        structures : [
            {
                key : 'struct_1',
                isDefault : true,
            },
            {
                key : 'struct_2',
            },
        ],
        mail : "sebphone@gmail.com",
        isConnected : false,
    },
    {
        key : "user_2",
        name : "Zabou",
        structures : [
            {
                key : 'struct_2',
                isDefault : true,
            }
        ],
        mail : "sebphone@gmail.com",
        isConnected : false,
    },
    {
        key : "user_3",
        name : "new",
        isConnected : false,
    }
]

export const MOCK_USERS_LIST = usersList;