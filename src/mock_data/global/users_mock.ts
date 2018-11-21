import { User } from "../../models/global/user.interface";

const usersList : User[] =
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
        email : "sebphone@gmail.com",
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
        email : "sebphone@gmail.com",
    },
    {
        key : "user_3",
        name : "new",
    }
]

export const MOCK_USERS_LIST = usersList;