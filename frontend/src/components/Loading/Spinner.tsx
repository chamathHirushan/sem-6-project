import React, {FC} from 'react';

interface Props {
    colour?:any;
    size:any;
}
const Spinner:FC<Props> = ({colour="#205781",size}) => {
    return (

            <div  style={{width:size,height:size}}>
                <svg   xmlns="http://www.w3.org/2000/svg"
                     style={{margin: "auto", background: "0 0", display: "block", shapeRendering: "auto" ,width:"100%",height:"100%"}}
                      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <circle cx="50" cy="50" fill="none" stroke={colour} strokeWidth="8" r="35"
                            strokeDasharray="164.93361431346415 56.97787143782138">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite"
                                          dur="1.1363636363636365s" values="0 50 50;360 50 50" keyTimes="0;1"/>
                    </circle>
                </svg>

            </div>

    );
};

export default Spinner;
