export type Locale = "ru" | "en";

export const translations = {
  ru: {
    title: "Мы используем файлы cookie",
    description: "Мы применяем cookie, чтобы сайт работал стабильно и удобнее. Аналитика и маркетинг — только с вашего согласия.",
    privacy: "Политика конфиденциальности",
    acceptAll: "Принять всё",
    rejectAll: "Отклонить всё",
    settings: "Настройки",
    modalTitle: "Настройки файлов cookie",
    modalDesc: "Выберите, какие категории разрешить. Essential — всегда включены, чтобы сайт работал.",
    essential: "Essential (обязательные)",
    analytics: "Analytics",
    marketing: "Marketing",
    save: "Сохранить выбор",
    cancel: "Отмена",
  },
  en: {
    title: "We use cookies",
    description: "We use cookies to make the site work and improve it. Analytics and marketing only with your consent.",
    privacy: "Privacy policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    settings: "Settings",
    modalTitle: "Cookie settings",
    modalDesc: "Choose which categories to allow. Essential are always on to make the site work.",
    essential: "Essential",
    analytics: "Analytics",
    marketing: "Marketing",
    save: "Save selection",
    cancel: "Cancel",
  },
} as const;

export type ConsentMessages = typeof translations[Locale];


