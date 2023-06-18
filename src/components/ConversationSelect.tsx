import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipient } from '../hooks/useRecipient';
import { Conversation } from '../types/type';
import { RecipientAvatar } from './RecipientAvatar';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const ConversationSelect = ({
    id,
    conversationUsers,
}: {
    id: string;
    conversationUsers: Conversation['users'];
}) => {
    const { recipient, recipientEmail } = useRecipient(conversationUsers);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const onSelectConversation = () => {
        navigate(`/conversations/${id}`);
    };

    const deleteConversation = async () => {
        if (!recipientEmail) return;

        try {
            // Delete the conversation document from Firestore
            await deleteDoc(doc(db, 'conversations', id));
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    return (
        <div
            onClick={onSelectConversation}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center justify-between py-6 border-b cursor-pointer"
        >
            <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
            <span className="text-gray-800 text-xl font-medium px-4">{recipientEmail}</span>
            {isHovered && (
                <button className="text-4xl" onClick={deleteConversation}>
                    <IoIosCloseCircleOutline />
                </button>
            )}
        </div>
    );
};
