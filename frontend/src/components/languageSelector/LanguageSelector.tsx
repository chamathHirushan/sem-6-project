import React, { useImperativeHandle, useState } from "react";
import Select from "react-select";

import { LanguageSelectorData } from "./LanguageSelectorData";
import i18n from "../../locale/i18n";
import moment from "moment";
const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "rgba(189,197,209,.3)" : "white",
    color: "black",
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
      // placeholder="Select Option"
      className="w-full md:w-auto"
      value={selectedOption}
      options={LanguageSelectorData}
      onChange={handleChange}
      menuPlacement="top"
      defaultValue={LanguageSelectorData[1]}
      styles={customStyles}
      // @ts-ignore
      getOptionLabel={(e: any) => (
        <div className="flex gap-3">
          <span className="hidden md:inline-block">{e.label}</span>
        </div>
      )}
    />
  );
};

export default React.forwardRef(LanguageSelector);
