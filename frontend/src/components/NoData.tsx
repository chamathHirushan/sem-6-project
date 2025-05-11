import React from 'react';
import NoDataIcon from "../assets/no_data.png";
import useI18n from "../locale/useI18n";

interface NoDataWrapperProps {
  noDataText?: string;
}

const NoDataWrapper: React.FC<NoDataWrapperProps> = ({ noDataText }) => {

    const {t} = useI18n("Analytics");
    return (
        <>
            {/* <p className="absolute px-10 py-5 text-center text-primary for-bold ">
                No data available No data available No data available
            </p> */}
            <div style={{borderRadius: 'inherit'}}
                className="z-10 absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center text-center p-7 overflow-hidden">
                <img src={NoDataIcon} alt="No data available" width={70} height={70} className="opacity-70"/>
                <h4 className="md:text-sm text-xs">{noDataText || t('no_data.defaultText')}</h4>
            </div>
        </>
    );
};

export default NoDataWrapper;