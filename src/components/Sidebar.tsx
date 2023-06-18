import { signOut } from 'firebase/auth';
import React, { useEffect, useState, useRef } from 'react';
// import { BiMessageDots } from 'react-icons/bi';
// import { CiMenuKebab, CiSearch } from 'react-icons/ci';
import { IoIosLogOut, IoIosCloseCircleOutline } from 'react-icons/io';
import { auth, db } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Modal from 'react-modal';
import EmailValidator from 'email-validator';
import { DocumentData, addDoc, collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Conversation } from '../types/type';
import { ConversationSelect } from './ConversationSelect';
import 'tippy.js/dist/tippy.css';
// import tippy from 'tippy.js';
Modal.setAppElement('#root'); // Set the app root element for React Modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // Adjust the width based on your preference
        maxHeight: '80vh', // Adjust the max height based on your preference
        overflow: 'auto', // Enable scrolling if the content exceeds the max height
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 0.3s ease',
    },
    contents: {
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
};

const Sidebar = () => {
    // const tooltipRef = useRef<any>(null);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [loggedInUser] = useAuthState(auth);
    const [isOpenNewConversation, setIsOpenNewConversation] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    // const [searchResults, setSearchResults] = useState<DocumentData[]>([]);
    const queryGetConversationForCurrentUser = query(
        collection(db, 'conversations'),
        where('users', 'array-contains', loggedInUser?.email),
    );

    const [conversationSnapshot] = useCollection(queryGetConversationForCurrentUser);
    // useEffect(() => {
    //     if (tooltipRef.current) {
    //         tippy(tooltipRef.current, {
    //             content: tooltipRef.current.getAttribute('data-tip-content') || '',
    //         });
    //     }
    // }, []);
    // useEffect(() => {
    //     const delay = 500; // Delay in milliseconds before performing the search
    //     const timeoutId = setTimeout(() => {
    //         setDebouncedSearchTerm(searchTerm);
    //     }, delay);

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [searchTerm]);

    // useEffect(() => {
    //     if (debouncedSearchTerm !== '') {
    //         const filteredResults = conversationSnapshot?.docs.filter((conversation) => {
    //             const conversationUsers = (conversation.data() as Conversation).users;
    //             return conversationUsers.some((user) => user.toLowerCase() === debouncedSearchTerm.toLowerCase());
    //         });
    //         const searchResults = filteredResults?.map((conversation) => {
    //             const conversationUsers = (conversation.data() as Conversation).users;
    //             return conversationUsers.join(', ');
    //         });
    //         const emails =
    //             searchResults
    //                 ?.find((result) => result.includes(debouncedSearchTerm.toLowerCase()))
    //                 ?.split(', ')
    //                 .map((email) => email.trim()) ?? [];

    //         const emailDocuments = emails.map((email) => ({ email }));
    //         setSearchResults(emailDocuments);
    //     } else {
    //         setSearchResults(conversationSnapshot?.docs ?? []);
    //     }
    // }, [debouncedSearchTerm, conversationSnapshot]);

    // function handleSearchChange(event: { target: { value: React.SetStateAction<string> } }) {
    //     setSearchTerm(event.target.value);
    //     console.log(event.target.value);
    // }
    const toggleNewConversation = (isOpen: boolean) => {
        setIsOpenNewConversation(isOpen);

        if (!isOpen) {
            setRecipientEmail('');
        }
    };

    const closeModal = () => {
        toggleNewConversation(false);
    };

    const isConversationAlreadyExists = (recipientEmail: string) =>
        conversationSnapshot?.docs.find((conversation) =>
            (conversation.data() as Conversation).users.includes(recipientEmail),
        );

    const isInvitingSelf = recipientEmail === loggedInUser?.email;

    const createConversation = async () => {
        if (!recipientEmail) return;
        if (
            EmailValidator.validate(recipientEmail) &&
            !isInvitingSelf &&
            !isConversationAlreadyExists(recipientEmail)
        ) {
            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientEmail],
            });
        }
        closeModal();
    };
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    };
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createConversation();
        }
    };
    return (
        <div className="p-6 h-full space-y-2">
            <div className="flex items-center justify-between">
                <img
                    src={loggedInUser?.photoURL || ''}
                    alt={loggedInUser?.email as string}
                    className="w-14 h-14 rounded-full dark:bg-gray-500"
                />

                <p className="text-xl">{loggedInUser?.email}</p>
                <div className="flex items-center text-4xl cursor-pointer">
                    <span onClick={logout} className="pl-6">
                        <IoIosLogOut />
                    </span>
                </div>
            </div>
            {/* <div>
                <ul className="pt-6 text-sm">
                    <li>
                        <div className="bg-gray-100 border rounded-full p-4 flex items-center space-x-3">
                            <span className="text-3xl font-medium">
                                <CiSearch />
                            </span>
                            <input
                                className="bg-gray-100 text-xl w-full"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search"
                            ></input>
                        </div>
                    </li>
                    <div ref={tooltipRef} data-tip-content={searchResults} className="search-results">
                        {searchResults.length > 1 && (
                            <div className="result-item bg-gray-100 rounded-md p-2 flex items-center space-x-2">
                                <span className="text-blue-500 font-semibold">{searchResults[1].email}</span>
                            </div>
                        )}
                    </div>
                </ul>
            </div> */}
            <div>
                <button
                    className="my-2 w-full text-blue-400 text-xl font-medium py-4 hover:bg-slate-100 rounded-full transition duration-150 ease-out hover:ease-in"
                    onClick={() => toggleNewConversation(true)} // Open the modal when the button is clicked
                >
                    START A NEW CONVERSATION
                </button>
            </div>

            {/* List of conversations */}

            {conversationSnapshot?.docs.map((conversation) => (
                <ConversationSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={(conversation.data() as Conversation).users}
                />
            ))}

            {/* Modal for starting a new conversation */}
            <Modal
                isOpen={isOpenNewConversation}
                onRequestClose={() => toggleNewConversation(false)} // Close the modal when requested
                contentLabel="New Conversation Modal"
                style={customStyles}
                onAfterOpen={() => {
                    setTimeout(() => {
                        customStyles.contents.opacity = 1;
                    }, 100);
                }}
                onAfterClose={() => {
                    customStyles.contents.opacity = 0;
                }}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-medium underline">New Conversation</h2>
                    <button className="text-3xl" onClick={closeModal}>
                        <IoIosCloseCircleOutline />
                    </button>
                </div>
                <form>
                    <input
                        onKeyDown={handleKeyDown}
                        type="email"
                        placeholder="Email Address"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="my-10 py-6 w-full text-xl focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 border rounded-md"
                    />
                </form>
                <button onClick={createConversation} className="text-2xl font-medium" type="submit">
                    Create
                </button>
            </Modal>
        </div>
    );
};

export default Sidebar;
