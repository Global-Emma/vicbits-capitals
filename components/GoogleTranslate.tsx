"use client";

import React, { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Language {
  code: string;
  name: string;
  flag: string;
}
type GoogleTranslateElementOptions = {
  pageLanguage: string;
  autoDisplay: boolean;
  includedLanguages: string;
};

interface GoogleTranslateWindow extends Window {
  googleTranslateElementInit?: () => void;
  google?: {
    translate?: {
      TranslateElement: new (
        options: GoogleTranslateElementOptions,
        elementId: string,
      ) => unknown;
    };
  };
}

export const LANGUAGES: Language[] = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", name: "Shqip (Albanian)", flag: "🇦🇱" },
  { code: "am", name: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "hy", name: "Հայերեն (Armenian)", flag: "🇦🇲" },
  { code: "as", name: "অসমীয়া (Assamese)", flag: "🇮🇳" },
  { code: "ay", name: "Aymar aru (Aymara)", flag: "🇧🇴" },
  { code: "az", name: "Azərbaycan (Azerbaijani)", flag: "🇦🇿" },
  { code: "bm", name: "Bamanankan (Bambara)", flag: "🇲🇱" },
  { code: "eu", name: "Euskara (Basque)", flag: "🇪🇸" },
  { code: "be", name: "Беларуская (Belarusian)", flag: "🇧🇾" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "bho", name: "भोजपुरी (Bhojpuri)", flag: "🇮🇳" },
  { code: "bs", name: "Bosanski (Bosnian)", flag: "🇧🇦" },
  { code: "bg", name: "Български (Bulgarian)", flag: "🇧🇬" },
  { code: "ca", name: "Català (Catalan)", flag: "🇪🇸" },
  { code: "ceb", name: "Cebuano", flag: "🇵🇭" },
  { code: "ny", name: "Chichewa", flag: "🇲🇼" },
  { code: "zh-CN", name: "中文 (简体 - Chinese Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "中文 (繁體 - Chinese Traditional)", flag: "🇹🇼" },
  { code: "co", name: "Corsu (Corsican)", flag: "🇫🇷" },
  { code: "hr", name: "Hrvatski (Croatian)", flag: "🇭🇷" },
  { code: "cs", name: "Čeština (Czech)", flag: "🇨🇿" },
  { code: "da", name: "Dansk (Danish)", flag: "🇩🇰" },
  { code: "dv", name: "ދިވެހި (Dhivehi)", flag: "🇲🇻" },
  { code: "doi", name: "डोगरी (Dogri)", flag: "🇮🇳" },
  { code: "nl", name: "Nederlands (Dutch)", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "eo", name: "Esperanto", flag: "🌐" },
  { code: "et", name: "Eesti (Estonian)", flag: "🇪🇪" },
  { code: "ee", name: "Eʋegbe (Ewe)", flag: "🇬🇭" },
  { code: "tl", name: "Filipino (Tagalog)", flag: "🇵🇭" },
  { code: "fi", name: "Suomi (Finnish)", flag: "🇫🇮" },
  { code: "fr", name: "Français (French)", flag: "🇫🇷" },
  { code: "fy", name: "Frysk (Frisian)", flag: "🇳🇱" },
  { code: "gl", name: "Galego (Galician)", flag: "🇪🇸" },
  { code: "ka", name: "ქართული (Georgian)", flag: "🇬🇪" },
  { code: "de", name: "Deutsch (German)", flag: "🇩🇪" },
  { code: "el", name: "Ελληνικά (Greek)", flag: "🇬🇷" },
  { code: "gn", name: "Avañe'ẽ (Guarani)", flag: "🇵🇾" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
  { code: "ht", name: "Kreyòl Ayisyen (Haitian)", flag: "🇭🇹" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "haw", name: "ʻŌlelo Hawaiʻi (Hawaiian)", flag: "🇺🇸" },
  { code: "iw", name: "עברית (Hebrew)", flag: "🇮🇱" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "hmn", name: "Hmoob (Hmong)", flag: "🇱🇦" },
  { code: "hu", name: "Magyar (Hungarian)", flag: "🇭🇺" },
  { code: "is", name: "Íslenska (Icelandic)", flag: "🇮🇸" },
  { code: "ig", name: "Asụsụ Igbo (Igbo)", flag: "🇳🇬" },
  { code: "ilo", name: "Ilokano", flag: "🇵🇭" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ga", name: "Gaeilge (Irish)", flag: "🇮🇪" },
  { code: "it", name: "Italiano (Italian)", flag: "🇮🇹" },
  { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "jw", name: "Basa Jawa (Javanese)", flag: "🇮🇩" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { code: "kk", name: "Қазақ тілі (Kazakh)", flag: "🇰🇿" },
  { code: "km", name: "ភាសាខ្មែរ (Khmer)", flag: "🇰🇭" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "gom", name: "कोंकणी (Konkani)", flag: "🇮🇳" },
  { code: "ko", name: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "kri", name: "Krio", flag: "🇸🇱" },
  { code: "ku", name: "Kurdî (Kurdish Kurmanji)", flag: "🇮🇶" },
  { code: "ckb", name: "کوردی (Kurdish Sorani)", flag: "🇮🇶" },
  { code: "ky", name: "Кыргызча (Kyrgyz)", flag: "🇰🇬" },
  { code: "lo", name: "ພາສາລາວ (Lao)", flag: "🇱🇦" },
  { code: "la", name: "Latina (Latin)", flag: "🇻🇦" },
  { code: "lv", name: "Latviešu (Latvian)", flag: "🇱🇻" },
  { code: "ln", name: "Lingála", flag: "🇨🇩" },
  { code: "lt", name: "Lietuvių (Lithuanian)", flag: "🇱🇹" },
  { code: "lg", name: "Luganda", flag: "🇺🇬" },
  { code: "lb", name: "Lëtzebuergesch (Luxembourgish)", flag: "🇱🇺" },
  { code: "mk", name: "Македонски (Macedonian)", flag: "🇲🇰" },
  { code: "mai", name: "मैथिली (Maithili)", flag: "🇮🇳" },
  { code: "mg", name: "Malagasy", flag: "🇲🇬" },
  { code: "ms", name: "Bahasa Melayu (Malay)", flag: "🇲🇾" },
  { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
  { code: "mt", name: "Malti (Maltese)", flag: "🇲🇹" },
  { code: "mi", name: "Te Reo Māori", flag: "🇳🇿" },
  { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
  { code: "mni-Mtei", name: "মৈতৈলোন্ (Manipuri)", flag: "🇮🇳" },
  { code: "lus", name: "Mizo", flag: "🇮🇳" },
  { code: "mn", name: "Монгол (Mongolian)", flag: "🇲🇳" },
  { code: "my", name: "မြန်မာစာ (Burmese)", flag: "🇲🇲" },
  { code: "ne", name: "नेपाली (Nepali)", flag: "🇳🇵" },
  { code: "no", name: "Norsk (Norwegian)", flag: "🇳🇴" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)", flag: "🇮🇳" },
  { code: "om", name: "Afaan Oromoo (Oromo)", flag: "🇪🇹" },
  { code: "ps", name: "پښتو (Pashto)", flag: "🇦🇫" },
  { code: "fa", name: "فارسی (Persian)", flag: "🇮🇷" },
  { code: "pl", name: "Polski (Polish)", flag: "🇵🇱" },
  { code: "pt", name: "Português (Portuguese)", flag: "🇵🇹" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳" },
  { code: "qu", name: "Runa Simi (Quechua)", flag: "🇵🇪" },
  { code: "ro", name: "Română (Romanian)", flag: "🇷🇴" },
  { code: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
  { code: "sm", name: "Gagana Sāmoa (Samoan)", flag: "🇼🇸" },
  { code: "sa", name: "संस्कृतम् (Sanskrit)", flag: "🇮🇳" },
  { code: "gd", name: "Gàidhlig (Scots Gaelic)", flag: "🇬🇧" },
  { code: "nso", name: "Sepedi (Northern Sotho)", flag: "🇿🇦" },
  { code: "sr", name: "Српски (Serbian)", flag: "🇷🇸" },
  { code: "st", name: "Sesotho", flag: "🇱🇸" },
  { code: "sn", name: "Chishona (Shona)", flag: "🇿🇼" },
  { code: "sd", name: "سنڌي (Sindhi)", flag: "🇵🇰" },
  { code: "si", name: "සිංහල (Sinhala)", flag: "🇱🇰" },
  { code: "sk", name: "Slovenčina (Slovak)", flag: "🇸🇰" },
  { code: "sl", name: "Slovenščina (Slovenian)", flag: "🇸🇮" },
  { code: "so", name: "Soomaali (Somali)", flag: "🇸🇴" },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
  { code: "su", name: "Basa Sunda (Sundanese)", flag: "🇮🇩" },
  { code: "sw", name: "Kiswahili (Swahili)", flag: "🇰🇪" },
  { code: "sv", name: "Svenska (Swedish)", flag: "🇸🇪" },
  { code: "tg", name: "Тоҷикӣ (Tajik)", flag: "🇹🇯" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "tt", name: "Татар (Tatar)", flag: "🇷🇺" },
  { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "th", name: "ไทย (Thai)", flag: "🇹🇭" },
  { code: "ti", name: "ትግርኛ (Tigrinya)", flag: "🇪🇷" },
  { code: "ts", name: "Xitsonga (Tsonga)", flag: "🇿🇦" },
  { code: "tr", name: "Türkçe (Turkish)", flag: "🇹🇷" },
  { code: "tk", name: "Türkmen (Turkmen)", flag: "🇹🇲" },
  { code: "ak", name: "Twi (Akan)", flag: "🇬🇭" },
  { code: "uk", name: "Українська (Ukrainian)", flag: "🇺🇦" },
  { code: "ur", name: "اردو (Urdu)", flag: "🇵🇰" },
  { code: "ug", name: "ئۇيغۇرچە (Uyghur)", flag: "🇨🇳" },
  { code: "uz", name: "Oʻzbek (Uzbek)", flag: "🇺🇿" },
  { code: "vi", name: "Tiếng Việt (Vietnamese)", flag: "🇻🇳" },
  { code: "cy", name: "Cymraeg (Welsh)", flag: "🇬🇧" },
  { code: "xh", name: "isiXhosa (Xhosa)", flag: "🇿🇦" },
  { code: "yi", name: "ייִדיש (Yiddish)", flag: "🇮🇱" },
  { code: "yo", name: "Yorùbá (Yoruba)", flag: "🇳🇬" },
  { code: "zu", name: "isiZulu (Zulu)", flag: "🇿🇦" },
];

export default function GoogleTranslate() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCookieLanguage, setPendingCookieLanguage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const googleWindow = window as GoogleTranslateWindow;

    // 1. Declare initialization handler
    googleWindow.googleTranslateElementInit = () => {
      const googleTranslate = googleWindow.google?.translate;

      if (!googleTranslate?.TranslateElement) {
        return;
      }

      new googleTranslate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
        },
        "google_translate_element",
      );
    };

    // 2. Load Google Translate script dynamically if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!pendingCookieLanguage) {
      return;
    }

    const hostname = window.location.hostname;
    const isHostOnly =
      hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    const cookieDomain = isHostOnly ? "" : `; domain=${hostname}`;

    document.cookie = `googtrans=/en/${pendingCookieLanguage}; path=/${cookieDomain}`;
    document.cookie = `googtrans=/en/${pendingCookieLanguage}; path=/`;
    window.location.reload();
  }, [pendingCookieLanguage]);

  // Programmatically trigger Google Translate change event
  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);

    const selectElement = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;

    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event("change"));
    } else {
      setPendingCookieLanguage(langCode);
    }
  };

  const current =
    LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left z-50">
      {/* Hidden container where Google mounts its native widget */}
      <div id="google_translate_element" className="hidden" />

      {/* Styled Custom UI Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-[#F3B233]/60 transition-all duration-200 shadow-sm"
      >
        <Globe size={14} className="text-[#F3B233]" />
        <span>{current.flag}</span>
        <span className="uppercase font-bold tracking-wider">
          {current.code}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#F3B233]" : "text-slate-400"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-xl bg-[#08111e] border border-slate-800 shadow-2xl overflow-hidden py-1 max-h-64 overflow-y-auto divide-y divide-slate-800/40"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F3B233]/15 hover:text-[#F3B233] transition-colors ${
                  selectedLang === lang.code
                    ? "text-[#F3B233] font-bold bg-slate-800/60"
                    : "text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
