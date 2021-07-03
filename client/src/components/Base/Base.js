import React from 'react';
import Navbar from '../Navbar/Navbar'

const Base = ({
    title="title",
    description="my description",
    className="",
    children}) => {
    return (
        <>
            <Navbar/>
             <div className="children" style={{marginTop:'100px'}} >
                {children}
            </div>
        
        </>
    );
}

export default Base;
