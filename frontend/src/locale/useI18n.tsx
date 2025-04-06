import { useEffect } from "react";
import i18n from "./i18n";
import {useTranslation} from "react-i18next";

const useI18n = (fileName: string) => {
    useEffect(() => {
        (async () => {
            try {
                const ENG = await import(`./en/${fileName}.json`);
                const SIN = await import(`./en/${fileName}.json`);
                const TAM = await import(`./en/${fileName}.json`);

                // Check if the translation resources are already added for the specified fileName
                if (!i18n.hasResourceBundle("en", fileName)) {
                    i18n.addResourceBundle("en", fileName, ENG.default);
                }
                if (!i18n.hasResourceBundle("si", fileName)) {
                    i18n.addResourceBundle("si", fileName, SIN.default);
                }
                if (!i18n.hasResourceBundle("ta", fileName)) {
                    i18n.addResourceBundle("ta", fileName, TAM.default);
                }
            } catch (error) {
                console.error(`Failed to load localization files for namespace "${fileName}":`, error);
            }
        })();
    }, [fileName]);  // Depend on fileName to reload translations

    return useTranslation(fileName);
};

export default useI18n;