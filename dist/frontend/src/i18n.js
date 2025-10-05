"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = require("i18next");
const react_i18next_1 = require("react-i18next");
const resources = {
    en: {
        translation: {
            dashboard: 'Dashboard',
            profiles: 'Profiles',
            analytics: 'Analytics',
            audit: 'Audit Logs',
            login: 'Login',
            logout: 'Logout',
            loading: 'Loading...',
            totalProfiles: 'Total Profiles',
            activeProfiles: 'Active Profiles',
            inactiveProfiles: 'Inactive Profiles',
            carriers: 'Carriers',
            profileStatus: 'Profile Status',
            carrierDistribution: 'Carrier Distribution',
            active: 'Active',
            inactive: 'Inactive',
            activate: 'Activate',
            deactivate: 'Deactivate',
            iccid: 'ICCID',
            eid: 'EID',
            msisdn: 'MSISDN',
            status: 'Status',
            carrier: 'Carrier',
            actions: 'Actions',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
        }
    },
    my: {
        translation: {
            dashboard: 'ဒက်ရှ်ဘုတ်',
            profiles: 'ပရိုဖိုင်များ',
            analytics: 'ခွဲခြမ်းစိတ်ဖြာမှု',
            audit: 'စာရင်းစစ်မှတ်တမ်းများ',
            login: 'ဝင်ရောက်ရန်',
            logout: 'ထွက်ရန်',
            loading: 'ဖွင့်နေသည်...',
            totalProfiles: 'စုစုပေါင်းပရိုဖိုင်များ',
            activeProfiles: 'အသုံးပြုနေသောပရိုဖိုင်များ',
            inactiveProfiles: 'အသုံးမပြုသောပရိုဖိုင်များ',
            carriers: 'ဝန်ဆောင်မှုပေးသူများ',
            profileStatus: 'ပရိုဖိုင်အခြေအနေ',
            carrierDistribution: 'ဝန်ဆောင်မှုပေးသူဖြန့်ဖြူးမှု',
            active: 'အသုံးပြုနေသော',
            inactive: 'အသုံးမပြုသော',
            activate: 'အသုံးပြုရန်',
            deactivate: 'ရပ်ဆိုင်းရန်',
            iccid: 'ICCID',
            eid: 'EID',
            msisdn: 'MSISDN',
            status: 'အခြေအနေ',
            carrier: 'ဝန်ဆောင်မှုပေးသူ',
            actions: 'လုပ်ဆောင်ချက်များ',
            email: 'အီးမေးလ်',
            password: 'စကားဝှက်',
            signIn: 'ဝင်ရောက်ရန်',
        }
    }
};
i18next_1.default
    .use(react_i18next_1.initReactI18next)
    .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
exports.default = i18next_1.default;
//# sourceMappingURL=i18n.js.map