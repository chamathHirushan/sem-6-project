import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {FC} from "react";

interface DataItem {
    label: string;
    Value: number;
    color?: string;
}

interface Props {
    data: DataItem[];
}

const chartStyles = {
  axisColor: '#4B3B2A',
  axisStroke: { stroke: '#4B3B2A', strokeWidth: 2 },
  tickFont: { fontSize: 12, fill: '#c4c4c4', fontWeight: 'normal' }
};

const AreaChartWithGradient: FC<Props> = ({
    data,
}) => {
    return <ResponsiveContainer width="95%" height={180}>
        <AreaChart data={data}
                   margin={{top: 10, right: 30, left: 0, bottom: 8}}>
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="50%" stopColor="rgba(172, 199, 232, 1)" stopOpacity={0.75}/>
                    <stop offset="90%" stopColor="rgba(172, 199, 232, 1)" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis
                // @ts-ignore
                tick={{...chartStyles.tickFont}} dy={8} axisLine={chartStyles.axisStroke}
                tickLine={{stroke: chartStyles.axisColor}} dataKey="label"/>
            <YAxis tick={chartStyles.tickFont} axisLine={chartStyles.axisStroke} tickLine={{display: 'none'}}
                   allowDecimals={false}/>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={chartStyles.axisColor}/>
            <Tooltip label="Value"/>
            <Area type="monotone" dataKey="Value" stroke="rgba(172, 199, 232, 1)" fill="url(#areaGradient)"
                  strokeWidth={3}/>
        </AreaChart>
    </ResponsiveContainer>
}

export default AreaChartWithGradient;