import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import DataInfoCard from "../../components/DataInfoCard";
import viewsImg from "../../assets/views.png";
import rateImg from "../../assets/rate.png";
import usageImg from "../../assets/usage.svg";
import inviteImg from "../../assets/invites.png";
import Select from "react-select";
import RingPieChart from "../../components/Pie";
import UsersPng from "../../assets/users.png";
import TemplateChartSection from "../../components/TemplateChartSection";

const DUMMY_PERIOD_DATA = {
  posted_tasks: [
    { label: "Electrician", value: 5 },
    { label: "Computer repair", value: 1 },
    { label: "Plumber", value: 2 },
    { label: "Auto Mechanic", value: 1 },
    { label: "House painiting", value: 2 },
    { label: "Electronic Repairs", value: 1 },
    { label: "CCTV", value: 2 },
  ],
  invites: [
    { label: "Technician", value: 3 },
    { label: "Computer repair", value: 1 },
    { label: "CCTV", value: 2 },
    { label: "Electronic Repairs", value: 4 },
    { label: "Auto Mechanic", value: 2 },
    { label: "Driver", value: 1 },
    { label: "Electrician", value: 7 },
  ],
  total_subscription_views: 10,
  completed_invites: 20,
  engaged_users: 15,
  views_per_task: 10,
  completion_rate: 0.82,
  acceptance_rate: 0.82,
};

const DUMMY_ANALYTICS_DATA = {
  for_12_months: DUMMY_PERIOD_DATA,
  for_6_months: DUMMY_PERIOD_DATA,
  for_1_month: DUMMY_PERIOD_DATA,
}

const options = [
  { label: "This month", value: "for_1_month" },
  { label: "Last 6 months", value: "for_6_months" },
  { label: "Last 12 months", value: "for_12_months" },
];

type DataItem = {
  label: string;
  value: number;
  color?: string;
};

