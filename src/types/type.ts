import { Timestamp } from 'firebase/firestore';

export interface Conversation {
    users: string[];
}

export interface AppUser {
    email: string;
    lastSeen: Timestamp;
    photoURL: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    text: string;
    user: string;
    send_at: string;
    imageURL?: string; // Update the type to string
}
