import React from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

interface DataItem {
    label: string;
    value: number;
    color?: string;
    additionalLabel?: any;
}

interface Props {
    customLegendStyle?: string;
    style2label?: string;
    data: DataItem[];
    paddingAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    showTitle?: boolean;
    titleLabel?: string[];
    textSize?: string;
    layoutDirection?: string;
    showPercentageLabel?: boolean;
    hideValueInLegend?: boolean;
}

const getOrderIndexArr = (array: number[]) => {
    const sortedIndex = (arr: number[]) => arr.map((val, ind) => {
        return {ind, val}
    })
        .sort((a, b) => {
            return a.val > b.val ? 1 : a.val == b.val ? 0 : -1
        })
        .map((obj) => obj.ind);
    return sortedIndex(sortedIndex(array))
};

const getColourArr = (data: DataItem[]) => {

    const orderIndexes = getOrderIndexArr(data.map((entry, i) => {
        return entry.value
    }))
    const len = data.length + 1
    const potion = 1 / len
    return data.map((value, i) => {
        return `rgba(180, 225, 198,${(orderIndexes[i] + 1) * potion})`
    })
}

const CustomLegendWithTotal: React.FC<{
    data: DataItem[],
    totalLabel?: string,
    textSize?: string,
    hideValues?: boolean
}> = ({
          data,
          totalLabel = "",
          textSize = 'text-lg',
          hideValues = false
      }) => {
    const defaultColors = getColourArr(data);
    return (
        <ul>
            {data.map((entry: any, index: number) => {
                if (entry?.label != "Started") {
                    return <li key={`item-${index}`}>
                        <div className="flex flex-row p-1.5 items-center justify-between">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="w-4 h-4 rounded-full flex-shrink-0"
                                     style={{backgroundColor: entry.color ? entry.color : defaultColors[index]}}/>
                                <div className={`${textSize} flex flex-wrap items-center`}>
                                    <span className="truncate">{entry.label}</span>
                                    {entry.additionalLabel && (
                                        <span className="ml-1 text-xs font-medium text-gray-650">
                                            {entry.additionalLabel}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!hideValues && <span className="self-end font-bold"> {entry.value}</span>}
                        </div>
                    </li>
                }

            })}
            {totalLabel && <>
                <hr/>
                <li key={`item-${data.length}`}>
                    <div className="flex flex-row p-1.5 items-center justify-between">
                        <span className={`self-start ${textSize}`}>{totalLabel}</span>
                        <span className="self-end font-bold"> {data.reduce((acc, val) => {
                            return acc + val.value;
                        }, 0)}</span>
                    </div>
                </li>
            </>}
        </ul>
    );
};

const CustomLegendWithPercentage: React.FC<{
    data: DataItem[],
    layoutDirection?: string,
    hideValues?: boolean
}> = ({data = [], layoutDirection = 'row', hideValues = false}) => {
    const defaultColors = getColourArr(data);
    return (
        <ul>
            {data.map((entry: any, index: number) => (
                <li key={`item-${index}`}>
                    {layoutDirection == 'row' ? (<div className="flex flex-row p-2 py-3 gap-2">
                        <div className="w-8 h-8"
                             style={{backgroundColor: entry.color ? entry.color : defaultColors[index]}}/>
                        <div className="flex flex-col w-48">
                            <span className="font-lexend text-start text-black"> {entry.label}</span>
                            <span
                                className="font-lexend text-start font-bold text-black pl-2 mt-1"> {entry.value}%</span>
                        </div>
                    </div>) : (
                        <div className="flex flex-row p-1.5 items-center justify-between">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="w-4 h-4 rounded-full flex-shrink-0"
                                     style={{backgroundColor: entry.color ? entry.color : defaultColors[index]}}/>
                                <span>{entry.label}</span>
                            </div>
                            {!hideValues && <span className="self-end font-bold pl-2">{entry.value}%</span>}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};


const CustomTooltip: React.FC<{ active: boolean; payload: any[]; customLegendStyle: string }> = ({
                                                                                                     active,
                                                                                                     payload,
                                                                                                     customLegendStyle
                                                                                                 }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white bg-opacity-90 p-5 border-black border-[0.2px]">
                <p>{`${data.label}: ${data.value} ${customLegendStyle === 'style1' ? '%' : ''}`}</p>
            </div>
        );
    }

    return null;
};

const renderPercentageLabel: React.FC<{
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number
}> = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
    const RADIAN = Math.PI / 180;
    if (percent === 0) {
        return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} fontWeight="normal" fontSize="11"
              dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const RingPieChart: React.FC<Props> = ({
                                           customLegendStyle = "style1",
                                           style2label,
                                           data,
                                           paddingAngle = 10,
                                           innerRadius = 40,
                                           outerRadius = 80,
                                           showTitle = false,
                                           titleLabel,
                                           textSize = 'text-lg',
                                           layoutDirection = 'row',
                                           showPercentageLabel = false,
                                           hideValueInLegend
                                       }) => {

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const defaultColors = getColourArr(sortedData);
    // @ts-ignore
    return (
        <div className="relative h-full">
            <div className={`flex ${layoutDirection == 'row' ? 'flex-row' : 'flex-col'} items-center justify-center`}>
                {
                    customLegendStyle == "style1" && layoutDirection == 'row' &&
                    <div className="w-1/3">
                        <CustomLegendWithPercentage data={sortedData}/>
                    </div>
                }
                <ResponsiveContainer width={customLegendStyle == "style1" ? "80%" : "50%"}
                                     height={1.5 * outerRadius + 40}>
                    <PieChart>
                        {
                            showTitle &&
                            <text x="50%" y="37%" textAnchor="middle" dominantBaseline="middle">
                                {titleLabel && titleLabel?.length > 0 &&
                                    titleLabel.map((entry, index) => {
                                        return <tspan className="font-lexend font-bold text-lg" x="50%"
                                                      dy="1em">{entry}</tspan>
                                    })}
                            </text>
                        }
                        <Tooltip
                            // @ts-ignore
                            content={<CustomTooltip customLegendStyle={customLegendStyle}/>}/>
                        <Pie
                            data={sortedData}
                            cx="50%"
                            cy="50%"
                            outerRadius={outerRadius}
                            innerRadius={innerRadius}
                            paddingAngle={paddingAngle}
                            fill="#8884d8"
                            dataKey="value"
                            startAngle={0}
                            endAngle={360}
                            labelLine={false}
                            label={showPercentageLabel ? renderPercentageLabel : undefined}
                        >
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color ? entry.color : defaultColors[index]}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {
                    customLegendStyle == "style2" &&
                    <div className={`${layoutDirection == 'row' ? 'w-1/2' : 'w-full px-12 mt-5'}`}>
                        <CustomLegendWithTotal data={sortedData} totalLabel={style2label} textSize={textSize}
                                               hideValues={hideValueInLegend}/>
                    </div>
                }
                {
                    layoutDirection == 'column' && customLegendStyle == 'style1' &&
                    <div className="w-2/3 mt-5 flex justify-center">
                        <CustomLegendWithPercentage layoutDirection="column" data={sortedData}
                                                    hideValues={hideValueInLegend}/>
                    </div>
                }
            </div>
        </div>
    );
};

export default RingPieChart;