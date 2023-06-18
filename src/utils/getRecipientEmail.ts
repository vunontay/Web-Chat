import { Conversation } from '../types/type';
import { User } from 'firebase/auth';

export const getRecipientEmail = (conversationUsers: Conversation['users'], loggedInUser?: User | null) => {
    if (!conversationUsers || conversationUsers.length === 0) {
        return null; // Return null or handle the empty case as needed
    }

    return conversationUsers.find((userEmail) => userEmail !== loggedInUser?.email);
};
