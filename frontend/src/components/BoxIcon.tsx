import React from 'react';

interface Prop {
    img: string;
    className?: string
}

const BoxIcon = ({img, className = 'bg-gray-light'}: Prop) => {
    return (
        <div className={"p-5 rounded-2xl my-auto " + className}>
            <img width="60" height="60" src={img} alt="Box icon"/>
        </div>
    );
};

export default BoxIcon;