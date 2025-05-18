import React, { useImperativeHandle, useState } from "react";
import Select from "react-select";

import { LanguageSelectorData } from "./LanguageSelectorData";
import i18n from "../../locale/i18n";
import moment from "moment";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? "#4F959D" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #4F959D" : "none",
    '&:hover': {
      borderColor: state.isFocused ? "#4F959D" : "#ccc",
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
    '&:hover': {
      backgroundColor: "#e5e7eb",
    }
  }),
};

const LanguageSelector: React.ForwardRefRenderFunction<{
  changeLanguageAction: (lang: string) => void;
}> = (_, ref) => {
  const changeLanguageAction = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    moment.locale(lang);
  };

  useImperativeHandle(ref, () => ({
    changeLanguageAction,
  }));

  moment.locale(localStorage.getItem("I18N_LANGUAGE") || "en");

  const [selectedOption, setSelectedOption] = useState<any>(
    LanguageSelectorData.find((obj) => {
      return obj.code === localStorage.getItem("I18N_LANGUAGE");
    })
  );

  // handle onChange event of the dropdown
  const handleChange = (e: any) => {
    changeLanguageAction(e.code);
    setSelectedOption(e);
  };

  return (
    <Select
      isSearchable={false}
      className="w-full md:w-auto ml-2 mb-2"
      value={selectedOption}
      options={LanguageSelectorData}
      onChange={handleChange}
      menuPlacement="top"
      defaultValue={LanguageSelectorData[0]}
      styles={customStyles}
      getOptionValue={(e: any) => e.code}
      // @ts-ignore
      getOptionLabel={(e: any) => (
        <div className="flex gap-3">
          <span>{e.label}</span>
        </div>
      )}
    />
  );
};

export default React.forwardRef(LanguageSelector);
