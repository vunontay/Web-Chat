import React from 'react';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';

const Home = () => {
    return (
        <div className="flex w-full">
            <div className="w-3/12 h-screen border-r-[1px] overflow-y-auto">
                <Sidebar />
            </div>
            <div className="w-full h-screen overflow-y-auto">
                <Content />
            </div>
        </div>
    );
};

export default Home;
