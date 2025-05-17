import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {FC, use} from "react";
import TemplateChartSection from "./TemplateChartSection";

interface DataItem {
    label: string;
    Posts: number;
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
            <Tooltip label="posts"/>
            <Area type="monotone" dataKey="Posts" stroke="rgba(172, 199, 232, 1)" fill="url(#areaGradient)"
                  strokeWidth={3}/>
        </AreaChart>
    </ResponsiveContainer>
}


const DUMMY_POSTS_DATA = [
    {label: "2024-11-01", count: 11},
    {label: "2024-12-01", count: 30},
    {label: "2025-01-01", count: 10},
    {label: "2025-02-01", count: 22},
    {label: "2025-03-01", count: 43},
    {label: "2025-04-01", count: 29},
    {label: "2025-05-01", count: 9},
];

export const PostsChart = () => {
    // useEffect(() => {
    //     const fetchData = async () => {
    // fetch from backend
    //     };

    //     fetchData();
    // }, []);

    const [postsData, setPostsData] = React.useState(DUMMY_POSTS_DATA);

return (
    <TemplateChartSection
        title="Posted Tasks"
        toolTip="Total posted tasks by users"
        isLoading={false}
        hasData={postsData.length > 0}
        displayInfo={true}
    >
        <div className="relative h-full">
            <AreaChartWithGradient
                data={postsData?.map((post) => {
                let date = new Date(post.label);
                let label = "";
                if (!isNaN(date.getTime())) {
                    label = date.toDateString().split(" ").slice(1).join(" ");
                }
                return { label: label, Posts: post.count };
                })}
            />
        </div>
    </TemplateChartSection>
    );
}