import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useLocation } from 'react-router-dom';
import { getRecipientEmail } from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getMessage, transformMessage } from '../utils/getMessage';
import { Conversation, Message } from '../types/type';

import { ConversationScreen } from '../components/ConversationScreen';

const Conversations = () => {
    const currentLocation = useLocation();
    const [loggedInUser] = useAuthState(auth);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const conversationId = currentLocation.pathname.split('/conversations/')[1];

    // Get conversation
    useEffect(() => {
        const getConversation = async () => {
            try {
                if (!conversationId) {
                    console.log('Conversation ID is missing.');
                    return;
                }

                const conversationRef = doc(db, 'conversations', conversationId);
                const conversationSnapshot = await getDoc(conversationRef);

                if (conversationSnapshot.exists()) {
                    const conversation = conversationSnapshot.data() as Conversation;

                    setConversations([conversation]);
                } else {
                    console.log('No conversation found');
                }
            } catch (error) {
                console.error('Error fetching conversation:', error);
            }
        };

        getConversation();
    }, [conversationId]);

    // Get message
    useEffect(() => {
        const getMessageConversation = async () => {
            try {
                if (!conversationId) {
                    console.log('Conversation ID is missing.');
                    return;
                }
                const queryMessages = getMessage(conversationId);
                const messagesSnapshot = await getDocs(queryMessages);
                const messages = messagesSnapshot.docs.map((messageDoc) => transformMessage(messageDoc) as Message);

                setMessages(messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        getMessageConversation();
    }, [conversationId]);

    useEffect(() => {
        if (conversations.length > 0) {
            const recipientEmail = getRecipientEmail(conversations[0].users, loggedInUser);
            document.title = `Conversation with ${recipientEmail}`;
        }
    }, [conversations, loggedInUser]);

    return (
        <ConversationScreen messages={messages} conversations={conversations} />
        // ...
    );
};

export default Conversations;
