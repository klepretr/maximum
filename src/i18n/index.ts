import { createI18n } from "vue-i18n";
import * as fr from "./fr.json";
import * as en from "./en.json";

export const I18N_LOCALE_STORAGE_KEY = "locale";

const messages = {
  fr,
  en,
};

const getUserPreferenceLocale = () => {
  const storageLocale = localStorage.getItem(I18N_LOCALE_STORAGE_KEY);
  if (storageLocale) {
    return storageLocale;
  }

  return navigator.language.split("-")[0];
};

export default createI18n({
  messages,
  fallbackLocale: "fr",
  locale: getUserPreferenceLocale(),
});
