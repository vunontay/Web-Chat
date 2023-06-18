import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import IMessage from './Message';
import { RecipientAvatar } from './RecipientAvatar';
import { convertFirestoreTimestampToString, getMessage, transformMessage } from '../utils/getMessage';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MdOutlineAttachFile, MdInsertEmoticon, MdSend } from 'react-icons/md';
import { CiMenuKebab, CiMicrophoneOn } from 'react-icons/ci';
import { Conversation, Message } from '../types/type';
import { useRecipient } from '../hooks/useRecipient';

interface ConversationScreenProps {
    conversations: Conversation[];
    messages: Message[];
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ conversations, messages }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Add isScrolledToBottom state

    const [loggedInUser] = useAuthState(auth);
    const currentLocation = useLocation();
    const conversationId = currentLocation.pathname.split('/conversations/')[1] || loggedInUser?.uid;

    const conversationUsers = conversations?.length > 0 ? conversations[0]?.users : [];
    const { recipientEmail, recipient } = useRecipient(conversationUsers);

    const queryMessages = getMessage(conversationId);
    const [messagesSnapshot, messagesLoading] = useCollection(queryMessages);

    useEffect(() => {
        scrollToBottom();
    }, [messagesSnapshot]);

    const showMessages = () => {
        if (messagesLoading) {
            return messages.map((message) => <IMessage key={message.id} message={message} />);
        }

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <IMessage key={message.id} message={transformMessage(message)} />
            ));
        }

        return null;
    };

    const addMessageToDbAndUpdateLastSeen = async () => {
        await setDoc(
            doc(db, 'users', loggedInUser?.email as string),
            {
                lastSeen: serverTimestamp(),
            },
            { merge: true },
        );

        await addDoc(collection(db, 'messages'), {
            conversation_id: conversationId,
            send_at: serverTimestamp(),
            text: newMessage,
            user: loggedInUser?.email,
        });

        setNewMessage('');
        if (isScrolledToBottom) {
            // Scroll to bottom only if already at the bottom
            scrollToBottom();
        }
    };

    const sendMessageOnEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter' && !showEmojiPicker) {
            event.preventDefault();
            if (!newMessage) return;
            addMessageToDbAndUpdateLastSeen();
        }
    };

    const sendMessageOnClick: React.MouseEventHandler<SVGElement> = (event) => {
        event.preventDefault();
        if (!newMessage) return;
        addMessageToDbAndUpdateLastSeen();
    };

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEmojiSelect = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const addEmoji = (e: any) => {
        const sym = e.unified.split('_');
        const codeArray: number[] = [];
        sym.forEach((el: string) => {
            codeArray.push(parseInt('0x' + el, 16));
        });
        let emoji = String.fromCodePoint(...codeArray);
        setNewMessage(newMessage + emoji);
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
            setIsScrolledToBottom(isAtBottom);
        }
    };

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="w-full h-screen">
            <div className="flex flex-wrap items-center w-full h-24 bg-blue-500">
                <div className="w-full flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
                        <h3 className="ml-3 text-white text-xl">{recipientEmail}</h3>
                        {recipient && (
                            <span className="ml-6 ">
                                Last Active: {convertFirestoreTimestampToString(recipient.lastSeen)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-4xl cursor-pointer">
                        <span className="px-6 text-white">
                            <MdOutlineAttachFile />
                        </span>
                        <span className="pl-6 text-white">
                            <CiMenuKebab />
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="overflow-y-auto h-[calc(100vh-16rem)]"
                ref={messagesContainerRef}
                onScroll={handleScroll} // Add onScroll event listener
            >
                {showMessages()}
                <div className="mb-10" ref={endOfMessagesRef}></div>
            </div>
            <div className="z-0 fixed bottom-0 w-full bg-white flex items-center p-8 h-20">
                <div className="relative">
                    <MdInsertEmoticon
                        onClick={handleEmojiSelect}
                        className="hover:text-slate-300 text-4xl mr-4 cursor-pointer"
                    />
                    {showEmojiPicker && (
                        <div className="absolute bottom-[100%]">
                            <Picker emojiSize={20} data={data} onEmojiSelect={addEmoji} maxFrequentRows={0} />
                        </div>
                    )}
                </div>
                <div className="w-3/4">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full flex-grow outline-none border-b-2 bg-gray-200 rounded-lg border-gray-300 py-4 mr-4 text-xl"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        onKeyDown={sendMessageOnEnter}
                        autoFocus
                    />
                </div>
                <div className="flex w-1/4 pl-4">
                    <MdSend onClick={sendMessageOnClick} className="text-4xl text-blue-500 cursor-pointer" />
                    <CiMicrophoneOn className="text-4xl ml-4 cursor-pointer" />
                </div>
            </div>
        </div>
    );
};
