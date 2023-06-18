import { DocumentData, DocumentSnapshot, Timestamp, collection, orderBy, query, where } from '@firebase/firestore';
import { db } from '../config/firebase';
import { Message } from '../types/type';

export const getMessage = (conversationId?: string) =>
    query(collection(db, 'messages'), where('conversation_id', '==', conversationId), orderBy('send_at', 'asc'));

export const transformMessage = (message: DocumentSnapshot | DocumentData) =>
    ({
        id: message.id,
        ...message.data(),
        send_at: message.data().send_at ? convertFirestoreTimestampToString(message.data().send_at as Timestamp) : null,
    } as Message);

export const convertFirestoreTimestampToString = (timestamp: Timestamp) =>
    new Date(timestamp.toDate().getTime()).toLocaleString();
