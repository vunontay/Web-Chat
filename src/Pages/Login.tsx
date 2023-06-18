/* eslint-disable @typescript-eslint/no-unused-vars */

import { FcGoogle } from 'react-icons/fc';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
    const signIn = () => {
        signInWithGoogle();
    };
    return (
        <div className="login">
            <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-4xl font-semibold text-center text-purple-700 underline">Sign In</h1>
                    <form className="mt-6">
                        <div className="mb-2">
                            <label className="block text-2xl font-semibold text-gray-800">Email</label>
                            <input
                                type="email"
                                className="block w-full px-4 py-4 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-2xl font-semibold text-gray-800">Password</label>
                            <input
                                type="password"
                                className="block w-full px-4 py-4 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="text-xl mt-6 text-purple-600 hover:underline">Forget Password?</div>
                        <div className="mt-6">
                            <button className="w-full px-4 py-4 tracking-wide text-white text-xl transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                                <p className="text-xl">Login</p>
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 flex items-center justify-center">
                        <p className="text-2xs font-medium text-center text-gray-700"> Don't have an account? </p>
                        <div className="font-medium text-purple-600 hover:underline">Sign up with</div>
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={signIn}
                            className="w-full flex items-center justify-center border border-gray-400 rounded-lg px-4 py-4 bg-blue-500 text-white hover:bg-blue-600"
                        >
                            <span className="text-2xl">
                                <FcGoogle />
                            </span>
                            <p className="text-xl pl-2">Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