const generateHSLColor = (index: number, total: number): string => {
  const hue = Math.floor((360 / total) * index);
  const saturation = 50; // softer color
  const lightness = 80; // light tone
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


export const assignColors = (data: DataItem[]): DataItem[] => {
  const itemsWithoutColor = data.filter(item => !item.color);
  const total = itemsWithoutColor.length;

  let colorIndex = 0;
  return data.map(item => {
    if (!item.color) {
      const color = generateHSLColor(colorIndex, total);
      colorIndex++;
      return { ...item, color };
    }
    return item;
  });
};

export default function Analytics() {
      //const [backendData, setBackendData] = useState<string>("Loading...");
      const [fullData, setFullData] = useState<typeof DUMMY_ANALYTICS_DATA>(DUMMY_ANALYTICS_DATA);
      const [data, setData] = useState<typeof DUMMY_PERIOD_DATA>(DUMMY_ANALYTICS_DATA.for_12_months);
      const {user} = useAuth();
      const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({ label: "Last 12 months", value: "for_12_months" });
    
      useEffect(() => {
        const fetchAnalyticsData = async () => {
          try {
            const response = await apiClient.get("/user/analytics") as { message?: string };
            if (response.message) {
              const parsedData = JSON.parse(response.message || "[]");
              setFullData(parsedData);
            }
          } catch (error) {
            console.error("API Error:", error);
          }
        };

        fetchAnalyticsData();
      }, []);

      // useEffect(() => {
      //   async function fetchData() {
      //     try {
      //       const response = await apiClient.get("/user/dashboard") as { message?: string };
      //       setBackendData(response.message || "No data received");
      //     } catch (error) {
      //       setBackendData("Error fetching data");
      //       console.error("API Error:", error);
      //     }
      //   }
    
      //   fetchData();
      // }, []);

      return (
        <>
          <div className="flex flex-wrap gap-2 ml-5 mb-1 justify-start">
            <Select
              isSearchable={false}
              className="w-[300px] z-20"
              classNamePrefix="react-select"
              options={options}
              value={selectedOption}
              onChange={(value) => {
                setSelectedOption(value || { label: "Last 12 months", value: "for_12_months" })
                setData(fullData[value?.value as keyof typeof DUMMY_ANALYTICS_DATA]);
              }}
              menuPlacement="bottom"
              styles={{
                control: (base) => ({ ...base, borderColor: "#205781", borderWidth: 1}),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#e0f2fe" : "white",
                  color: state.isSelected ? "#205781" : "#0f172a",
                }),
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-5 justify-center">
            <div className="mb-5 ">
              <h2 className="text-lg font-bold text-black mb-5 text-center">
                Posted Tasks
              </h2>
             <div className="flex flex-col md:flex-row gap-2">
              {/* Left section: 1/3 width */}
              <div className="w-full md:w-1/3 shrink-0">
                <TemplateChartSection
                  title="Posted tasks by me for each category"
                  toolTip="Number of posted tasks for each category"
                  isLoading={false}
                  hasData={data.posted_tasks.length > 0}
                  displayInfo={true}
                >
                  <RingPieChart
                    customLegendStyle="style2"
                    showPercentageLabel
                    hideValueInLegend
                    data={assignColors(data.posted_tasks)}
                    paddingAngle={10}
                    innerRadius={40}
                    outerRadius={80}
                  />
                </TemplateChartSection>
              </div>

              {/* Right section: 2/3 width */}
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                <DataInfoCard
                  img={viewsImg}
                  title="Views per posted task"
                  value={data.views_per_task}
                  Info="Average number of views per task posted by you"
                  isFiltered={false}
                  displayTooltip={true}
                />
                <DataInfoCard
                  img={rateImg}
                  title="Completion rate per task"
                  value={data.completion_rate}
                  Info="Completed tasks divided by total tasks posted by you"
                  isFiltered={false}
                  displayTooltip={true}
                />
                <DataInfoCard
                  img={usageImg}
                  title="Acceptance rate per task"
                  value={data.acceptance_rate}
                  Info="Total number of tasks that have been assigned to someone as an average"
                  isFiltered={false}
                  displayTooltip={true}
                />
              </div>
            </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-5 mx-auto justify-center max-w-[1100px]">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-black mb-5 text-center">
                Subscription analytics
              </h2>
              <div className="flex flex-col md:flex-row gap-2">
                {/* Left section: 2/3 width */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                  <DataInfoCard
                    img={rateImg}
                    title="Completed invites"
                    value={data.completed_invites}
                    Info="Invited tasks that have been completed by you"
                    isFiltered={false}
                    displayTooltip={true}
                  />
                  <DataInfoCard
                    img={viewsImg}
                    title="Total number of views for your working posts"
                    value={data.total_subscription_views}
                    Info="Total number of views for your working posts/subscription"
                    isFiltered={false}
                    displayTooltip={true}
                  />
                    <DataInfoCard
                    img={UsersPng}
                    title="Number of users you have engaged with"
                    value={data.engaged_users}
                    Info="Total number of users you have engaged with via your working posts"
                    isFiltered={false}
                    displayTooltip={true}
                  />
                </div>

                {/* Right section: 1/3 width */}
                <div className="w-full md:w-1/3 shrink-0">
                  {data.invites.length > 1 ? (
                    <TemplateChartSection
                        title="Invites for each category"
                        toolTip="Number of invites for each working category you have subscribed to"
                        isLoading={false}
                        hasData={true}
                        displayInfo={true}
                        >
                          <RingPieChart
                            customLegendStyle="style2"
                            showPercentageLabel
                            hideValueInLegend
                            data={assignColors(data.invites)}
                            paddingAngle={10}
                            innerRadius={40}
                            outerRadius={80}
                            />
                    </TemplateChartSection>) : (
                      <DataInfoCard
                        img={inviteImg}
                        title={`Total number of invites for ${data.invites[0]?.label || "unknown"} category`}
                        value={data.invites[0]?.value || 0}
                        Info={"Total number of invites got for your working category"}
                        isFiltered={false}
                        displayTooltip={true}
                      />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <p>Logged as level {user.role} user</p>
          <p>Analytics page content goes here.</p>
          <p>{backendData}</p> */}
        </>
      );
  }

