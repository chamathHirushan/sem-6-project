import React from 'react';
import {twMerge} from "tailwind-merge";

interface Prop {
    className?: string
}

const InformationIcon = ({className,...props}: Prop) => {
    return (
        <div className={twMerge("rounded-full cursor-pointer h-6 w-6 z-20", className)} {...props}>
            <svg xmlns="http://www.w3.org/2000/svg" className="hover:text-primary" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </div>
    );
};

export default InformationIcon;