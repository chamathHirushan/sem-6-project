import React, {ReactNode} from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import InformationIcon from "./InfoIcon";
import NoDataIcon from "../assets/no_data.png";
import Spinner from "./Loading/Spinner";

interface TemplateChartSectionProps {
    title?: string,
    toolTip?: string,
    children?: ReactNode,
    textSize?: string,
    isLoading?: boolean,
    titleBarChildren?: any,
    displayInfo?: boolean,
    hasData?: boolean,
}

const TemplateChartSection: React.FC<TemplateChartSectionProps> = ({
                                                                       title = "",
                                                                       toolTip = "",
                                                                       children,
                                                                       textSize = "text-lg",
                                                                       isLoading = false,
                                                                       titleBarChildren,
                                                                       displayInfo,
                                                                       hasData = true,
                                                                   }) => {
    return (
        <div className="bg-white rounded p-0 w-full h-full rounded-2xl border border-gray-50">
            <div className="flex justify-between gap-2 items-center p-3 px-5">
                <div className="flex gap-1 items-center text-black w-full justify-between">
                    <div className="flex justify-between items-center">
                        <span className={`font-lexend md:${textSize} font-bold`}>
                            {title}
                            {!displayInfo && toolTip && (
                                <p className="p-1 mt-1 text-sm text-gray-500 rounded-lg">
                                    {(toolTip as string).split("<br/><br/>").map((line:any, index:any) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            )}
                        </span> {titleBarChildren && titleBarChildren}
                    </div>
                    <div className="flex flex-row items-center">
                        {displayInfo && (
                            <>
                                <InformationIcon
                                    data-tooltip-id={title}
                                    data-tooltip-content={toolTip}
                                    className="cursor-pointer"
                                />
                                <ReactTooltip
                                    id={title}
                                    className="w-60 bg-black backdrop-opacity-100 whitespace-pre-line"
                                    place="top"
                                    delayHide={500}
                                >
                                    {toolTip}
                                </ReactTooltip>
                            </>
                        )}
                    </div>
                </div>

            </div>
            <hr className="m-0"/>
            <div className="p-5 relative overflow-auto flex flex-col justify-center h-[calc(100%-64px)]">
                {!hasData && (
                    <div
                        className="z-10 absolute inset-0 flex flex-col items-center justify-center text-center p-7 gap-2 overflow-hidden">
                        {isLoading ? <Spinner size="medium" /> :
                            <>
                                <img src={NoDataIcon} alt="No data available" width={70} height={70} className="opacity-70"/>
                                {/* <h4 className="md:text-sm text-xs">No data</h4> */}
                                <p className="md:text-sm text-xs">Not enough data to be shown</p>
                            </>
                        }
                    </div>
                )}
                <div style={{filter: !hasData ? 'blur(12px)' : 'none'}}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TemplateChartSection;
