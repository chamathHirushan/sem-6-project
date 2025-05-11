import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";
import PerformanceCard from "../../components/PerformanceCard";
import postsImg from "../../assets/posts.png";
import viewsImg from "../../assets/views.png";
import rateImg from "../../assets/rate.png";
import usageImg from "../../assets/usage.svg";
import Select from "react-select";
import RingPieChart from "../../components/Pie";

const DUMMY_ANALYTICS_DATA = [
]

const options = [
  { label: "This month", value: "This month" },
  { label: "Last 6 months", value: "Last 6 months" },
  { label: "Last 12 months", value: "Last 12 months" },
];

export default function Analytics() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
      const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>({ label: "Last 12 months", value: "Last 12 months" });
    
      useEffect(() => {
        async function fetchData() {
          try {
            const response = await apiClient.get("/user/dashboard") as { message?: string };
            setBackendData(response.message || "No data received");
          } catch (error) {
            setBackendData("Error fetching data");
            console.error("API Error:", error);
          }
        }
    
        fetchData();
      }, []);

      return (
        <>
          <div className="flex flex-wrap gap-5 ml-5 justify-start">
            <Select
              isClearable
              isSearchable={false}
              className="w-[300px] z-20"
              classNamePrefix="react-select"
              options={options}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value || { label: "Last 12 months", value: "Last 12 months" })}
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
          <div className="flex flex-wrap gap-5 mb-5 justify-center">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-black mb-5 text-center">
                Posted Tasks
              </h2>
              <div className="flex flex-wrap gap-5 justify-center">
                <div className="flex-grow min-w-[350px] max-w-[calc(33%-1.25rem)] flex-1">
                  <PerformanceCard
                    img={postsImg}
                    title={"Posted tasks by me"}
                    value={10}
                    Info={"text15"}
                    isFiltered={false}
                    noDataText={"text31"}
                    displayTooltip={true}
                  />
                </div>
                <div className="flex-grow min-w-[350px] max-w-[calc(33%-1.25rem)] flex-1">
                  <PerformanceCard
                    img={viewsImg}
                    title={"Views per posted task"}
                    value={10}
                    Info={"text15"}
                    isFiltered={false}
                    noDataText={"text31"}
                    displayTooltip={true}
                  />
                </div>
                <div className="flex-grow min-w-[350px] max-w-[calc(33%-1.25rem)] flex-1">
                  <PerformanceCard
                    img={rateImg}
                    title={"Completion rate per task"}
                    value={0.82}
                    Info={"text15"}
                    isFiltered={false}
                    noDataText={"text31"}
                    displayTooltip={true}
                  />
                </div>
                <div className="flex-grow min-w-[350px] max-w-[calc(33%-1.25rem)] flex-1">
                  <PerformanceCard
                    img={usageImg}
                    title={"Acceptance rate per task"}
                    value={0.82}
                    Info={"text15"}
                    isFiltered={false}
                    noDataText={"text31"}
                    displayTooltip={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 mb-5 justify-center">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-black mb-5 text-center">
                  Subscription analytics
                </h2>
                <div className="flex flex-wrap gap-5 mb-5 justify-center">
                  <div className="flex-grow min-w-[450px] max-w-[calc(33%-1.25rem)] flex-1">
                    <PerformanceCard
                      img={viewsImg}
                      title={"Views per subscribtion"}
                      value={10}
                      Info={"text15"}
                      isFiltered={false}
                      noDataText={"text31"}
                      displayTooltip={true}
                    />
                  </div>
                  <div className="flex-grow min-w-[450px] max-w-[calc(33%-1.25rem)] flex-1">
                    <PerformanceCard
                      img={viewsImg}
                      title={"Views per posted task"}
                      value={10}
                      Info={"text15"}
                      isFiltered={false}
                      noDataText={"text31"}
                      displayTooltip={true}
                    />
                  </div>
                  <div className="flex-grow min-w-[450px] max-w-[calc(33%-1.25rem)] flex-1">
                    <PerformanceCard
                      img={postsImg}
                      title={"Views per subscribtion"}
                      value={10}
                      Info={"text15"}
                      isFiltered={false}
                      noDataText={"text31"}
                      displayTooltip={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RingPieChart
                    customLegendStyle="style2"
                    showPercentageLabel
                    hideValueInLegend
                     data={[
                      { label: "Marketing", value: 25, color: "#38bdf8" },
                      { label: "Sales", value: 40, color: "#34d399" },
                      { label: "Engineering", value: 20, color: "#facc15" },
                      { label: "Support", value: 15, color: "#f472b6" },
                    ]}
                    paddingAngle={10}
                    innerRadius={70}
                    outerRadius={100}
                    // style2label={t("text24")}
                />
          <p>Logged as level {user.role} user</p>
          <p>Analytics page content goes here.</p>
          <p>{backendData}</p>
        </>
      );
  }

