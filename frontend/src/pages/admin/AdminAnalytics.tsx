import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../api/client";
import DataInfoCard from "../../components/DataInfoCard";
import lkrImg from "../../assets/rupee.svg";
import Select from "react-select";
import TemplateChartSection from "../../components/TemplateChartSection";
import AreaChartWithGradient from "../../components/Chart";
import { assignColors } from "../user/Analytics";
import React from "react";


import PostImg from "../../assets/report.png";
import rateImg from "../../assets/rate.png";
import usageImg from "../../assets/usage.svg";
import inviteImg from "../../assets/invites.png";
import UsersPng from "../../assets/users.png";
import RingPieChart from "../../components/Pie";

const DUMMY_POSTS_DATA = [
    {label: "2024-11-01", count: 11},
    {label: "2024-12-01", count: 30},
    {label: "2025-01-01", count: 10},
    {label: "2025-02-01", count: 22},
    {label: "2025-03-01", count: 43},
    {label: "2025-04-01", count: 29},
    {label: "2025-05-01", count: 9},
];

const DUMMY_EARNINGS_DATA = [
    {label: "2024-Nov", count: 1100},
    {label: "2024-Dec", count: 3000},
    {label: "2025-Jan", count: 10000},
    {label: "2025-Feb", count: 2200},
    {label: "2025-Mar", count: 4300},
    {label: "2025-Apr", count: 2900},
    {label: "2025-May", count: 9000},
];

const posted_tasks = [
    { label: "Completed", value: 43 },
    { label: "Assigned", value: 30 },
    { label: "Open", value: 39 },
    { label: "Cancelled", value: 4 },
];

export default function AdminAnalytics() {
    const [backendData, setBackendData] = useState<string>("Loading...");
    const {user} = useAuth();
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await apiClient.get("/admin/dashboard");
          setBackendData(response.message || "No data received");
        } catch (error) {
          setBackendData("Error fetching data");
          console.error("API Error:", error);
        }
      }
  
      fetchData();
    }, []);

    const options = [
      { label: "This month", value: "for_1_month" },
      { label: "Last 6 months", value: "for_6_months" },
      { label: "Last 12 months", value: "for_12_months" },
    ];

    const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({ label: "Last 12 months", value: "for_12_months" });
    const [postsData, setPostsData] = React.useState(DUMMY_POSTS_DATA);
    const [earningsData, setEarningsData] = React.useState(DUMMY_EARNINGS_DATA);

  return (
      <div className="mx-8">
        <div className="flex flex-wrap gap-2 ml-4 mt-6 justify-end">
          <Select
            isSearchable={false}
            className="w-[300px] z-20"
            classNamePrefix="react-select"
            options={options}
            value={selectedOption}
            onChange={(value) => {
              setSelectedOption(value || { label: "Last 12 months", value: "for_12_months" })
              // setData(fullData[value?.value as keyof typeof DUMMY_ANALYTICS_DATA]);
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
         
        <div className="p-2 gap-2 mb-4 mx-auto justify-center max-w-[1300px]">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-black mb-5 text-center">
              Earnings
            </h2>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Left section: 3/5 width */}
              <div className="w-full md:w-3/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                <DataInfoCard
                  img={lkrImg}
                  title="Earnings over the selected time period (LKR)"
                  value="19 100"
                  Info="Total earnings of the platform over the selected time period"
                  isFiltered={false}
                  displayTooltip={true}
                />
                <DataInfoCard
                  img={PostImg}
                  title="Total number boosted posts"
                  value={34}
                  Info="Total number of posts boosted by users"
                  isFiltered={false}
                  displayTooltip={true}
                />
                <DataInfoCard
                  img={rateImg}
                  title="Completion rate of boosted posts"
                  value={0.89}
                  Info="Total number of users you have engaged with via your working posts"
                  isFiltered={false}
                  displayTooltip={true}
                />
              </div>

              {/* Right section: 2/5 width */}
              <div className="w-full md:w-2/5 shrink-0">
                {2> 1 ? (
                  <TemplateChartSection
                      title="Earining Distribution (LKR)"
                      toolTip="Profits of the platform in Sri lankan rupees"
                      isLoading={false}
                      hasData={earningsData.length > 0}
                      displayInfo={true}
                  >
                      <div className="relative h-full w-full">
                          <AreaChartWithGradient
                              data={earningsData?.map((profit) => {
                              let date = new Date(profit.label);
                              let label = "";
                              if (!isNaN(date.getTime())) {
                                  label = date.toDateString().split(" ").slice(1).join(" ");
                              }
                              return { label: label, Value: profit.count };
                              })}
                          />
                      </div>
                  </TemplateChartSection>) : (
                    <DataInfoCard
                      img={inviteImg}
                      title={`Total number of invites for"unknown"} category`}
                      value={10}
                      Info={"Total number of invites got for your working category"}
                      isFiltered={false}
                      displayTooltip={true}
                    />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 gap-2 mb-5 mx-auto justify-center max-w-[1300px]">
          <div className="mb-5 ">
            <h2 className="text-xl font-bold text-black mb-5 text-center">
              User Engagement
            </h2>
            <div className="flex flex-col md:flex-row gap-2">
            {/* Left section: 2/5 width */}
            <div className="w-full md:w-[35%] shrink-0">
              <TemplateChartSection
                  title="Task Posting distribution"
                  toolTip="Distribution of total tasks posted by users"
                  isLoading={false}
                  hasData={postsData.length > 0}
                  displayInfo={true}
              >
                  <div className="relative h-full w-full">
                      <AreaChartWithGradient
                          data={postsData?.map((post) => {
                          let date = new Date(post.label);
                          let label = "";
                          if (!isNaN(date.getTime())) {
                              label = date.toDateString().split(" ").slice(1).join(" ");
                          }
                          return { label: label, Value: post.count };
                          })}
                      />
                  </div>
              </TemplateChartSection>
            </div>

            <div className="w-full md:w-[35%] shrink-0">
              <TemplateChartSection
                  title="Statistics of posted tasks"
                  toolTip="Statistics of posted tasks by users"
                  isLoading={false}
                  hasData={postsData.length > 0}
                  displayInfo={true}
              >
                  <RingPieChart
                    customLegendStyle="style2"
                    showPercentageLabel
                    hideValueInLegend
                    data={assignColors(posted_tasks)}
                    paddingAngle={10}
                    innerRadius={40}
                    outerRadius={80}
                  />
              </TemplateChartSection>
            </div>

            {/* Right section: 3/5 width */}
            <div className="w-full md:w-[30%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <DataInfoCard
                img={UsersPng}
                title={`Active users within ${selectedOption.label.toLowerCase()}`}
                value={168}
                Info="Active users f the platform within the selected time period"
                isFiltered={false}
                displayTooltip={true}
              />
              <DataInfoCard
                img={usageImg}
                title={`Active user percentage over ${selectedOption.label.toLowerCase()}`}
                value="82%"
                Info="Active user percentage over the selected time period"
                isFiltered={false}
                displayTooltip={true}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }