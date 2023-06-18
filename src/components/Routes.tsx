import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Conversations from '../Pages/Conversation';

const MainRoutes = () => {
    const [loggedInUser] = useAuthState(auth);

    useEffect(() => {
        const setUseInDb = async () => {
            try {
                await setDoc(
                    doc(db, 'users', loggedInUser?.uid as string),
                    {
                        email: loggedInUser?.email,
                        lastSeen: serverTimestamp(),
                        photoURL: loggedInUser?.photoURL,
                    },
                    { merge: true }, // chỉ uppdate khi có thay đổi
                );
            } catch (error) {
                console.log('error', error);
            }
        };

        if (loggedInUser) {
            setUseInDb();
        }
    }, [loggedInUser]);

    if (!loggedInUser) {
        return <Login />;
    } else if (loggedInUser) {
        return <Home />;
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/conversation/:id" element={<Conversations />} />
            </Routes>
        </div>
    );
};

export default MainRoutes;
