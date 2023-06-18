import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { Message } from '../types/type';

const IMessage = ({ message }: { message: Message }) => {
    const [loggedInUser] = useAuthState(auth);

    const sentMessageClasses = 'bg-blue-500 text-white float-right ml-auto';
    const receivedMessageClasses = 'bg-gray-300  mr-auto';
    const isSentMessage = loggedInUser?.email === message.user;

    const messageClasses = isSentMessage ? sentMessageClasses : receivedMessageClasses;

    const timestampClasses = 'text-black text-2xs pr-4 absolute bottom-0 right-0';

    return (
        <div className="flex">
            <div className={`${messageClasses} text-left min-w-[30%] p-4 pb-6 rounded-3xl m-2 relative`}>
                {message.text && <p className="text-xl">{message.text}</p>}
                {message.imageURL && (
                    <div>
                        <img src={message.imageURL} alt="" />
                    </div>
                )}
                <span className={timestampClasses}>{message.send_at}</span>
            </div>
        </div>
    );
};

export default IMessage;
