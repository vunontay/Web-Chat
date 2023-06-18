import { useRecipient } from '../hooks/useRecipient';

type Props = ReturnType<typeof useRecipient>;

export const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
    return recipient?.photoURL ? (
        <div className="flex items-center justify-center w-14 h-14 bg-gray-200 rounded-full">
            <img className="w-full h-full rounded-full" src={recipient.photoURL} alt="Recipient Avatar" />
        </div>
    ) : (
        <div className="flex items-center justify-center w-14 h-14 bg-gray-200 rounded-full">
            <span className="text-gray-600 text-xl font-bold">
                {recipientEmail && recipientEmail[0].toLocaleUpperCase()}
            </span>
        </div>
    );
};
