import { Tooltip as ReactTooltip } from 'react-tooltip';

import BoxIcon from "./BoxIcon";
import InformationIcon from "./InfoIcon";
import NoDataWrapper from "./NoData";

import { nanoid } from 'nanoid';
import useI18n from "../locale/useI18n";

interface Props {
  img: string;
  value: any;
  title: string;
  Info: string;
  isFiltered?: boolean ;
  noDataText?: string;
  displayTooltip?: boolean;
  bottomTooltip?: boolean;
}

const DataInfoCard = (props: Props) => {
  const {t} = useI18n("Analytics");

  const tooltipId = nanoid();

  return (
    <div className="relative w-full h-full flex flex-col justify-center bg-white rounded-2xl border border-gray-50">
      {!props.value && !props.isFiltered && <NoDataWrapper noDataText={props.noDataText}/>}
      <div className="p-4 flex justify-between h-full text-black">
        <div className="flex gap-5 items-center">
          <BoxIcon img={props.img} />
          <div className="w-2/3">
            <h2 className="font-lexend font-extrabold text-4xl text-primary">{props.value}</h2>
            <span className="font-medium text-sm text-gray-600 text-start">{props.title}</span>
            {!props.displayTooltip && (
                <p className="text-sm text-gray-600">{props.Info}</p>
            )}
          </div>
        </div>
        {props.displayTooltip && (
          <InformationIcon
            data-tooltip-id={tooltipId}
            data-tooltip-content={props.Info || "No tooltip content available"}
            className="px-2 items-start w-9 h-9"
          />
        )}

        {props.displayTooltip && (
          <ReactTooltip
            id={tooltipId}
            className="w-60 items-center z-20"
            delayHide={500}
            place={props.bottomTooltip ? "bottom" : "top"}
          />
        )}
      </div>
    </div>
  );
};

export default DataInfoCard;
