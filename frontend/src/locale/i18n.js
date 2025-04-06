import i18n from "i18next";

import {initReactI18next} from "react-i18next";

import loginENG from "./en/login.json";
import loginSIN from "./si/login.json";
import loginTAM from "./ta/login.json";

const resources = {
    en: {
        login: loginENG,
    },
    si: {
        login: loginSIN,
    },
    ta: {
        login: loginTAM,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("I18N_LANGUAGE") || "en",
        fallbackLng: "en", // use en if detected lng is not available
        debug: true,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;