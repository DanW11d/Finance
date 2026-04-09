function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uid() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STORAGE = Object.freeze({
  settings: "mae_settings_v1",
  transactions: "mae_transactions_v1",
  goals: "mae_goals_v1",
  recurring: "mae_recurring_v1",
  onboarding: "mae_onboarding_seen_v1",
  session: "mae_session_v1",
});

const CATEGORY_META = Object.freeze([
  {
    id: "obligatory",
    icon: "🏠",
    color: "var(--blue)",
    soft: "var(--blue-soft)",
    names: { ru: "Обязательные", be: "Абавязковыя", en: "Essential" },
  },
  {
    id: "savings",
    icon: "🛟",
    color: "var(--accent)",
    soft: "var(--accent-soft)",
    names: { ru: "Подушка", be: "Падушка", en: "Safety net" },
  },
  {
    id: "invest",
    icon: "📈",
    color: "var(--green)",
    soft: "var(--green-soft)",
    names: { ru: "Инвестиции", be: "Інвестыцыі", en: "Investments" },
  },
  {
    id: "fun",
    icon: "🎉",
    color: "var(--amber)",
    soft: "var(--amber-soft)",
    names: { ru: "Радости", be: "Радасці", en: "Fun" },
  },
  {
    id: "goals",
    icon: "🎯",
    color: "var(--red)",
    soft: "var(--red-soft)",
    names: { ru: "Цели", be: "Мэты", en: "Goals" },
  },
]);

const GOAL_COLORS = Object.freeze(["var(--accent)", "var(--blue)", "var(--green)", "var(--amber)", "var(--red)"]);
const NBRB_CODES = Object.freeze(["USD", "EUR", "RUB"]);
const TX_CURRENCIES = Object.freeze(["BYN", ...NBRB_CODES]);
const NBRB_API_BASE = "https://api.nbrb.by/exrates/rates";
const NBRB_DAILY_RATES_URL = `${NBRB_API_BASE}?periodicity=0`;
const RATES_STALE_MS = 6 * 60 * 60 * 1000;
const RATES_POLL_INTERVAL_MS = 60 * 60 * 1000;
const RECURRING_TEMPLATES = Object.freeze(["salary", "rent", "subscription", "internet", "credit", "other"]);

const DEFAULT_SETTINGS = Object.freeze({
  budgets: Object.freeze({
    obligatory: 45,
    savings: 20,
    invest: 15,
    fun: 10,
    goals: 10,
  }),
  rates: Object.freeze({
    USD: Object.freeze({ scale: 1, officialRate: 3.02 }),
    EUR: Object.freeze({ scale: 1, officialRate: 3.26 }),
    RUB: Object.freeze({ scale: 100, officialRate: 3.28 }),
  }),
  ratesSource: "manual",
  ratesUpdatedAt: null,
  baseCurrency: "BYN",
  theme: "dark",
});

const I18N = {
  ru: {
    appName: "Мае финансы",
    appSub: "личный бюджет, цели и быстрый контроль месяца",
    navHome: "Главная",
    navHistory: "История",
    navAdd: "Добавить",
    navGoals: "Цели",
    navSettings: "Настройки",
    homeEyebrow: "обзор месяца",
    historyEyebrow: "операции и аналитика",
    addEyebrow: "быстрый ввод",
    goalsEyebrow: "накопления",
    settingsEyebrow: "правила и данные",
    balanceLabel: "Баланс месяца",
    incomeLabel: "Доходы",
    expenseLabel: "Расходы",
    remainderLabel: "Остаток",
    quickExpense: "Добавить расход",
    quickIncome: "Добавить доход",
    openHistory: "Открыть историю",
    issuesLabel: "Что требует внимания",
    budgetTitle: "Бюджет по категориям",
    recentTitle: "Последние операции",
    goalsPreview: "Ближайшие цели",
    seeAll: "Смотреть все",
    planned: "План",
    spent: "Потрачено",
    left: "Осталось",
    overrun: "Перерасход",
    noTransactionsTitle: "Пока нет операций",
    noTransactionsCopy: "Начни с первой записи, чтобы увидеть баланс, категории и аналитику месяца.",
    noGoalsTitle: "Цели еще не созданы",
    noGoalsCopy: "Добавь 1–3 цели, чтобы видеть накопления прямо на главной.",
    addFirstTx: "Добавить первую операцию",
    addFirstGoal: "Создать цель",
    insightStartTitle: "Начни с базового ввода",
    insightStartCopy: "В первой версии самое важное — быстро записывать траты и доходы, а затем смотреть остаток по месяцу.",
    insightBudgetWarnTitle: "Бюджет не сходится",
    insightBudgetWarnCopy: "Сумма процентов сейчас {total}%. Лучше держать общий план около 100%, чтобы категории были читаемыми.",
    insightIncomeMissingTitle: "Нет доходов за месяц",
    insightIncomeMissingCopy: "Пока нет доходов, план категорий считается от нуля и остатки выглядят пустыми.",
    insightOverTitle: "Есть перерасход",
    insightOverCopy: "Категорий с превышением: {count}. Проверь историю и скорректируй план или записи.",
    insightHealthyTitle: "Бюджет выглядит спокойно",
    insightHealthyCopy: "Доходы, расходы и категории сейчас без критических отклонений.",
    historyTitle: "История месяца",
    historyListTab: "История",
    historyAnalyticsTab: "Аналитика",
    filterType: "Тип",
    filterCategory: "Категория",
    allTypes: "Все операции",
    expensesOnly: "Только расходы",
    incomeOnly: "Только доходы",
    allCategories: "Все категории",
    editHint: "Нажми, чтобы изменить",
    emptyHistoryTitle: "История пуста",
    emptyHistoryCopy: "Фильтры ничего не нашли. Попробуй сменить месяц или сбросить ограничение по типу/категории.",
    analyticsEmptyTitle: "Пока нечего анализировать",
    analyticsEmptyCopy: "Добавь хотя бы несколько операций за месяц, и здесь появятся срезы по категориям и трендам.",
    biggestCategory: "Самая затратная категория",
    averageExpense: "Средний расход",
    operationsCount: "Операций",
    categoriesOnTrack: "Категорий в норме",
    addTitleNew: "Новая операция",
    addTitleEdit: "Редактирование операции",
    addCopy: "Сделаем ввод коротким: сумма, категория, дата и при желании короткая заметка.",
    typeLabel: "Тип операции",
    expenseType: "Расход",
    incomeType: "Доход",
    amountLabel: "Сумма",
    categoryLabel: "Категория",
    descriptionLabel: "Описание",
    descriptionPlaceholder: "Кофе, продукты, зарплата...",
    dateLabel: "Дата",
    saveTx: "Сохранить",
    updateTx: "Обновить",
    cancel: "Отмена",
    delete: "Удалить",
    validationAmount: "Введите сумму больше нуля",
    validationDate: "Выберите корректную дату",
    toastTxSaved: "Операция сохранена",
    toastTxUpdated: "Операция обновлена",
    toastTxDeleted: "Операция удалена",
    confirmDeleteTx: "Удалить эту операцию?",
    goalsTitle: "Цели и накопления",
    goalsCopy: "Здесь живут только реальные накопления: одна цель, понятный прогресс и быстрые пополнения без лишней сложности.",
    totalSaved: "Накоплено всего",
    totalTarget: "Цель суммарно",
    nearestGoal: "Ближайшая цель",
    addGoal: "Новая цель",
    editGoal: "Изменить",
    topUpGoal: "Пополнить",
    withdrawGoal: "Списать",
    goalNameLabel: "Название цели",
    goalTargetLabel: "Целевая сумма",
    goalSavedLabel: "Уже накоплено",
    saveGoal: "Сохранить цель",
    updateGoal: "Обновить цель",
    adjustGoalTitle: "Изменить баланс цели",
    adjustAmountLabel: "Сумма изменения",
    goalRemaining: "Осталось",
    goalProgress: "Прогресс",
    validationGoalName: "Введите название цели",
    validationGoalTarget: "Укажи целевую сумму больше нуля",
    validationGoalAdjust: "Введите сумму для изменения",
    confirmDeleteGoal: "Удалить эту цель?",
    toastGoalSaved: "Цель создана",
    toastGoalUpdated: "Цель обновлена",
    toastGoalDeleted: "Цель удалена",
    toastGoalAdjusted: "Баланс цели обновлен",
    settingsTitle: "Настройки и данные",
    settingsCopy: "Здесь настраиваются правила приложения: язык, проценты бюджета, ручные курсы и работа с данными.",
    languageLabel: "Язык",
    budgetSettingsLabel: "Распределение бюджета",
    budgetSettingsCopy: "Проценты влияют на план по категориям на главном экране и в аналитике.",
    budgetTotalOk: "Суммарный бюджет: {total}%. Отлично, план читается без перекосов.",
    budgetTotalWarn: "Суммарный бюджет: {total}%. Лучше держать около 100%, чтобы остатки были честными.",
    rateSettingsLabel: "Официальные курсы НБРБ",
    rateSettingsCopy: "Для web app берем официальный курс BYN из API Национального банка Республики Беларусь и храним локальный fallback.",
    updateRates: "Обновить курсы",
    ratesUpdatedLabel: "Обновлено",
    ratesSourceLabel: "Источник",
    ratesSourceOfficial: "НБРБ API",
    ratesSourceManual: "Локальный fallback",
    toolsLabel: "Инструменты",
    converterLabel: "Конвертер валют",
    converterFrom: "Считаю из",
    dataLabel: "Данные",
    exportData: "Экспорт JSON",
    importData: "Импорт JSON",
    resetData: "Сбросить все",
    resetCopy: "Полный сброс удалит операции, цели и пользовательские настройки бюджета/курсов.",
    confirmReset: "Сбросить все данные приложения?",
    toastBudgetSaved: "Бюджет обновлен",
    toastRateSaved: "Курс сохранен",
    toastRatesUpdated: "Курсы НБРБ обновлены",
    toastRatesFailed: "Не удалось обновить курсы НБРБ",
    toastImported: "Данные импортированы",
    toastReset: "Данные сброшены",
    baseCurrencyLabel: "Базовая валюта",
    baseCurrencyCopy: "В первой версии она зафиксирована как BYN, чтобы не усложнять модель данных.",
    toolHint: "Конвертер считает по официальным курсам BYN и умеет работать на локально сохраненных значениях.",
    importError: "Не удалось импортировать файл",
    setupTitle: "Быстрый запуск v1",
    setupCopy: "Ниже три шага, которые переводят прототип в реально полезный личный трекер.",
    setupIncomeTitle: "Добавь доход месяца",
    setupIncomeCopy: "От дохода считаются бюджеты по категориям и реальный остаток.",
    setupBudgetTitle: "Проверь бюджет на 100%",
    setupBudgetCopy: "Когда проценты сходятся, категории начинают говорить правду.",
    setupGoalTitle: "Создай хотя бы одну цель",
    setupGoalCopy: "Цели превращают приложение из счетчика расходов в финансовый план.",
    setupDoneTitle: "База собрана",
    setupDoneCopy: "Теперь приложение уже похоже на настоящий личный финансовый инструмент.",
    setupActionIncome: "Внести доход",
    setupActionBudget: "Проверить бюджет",
    setupActionGoal: "Создать цель",
    quickAmountsLabel: "Быстрые суммы",
    quickCategoriesLabel: "Быстрые категории",
    onboardingKicker: "первый запуск",
    onboardingTitle: "Соберем сильный первый опыт",
    onboardingCopy: "В v1 самое важное — за минуту понять, как здесь записываются деньги, где видно остаток и как задать себе финансовую цель.",
    onboardingStep1Title: "1. Зафиксируй доход",
    onboardingStep1Copy: "Один доход за месяц уже оживляет бюджеты и делает главную полезной.",
    onboardingStep2Title: "2. Проверь распределение",
    onboardingStep2Copy: "Категории должны складываться примерно в 100%, иначе остатки искажаются.",
    onboardingStep3Title: "3. Добавь цель",
    onboardingStep3Copy: "Даже одна цель меняет ощущение от приложения: появляется движение, а не только учет.",
    onboardingPrimary: "Начать с дохода",
    onboardingDemo: "Заполнить демо",
    onboardingLater: "Позже",
    replayGuide: "Показать onboarding",
    toastDemoLoaded: "Демо-данные добавлены",
    currencies: {
      BYN: "Белорусский рубль",
      EUR: "Евро",
      USD: "Доллар США",
      RUB: "Российский рубль",
    },
  },
  be: {
    appName: "Мае фінансы",
    appSub: "асабісты бюджэт, мэты і хуткі кантроль месяца",
    navHome: "Галоўная",
    navHistory: "Гісторыя",
    navAdd: "Дадаць",
    navGoals: "Мэты",
    navSettings: "Налады",
    homeEyebrow: "агляд месяца",
    historyEyebrow: "аперацыі і аналітыка",
    addEyebrow: "хуткі ўвод",
    goalsEyebrow: "назапашванні",
    settingsEyebrow: "правілы і даныя",
    balanceLabel: "Баланс месяца",
    incomeLabel: "Даходы",
    expenseLabel: "Выдаткі",
    remainderLabel: "Астатак",
    quickExpense: "Дадаць выдатак",
    quickIncome: "Дадаць даход",
    openHistory: "Адкрыць гісторыю",
    issuesLabel: "Што патрабуе ўвагі",
    budgetTitle: "Бюджэт па катэгорыях",
    recentTitle: "Апошнія аперацыі",
    goalsPreview: "Бліжэйшыя мэты",
    seeAll: "Глядзець усё",
    planned: "План",
    spent: "Патрачана",
    left: "Асталося",
    overrun: "Перавышэнне",
    noTransactionsTitle: "Пакуль няма аперацый",
    noTransactionsCopy: "Пачні з першай запісы, каб убачыць баланс, катэгорыі і аналітыку месяца.",
    noGoalsTitle: "Мэты яшчэ не створаны",
    noGoalsCopy: "Дадай 1–3 мэты, каб бачыць назапашванні проста на галоўным экране.",
    addFirstTx: "Дадаць першую аперацыю",
    addFirstGoal: "Стварыць мэту",
    insightStartTitle: "Пачні з базавага ўводу",
    insightStartCopy: "У першай версіі самае важнае — хутка запісваць выдаткі і даходы, а потым глядзець астатак па месяцы.",
    insightBudgetWarnTitle: "Бюджэт не сыходзіцца",
    insightBudgetWarnCopy: "Сума працэнтаў цяпер {total}%. Лепш трымаць агульны план каля 100%, каб катэгорыі былі чытэльнымі.",
    insightIncomeMissingTitle: "Няма даходаў за месяц",
    insightIncomeMissingCopy: "Пакуль няма даходаў, план катэгорый лічыцца ад нуля і астаткі выглядаюць пустымі.",
    insightOverTitle: "Ёсць перавышэнне",
    insightOverCopy: "Катэгорый з перавышэннем: {count}. Правер гісторыю і скарэктуй план або запісы.",
    insightHealthyTitle: "Бюджэт выглядае спакойна",
    insightHealthyCopy: "Даходы, выдаткі і катэгорыі зараз без крытычных адхіленняў.",
    historyTitle: "Гісторыя месяца",
    historyListTab: "Гісторыя",
    historyAnalyticsTab: "Аналітыка",
    filterType: "Тып",
    filterCategory: "Катэгорыя",
    allTypes: "Усе аперацыі",
    expensesOnly: "Толькі выдаткі",
    incomeOnly: "Толькі даходы",
    allCategories: "Усе катэгорыі",
    editHint: "Націсні, каб змяніць",
    emptyHistoryTitle: "Гісторыя пустая",
    emptyHistoryCopy: "Фільтры нічога не знайшлі. Паспрабуй змяніць месяц або скінуць абмежаванне па тыпе/катэгорыі.",
    analyticsEmptyTitle: "Пакуль няма чаго аналізаваць",
    analyticsEmptyCopy: "Дадай хаця б некалькі аперацый за месяц, і тут з'явяцца зрэзы па катэгорыях і трэндах.",
    biggestCategory: "Самая затратная катэгорыя",
    averageExpense: "Сярэдні выдатак",
    operationsCount: "Аперацый",
    categoriesOnTrack: "Катэгорый у норме",
    addTitleNew: "Новая аперацыя",
    addTitleEdit: "Рэдагаванне аперацыі",
    addCopy: "Робім увод кароткім: сума, катэгорыя, дата і пры жаданні кароткая заўвага.",
    typeLabel: "Тып аперацыі",
    expenseType: "Выдатак",
    incomeType: "Даход",
    amountLabel: "Сума",
    categoryLabel: "Катэгорыя",
    descriptionLabel: "Апісанне",
    descriptionPlaceholder: "Кава, прадукты, зарплата...",
    dateLabel: "Дата",
    saveTx: "Захаваць",
    updateTx: "Абнавіць",
    cancel: "Адмена",
    delete: "Выдаліць",
    validationAmount: "Увядзі суму больш за нуль",
    validationDate: "Абяры карэктную дату",
    toastTxSaved: "Аперацыя захавана",
    toastTxUpdated: "Аперацыя абноўлена",
    toastTxDeleted: "Аперацыя выдалена",
    confirmDeleteTx: "Выдаліць гэту аперацыю?",
    goalsTitle: "Мэты і назапашванні",
    goalsCopy: "Тут жывуць толькі рэальныя назапашванні: адна мэта, зразумелы прагрэс і хуткія папаўненні без лішняй складанасці.",
    totalSaved: "Назапашана ўсяго",
    totalTarget: "Сумарная мэта",
    nearestGoal: "Бліжэйшая мэта",
    addGoal: "Новая мэта",
    editGoal: "Змяніць",
    topUpGoal: "Папоўніць",
    withdrawGoal: "Спісаць",
    goalNameLabel: "Назва мэты",
    goalTargetLabel: "Мэтавая сума",
    goalSavedLabel: "Ужо назапашана",
    saveGoal: "Захаваць мэту",
    updateGoal: "Абнавіць мэту",
    adjustGoalTitle: "Змяніць баланс мэты",
    adjustAmountLabel: "Сума змены",
    goalRemaining: "Засталося",
    goalProgress: "Прагрэс",
    validationGoalName: "Увядзі назву мэты",
    validationGoalTarget: "Пакажы мэтавую суму больш за нуль",
    validationGoalAdjust: "Увядзі суму для змены",
    confirmDeleteGoal: "Выдаліць гэту мэту?",
    toastGoalSaved: "Мэта створана",
    toastGoalUpdated: "Мэта абноўлена",
    toastGoalDeleted: "Мэта выдалена",
    toastGoalAdjusted: "Баланс мэты абноўлены",
    settingsTitle: "Налады і даныя",
    settingsCopy: "Тут наладжваюцца правілы праграмы: мова, працэнты бюджэту, ручныя курсы і праца з данымі.",
    languageLabel: "Мова",
    budgetSettingsLabel: "Размеркаванне бюджэту",
    budgetSettingsCopy: "Працэнты ўплываюць на план па катэгорыях на галоўным экране і ў аналітыцы.",
    budgetTotalOk: "Сумарны бюджэт: {total}%. Выдатна, план чытаецца без перакосаў.",
    budgetTotalWarn: "Сумарны бюджэт: {total}%. Лепш трымаць каля 100%, каб астаткі былі сумленнымі.",
    rateSettingsLabel: "Афіцыйныя курсы НБРБ",
    rateSettingsCopy: "Для web app бяром афіцыйны курс BYN з API Нацыянальнага банка Рэспублікі Беларусь і захоўваем лакальны fallback.",
    updateRates: "Абнавіць курсы",
    ratesUpdatedLabel: "Абноўлена",
    ratesSourceLabel: "Крыніца",
    ratesSourceOfficial: "НБРБ API",
    ratesSourceManual: "Лакальны fallback",
    toolsLabel: "Інструменты",
    converterLabel: "Канвертар валют",
    converterFrom: "Лічу з",
    dataLabel: "Даныя",
    exportData: "Экспарт JSON",
    importData: "Імпарт JSON",
    resetData: "Скінуць усё",
    resetCopy: "Поўны скід выдаліць аперацыі, мэты і карыстальніцкія налады бюджэту/курсаў.",
    confirmReset: "Скінуць усе даныя праграмы?",
    toastBudgetSaved: "Бюджэт абноўлены",
    toastRateSaved: "Курс захаваны",
    toastRatesUpdated: "Курсы НБРБ абноўлены",
    toastRatesFailed: "Не ўдалося абнавіць курсы НБРБ",
    toastImported: "Даныя імпартаваны",
    toastReset: "Даныя скінуты",
    baseCurrencyLabel: "Базавая валюта",
    baseCurrencyCopy: "У першай версіі яна зафіксавана як BYN, каб не ўскладняць мадэль даных.",
    toolHint: "Канвертар лічыць па афіцыйных курсах BYN і ўмее працаваць на лакальна захаваных значэннях.",
    importError: "Не ўдалося імпартаваць файл",
    setupTitle: "Хуткі запуск v1",
    setupCopy: "Ніжэй тры крокі, якія пераводзяць прататып у сапраўды карысны асабісты трэкер.",
    setupIncomeTitle: "Дадай даход месяца",
    setupIncomeCopy: "Ад даходу лічацца бюджэты па катэгорыях і рэальны астатак.",
    setupBudgetTitle: "Правер бюджэт на 100%",
    setupBudgetCopy: "Калі працэнты сыходзяцца, катэгорыі пачынаюць казаць праўду.",
    setupGoalTitle: "Ствары хаця б адну мэту",
    setupGoalCopy: "Мэты ператвараюць праграму са лічыльніка выдаткаў у фінансавы план.",
    setupDoneTitle: "База сабрана",
    setupDoneCopy: "Цяпер праграма ўжо падобная да сапраўднага інструмента асабістых фінансаў.",
    setupActionIncome: "Унесці даход",
    setupActionBudget: "Праверыць бюджэт",
    setupActionGoal: "Стварыць мэту",
    quickAmountsLabel: "Хуткія сумы",
    quickCategoriesLabel: "Хуткія катэгорыі",
    onboardingKicker: "першы запуск",
    onboardingTitle: "Збярэм моцны першы досвед",
    onboardingCopy: "У v1 самае важнае — за хвіліну зразумець, як тут запісваюцца грошы, дзе бачны астатак і як задаць сабе фінансавую мэту.",
    onboardingStep1Title: "1. Зафіксуй даход",
    onboardingStep1Copy: "Адзін даход за месяц ужо ажыўляе бюджэты і робіць галоўную карыснай.",
    onboardingStep2Title: "2. Правер размеркаванне",
    onboardingStep2Copy: "Катэгорыі павінны складацца прыкладна ў 100%, інакш астаткі будуць скажонымі.",
    onboardingStep3Title: "3. Дадай мэту",
    onboardingStep3Copy: "Нават адна мэта змяняе адчуванне ад праграмы: з'яўляецца рух, а не толькі ўлік.",
    onboardingPrimary: "Пачаць з даходу",
    onboardingDemo: "Запоўніць дэма",
    onboardingLater: "Пазней",
    replayGuide: "Паказаць onboarding",
    toastDemoLoaded: "Дэма-даныя дададзены",
    currencies: {
      BYN: "Беларускі рубель",
      EUR: "Еўра",
      USD: "Даляр ЗША",
      RUB: "Расійскі рубель",
    },
  },
};

const STAGE1_I18N = {
  ru: {
    historyCalendarTab: "Календарь",
    historyFiltersTitle: "Быстрые фильтры",
    filterSearch: "Поиск",
    filterSearchPlaceholder: "Описание, сумма или дата",
    filterDate: "Дата",
    filterMinAmount: "Сумма от",
    filterMaxAmount: "Сумма до",
    resetFilters: "Сбросить фильтры",
    resultsFound: "Найдено",
    emptyMonthTitle: "В этом месяце пока нет операций",
    emptyMonthCopy: "Добавь первую запись или настрой повторяющуюся операцию, чтобы месяц начал считаться.",
    emptyMonthAction: "Добавить операцию",
    emptyCalendarTitle: "Календарь пока пуст",
    emptyCalendarCopy: "Записи появятся по дням, как только в этом месяце будут операции.",
    emptyCalendarDayTitle: "На выбранный день операций нет",
    emptyCalendarDayCopy: "Выбери другой день или сними часть фильтров.",
    calendarDayTotal: "Итого за день",
    calendarDayIncome: "Доход",
    calendarDayExpense: "Расход",
    calendarDayEntries: "Операции дня",
    recurringLabel: "Повторять каждый месяц",
    recurringHint: "Сохраняем шаблон и автоматически добавляем запись в этот день каждого месяца.",
    recurringDayLabel: "День месяца",
    recurringTemplateLabel: "Тип повтора",
    recurringTitle: "Повторяющиеся операции",
    recurringCopy: "Шаблоны для зарплаты, аренды, подписок, интернета, кредита и других регулярных платежей.",
    recurringAdd: "Новый повтор",
    recurringEmptyTitle: "Повторов пока нет",
    recurringEmptyCopy: "Создай шаблон при добавлении операции, и приложение само подставит ее в следующий месяц.",
    recurringEveryMonth: "Каждый месяц",
    recurringActive: "Активна",
    recurringPaused: "Пауза",
    recurringSourceBadge: "Повтор",
    recurringManageHint: "Эта запись пришла из шаблона. Сам шаблон можно поставить на паузу или удалить в настройках.",
    recurringTemplateSalary: "Зарплата",
    recurringTemplateRent: "Аренда",
    recurringTemplateSubscription: "Подписка",
    recurringTemplateInternet: "Интернет",
    recurringTemplateCredit: "Кредит",
    recurringTemplateOther: "Другое",
    toastRecurringSaved: "Повторяющаяся операция сохранена",
    toastRecurringDeleted: "Повторяющаяся операция удалена",
    toastRecurringPaused: "Повтор поставлен на паузу",
    toastRecurringResumed: "Повтор снова активен",
    confirmDeleteRecurring: "Удалить этот повтор?",
    noInternetTitle: "Нет интернета",
    noInternetCopy: "Приложение продолжает работать на локальных данных. Курсы и сетевые обновления могут быть неактуальны.",
    ratesOfflineTitle: "Курсы не обновляются без сети",
    ratesOfflineCopy: "Показываем последние сохраненные значения. Как только сеть вернется, курсы можно обновить вручную.",
    ratesErrorTitle: "Не удалось обновить курсы",
    ratesErrorCopy: "Оставили последний сохраненный курс. Проверь соединение и попробуй еще раз.",
    ratesNeverUpdatedTitle: "Курсы еще не загружались",
    ratesNeverUpdatedCopy: "Сейчас используются локальные значения по умолчанию. Когда будет интернет, подтяни актуальный курс НБРБ.",
    toastOffline: "Нет интернета, работаем локально",
    toastOnline: "Интернет снова доступен",
    weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  be: {
    historyCalendarTab: "Каляндар",
    historyFiltersTitle: "Хуткія фільтры",
    filterSearch: "Пошук",
    filterSearchPlaceholder: "Апісанне, сума або дата",
    filterDate: "Дата",
    filterMinAmount: "Сума ад",
    filterMaxAmount: "Сума да",
    resetFilters: "Скінуць фільтры",
    resultsFound: "Знойдзена",
    emptyMonthTitle: "У гэтым месяцы пакуль няма аперацый",
    emptyMonthCopy: "Дадай першую запіс або наладзь паўтор, каб месяц пачаў лічыцца.",
    emptyMonthAction: "Дадаць аперацыю",
    emptyCalendarTitle: "Каляндар пакуль пусты",
    emptyCalendarCopy: "Запісы з'явяцца па днях, як толькі ў гэтым месяцы будуць аперацыі.",
    emptyCalendarDayTitle: "На выбраны дзень аперацый няма",
    emptyCalendarDayCopy: "Выберы іншы дзень або знімі частку фільтраў.",
    calendarDayTotal: "Разам за дзень",
    calendarDayIncome: "Даход",
    calendarDayExpense: "Выдатак",
    calendarDayEntries: "Аперацыі дня",
    recurringLabel: "Паўтараць кожны месяц",
    recurringHint: "Захоўваем шаблон і аўтаматычна дадаем запіс у гэты дзень кожнага месяца.",
    recurringDayLabel: "Дзень месяца",
    recurringTemplateLabel: "Тып паўтору",
    recurringTitle: "Паўторныя аперацыі",
    recurringCopy: "Шаблоны для зарплаты, арэнды, падпісак, інтэрнэту, крэдыту і іншых рэгулярных плацяжоў.",
    recurringAdd: "Новы паўтор",
    recurringEmptyTitle: "Паўтораў пакуль няма",
    recurringEmptyCopy: "Ствары шаблон пры даданні аперацыі, і праграма сама падставіць яго ў наступны месяц.",
    recurringEveryMonth: "Кожны месяц",
    recurringActive: "Актыўна",
    recurringPaused: "Паўза",
    recurringSourceBadge: "Паўтор",
    recurringManageHint: "Гэты запіс прыйшоў з шаблону. Сам шаблон можна паставіць на паўзу або выдаліць у наладах.",
    recurringTemplateSalary: "Зарплата",
    recurringTemplateRent: "Арэнда",
    recurringTemplateSubscription: "Падпіска",
    recurringTemplateInternet: "Інтэрнэт",
    recurringTemplateCredit: "Крэдыт",
    recurringTemplateOther: "Іншае",
    toastRecurringSaved: "Паўторная аперацыя захавана",
    toastRecurringDeleted: "Паўторная аперацыя выдалена",
    toastRecurringPaused: "Паўтор пастаўлены на паўзу",
    toastRecurringResumed: "Паўтор зноў актыўны",
    confirmDeleteRecurring: "Выдаліць гэты паўтор?",
    noInternetTitle: "Няма інтэрнэту",
    noInternetCopy: "Праграма працягвае працаваць на лакальных даных. Курсы і сеткавыя абнаўленні могуць быць неактуальныя.",
    ratesOfflineTitle: "Курсы не абнаўляюцца без сеткі",
    ratesOfflineCopy: "Паказваем апошнія захаваныя значэнні. Як толькі сетка вернецца, курсы можна абнавіць уручную.",
    ratesErrorTitle: "Не ўдалося абнавіць курсы",
    ratesErrorCopy: "Пакінулі апошні захаваны курс. Правер злучэнне і паспрабуй яшчэ раз.",
    ratesNeverUpdatedTitle: "Курсы яшчэ не загружаліся",
    ratesNeverUpdatedCopy: "Цяпер выкарыстоўваюцца лакальныя значэнні па змаўчанні. Калі будзе інтэрнэт, падцягні актуальны курс НБРБ.",
    toastOffline: "Няма інтэрнэту, працуем лакальна",
    toastOnline: "Інтэрнэт зноў даступны",
    weekdaysShort: ["Пн", "Аў", "Ср", "Чц", "Пт", "Сб", "Нд"],
  },
  en: {
    appName: "My Finances",
    appSub: "personal budget, goals and quick monthly control",
    navHome: "Home",
    navHistory: "History",
    navAdd: "Add",
    navGoals: "Goals",
    navSettings: "Settings",
    homeEyebrow: "month overview",
    historyEyebrow: "operations and analytics",
    addEyebrow: "quick entry",
    goalsEyebrow: "savings",
    settingsEyebrow: "rules and data",
    balanceLabel: "Monthly balance",
    incomeLabel: "Income",
    expenseLabel: "Expenses",
    remainderLabel: "Remaining",
    budgetTitle: "Budget by category",
    planned: "Planned",
    spent: "Spent",
    left: "Left",
    overrun: "Over budget",
    historyTitle: "Month history",
    historyListTab: "History",
    historyAnalyticsTab: "Analytics",
    historyCalendarTab: "Calendar",
    filterType: "Type",
    filterCategory: "Category",
    filterSearch: "Search",
    filterSearchPlaceholder: "Description, amount or date",
    filterDate: "Date",
    filterMinAmount: "Min amount",
    filterMaxAmount: "Max amount",
    allTypes: "All transactions",
    expensesOnly: "Expenses only",
    incomeOnly: "Income only",
    allCategories: "All categories",
    resetFilters: "Reset filters",
    resultsFound: "Found",
    biggestCategory: "Biggest category",
    averageExpense: "Average expense",
    operationsCount: "Transactions",
    categoriesOnTrack: "Categories on track",
    addTitleNew: "New transaction",
    addTitleEdit: "Edit transaction",
    addCopy: "Quick entry: amount, category, date and optional note.",
    typeLabel: "Type",
    expenseType: "Expense",
    incomeType: "Income",
    amountLabel: "Amount",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Coffee, groceries, salary...",
    dateLabel: "Date",
    saveTx: "Save",
    updateTx: "Update",
    cancel: "Cancel",
    delete: "Delete",
    editHint: "Tap to edit",
    goalsTitle: "Goals and savings",
    goalsCopy: "Real goals live here: clear progress and quick top-ups without extra complexity.",
    totalSaved: "Saved total",
    totalTarget: "Target total",
    nearestGoal: "Nearest goal",
    addGoal: "New goal",
    editGoal: "Edit",
    topUpGoal: "Top up",
    withdrawGoal: "Withdraw",
    goalNameLabel: "Goal name",
    goalTargetLabel: "Target amount",
    goalSavedLabel: "Already saved",
    saveGoal: "Save goal",
    updateGoal: "Update goal",
    adjustGoalTitle: "Adjust goal balance",
    adjustAmountLabel: "Adjustment amount",
    goalRemaining: "Remaining",
    goalProgress: "Progress",
    settingsTitle: "Settings and data",
    settingsCopy: "Language, budget, rates and app data live here.",
    languageLabel: "Language",
    budgetSettingsLabel: "Budget allocation",
    budgetSettingsCopy: "These percentages shape the plan on the home screen and in analytics.",
    budgetTotalOk: "Total budget: {total}%. Great, the plan is balanced.",
    budgetTotalWarn: "Total budget: {total}%. It's better to stay near 100%.",
    rateSettingsLabel: "Official NBRB rates",
    rateSettingsCopy: "The web app uses the official BYN rate from the National Bank of Belarus API and keeps a local fallback.",
    updateRates: "Refresh rates",
    ratesUpdatedLabel: "Updated",
    ratesSourceLabel: "Source",
    ratesSourceOfficial: "NBRB API",
    ratesSourceManual: "Local fallback",
    toolsLabel: "Tools",
    converterLabel: "Currency converter",
    converterFrom: "Convert from",
    dataLabel: "Data",
    exportData: "Export JSON",
    importData: "Import JSON",
    resetData: "Reset all",
    confirmReset: "Reset all app data?",
    toastBudgetSaved: "Budget updated",
    toastRateSaved: "Rate saved",
    toastRatesUpdated: "NBRB rates updated",
    toastRatesFailed: "Could not update NBRB rates",
    toastImported: "Data imported",
    toastReset: "Data reset",
    baseCurrencyLabel: "Base currency",
    baseCurrencyCopy: "In the first version it stays fixed as BYN.",
    noInternetTitle: "No internet",
    noInternetCopy: "The app still works with local data. Rates may be outdated until the connection returns.",
    ratesOfflineTitle: "Rates cannot refresh offline",
    ratesOfflineCopy: "Showing the last saved values. Refresh again when you are online.",
    ratesErrorTitle: "Failed to refresh rates",
    ratesErrorCopy: "The last saved rates are still available. Try again a bit later.",
    ratesNeverUpdatedTitle: "Rates have not been loaded yet",
    ratesNeverUpdatedCopy: "The app is using local defaults until the first successful refresh.",
    toastOffline: "Offline mode: using local data",
    toastOnline: "Connection restored",
    weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

// App state
// All mutable state lives here. Rules:
//   - Persistent data (transactions, goals, recurring, settings):
//     always mutate the variable, then call the matching save*() function.
//   - UI state (currentPage, historyMode, drafts, filters):
//     mutate freely, then call render().
//   - Never reset transactions/goals/recurring to [] without calling save*().

// Persistent data - mutate + save*() after every change
let lang = load("lang", "ru");
let settings = null;
let transactions = [];
let goals = [];
let recurring = [];

// Navigation & view state - mutate + render()
let currentPage = "home";
let lastNonAddPage = "home";
let viewMonth = new Date().toISOString().slice(0, 7);

// History screen state
let historyMode = "list";
let historyTypeFilter = "all";
let historyCategoryFilter = "all";
let historySearchQuery = "";
let historyDateFilter = "";
let historyAmountMin = "";
let historyAmountMax = "";
let historySelectedDate = "";

// Transaction & goal editor state
let editingTxId = null;
let txDraft = null;
let goalDraft = null;
let goalEditorMode = null;
let adjustGoalId = null;
let adjustGoalAmount = "";

// Tools state
let convFrom = "BYN";
let convAmount = "100";

// App & connectivity state
let onboardingSeen = load(STORAGE.onboarding, false);
let forceOnboarding = false;
let isOnline = typeof navigator === "undefined" ? true : navigator.onLine;
let ratesUiState = {
  loading: false,
  lastError: null,
};

function migrateSettings(raw) {
  const next = clone(DEFAULT_SETTINGS);
  if (raw && typeof raw === "object") {
    if (raw.budgets && typeof raw.budgets === "object") {
      for (const category of CATEGORY_META) {
        const value = Number(raw.budgets[category.id]);
        if (Number.isFinite(value) && value >= 0) {
          next.budgets[category.id] = value;
        }
      }
    }
    if (raw.rates && typeof raw.rates === "object") {
      const oldBynPerEur = Number(raw.rates.BYN);
      const oldEurPerUsd = Number(raw.rates.USD);
      const oldEurPerRub = Number(raw.rates.RUB);

      for (const code of Object.keys(next.rates)) {
        const value = raw.rates[code];
        if (value && typeof value === "object") {
          const officialRate = Number(value.officialRate);
          const scale = Number(value.scale);
          if (Number.isFinite(officialRate) && officialRate > 0 && Number.isFinite(scale) && scale > 0) {
            next.rates[code] = { scale, officialRate };
          }
        }
      }

      if (Number.isFinite(oldBynPerEur) && oldBynPerEur > 0) {
        next.rates.EUR = { scale: 1, officialRate: oldBynPerEur };
        if (Number.isFinite(oldEurPerUsd) && oldEurPerUsd > 0) {
          next.rates.USD = { scale: 1, officialRate: oldBynPerEur / oldEurPerUsd };
        }
        if (Number.isFinite(oldEurPerRub) && oldEurPerRub > 0) {
          next.rates.RUB = { scale: 100, officialRate: (oldBynPerEur / oldEurPerRub) * 100 };
        }
      }
    }
    if (typeof raw.ratesSource === "string") {
      next.ratesSource = raw.ratesSource;
    }
    if (raw.ratesUpdatedAt) {
      next.ratesUpdatedAt = raw.ratesUpdatedAt;
    }
    if (raw.theme === "light" || raw.theme === "dark") {
      next.theme = raw.theme;
    }
  }
  return next;
}

function migrateTransactions(source) {
  if (!Array.isArray(source)) return [];
  return source
    .map((tx, index) => {
      const amount = normalizeMoneyAmount(Math.abs(Number(tx.amount ?? 0)));
      const currency = transactionCurrencyCode(tx.currency);
      const originalAmount = normalizeMoneyAmount(Math.abs(Number(tx.originalAmount ?? amount)));
      return {
        id: String(tx.id ?? uid()),
        createdAt: Number(tx.createdAt ?? tx.id ?? Date.now() - index),
        type: tx.type === "income" ? "income" : "expense",
        amount,
        originalAmount,
        currency,
        cat: CATEGORY_META.some((category) => category.id === tx.cat) ? tx.cat : "obligatory",
        desc: String(tx.desc ?? ""),
        date: /^\d{4}-\d{2}-\d{2}$/.test(String(tx.date ?? "")) ? String(tx.date) : new Date().toISOString().slice(0, 10),
        source: tx.source === "recurring" ? "recurring" : "manual",
        recurringId: tx.recurringId ? String(tx.recurringId) : null,
        recurringStamp: tx.recurringStamp ? String(tx.recurringStamp) : null,
        recurringTemplate: RECURRING_TEMPLATES.includes(String(tx.recurringTemplate)) ? String(tx.recurringTemplate) : "other",
      };
    })
    .filter((tx) => tx.amount > 0)
    .sort(sortTransactions);
}

function migrateRecurring(source) {
  if (!Array.isArray(source)) return [];
  return source
    .map((rule, index) => {
      const startMonth = /^\d{4}-\d{2}$/.test(String(rule.startMonth ?? ""))
        ? String(rule.startMonth)
        : new Date().toISOString().slice(0, 7);
      const endMonth = /^\d{4}-\d{2}$/.test(String(rule.endMonth ?? "")) ? String(rule.endMonth) : "";
      const skipMonths = Array.isArray(rule.skipMonths)
        ? [...new Set(rule.skipMonths.filter((value) => /^\d{4}-\d{2}$/.test(String(value))).map(String))]
        : [];
      return {
        id: String(rule.id ?? uid()),
        createdAt: Number(rule.createdAt ?? Date.now() + index),
        type: rule.type === "income" ? "income" : "expense",
        amount: normalizeMoneyAmount(Math.abs(Number(rule.amount ?? 0))),
        originalAmount: normalizeMoneyAmount(Math.abs(Number(rule.originalAmount ?? rule.amount ?? 0))),
        currency: transactionCurrencyCode(rule.currency),
        cat: CATEGORY_META.some((category) => category.id === rule.cat) ? rule.cat : "obligatory",
        desc: String(rule.desc ?? "").trim(),
        day: Math.min(31, Math.max(1, Number(rule.day ?? 1) || 1)),
        startMonth,
        endMonth,
        active: rule.active !== false,
        template: RECURRING_TEMPLATES.includes(String(rule.template)) ? String(rule.template) : "other",
        skipMonths,
      };
    })
    .filter((rule) => rule.amount > 0 && rule.desc);
}

function migrateGoals(source, legacyEnvelopes) {
  let rawGoals = Array.isArray(source) ? source : [];
  if (!rawGoals.length && Array.isArray(legacyEnvelopes) && legacyEnvelopes.length) {
    rawGoals = legacyEnvelopes.map((env, index) => ({
      id: String(env.id ?? uid()),
      name: env.id === "savings" ? "Подушка безопасности" : env.id === "goals" ? "Крупная цель" : "Цель " + (index + 1),
      target: Number(env.goal ?? 0),
      saved: Math.max(0, Number(env.added ?? 0) - Number(env.spent ?? 0)),
      accent: GOAL_COLORS[index % GOAL_COLORS.length],
    }));
  }

  return rawGoals
    .map((goal, index) => ({
      id: String(goal.id ?? uid()),
      createdAt: Number(goal.createdAt ?? Date.now() + index),
      name: String(goal.name ?? ""),
      target: Math.max(0, Number(goal.target ?? goal.goal ?? 0)),
      saved: Math.max(0, Number(goal.saved ?? (Number(goal.added ?? 0) - Number(goal.spent ?? 0)))),
      accent: goal.accent || GOAL_COLORS[index % GOAL_COLORS.length],
    }))
    .filter((goal) => goal.name);
}

function text(key, vars) {
  const dict = {
    ...(I18N.ru || {}),
    ...((STAGE1_I18N.ru || {})),
    ...(I18N[lang] || {}),
    ...((STAGE1_I18N[lang] || {})),
  };
  let value = dict[key];
  if (value === undefined) {
    console.warn(`[text] missing key: "${key}"`);
    value = key;
  }
  if (vars && typeof value === "string") {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), replacement);
    }
  }
  return value;
}

function localeCode() {
  if (lang === "be") return "be-BY";
  if (lang === "en") return "en-US";
  return "ru-RU";
}

function categoryName(id) {
  const category = CATEGORY_META.find((item) => item.id === id) || CATEGORY_META[0];
  return category.names[lang] || category.names.ru;
}

Object.assign(I18N.ru, {
  txCurrencyLabel: "Валюта",
  txCurrencyHint: "Базовая валюта приложения — BYN",
  txCurrencyConverted: "Сохраним в базе как",
  txCurrencyRate: "Курс НБРБ",
  themeLabel: "Тема",
  themeCopy: "Светлая тема для дневного режима и темная для вечернего.",
  themeDark: "Темная",
  themeLight: "Светлая",
  ratesFileProtocolTitle: "Для автокурсов нужен обычный запуск web app",
  ratesFileProtocolCopy: "Если страница открыта как file:///..., браузер может блокировать запросы к НБРБ. Открой приложение через локальный сервер или установленную PWA-версию.",
});

Object.assign(I18N.be, {
  txCurrencyLabel: "Валюта",
  txCurrencyHint: "Базавая валюта праграмы — BYN",
  txCurrencyConverted: "У базе будзе захавана як",
  txCurrencyRate: "Курс НБРБ",
  themeLabel: "Тэма",
  themeCopy: "Светлая тэма для дзённага рэжыму і цёмная для вячэрняга.",
  themeDark: "Цёмная",
  themeLight: "Светлая",
  ratesFileProtocolTitle: "Для аўтакурсаў патрэбен звычайны запуск web app",
  ratesFileProtocolCopy: "Калі старонка адкрыта як file:///..., браўзер можа блакаваць запыты да НБРБ. Адкрый праграму праз лакальны сервер або ўсталяваную PWA-версію.",
});

Object.assign(I18N.en, {
  txCurrencyLabel: "Currency",
  txCurrencyHint: "The app base currency is BYN",
  txCurrencyConverted: "Stored in base as",
  txCurrencyRate: "NBRB rate",
  themeLabel: "Theme",
  themeCopy: "Light theme for daytime use and dark theme for evening use.",
  themeDark: "Dark",
  themeLight: "Light",
  ratesFileProtocolTitle: "Automatic rates need a normal web app launch",
  ratesFileProtocolCopy: "If the page is opened as file:///..., the browser may block requests to NBRB. Open the app through a local server or an installed PWA build.",
});

Object.assign(I18N.en, {
  quickExpense: "Add expense",
  quickIncome: "Add income",
  openHistory: "Open history",
  issuesLabel: "What needs attention",
  recentTitle: "Recent transactions",
  goalsPreview: "Upcoming goals",
  seeAll: "See all",
  noTransactionsTitle: "No transactions yet",
  noTransactionsCopy: "Start with the first entry to see your balance, categories and monthly analytics.",
  noGoalsTitle: "No goals yet",
  noGoalsCopy: "Add 1-3 goals to see your savings right on the home screen.",
  addFirstTx: "Add your first transaction",
  addFirstGoal: "Create a goal",
  insightStartTitle: "Start with the basics",
  insightStartCopy: "In v1 the most important thing is to log expenses and income quickly, then check the monthly remainder.",
  insightBudgetWarnTitle: "Budget is out of balance",
  insightBudgetWarnCopy: "Your percentages add up to {total}%. It is better to keep the total near 100% so categories stay readable.",
  insightIncomeMissingTitle: "No income this month",
  insightIncomeMissingCopy: "Without income, category plans are calculated from zero and the remainders look empty.",
  insightOverTitle: "There is overspending",
  insightOverCopy: "Categories over plan: {count}. Check the history and adjust either the plan or the entries.",
  insightHealthyTitle: "Budget looks healthy",
  insightHealthyCopy: "Income, expenses and categories are currently within a comfortable range.",
  emptyHistoryTitle: "History is empty",
  emptyHistoryCopy: "Nothing matched these filters. Try another month or reset the type/category filters.",
  analyticsEmptyTitle: "Nothing to analyze yet",
  analyticsEmptyCopy: "Add at least a few transactions this month and category and trend analytics will appear here.",
  validationAmount: "Enter an amount greater than zero",
  validationDate: "Choose a valid date",
  toastTxSaved: "Transaction saved",
  toastTxUpdated: "Transaction updated",
  toastTxDeleted: "Transaction deleted",
  confirmDeleteTx: "Delete this transaction?",
  validationGoalName: "Enter a goal name",
  validationGoalTarget: "Enter a target amount greater than zero",
  validationGoalAdjust: "Enter an adjustment amount",
  confirmDeleteGoal: "Delete this goal?",
  toastGoalSaved: "Goal created",
  toastGoalUpdated: "Goal updated",
  toastGoalDeleted: "Goal deleted",
  toastGoalAdjusted: "Goal balance updated",
  resetCopy: "A full reset will delete transactions, goals and your custom budget and rate settings.",
  toolHint: "The converter uses official BYN rates and also works with locally saved values.",
  importError: "Could not import the file",
  setupTitle: "Quick start v1",
  setupCopy: "These three steps turn the prototype into a genuinely useful personal tracker.",
  setupIncomeTitle: "Add this month's income",
  setupIncomeCopy: "Income drives category budgets and the real remainder.",
  setupBudgetTitle: "Check that the budget totals 100%",
  setupBudgetCopy: "When percentages add up correctly, categories start telling the truth.",
  setupGoalTitle: "Create at least one goal",
  setupGoalCopy: "Goals turn the app from a spending tracker into a financial plan.",
  setupDoneTitle: "Core setup complete",
  setupDoneCopy: "Now the app already feels like a real personal finance tool.",
  setupActionIncome: "Add income",
  setupActionBudget: "Review budget",
  setupActionGoal: "Create goal",
  quickAmountsLabel: "Quick amounts",
  quickCategoriesLabel: "Quick categories",
  onboardingKicker: "first launch",
  onboardingTitle: "Let's build a strong first run",
  onboardingCopy: "In v1 the key thing is to understand in one minute how to record money, where to see the remainder and how to set a financial goal.",
  onboardingStep1Title: "1. Record your income",
  onboardingStep1Copy: "A single income for the month already makes budgets useful.",
  onboardingStep2Title: "2. Review allocation",
  onboardingStep2Copy: "Categories should add up to about 100%, otherwise the remainders get distorted.",
  onboardingStep3Title: "3. Add a goal",
  onboardingStep3Copy: "Even one goal changes the feel of the app: it becomes movement, not just accounting.",
  onboardingPrimary: "Start with income",
  onboardingDemo: "Load demo",
  onboardingLater: "Later",
  replayGuide: "Show onboarding",
  toastDemoLoaded: "Demo data loaded",
  currencies: {
    BYN: "Belarusian ruble",
    EUR: "Euro",
    USD: "US dollar",
    RUB: "Russian ruble",
  },
});

Object.assign(STAGE1_I18N.en, {
  historyFiltersTitle: "Quick filters",
  emptyMonthTitle: "No transactions this month yet",
  emptyMonthCopy: "Add the first entry or set up a recurring transaction so the month starts counting.",
  emptyMonthAction: "Add transaction",
  emptyCalendarTitle: "Calendar is empty so far",
  emptyCalendarCopy: "Entries will appear by day as soon as this month has transactions.",
  emptyCalendarDayTitle: "No transactions on the selected day",
  emptyCalendarDayCopy: "Choose another day or remove some filters.",
  calendarDayTotal: "Day total",
  calendarDayIncome: "Income",
  calendarDayExpense: "Expense",
  calendarDayEntries: "Transactions for the day",
  recurringLabel: "Repeat every month",
  recurringHint: "We save a template and automatically add the transaction on this day every month.",
  recurringDayLabel: "Day of month",
  recurringTemplateLabel: "Recurring type",
  recurringTitle: "Recurring transactions",
  recurringCopy: "Templates for salary, rent, subscriptions, internet, credit and other regular payments.",
  recurringAdd: "New recurring",
  recurringEmptyTitle: "No recurring transactions yet",
  recurringEmptyCopy: "Create a template while adding a transaction, and the app will reuse it next month.",
  recurringEveryMonth: "Every month",
  recurringActive: "Active",
  recurringPaused: "Paused",
  recurringSourceBadge: "Recurring",
  recurringManageHint: "This entry came from a template. You can pause or delete the template in settings.",
  recurringTemplateSalary: "Salary",
  recurringTemplateRent: "Rent",
  recurringTemplateSubscription: "Subscription",
  recurringTemplateInternet: "Internet",
  recurringTemplateCredit: "Credit",
  recurringTemplateOther: "Other",
  toastRecurringSaved: "Recurring transaction saved",
  toastRecurringDeleted: "Recurring transaction deleted",
  toastRecurringPaused: "Recurring transaction paused",
  toastRecurringResumed: "Recurring transaction resumed",
  confirmDeleteRecurring: "Delete this recurring transaction?",
});

function getActiveSettings() {
  if (!settings || typeof settings !== "object") {
    settings = migrateSettings(null);
  }
  return settings;
}

function currentTheme() {
  return getActiveSettings().theme === "light" ? "light" : "dark";
}

function applyTheme() {
  const theme = currentTheme();
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "light" ? "#f3eee4" : "#090909");
  }
}

function getCategories() {
  const activeSettings = getActiveSettings();
  return CATEGORY_META.map((category) => ({
    ...category,
    name: categoryName(category.id),
    budgetPct: Number(activeSettings.budgets[category.id] ?? 0),
  }));
}

function formatMonthLabel(ym) {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const label = new Intl.DateTimeFormat(localeCode(), {
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDateLabel(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(localeCode(), {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
}

function formatNumber(value, digits) {
  const resolvedDigits = digits !== undefined ? digits : Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat(localeCode(), {
    minimumFractionDigits: resolvedDigits,
    maximumFractionDigits: resolvedDigits,
  }).format(value);
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthValue() {
  return isoToday().slice(0, 7);
}

function recurringTemplateLabel(template) {
  const key = "recurringTemplate" + String(template || "other").charAt(0).toUpperCase() + String(template || "other").slice(1);
  return text(key);
}

function recurringStatusLabel(rule) {
  return rule.active ? text("recurringActive") : text("recurringPaused");
}

function recurringStamp(ruleId, ym) {
  return String(ruleId) + ":" + ym;
}

function buildRecurringDate(ym, day) {
  const [year, month] = ym.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${ym}-${String(Math.min(lastDay, Math.max(1, Number(day) || 1))).padStart(2, "0")}`;
}

function recurringCanMaterialize(ym, day) {
  const currentMonth = currentMonthValue();
  if (ym < currentMonth) return true;
  if (ym > currentMonth) return false;
  return Number(day) <= Number(isoToday().slice(8, 10));
}

function moneyInline(value, withSign) {
  const sign = withSign ? (value > 0 ? "+" : value < 0 ? "−" : "") : "";
  const digits = Math.abs(value % 1) > 0 ? 2 : 0;
  return sign + formatNumber(Math.abs(value), digits) + ' <span class="money-code"><i class="byn">BYN</i></span>';
}

function currencyValue(value, code) {
  if (code === "BYN") {
    return moneyInline(value, false);
  }
  return formatNumber(value, 2) + " " + code;
}

function normalizeMoneyAmount(value) {
  const numeric = Number(value) || 0;
  return Math.round((numeric + Number.EPSILON) * 100) / 100;
}

function transactionCurrencyCode(value) {
  const code = String(value || "BYN").toUpperCase();
  return TX_CURRENCIES.includes(code) ? code : "BYN";
}

function baseAmountFromInput(amount, code) {
  const currency = transactionCurrencyCode(code);
  const numeric = Math.abs(Number(amount) || 0);
  return normalizeMoneyAmount(convertCurrency(currency, "BYN", numeric));
}

function currencyCompactValue(value, code) {
  const numeric = Math.abs(Number(value) || 0);
  const digits = Math.abs(numeric % 1) > 0 ? 2 : 0;
  return `${formatNumber(numeric, digits)} ${transactionCurrencyCode(code)}`;
}

function rateUnitValue(code) {
  if (code === "BYN") return 1;
  const activeSettings = getActiveSettings();
  const entry = activeSettings.rates[code];
  if (!entry) return 1;
  return entry.officialRate / entry.scale;
}

function formatRateDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(localeCode(), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function shouldRefreshRates() {
  const activeSettings = getActiveSettings();
  if (!activeSettings.ratesUpdatedAt) return true;
  const updatedAt = new Date(activeSettings.ratesUpdatedAt).getTime();
  if (Number.isNaN(updatedAt)) return true;
  return Date.now() - updatedAt > RATES_STALE_MS;
}

function budgetTotal() {
  return getCategories().reduce((sum, category) => sum + Number(category.budgetPct || 0), 0);
}

function getMonth(isoDate) {
  return isoDate.slice(0, 7);
}

function sortTransactions(a, b) {
  if (a.date === b.date) {
    return b.createdAt - a.createdAt;
  }
  return a.date < b.date ? 1 : -1;
}

function monthTransactions(ym) {
  return transactions.filter((tx) => getMonth(tx.date) === ym);
}

function monthIncome(ym) {
  return monthTransactions(ym).filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
}

function monthExpenses(ym) {
  return monthTransactions(ym).filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
}

function categorySpent(ym, catId) {
  return monthTransactions(ym)
    .filter((tx) => tx.type === "expense" && tx.cat === catId)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

function categoryBudgetsForMonth(ym) {
  const income = monthIncome(ym);
  return getCategories().map((category) => {
    const planned = income * (category.budgetPct / 100);
    const spent = categorySpent(ym, category.id);
    const left = planned - spent;
    const progress = planned > 0 ? Math.min(100, (spent / planned) * 100) : spent > 0 ? 100 : 0;
    return {
      ...category,
      planned,
      spent,
      left,
      progress,
      over: left < 0,
    };
  });
}

function createRecurringFromDraft(draft, existingId) {
  const currency = transactionCurrencyCode(draft.currency);
  const originalAmount = normalizeMoneyAmount(Math.abs(Number(draft.amount || 0)));
  return {
    id: existingId || uid(),
    createdAt: Date.now(),
    type: draft.type,
    amount: baseAmountFromInput(originalAmount, currency),
    originalAmount,
    currency,
    cat: draft.type === "income" ? "obligatory" : draft.cat,
    desc: draft.desc.trim() || recurringTemplateLabel(draft.recurringTemplate),
    day: Math.min(31, Math.max(1, Number(draft.recurringDay || Number(String(draft.date || isoToday()).slice(8, 10))) || 1)),
    startMonth: getMonth(draft.date || isoToday()),
    endMonth: "",
    active: true,
    template: RECURRING_TEMPLATES.includes(draft.recurringTemplate) ? draft.recurringTemplate : "other",
    skipMonths: [],
  };
}

function ensureRecurringTransactions(ym) {
  if (!Array.isArray(recurring) || !recurring.length) return false;
  let changed = false;

  recurring.forEach((rule) => {
    if (!rule.active) return;
    if (rule.startMonth > ym) return;
    if (rule.endMonth && rule.endMonth < ym) return;
    if (rule.skipMonths.includes(ym)) return;
    if (!recurringCanMaterialize(ym, rule.day)) return;

    const stamp = recurringStamp(rule.id, ym);
    if (transactions.some((tx) => tx.recurringStamp === stamp)) return;

    const currency = transactionCurrencyCode(rule.currency);
    const originalAmount = normalizeMoneyAmount(Math.abs(Number(rule.originalAmount ?? rule.amount ?? 0)));
    transactions.push({
      id: uid(),
      createdAt: new Date(buildRecurringDate(ym, rule.day) + "T09:00:00").getTime(),
      type: rule.type,
      amount: normalizeMoneyAmount(Number(rule.amount) || 0),
      originalAmount,
      currency,
      cat: rule.type === "income" ? "obligatory" : rule.cat,
      desc: rule.desc,
      date: buildRecurringDate(ym, rule.day),
      source: "recurring",
      recurringId: rule.id,
      recurringStamp: stamp,
      recurringTemplate: rule.template || "other",
    });
    changed = true;
  });

  if (changed) {
    transactions = transactions.sort(sortTransactions);
    saveTransactions();
  }

  return changed;
}

function createEmptyTxDraft(type) {
  return {
    type: type || "expense",
    amount: "",
    currency: "BYN",
    cat: "obligatory",
    desc: "",
    date: isoToday(),
    recurringEnabled: false,
    recurringTemplate: "other",
    recurringDay: Number(isoToday().slice(8, 10)),
    recurringLinkedId: null,
  };
}

function createEmptyGoalDraft() {
  return {
    id: null,
    name: "",
    target: "",
    saved: "",
    accent: GOAL_COLORS[goals.length % GOAL_COLORS.length],
  };
}

function setupSteps() {
  const incomeReady = monthIncome(viewMonth) > 0;
  const budgetReady = budgetTotal() === 100;
  const goalReady = goals.length > 0;
  return [
    {
      done: incomeReady,
      title: text("setupIncomeTitle"),
      copy: text("setupIncomeCopy"),
      action: `startCreateTx('income')`,
      actionLabel: text("setupActionIncome"),
    },
    {
      done: budgetReady,
      title: text("setupBudgetTitle"),
      copy: text("setupBudgetCopy"),
      action: `showPage('settings')`,
      actionLabel: text("setupActionBudget"),
    },
    {
      done: goalReady,
      title: text("setupGoalTitle"),
      copy: text("setupGoalCopy"),
      action: `showPage('goals');openGoalCreate();`,
      actionLabel: text("setupActionGoal"),
    },
  ];
}

function shouldShowSetupCard() {
  return setupSteps().some((step) => !step.done);
}

function dismissOnboarding() {
  onboardingSeen = true;
  forceOnboarding = false;
  save(STORAGE.onboarding, true);
  renderOverlay();
}

function startOnboardingFlow() {
  dismissOnboarding();
  startCreateTx("income");
}

function createDemoData() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const makeDate = (day) => `${y}-${m}-${String(day).padStart(2, "0")}`;
  const now = Date.now();
  return {
    transactions: [
      { id: uid(), createdAt: now - 1, type: "income", amount: 3200, cat: "obligatory", desc: "Основной доход", date: makeDate(2) },
      { id: uid(), createdAt: now - 2, type: "expense", amount: 860, cat: "obligatory", desc: "Квартира и счета", date: makeDate(3) },
      { id: uid(), createdAt: now - 3, type: "expense", amount: 320, cat: "fun", desc: "Выходные и кафе", date: makeDate(6) },
      { id: uid(), createdAt: now - 4, type: "expense", amount: 450, cat: "goals", desc: "Отложено на цель", date: makeDate(10) },
      { id: uid(), createdAt: now - 5, type: "expense", amount: 280, cat: "invest", desc: "Долгий горизонт", date: makeDate(14) },
      { id: uid(), createdAt: now - 6, type: "expense", amount: 410, cat: "savings", desc: "Резерв месяца", date: makeDate(18) },
    ].sort(sortTransactions),
    goals: [
      { id: uid(), createdAt: now - 7, name: lang === "be" ? "Падарожжа ў Вільню" : "Поездка в Вильнюс", target: 2500, saved: 1200, accent: GOAL_COLORS[0] },
      { id: uid(), createdAt: now - 8, name: lang === "be" ? "Падушка бяспекі" : "Подушка безопасности", target: 6000, saved: 2100, accent: GOAL_COLORS[1] },
    ],
    recurring: [
      {
        id: uid(),
        createdAt: now - 9,
        type: "income",
        amount: 3200,
        cat: "obligatory",
        desc: "Зарплата",
        day: 2,
        startMonth: `${y}-${m}`,
        endMonth: "",
        active: true,
        template: "salary",
        skipMonths: [],
      },
      {
        id: uid(),
        createdAt: now - 10,
        type: "expense",
        amount: 860,
        cat: "obligatory",
        desc: lang === "be" ? "Арэнда" : "Аренда",
        day: 3,
        startMonth: `${y}-${m}`,
        endMonth: "",
        active: true,
        template: "rent",
        skipMonths: [],
      },
    ],
  };
}

function loadDemoData() {
  const demo = createDemoData();
  transactions = demo.transactions;
  goals = demo.goals;
  recurring = demo.recurring;
  saveTransactions();
  saveGoals();
  saveRecurring();
  dismissOnboarding();
  currentPage = "home";
  showToast(text("toastDemoLoaded"));
  render();
}

function openOnboardingGuide() {
  forceOnboarding = true;
  renderOverlay();
}

function quickAmountPresets() {
  const currency = transactionCurrencyCode(txDraft?.currency);
  if (txDraft.type === "income") {
    return currency === "BYN" ? [500, 1000, 1500, 2500] : [50, 100, 250, 500];
  }
  return currency === "BYN" ? [10, 25, 50, 100] : [5, 10, 20, 50];
}

function setQuickAmount(amount) {
  txDraft.amount = String(amount);
  render();
}

function setDraftCategory(catId) {
  txDraft.cat = catId;
  render();
}

function setTxCurrency(code) {
  txDraft.currency = transactionCurrencyCode(code);
  render();
}

function saveTransactions() {
  save(STORAGE.transactions, transactions);
}

function saveGoals() {
  save(STORAGE.goals, goals);
}

function saveRecurring() {
  save(STORAGE.recurring, recurring);
}

function saveSettings() {
  save(STORAGE.settings, getActiveSettings());
}

function createAppSessionSnapshot() {
  return {
    version: 1,
    currentPage,
    lastNonAddPage,
    viewMonth,
    historyMode,
    historyTypeFilter,
    historyCategoryFilter,
    historySearchQuery,
    historyDateFilter,
    historyAmountMin,
    historyAmountMax,
    historySelectedDate,
    editingTxId,
    txDraft: txDraft ? { ...txDraft } : null,
    goalDraft: goalDraft ? { ...goalDraft } : null,
    goalEditorMode,
    adjustGoalId,
    adjustGoalAmount,
    convFrom,
    convAmount,
    forceOnboarding,
  };
}

function saveAppSession() {
  save(STORAGE.session, createAppSessionSnapshot());
}

function restoreTxDraft(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const draft = createEmptyTxDraft(source.type === "income" ? "income" : "expense");

  if (source.amount !== undefined && source.amount !== null) {
    draft.amount = String(source.amount);
  }
  draft.currency = transactionCurrencyCode(source.currency);
  if (draft.type === "expense" && CATEGORY_META.some((category) => category.id === source.cat)) {
    draft.cat = String(source.cat);
  }
  draft.desc = String(source.desc ?? "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(source.date ?? ""))) {
    draft.date = String(source.date);
  }
  draft.recurringEnabled = source.recurringEnabled === true;
  if (RECURRING_TEMPLATES.includes(String(source.recurringTemplate))) {
    draft.recurringTemplate = String(source.recurringTemplate);
  }
  const recurringDay = Number(source.recurringDay);
  if (Number.isFinite(recurringDay)) {
    draft.recurringDay = Math.min(31, Math.max(1, recurringDay));
  }
  draft.recurringLinkedId = source.recurringLinkedId ? String(source.recurringLinkedId) : null;

  return draft;
}

function restoreGoalDraft(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const draft = createEmptyGoalDraft();

  draft.id = source.id ? String(source.id) : null;
  draft.name = String(source.name ?? "");
  draft.target = source.target === undefined || source.target === null ? "" : String(source.target);
  draft.saved = source.saved === undefined || source.saved === null ? "" : String(source.saved);
  if (typeof source.accent === "string" && source.accent) {
    draft.accent = source.accent;
  }

  return draft;
}

function restoreAppSession(raw) {
  if (!raw || typeof raw !== "object") return;

  if (["home", "history", "add", "goals", "settings"].includes(raw.currentPage)) {
    currentPage = raw.currentPage;
  }
  if (["home", "history", "goals", "settings"].includes(raw.lastNonAddPage)) {
    lastNonAddPage = raw.lastNonAddPage;
  }
  if (/^\d{4}-\d{2}$/.test(String(raw.viewMonth ?? ""))) {
    viewMonth = String(raw.viewMonth);
  }
  if (["list", "analytics", "calendar"].includes(raw.historyMode)) {
    historyMode = raw.historyMode;
  }
  if (["all", "expense", "income"].includes(raw.historyTypeFilter)) {
    historyTypeFilter = raw.historyTypeFilter;
  }

  const savedCategoryFilter = String(raw.historyCategoryFilter ?? "");
  if (savedCategoryFilter === "all" || CATEGORY_META.some((category) => category.id === savedCategoryFilter)) {
    historyCategoryFilter = savedCategoryFilter || historyCategoryFilter;
  }

  historySearchQuery = String(raw.historySearchQuery ?? "");
  historyDateFilter = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.historyDateFilter ?? "")) ? String(raw.historyDateFilter) : "";
  historyAmountMin = raw.historyAmountMin === undefined || raw.historyAmountMin === null ? "" : String(raw.historyAmountMin);
  historyAmountMax = raw.historyAmountMax === undefined || raw.historyAmountMax === null ? "" : String(raw.historyAmountMax);
  historySelectedDate = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.historySelectedDate ?? "")) ? String(raw.historySelectedDate) : "";

  editingTxId = raw.editingTxId ? String(raw.editingTxId) : null;
  txDraft = restoreTxDraft(raw.txDraft);
  goalDraft = restoreGoalDraft(raw.goalDraft);
  goalEditorMode = raw.goalEditorMode === "create" || raw.goalEditorMode === "edit" ? raw.goalEditorMode : null;
  adjustGoalId = raw.adjustGoalId ? String(raw.adjustGoalId) : null;
  adjustGoalAmount = raw.adjustGoalAmount === undefined || raw.adjustGoalAmount === null ? "" : String(raw.adjustGoalAmount);
  convFrom = transactionCurrencyCode(raw.convFrom);
  convAmount = raw.convAmount === undefined || raw.convAmount === null ? "100" : String(raw.convAmount);
  forceOnboarding = raw.forceOnboarding === true;

  if (editingTxId && !transactions.some((tx) => tx.id === editingTxId)) {
    editingTxId = null;
  }
  if (goalEditorMode === "edit" && (!goalDraft.id || !goals.some((goal) => goal.id === goalDraft.id))) {
    goalEditorMode = null;
    goalDraft = createEmptyGoalDraft();
  }
  if (adjustGoalId && !goals.some((goal) => goal.id === adjustGoalId)) {
    adjustGoalId = null;
    adjustGoalAmount = "";
  }
  if ((goalEditorMode || adjustGoalId) && currentPage !== "goals") {
    currentPage = "goals";
  }
}

function flushAppState() {
  save("lang", lang);
  save(STORAGE.onboarding, Boolean(onboardingSeen));
  saveTransactions();
  saveGoals();
  saveRecurring();
  saveSettings();
  saveAppSession();
}

function setupAppPersistence() {
  if (setupAppPersistence.bound) return;
  setupAppPersistence.bound = true;

  window.addEventListener("pagehide", flushAppState);
  window.addEventListener("beforeunload", flushAppState);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushAppState();
    }
  });
}

function syncLanguage() {
  document.documentElement.lang = lang;
  applyTheme();
  document.title = text("appName");
  save("lang", lang);
}

function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function applyNavText() {
  document.getElementById("nav-label-home").textContent = text("navHome");
  document.getElementById("nav-label-history").textContent = text("navHistory");
  document.getElementById("nav-label-add").textContent = text("navAdd");
  document.getElementById("nav-label-goals").textContent = text("navGoals");
  document.getElementById("nav-label-settings").textContent = text("navSettings");
}

function updateActiveNav() {
  document.querySelectorAll(".nav-btn").forEach((button) => button.classList.remove("active"));
  const targetId = currentPage === "add" ? "nav-add" : "nav-" + currentPage;
  const active = document.getElementById(targetId);
  if (active) active.classList.add("active");
}

function showPage(page) {
  if (page !== "add") {
    lastNonAddPage = page;
  }
  ensureRecurringTransactions(viewMonth);
  currentPage = page;
  render();
  document.getElementById("screen").scrollTop = 0;
}

function changeMonth(delta) {
  const [year, month] = viewMonth.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  viewMonth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
  if (historyDateFilter && getMonth(historyDateFilter) !== viewMonth) {
    historyDateFilter = "";
  }
  ensureRecurringTransactions(viewMonth);
  render();
}

function startCreateTx(type) {
  editingTxId = null;
  txDraft = createEmptyTxDraft(type || "expense");
  currentPage = "add";
  render();
  document.getElementById("screen").scrollTop = 0;
}

function startEditTx(id) {
  const tx = transactions.find((item) => item.id === id);
  if (!tx) return;
  editingTxId = id;
  txDraft = {
    type: tx.type,
    amount: String(tx.originalAmount ?? tx.amount),
    currency: transactionCurrencyCode(tx.currency),
    cat: tx.cat,
    desc: tx.desc,
    date: tx.date,
    recurringEnabled: false,
    recurringTemplate: tx.recurringTemplate || "other",
    recurringDay: Number(String(tx.date).slice(8, 10)),
    recurringLinkedId: tx.recurringId || null,
  };
  currentPage = "add";
  render();
  document.getElementById("screen").scrollTop = 0;
}

function cancelTxEdit() {
  editingTxId = null;
  txDraft = createEmptyTxDraft("expense");
  showPage(lastNonAddPage || "home");
}

function updateTxDraft(field, value) {
  txDraft[field] = value;
  saveAppSession();
}

function setTxType(type) {
  txDraft.type = type;
  if (type === "income") {
    txDraft.cat = "obligatory";
  }
  render();
}

function toggleTxRecurring() {
  txDraft.recurringEnabled = !txDraft.recurringEnabled;
  if (txDraft.recurringEnabled && !txDraft.desc.trim()) {
    txDraft.desc = recurringTemplateLabel(txDraft.recurringTemplate);
  }
  render();
}

function setRecurringTemplate(template) {
  txDraft.recurringTemplate = RECURRING_TEMPLATES.includes(template) ? template : "other";
  if (!txDraft.desc.trim()) {
    txDraft.desc = recurringTemplateLabel(txDraft.recurringTemplate);
  }
  render();
}

function submitTx() {
  const inputAmount = Number(txDraft.amount);
  if (!Number.isFinite(inputAmount) || inputAmount <= 0) {
    showToast(text("validationAmount"));
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(txDraft.date)) {
    showToast(text("validationDate"));
    return;
  }

  const existingTx = editingTxId ? transactions.find((item) => item.id === editingTxId) : null;
  let linkedRecurringId = existingTx?.recurringId || null;
  let linkedRecurringStamp = existingTx?.recurringStamp || null;
  let linkedRecurringTemplate = existingTx?.recurringTemplate || null;

  if (!editingTxId && txDraft.recurringEnabled) {
    const recurringRule = createRecurringFromDraft(txDraft);
    recurring = [recurringRule, ...recurring];
    saveRecurring();
    linkedRecurringId = recurringRule.id;
    linkedRecurringStamp = recurringStamp(recurringRule.id, getMonth(txDraft.date));
    linkedRecurringTemplate = recurringRule.template;
    showToast(text("toastRecurringSaved"));
  }

  const currency = transactionCurrencyCode(txDraft.currency);
  const originalAmount = normalizeMoneyAmount(inputAmount);
  const amount = baseAmountFromInput(originalAmount, currency);

  const payload = {
    id: editingTxId || uid(),
    createdAt: editingTxId ? (existingTx?.createdAt || Date.now()) : Date.now(),
    type: txDraft.type,
    amount,
    originalAmount,
    currency,
    cat: txDraft.type === "income" ? "obligatory" : txDraft.cat,
    desc: txDraft.desc.trim(),
    date: txDraft.date,
    source: linkedRecurringId ? "recurring" : (existingTx?.source || "manual"),
    recurringId: linkedRecurringId,
    recurringStamp: linkedRecurringStamp,
    recurringTemplate: linkedRecurringTemplate || "other",
  };

  if (editingTxId) {
    transactions = transactions.map((item) => (item.id === editingTxId ? payload : item)).sort(sortTransactions);
    showToast(text("toastTxUpdated"));
  } else {
    transactions = [payload, ...transactions].sort(sortTransactions);
    showToast(text("toastTxSaved"));
  }

  saveTransactions();
  editingTxId = null;
  txDraft = createEmptyTxDraft(payload.type);
  ensureRecurringTransactions(viewMonth);
  showPage("home");
}

function deleteEditingTx() {
  if (!editingTxId) return;
  if (!confirm(text("confirmDeleteTx"))) return;
  const deletingTx = transactions.find((item) => item.id === editingTxId);
  if (deletingTx?.recurringId) {
    recurring = recurring.map((rule) => {
      if (rule.id !== deletingTx.recurringId) return rule;
      const ym = getMonth(deletingTx.date);
      return {
        ...rule,
        skipMonths: [...new Set([...(rule.skipMonths || []), ym])],
      };
    });
    saveRecurring();
  }
  transactions = transactions.filter((item) => item.id !== editingTxId);
  saveTransactions();
  editingTxId = null;
  txDraft = createEmptyTxDraft("expense");
  showToast(text("toastTxDeleted"));
  showPage("history");
}

function setHistoryMode(mode) {
  historyMode = mode;
  if (mode === "calendar") {
    historyDateFilter = "";
  }
  if (mode === "calendar" && !historySelectedDate) {
    const visible = applyHistoryFilters(monthTransactions(viewMonth), { ignoreDate: true });
    historySelectedDate = visible[0]?.date || "";
  }
  render();
}

function setHistoryTypeFilter(value) {
  historyTypeFilter = value;
  render();
}

function setHistoryCategoryFilter(value) {
  historyCategoryFilter = value;
  render();
}

function setHistorySearchQuery(value) {
  historySearchQuery = value;
  render();
}

function setHistoryDateFilter(value) {
  historyDateFilter = value;
  render();
}

function setHistoryAmountMin(value) {
  historyAmountMin = value;
  render();
}

function setHistoryAmountMax(value) {
  historyAmountMax = value;
  render();
}

function resetHistoryFilters() {
  historyTypeFilter = "all";
  historyCategoryFilter = "all";
  historySearchQuery = "";
  historyDateFilter = "";
  historyAmountMin = "";
  historyAmountMax = "";
  render();
}

function selectHistoryDate(iso) {
  historySelectedDate = iso;
  render();
}

function historyActiveFiltersCount() {
  return [historyTypeFilter !== "all", historyCategoryFilter !== "all", historySearchQuery.trim(), historyDateFilter, historyAmountMin, historyAmountMax].filter(Boolean).length;
}

function applyHistoryFilters(list, options) {
  const opts = options || {};
  const query = historySearchQuery.trim().toLowerCase();
  const minAmount = Number(historyAmountMin);
  const maxAmount = Number(historyAmountMax);

  return list.filter((tx) => {
    if (historyTypeFilter !== "all" && tx.type !== historyTypeFilter) return false;
    if (historyCategoryFilter !== "all" && tx.type === "expense" && tx.cat !== historyCategoryFilter) return false;
    if (historyCategoryFilter !== "all" && tx.type === "income") return false;
    if (!opts.ignoreDate && historyDateFilter && tx.date !== historyDateFilter) return false;
    if (Number.isFinite(minAmount) && historyAmountMin !== "" && tx.amount < minAmount) return false;
    if (Number.isFinite(maxAmount) && historyAmountMax !== "" && tx.amount > maxAmount) return false;
    if (query) {
      const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
      const haystack = [tx.desc, label, tx.date, String(tx.amount), formatNumber(tx.amount, 2)].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function filteredHistoryTransactions() {
  return applyHistoryFilters(monthTransactions(viewMonth));
}

function filteredCalendarTransactions() {
  return applyHistoryFilters(monthTransactions(viewMonth), { ignoreDate: true });
}

function toggleRecurringActive(id) {
  recurring = recurring.map((rule) => rule.id === id ? { ...rule, active: !rule.active } : rule);
  saveRecurring();
  const rule = recurring.find((item) => item.id === id);
  showToast(text(rule && rule.active ? "toastRecurringResumed" : "toastRecurringPaused"));
  render();
}

function deleteRecurring(id) {
  if (!confirm(text("confirmDeleteRecurring"))) return;
  recurring = recurring.filter((rule) => rule.id !== id);
  saveRecurring();
  showToast(text("toastRecurringDeleted"));
  render();
}

function startCreateRecurring(type) {
  startCreateTx(type || "expense");
  txDraft.recurringEnabled = true;
  render();
}

function openGoalCreate() {
  goalEditorMode = "create";
  goalDraft = createEmptyGoalDraft();
  adjustGoalId = null;
  adjustGoalAmount = "";
  render();
}

function openGoalEdit(id) {
  const goal = goals.find((item) => item.id === id);
  if (!goal) return;
  goalEditorMode = "edit";
  goalDraft = {
    id: goal.id,
    name: goal.name,
    target: String(goal.target),
    saved: String(goal.saved),
    accent: goal.accent,
  };
  adjustGoalId = null;
  adjustGoalAmount = "";
  render();
}

function cancelGoalEditor() {
  goalEditorMode = null;
  goalDraft = createEmptyGoalDraft();
  render();
}

function updateGoalDraft(field, value) {
  goalDraft[field] = value;
  saveAppSession();
}

function saveGoalRecord() {
  const name = goalDraft.name.trim();
  const target = Number(goalDraft.target);
  const savedAmount = Number(goalDraft.saved || 0);

  if (!name) {
    showToast(text("validationGoalName"));
    return;
  }
  if (!Number.isFinite(target) || target <= 0) {
    showToast(text("validationGoalTarget"));
    return;
  }

  const payload = {
    id: goalDraft.id || uid(),
    createdAt: goalDraft.id ? (goals.find((item) => item.id === goalDraft.id)?.createdAt || Date.now()) : Date.now(),
    name,
    target,
    saved: Math.max(0, Number.isFinite(savedAmount) ? savedAmount : 0),
    accent: goalDraft.accent || GOAL_COLORS[goals.length % GOAL_COLORS.length],
  };

  if (goalEditorMode === "edit") {
    goals = goals.map((item) => (item.id === payload.id ? payload : item));
    showToast(text("toastGoalUpdated"));
  } else {
    goals = [...goals, payload];
    showToast(text("toastGoalSaved"));
  }

  saveGoals();
  goalEditorMode = null;
  goalDraft = createEmptyGoalDraft();
  render();
}

function removeGoal(id) {
  if (!confirm(text("confirmDeleteGoal"))) return;
  goals = goals.filter((item) => item.id !== id);
  if (adjustGoalId === id) {
    adjustGoalId = null;
    adjustGoalAmount = "";
  }
  saveGoals();
  showToast(text("toastGoalDeleted"));
  render();
}

function openGoalAdjust(id) {
  adjustGoalId = id;
  adjustGoalAmount = "";
  goalEditorMode = null;
  render();
}

function cancelGoalAdjust() {
  adjustGoalId = null;
  adjustGoalAmount = "";
  render();
}

function updateGoalAdjust(value) {
  adjustGoalAmount = value;
  saveAppSession();
}

function applyGoalAdjust(direction) {
  const amount = Number(adjustGoalAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast(text("validationGoalAdjust"));
    return;
  }
  goals = goals.map((goal) => {
    if (goal.id !== adjustGoalId) return goal;
    return {
      ...goal,
      saved: Math.max(0, goal.saved + amount * direction),
    };
  });
  saveGoals();
  adjustGoalId = null;
  adjustGoalAmount = "";
  showToast(text("toastGoalAdjusted"));
  render();
}

function setLang(nextLang) {
  lang = ["ru", "be", "en"].includes(nextLang) ? nextLang : "ru";
  syncLanguage();
  render();
}

function setTheme(nextTheme) {
  const activeSettings = getActiveSettings();
  const normalized = nextTheme === "light" ? "light" : "dark";
  activeSettings.theme = normalized;
  saveSettings();
  applyTheme();
  render();
}

function updateBudget(catId, value) {
  const activeSettings = getActiveSettings();
  const parsed = Number(value);
  activeSettings.budgets[catId] = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  saveSettings();
  showToast(text("toastBudgetSaved"));
  render();
}

function updateRate(code, field, value) {
  const activeSettings = getActiveSettings();
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    render();
    return;
  }
  activeSettings.rates[code] = {
    ...activeSettings.rates[code],
    [field]: parsed,
  };
  activeSettings.ratesSource = "manual";
  activeSettings.ratesUpdatedAt = new Date().toISOString();
  saveSettings();
  showToast(text("toastRateSaved"));
  render();
}

function nbrbFetchOptions() {
  return {
    headers: { Accept: "application/json" },
    cache: "no-store",
    mode: "cors",
    credentials: "omit",
  };
}

async function fetchRatesBatchFromNBRB() {
  const response = await fetch(NBRB_DAILY_RATES_URL, nbrbFetchOptions());
  if (!response.ok) {
    throw new Error("batch:" + response.status);
  }
  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("batch:invalid");
  }
  return payload.filter((rate) => NBRB_CODES.includes(String(rate.Cur_Abbreviation || "").toUpperCase()));
}

async function fetchRatesFallbackFromNBRB() {
  return Promise.all(
    NBRB_CODES.map((code) =>
      fetch(`${NBRB_API_BASE}/${code}?parammode=2`, nbrbFetchOptions()).then((response) => {
        if (!response.ok) {
          throw new Error(code + ":" + response.status);
        }
        return response.json();
      })
    )
  );
}

function applyFetchedRates(activeSettings, responses) {
  responses.forEach((rate) => {
    const code = String(rate.Cur_Abbreviation || "").toUpperCase();
    if (!NBRB_CODES.includes(code)) return;
    activeSettings.rates[code] = {
      scale: Number(rate.Cur_Scale),
      officialRate: Number(rate.Cur_OfficialRate),
    };
  });
  activeSettings.ratesSource = "nbrb";
  activeSettings.ratesUpdatedAt = new Date().toISOString();
  saveSettings();
}

async function refreshRatesFromNBRB(options) {
  const opts = options || {};
  const activeSettings = getActiveSettings();
  if (!isOnline) {
    ratesUiState.lastError = "offline";
    render();
    if (!opts.silent) showToast(text("toastRatesFailed"));
    return;
  }

  ratesUiState.loading = true;
  ratesUiState.lastError = null;
  render();

  try {
    let responses = [];
    try {
      responses = await fetchRatesBatchFromNBRB();
      if (responses.length !== NBRB_CODES.length) {
        throw new Error("batch:partial");
      }
    } catch (batchError) {
      responses = await fetchRatesFallbackFromNBRB();
    }

    applyFetchedRates(activeSettings, responses);
    ratesUiState.loading = false;
    ratesUiState.lastError = null;
    if (!opts.silent) showToast(text("toastRatesUpdated"));
    render();
  } catch (error) {
    console.error("NBRB rates update failed", error);
    ratesUiState.loading = false;
    ratesUiState.lastError = String(error && error.message ? error.message : error);
    if (!opts.silent) showToast(text("toastRatesFailed"));
    render();
  }
}

function setConverterFrom(code) {
  convFrom = code;
  render();
}

function updateConverterAmount(value) {
  convAmount = value;
  saveAppSession();
}

function convertCurrency(fromCode, toCode, amount) {
  const amountInByn = fromCode === "BYN" ? amount : amount * rateUnitValue(fromCode);
  return toCode === "BYN" ? amountInByn : amountInByn / rateUnitValue(toCode);
}

function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    lang,
    settings: getActiveSettings(),
    transactions,
    goals,
    recurring,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mae-finansy-" + new Date().toISOString().slice(0, 10) + ".json";
  link.click();
  URL.revokeObjectURL(url);
}

function triggerImport() {
  document.getElementById("import-input").click();
}

function handleImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result || ""));
      transactions = migrateTransactions(payload.transactions);
      goals = migrateGoals(payload.goals, []);
      recurring = migrateRecurring(payload.recurring);
      settings = migrateSettings(payload.settings);
      lang = payload.lang === "be" ? "be" : "ru";
      onboardingSeen = true;
      forceOnboarding = false;
      save(STORAGE.onboarding, true);
      syncLanguage();
      saveTransactions();
      saveGoals();
      saveRecurring();
      saveSettings();
      currentPage = "home";
      lastNonAddPage = "home";
      editingTxId = null;
      txDraft = createEmptyTxDraft("expense");
      goalEditorMode = null;
      adjustGoalId = null;
      render();
      showToast(text("toastImported"));
    } catch {
      showToast(text("importError"));
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (!confirm(text("confirmReset"))) return;
  transactions = [];
  goals = [];
  recurring = [];
  settings = clone(DEFAULT_SETTINGS);
  onboardingSeen = false;
  forceOnboarding = false;
  editingTxId = null;
  txDraft = createEmptyTxDraft("expense");
  goalEditorMode = null;
  goalDraft = createEmptyGoalDraft();
  adjustGoalId = null;
  adjustGoalAmount = "";
  save(STORAGE.onboarding, false);
  saveTransactions();
  saveGoals();
  saveRecurring();
  saveSettings();
  showToast(text("toastReset"));
  render();
}

function renderTransactionItem(tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "💸" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">${escapeHtml(label)} · ${tx.date}</div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
}

function renderTransactionGroups(list, grouped) {
  if (!grouped) {
    return `
      <div class="list-card">
        <div class="tx-group">
          ${list.map(renderTransactionItem).join("")}
        </div>
      </div>
    `;
  }

  const groups = {};
  list.forEach((tx) => {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  });

  return `
    <div class="list-card">
      ${Object.keys(groups).sort().reverse().map((date) => `
        <div class="tx-group">
          <div class="tx-group-title">${formatDateLabel(date)}</div>
          ${groups[date].map(renderTransactionItem).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function renderHome() {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const recent = monthTransactions(viewMonth).slice(0, 5);
  const goalsPreview = [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved)).slice(0, 2);
  const setup = setupSteps();
  const doneCount = setup.filter((step) => step.done).length;
  const setupProgress = (doneCount / setup.length) * 100;
  const alerts = [];
  const total = budgetTotal();
  const overBudget = budgets.filter((item) => item.over);

  if (!monthTransactions(viewMonth).length) {
    alerts.push({ tone: "neutral", icon: "◌", title: text("insightStartTitle"), copy: text("insightStartCopy") });
  }
  if (total !== 100) {
    alerts.push({
      tone: "warning",
      icon: "!",
      title: text("insightBudgetWarnTitle"),
      copy: text("insightBudgetWarnCopy", { total: formatNumber(total, 0) }),
    });
  }
  if (income <= 0) {
    alerts.push({
      tone: "warning",
      icon: "₿",
      title: text("insightIncomeMissingTitle"),
      copy: text("insightIncomeMissingCopy"),
    });
  }
  if (overBudget.length) {
    alerts.push({
      tone: "danger",
      icon: "×",
      title: text("insightOverTitle"),
      copy: text("insightOverCopy", { count: String(overBudget.length) }),
    });
  }
  if (!alerts.length) {
    alerts.push({ tone: "success", icon: "✓", title: text("insightHealthyTitle"), copy: text("insightHealthyCopy") });
  }

  const setupHtml = shouldShowSetupCard() ? `
    <section class="section reveal" style="--delay:1">
      <div class="section-head"><div class="section-title">${text("setupTitle")}</div></div>
      <div class="setup-card panel">
        <div class="setup-top">
          <div>
            <div class="setting-title">${text("setupTitle")}</div>
            <div class="setting-copy">${text("setupCopy")}</div>
          </div>
          <div class="setup-badge">${doneCount}/${setup.length}</div>
        </div>
        <div class="setup-track"><div class="setup-fill" style="width:${setupProgress}%"></div></div>
        <div class="setup-list">
          ${setup.map((step) => `
            <div class="setup-item ${step.done ? "complete" : ""}">
              <div class="setup-mark">${step.done ? "✓" : "•"}</div>
              <div class="setup-copy">
                <strong>${escapeHtml(step.title)}</strong>
                <span>${escapeHtml(step.copy)}</span>
                ${step.done ? "" : `<button class="link-button" style="margin-top:8px" onclick="${step.action}">${step.actionLabel}</button>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  ` : `
    <section class="section reveal" style="--delay:1">
      <div class="setting-card">
        <div class="setting-title">${text("setupDoneTitle")}</div>
        <div class="setting-copy">${text("setupDoneCopy")}</div>
      </div>
    </section>
  `;

  const budgetHtml = budgets.map((category) => `
    <div class="budget-card ${category.over ? "over" : ""}" data-cat="${category.id}">
      <div class="budget-head">
        <div>
          <div class="budget-name">${category.icon} ${escapeHtml(category.name)}</div>
          <div class="budget-pct">${formatNumber(category.budgetPct, 0)}%</div>
        </div>
        <div class="tx-amount ${category.over ? "expense" : "income"}">${moneyInline(category.left, category.left !== 0)}</div>
      </div>
      <div class="budget-stat">
        <div>
          <span>${text("planned")}</span>
          <strong>${moneyInline(category.planned, false)}</strong>
        </div>
        <div>
          <span>${text("spent")}</span>
          <strong>${moneyInline(category.spent, false)}</strong>
        </div>
      </div>
      <div class="budget-track">
        <div class="budget-fill" style="width:${Math.min(100, category.progress)}%;background:${category.color}"></div>
      </div>
      <div class="budget-foot">${category.over ? text("overrun") : text("left")}: ${moneyInline(Math.abs(category.left), false)}</div>
    </div>
  `).join("");

  const recentHtml = recent.length
    ? renderTransactionGroups(recent, false)
    : `
      <div class="empty-state">
        <strong>${text("noTransactionsTitle")}</strong>
        <span>${text("noTransactionsCopy")}</span>
        <button class="btn btn-primary" onclick="startCreateTx('expense')">${text("addFirstTx")}</button>
      </div>
    `;

  const goalsHtml = goalsPreview.length
    ? goalsPreview.map((goal) => {
        const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
        return `
          <div class="goal-card">
            <div class="goal-top">
              <div>
                <div class="goal-name">${escapeHtml(goal.name)}</div>
                <div class="goal-meta">${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</div>
              </div>
              <div class="tx-amount income">${formatNumber(progress, 0)}%</div>
            </div>
            <div class="goal-progress">
              <div class="goal-track"><div class="goal-fill" style="width:${progress}%;background:${goal.accent}"></div></div>
            </div>
            <div class="goal-stats">
              <div>${text("goalProgress")}<strong>${moneyInline(goal.saved, false)}</strong></div>
              <div style="text-align:right">${text("goalTargetLabel")}<strong>${moneyInline(goal.target, false)}</strong></div>
            </div>
          </div>
        `;
      }).join("")
    : `
      <div class="empty-state">
        <strong>${text("noGoalsTitle")}</strong>
        <span>${text("noGoalsCopy")}</span>
        <button class="btn btn-secondary" onclick="showPage('goals');openGoalCreate();">${text("addFirstGoal")}</button>
      </div>
    `;

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("homeEyebrow")}</div>
        <div class="page-title">${formatMonthLabel(viewMonth)}</div>
        <div class="page-subtitle">${text("appSub")}</div>
      </div>
      <div class="month-switch">
        <button class="month-button" onclick="changeMonth(-1)">‹</button>
        <div class="month-label">
          <strong>${formatMonthLabel(viewMonth)}</strong>
          <span>${viewMonth}</span>
        </div>
        <button class="month-button" onclick="changeMonth(1)">›</button>
      </div>
      <section class="hero-card reveal" style="--delay:0">
        <div class="hero-top">
          <div>
            <div class="hero-label">${text("balanceLabel")}</div>
            <div class="hero-balance"><span class="${balance < 0 ? "" : "accent"}">${balance < 0 ? "−" : ""}${formatNumber(Math.abs(balance), Math.abs(balance % 1) > 0 ? 2 : 0)}</span> <span class="money-code"><i class="byn">BYN</i></span></div>
          </div>
        </div>
        <div class="hero-footnote">${text("remainderLabel")}: ${moneyInline(balance, true)}</div>
        <div class="metric-grid">
          <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="startCreateTx('expense')">${text("quickExpense")}</button>
          <button class="btn btn-secondary" onclick="startCreateTx('income')">${text("quickIncome")}</button>
          <button class="btn btn-ghost" onclick="showPage('history')">${text("openHistory")}</button>
        </div>
      </section>
      ${setupHtml}
      <section class="section reveal" style="--delay:2">
        <div class="section-head"><div class="section-title">${text("issuesLabel")}</div></div>
        <div class="insight-list">
          ${alerts.map((alert) => `
            <div class="insight insight-${alert.tone}">
              <div class="insight-icon">${alert.icon}</div>
              <div class="insight-copy"><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.copy)}</span></div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div><button class="link-button" onclick="showPage('settings')">${text("navSettings")}</button></div>
        <div class="budget-grid">${budgetHtml}</div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("recentTitle")}</div><button class="link-button" onclick="showPage('history')">${text("seeAll")}</button></div>
        ${recentHtml}
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("goalsPreview")}</div><button class="link-button" onclick="showPage('goals')">${text("seeAll")}</button></div>
        ${goalsHtml}
      </section>
    </div>
  `;
}

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;

  const historyContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : `<div class="empty-state"><strong>${text("emptyHistoryTitle")}</strong><span>${text("emptyHistoryCopy")}</span></div>`;

  const analyticsContent = monthly.length
    ? `
      <div class="history-summary">
        <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
        <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
        <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
      </div>
      <section class="section">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyAnalyticsTab")} и ${text("historyListTab").toLowerCase()} держим рядом, чтобы не распылять навигацию.</div>
      </div>
      <div class="month-switch">
        <button class="month-button" onclick="changeMonth(-1)">‹</button>
        <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
        <button class="month-button" onclick="changeMonth(1)">›</button>
      </div>
      <div class="page-tabs reveal" style="--delay:0">
        <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
        <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
      </div>
      ${historyMode === "list" ? `
        <div class="filter-grid reveal" style="--delay:1">
          <div class="field">
            <label class="label">${text("filterType")}</label>
            <select class="select" onchange="setHistoryTypeFilter(this.value)">
              <option value="all" ${historyTypeFilter === "all" ? "selected" : ""}>${text("allTypes")}</option>
              <option value="expense" ${historyTypeFilter === "expense" ? "selected" : ""}>${text("expensesOnly")}</option>
              <option value="income" ${historyTypeFilter === "income" ? "selected" : ""}>${text("incomeOnly")}</option>
            </select>
          </div>
          <div class="field">
            <label class="label">${text("filterCategory")}</label>
            <select class="select" onchange="setHistoryCategoryFilter(this.value)">
              <option value="all" ${historyCategoryFilter === "all" ? "selected" : ""}>${text("allCategories")}</option>
              ${getCategories().map((category) => `<option value="${category.id}" ${historyCategoryFilter === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        </div>
        <section class="section reveal" style="--delay:2">${historyContent}</section>
      ` : analyticsContent}
    </div>
  `;
}

renderHistory = function () {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "-"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "-"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
};

updateAppChrome = function () {
  document.body.dataset.page = currentPage;
};

clearInterval(init.chromeTimer);
init.chromeTimer = setInterval(updateAppChrome, 60000);
updateAppChrome();
render();

renderTransactionItem = function (tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "💸" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">${escapeHtml(label)} &middot; ${tx.date}${tx.recurringId ? ` <span class="tx-pill">${text("recurringSourceBadge")}</span>` : ""}</div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
};

renderAdd = function () {
  const amountValue = Number(txDraft.amount);
  const previewValue = Number.isFinite(amountValue) ? Math.abs(amountValue) : 0;
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;

  return `
    <div class="page page-add">
      <section class="add-hero-card panel reveal" style="--delay:0">
        <div class="add-hero-top">
          <div>
            <div class="eyebrow">${text("addEyebrow")}</div>
            <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
          </div>
          <div class="add-mode-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
        </div>
        <div class="page-subtitle">${text("addCopy")}</div>
        <div class="add-amount-preview ${txDraft.type === "income" ? "income" : "expense"}">${moneyInline(previewValue, false)}</div>
        <div class="field add-quick-field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented add-type-switch">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field add-quick-field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
      </section>
      <section class="composer-sheet panel reveal" style="--delay:1">
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input input-amount" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row chip-row-categories">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
        </div>
        ${canConfigureRecurring ? `
          <div class="recurring-inline-card">
            <div class="setting-row recurring-inline-row">
              <div>
                <div class="setting-title">${text("recurringLabel")}</div>
                <div class="setting-copy">${text("recurringHint")}</div>
              </div>
              <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" onclick="toggleTxRecurring()" aria-pressed="${txDraft.recurringEnabled ? "true" : "false"}"><span></span></button>
            </div>
            ${txDraft.recurringEnabled ? `
              <div class="history-filter-grid recurring-inline-grid">
                <div class="field">
                  <label class="label">${text("recurringTemplateLabel")}</label>
                  <select class="select" onchange="setRecurringTemplate(this.value)">
                    ${RECURRING_TEMPLATES.map((template) => `<option value="${template}" ${txDraft.recurringTemplate === template ? "selected" : ""}>${text("recurringTemplate" + template.charAt(0).toUpperCase() + template.slice(1))}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label class="label">${text("recurringDayLabel")}</label>
                  <input class="input" type="number" min="1" max="31" value="${escapeHtml(String(txDraft.recurringDay || Number(String(txDraft.date).slice(8, 10))))}" oninput="updateTxDraft('recurringDay', this.value)">
                </div>
              </div>
            ` : ""}
          </div>
        ` : `
          <div class="status-card info inline-status">
            <strong>${text("recurringSourceBadge")}</strong>
            <span>${text("recurringManageHint")}</span>
          </div>
        `}
        <div class="composer-actions">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
};

renderSettings = function () {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      ${renderStatusStack("settings")}
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      ${renderRecurringSection()}
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
};

renderHistory = function () {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
};

updateAppChrome = function () {
  document.body.dataset.page = currentPage;
};

loadDemoData = function () {
  const demo = createDemoData();
  transactions = demo.transactions;
  goals = demo.goals;
  recurring = migrateRecurring(demo.recurring || []);
  saveTransactions();
  saveGoals();
  saveRecurring();
  dismissOnboarding();
  currentPage = "home";
  ensureRecurringTransactions(viewMonth);
  showToast(text("toastDemoLoaded"));
  render();
};

render();

function renderTransactionItem(tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "💸" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">
          ${escapeHtml(label)} &middot; ${tx.date}
          ${tx.recurringId ? ` <span class="tx-pill">${text("recurringSourceBadge")}</span>` : ""}
        </div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
}

function renderAdd() {
  const amountValue = Number(txDraft.amount);
  const previewValue = Number.isFinite(amountValue) ? Math.abs(amountValue) : 0;
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;

  return `
    <div class="page page-add">
      <section class="add-hero-card panel reveal" style="--delay:0">
        <div class="add-hero-top">
          <div>
            <div class="eyebrow">${text("addEyebrow")}</div>
            <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
          </div>
          <div class="add-mode-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
        </div>
        <div class="page-subtitle">${text("addCopy")}</div>
        <div class="add-amount-preview ${txDraft.type === "income" ? "income" : "expense"}">${moneyInline(previewValue, false)}</div>
        <div class="field add-quick-field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented add-type-switch">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field add-quick-field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
      </section>
      <section class="composer-sheet panel reveal" style="--delay:1">
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input input-amount" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row chip-row-categories">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
        </div>
        ${canConfigureRecurring ? `
          <div class="recurring-inline-card">
            <div class="setting-row recurring-inline-row">
              <div>
                <div class="setting-title">${text("recurringLabel")}</div>
                <div class="setting-copy">${text("recurringHint")}</div>
              </div>
              <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" onclick="toggleTxRecurring()" aria-pressed="${txDraft.recurringEnabled ? "true" : "false"}"><span></span></button>
            </div>
            ${txDraft.recurringEnabled ? `
              <div class="history-filter-grid recurring-inline-grid">
                <div class="field">
                  <label class="label">${text("recurringTemplateLabel")}</label>
                  <select class="select" onchange="setRecurringTemplate(this.value)">
                    ${RECURRING_TEMPLATES.map((template) => `<option value="${template}" ${txDraft.recurringTemplate === template ? "selected" : ""}>${text("recurringTemplate" + template.charAt(0).toUpperCase() + template.slice(1))}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label class="label">${text("recurringDayLabel")}</label>
                  <input class="input" type="number" min="1" max="31" value="${escapeHtml(String(txDraft.recurringDay || Number(String(txDraft.date).slice(8, 10))))}" oninput="updateTxDraft('recurringDay', this.value)">
                </div>
              </div>
            ` : ""}
          </div>
        ` : `
          <div class="status-card info inline-status">
            <strong>${text("recurringSourceBadge")}</strong>
            <span>${text("recurringManageHint")}</span>
          </div>
        `}
        <div class="composer-actions">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
}

renderHome = function () {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const recent = monthTransactions(viewMonth).slice(0, 5);
  const goalsPreview = [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved)).slice(0, 2);
  const setup = setupSteps();
  const doneCount = setup.filter((step) => step.done).length;
  const setupProgress = (doneCount / setup.length) * 100;
  const alerts = [];
  const total = budgetTotal();
  const overBudget = budgets.filter((item) => item.over);

  if (!monthTransactions(viewMonth).length) {
    alerts.push({ tone: "neutral", icon: "•", title: text("insightStartTitle"), copy: text("insightStartCopy") });
  }
  if (total !== 100) {
    alerts.push({ tone: "warning", icon: "!", title: text("insightBudgetWarnTitle"), copy: text("insightBudgetWarnCopy", { total: formatNumber(total, 0) }) });
  }
  if (income <= 0) {
    alerts.push({ tone: "warning", icon: "+", title: text("insightIncomeMissingTitle"), copy: text("insightIncomeMissingCopy") });
  }
  if (overBudget.length) {
    alerts.push({ tone: "danger", icon: "x", title: text("insightOverTitle"), copy: text("insightOverCopy", { count: String(overBudget.length) }) });
  }
  if (!alerts.length) {
    alerts.push({ tone: "success", icon: "v", title: text("insightHealthyTitle"), copy: text("insightHealthyCopy") });
  }

  const setupHtml = shouldShowSetupCard() ? `
    <section class="section reveal" style="--delay:3">
      <div class="section-head"><div class="section-title">${text("setupTitle")}</div></div>
      <div class="setup-card panel">
        <div class="setup-top">
          <div>
            <div class="setting-title">${text("setupTitle")}</div>
            <div class="setting-copy">${text("setupCopy")}</div>
          </div>
          <div class="setup-badge">${doneCount}/${setup.length}</div>
        </div>
        <div class="setup-track"><div class="setup-fill" style="width:${setupProgress}%"></div></div>
        <div class="setup-list">
          ${setup.map((step) => `
            <div class="setup-item ${step.done ? "complete" : ""}">
              <div class="setup-mark">${step.done ? "v" : "•"}</div>
              <div class="setup-copy">
                <strong>${escapeHtml(step.title)}</strong>
                <span>${escapeHtml(step.copy)}</span>
                ${step.done ? "" : `<button class="link-button" style="margin-top:8px" onclick="${step.action}">${step.actionLabel}</button>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  ` : `
    <section class="section reveal" style="--delay:3">
      <div class="setting-card">
        <div class="setting-title">${text("setupDoneTitle")}</div>
        <div class="setting-copy">${text("setupDoneCopy")}</div>
      </div>
    </section>
  `;

  const budgetHtml = budgets.map((category) => `
    <div class="budget-card ${category.over ? "over" : ""}" data-cat="${category.id}">
      <div class="budget-head">
        <div>
          <div class="budget-name">${category.icon} ${escapeHtml(category.name)}</div>
          <div class="budget-pct">${formatNumber(category.budgetPct, 0)}%</div>
        </div>
        <div class="tx-amount ${category.over ? "expense" : "income"}">${moneyInline(category.left, category.left !== 0)}</div>
      </div>
      <div class="budget-stat">
        <div><span>${text("planned")}</span><strong>${moneyInline(category.planned, false)}</strong></div>
        <div><span>${text("spent")}</span><strong>${moneyInline(category.spent, false)}</strong></div>
      </div>
      <div class="budget-track"><div class="budget-fill" style="width:${Math.min(100, category.progress)}%;background:${category.color}"></div></div>
      <div class="budget-foot">${category.over ? text("overrun") : text("left")}: ${moneyInline(Math.abs(category.left), false)}</div>
    </div>
  `).join("");

  const recentHtml = recent.length
    ? renderTransactionGroups(recent, false)
    : `<div class="empty-state"><strong>${text("noTransactionsTitle")}</strong><span>${text("noTransactionsCopy")}</span><button class="btn btn-primary" onclick="startCreateTx('expense')">${text("addFirstTx")}</button></div>`;

  const goalsHtml = goalsPreview.length
    ? goalsPreview.map((goal) => {
        const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
        return `
          <div class="goal-card">
            <div class="goal-top">
              <div>
                <div class="goal-name">${escapeHtml(goal.name)}</div>
                <div class="goal-meta">${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</div>
              </div>
              <div class="tx-amount income">${formatNumber(progress, 0)}%</div>
            </div>
            <div class="goal-progress"><div class="goal-track"><div class="goal-fill" style="width:${progress}%;background:${goal.accent}"></div></div></div>
            <div class="goal-stats">
              <div>${text("goalProgress")}<strong>${moneyInline(goal.saved, false)}</strong></div>
              <div style="text-align:right">${text("goalTargetLabel")}<strong>${moneyInline(goal.target, false)}</strong></div>
            </div>
          </div>
        `;
      }).join("")
    : `<div class="empty-state"><strong>${text("noGoalsTitle")}</strong><span>${text("noGoalsCopy")}</span><button class="btn btn-secondary" onclick="showPage('goals');openGoalCreate();">${text("addFirstGoal")}</button></div>`;

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("homeEyebrow")}</div>
        <div class="page-title">${formatMonthLabel(viewMonth)}</div>
        <div class="page-subtitle">${text("appSub")}</div>
      </div>
      ${renderStatusStack("home")}
      <div class="month-switch">
        <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
        <div class="month-label">
          <strong>${formatMonthLabel(viewMonth)}</strong>
          <span>${viewMonth}</span>
        </div>
        <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
      </div>
      <section class="hero-card reveal" style="--delay:0">
        <div class="hero-top">
          <div>
            <div class="hero-label">${text("balanceLabel")}</div>
            <div class="hero-balance"><span class="${balance < 0 ? "" : "accent"}">${balance < 0 ? "-" : ""}${formatNumber(Math.abs(balance), Math.abs(balance % 1) > 0 ? 2 : 0)}</span> <span class="money-code"><i class="byn">BYN</i></span></div>
          </div>
        </div>
        <div class="hero-footnote">${text("remainderLabel")}: ${moneyInline(balance, true)}</div>
        <div class="metric-grid">
          <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="startCreateTx('expense')">${text("quickExpense")}</button>
          <button class="btn btn-secondary" onclick="startCreateTx('income')">${text("quickIncome")}</button>
          <button class="btn btn-ghost" onclick="showPage('history')">${text("openHistory")}</button>
        </div>
      </section>
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${setupHtml}
      ${renderSmartInsightsSection(viewMonth, 4)}
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("issuesLabel")}</div></div>
        <div class="insight-list">
          ${alerts.map((alert) => `<div class="insight insight-${alert.tone}"><div class="insight-icon">${alert.icon}</div><div class="insight-copy"><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.copy)}</span></div></div>`).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:6">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div><button class="link-button" onclick="showPage('settings')">${text("navSettings")}</button></div>
        <div class="budget-grid">${budgetHtml}</div>
      </section>
      <section class="section reveal" style="--delay:7">
        <div class="section-head"><div class="section-title">${text("recentTitle")}</div><button class="link-button" onclick="showPage('history')">${text("seeAll")}</button></div>
        ${recentHtml}
      </section>
      <section class="section reveal" style="--delay:8">
        <div class="section-head"><div class="section-title">${text("goalsPreview")}</div><button class="link-button" onclick="showPage('goals')">${text("seeAll")}</button></div>
        ${goalsHtml}
      </section>
    </div>
  `;
};

renderHistory = function () {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
};

updateAppChrome = function () {
  document.body.dataset.page = currentPage;
};

clearInterval(init.chromeTimer);
init.chromeTimer = setInterval(updateAppChrome, 60000);
updateAppChrome();
render();

function renderSettings() {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      ${renderStatusStack("settings")}
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      ${renderRecurringSection()}
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
}

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
}

renderTransactionItem = function (tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "💸" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">${escapeHtml(label)} &middot; ${tx.date}${tx.recurringId ? ` <span class="tx-pill">${text("recurringSourceBadge")}</span>` : ""}</div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
};

renderAdd = function () {
  const amountValue = Number(txDraft.amount);
  const previewValue = Number.isFinite(amountValue) ? Math.abs(amountValue) : 0;
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;

  return `
    <div class="page page-add">
      <section class="add-hero-card panel reveal" style="--delay:0">
        <div class="add-hero-top">
          <div>
            <div class="eyebrow">${text("addEyebrow")}</div>
            <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
          </div>
          <div class="add-mode-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
        </div>
        <div class="page-subtitle">${text("addCopy")}</div>
        <div class="add-amount-preview ${txDraft.type === "income" ? "income" : "expense"}">${moneyInline(previewValue, false)}</div>
        <div class="field add-quick-field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented add-type-switch">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field add-quick-field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
      </section>
      <section class="composer-sheet panel reveal" style="--delay:1">
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input input-amount" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row chip-row-categories">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
        </div>
        ${canConfigureRecurring ? `
          <div class="recurring-inline-card">
            <div class="setting-row recurring-inline-row">
              <div>
                <div class="setting-title">${text("recurringLabel")}</div>
                <div class="setting-copy">${text("recurringHint")}</div>
              </div>
              <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" onclick="toggleTxRecurring()" aria-pressed="${txDraft.recurringEnabled ? "true" : "false"}"><span></span></button>
            </div>
            ${txDraft.recurringEnabled ? `
              <div class="history-filter-grid recurring-inline-grid">
                <div class="field">
                  <label class="label">${text("recurringTemplateLabel")}</label>
                  <select class="select" onchange="setRecurringTemplate(this.value)">
                    ${RECURRING_TEMPLATES.map((template) => `<option value="${template}" ${txDraft.recurringTemplate === template ? "selected" : ""}>${text("recurringTemplate" + template.charAt(0).toUpperCase() + template.slice(1))}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label class="label">${text("recurringDayLabel")}</label>
                  <input class="input" type="number" min="1" max="31" value="${escapeHtml(String(txDraft.recurringDay || Number(String(txDraft.date).slice(8, 10))))}" oninput="updateTxDraft('recurringDay', this.value)">
                </div>
              </div>
            ` : ""}
          </div>
        ` : `
          <div class="status-card info inline-status">
            <strong>${text("recurringSourceBadge")}</strong>
            <span>${text("recurringManageHint")}</span>
          </div>
        `}
        <div class="composer-actions">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
};

renderSettings = function () {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      ${renderStatusStack("settings")}
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      ${renderRecurringSection()}
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
};

renderHistory = function () {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
};

updateAppChrome = function () {
  document.body.dataset.page = currentPage;
};

render();

function updateAppChrome() {
  document.body.dataset.page = currentPage;
}

function stage2Text(key, vars) {
  const dict = {
    ru: {
      trendTitle: "Сравнение с прошлым месяцем",
      trendIncome: "Доходы",
      trendExpense: "Расходы",
      trendBalance: "Баланс",
      trendVsPrev: "к прошлому месяцу",
      trendNoPrev: "Нет прошлого месяца для сравнения",
      dailyAllowanceTitle: "Можно тратить в день",
      dailyAllowanceCurrent: "До конца месяца осталось {days} дн.",
      dailyAllowanceFuture: "Если придерживаться текущего темпа бюджета.",
      dailyAllowancePast: "Месяц уже закрыт.",
      dailyAllowanceDays: "Осталось дней",
      smartTitle: "Умные инсайты",
      smartGrowth: "Самая растущая категория",
      smartStable: "Самая стабильная категория",
      smartCut: "Где можно сократить",
      smartNoData: "Пока мало данных для выводов",
      smartGrowthCopy: "{name} выросла на {amount} к прошлому месяцу.",
      smartStableCopy: "{name} почти без колебаний: разница всего {amount}.",
      smartCutOverCopy: "{name} выше плана на {amount}.",
      smartCutSpendCopy: "{name} сейчас самая тяжелая категория месяца.",
      smartNeutralCopy: "Собери еще один полный месяц, и выводы станут точнее.",
      prevMonthLabel: "Предыдущий месяц",
      currentMonthLabel: "Текущий месяц",
    },
    be: {
      trendTitle: "Параўнанне з мінулым месяцам",
      trendIncome: "Даходы",
      trendExpense: "Выдаткі",
      trendBalance: "Баланс",
      trendVsPrev: "да мінулага месяца",
      trendNoPrev: "Няма мінулага месяца для параўнання",
      dailyAllowanceTitle: "Можна траціць у дзень",
      dailyAllowanceCurrent: "Да канца месяца засталося {days} дзн.",
      dailyAllowanceFuture: "Калі трымацца бягучага тэмпу бюджэту.",
      dailyAllowancePast: "Месяц ужо закрыты.",
      dailyAllowanceDays: "Засталося дзён",
      smartTitle: "Разумныя інсайты",
      smartGrowth: "Самая растучая катэгорыя",
      smartStable: "Самая стабільная катэгорыя",
      smartCut: "Дзе можна скараціць",
      smartNoData: "Пакуль мала даных для высноў",
      smartGrowthCopy: "{name} вырасла на {amount} да мінулага месяца.",
      smartStableCopy: "{name} амаль без ваганняў: розніца ўсяго {amount}.",
      smartCutOverCopy: "{name} вышэй за план на {amount}.",
      smartCutSpendCopy: "{name} цяпер самая цяжкая катэгорыя месяца.",
      smartNeutralCopy: "Збяры яшчэ адзін поўны месяц, і высновы стануць дакладней.",
      prevMonthLabel: "Мінулы месяц",
      currentMonthLabel: "Бягучы месяц",
    },
  };
  dict.en = {
    trendTitle: "Compared with last month",
    trendIncome: "Income",
    trendExpense: "Expenses",
    trendBalance: "Balance",
    trendVsPrev: "vs previous month",
    trendNoPrev: "No previous month to compare",
    dailyAllowanceTitle: "Daily spending allowance",
    dailyAllowanceCurrent: "{days} days left in the month",
    dailyAllowanceFuture: "If you keep following the current budget pace.",
    dailyAllowancePast: "The month is already closed.",
    dailyAllowanceDays: "Days left",
    smartTitle: "Smart insights",
    smartGrowth: "Fastest-growing category",
    smartStable: "Most stable category",
    smartCut: "Where to cut back",
    smartNoData: "There is not enough data yet",
    smartGrowthCopy: "{name} grew by {amount} compared with last month.",
    smartStableCopy: "{name} is almost unchanged: the difference is only {amount}.",
    smartCutOverCopy: "{name} is over plan by {amount}.",
    smartCutSpendCopy: "{name} is currently the heaviest category this month.",
    smartNeutralCopy: "Collect one more full month and the insights will become more accurate.",
    prevMonthLabel: "Previous month",
    currentMonthLabel: "Current month",
  };
  let value = (dict[lang] || dict.ru)[key] || dict.ru[key] || key;
  if (vars && typeof value === "string") {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), replacement);
    }
  }
  return value;
}

function shiftMonthValue(ym, delta) {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(ym) {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function monthTotals(ym) {
  const income = monthIncome(ym);
  const expense = monthExpenses(ym);
  return {
    income,
    expense,
    balance: income - expense,
    count: monthTransactions(ym).length,
  };
}

function monthComparison(ym) {
  const previousMonth = shiftMonthValue(ym, -1);
  const current = monthTotals(ym);
  const previous = monthTotals(previousMonth);
  return {
    previousMonth,
    current,
    previous,
    hasPrevious: previous.count > 0,
    incomeDelta: current.income - previous.income,
    expenseDelta: current.expense - previous.expense,
    balanceDelta: current.balance - previous.balance,
  };
}

function dailyAllowance(ym) {
  const today = isoToday();
  const currentMonth = currentMonthValue();
  const balance = monthTotals(ym).balance;
  const totalDays = daysInMonth(ym);
  let daysLeft = totalDays;

  if (ym === currentMonth) {
    daysLeft = Math.max(1, totalDays - Number(today.slice(8, 10)) + 1);
  } else if (ym < currentMonth) {
    daysLeft = 0;
  }

  return {
    daysLeft,
    perDay: daysLeft > 0 ? balance / daysLeft : balance,
    isPast: ym < currentMonth,
    isCurrent: ym === currentMonth,
    isFuture: ym > currentMonth,
  };
}

function categoryMonthDeltas(ym) {
  const previousMonth = shiftMonthValue(ym, -1);
  const budgets = categoryBudgetsForMonth(ym);

  return budgets.map((category) => {
    const previousSpent = categorySpent(previousMonth, category.id);
    const delta = category.spent - previousSpent;
    return {
      ...category,
      previousSpent,
      delta,
      absDelta: Math.abs(delta),
      overspend: Math.max(0, category.spent - category.planned),
    };
  });
}

function smartInsights(ym) {
  const deltas = categoryMonthDeltas(ym);
  const active = deltas.filter((item) => item.spent > 0 || item.previousSpent > 0);
  const growth = [...active].filter((item) => item.delta > 0).sort((a, b) => b.delta - a.delta)[0] || null;
  const stable = [...active].sort((a, b) => a.absDelta - b.absDelta || b.spent - a.spent)[0] || null;
  const overspend = [...deltas].filter((item) => item.overspend > 0).sort((a, b) => b.overspend - a.overspend)[0] || null;
  const topSpend = [...deltas].sort((a, b) => b.spent - a.spent)[0] || null;
  const cut = overspend || topSpend || null;

  return {
    growth,
    stable,
    cut,
  };
}

function trendDeltaMarkup(value, inverse) {
  const positive = inverse ? value < 0 : value > 0;
  const negative = inverse ? value > 0 : value < 0;
  const tone = positive ? "up" : negative ? "down" : "neutral";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `<span class="trend-delta ${tone}">${sign}${moneyInline(Math.abs(value), false)}</span>`;
}

function renderTrendSection(ym) {
  const comparison = monthComparison(ym);
  const items = [
    { label: stage2Text("trendIncome"), value: comparison.current.income, delta: comparison.incomeDelta, inverse: false },
    { label: stage2Text("trendExpense"), value: comparison.current.expense, delta: comparison.expenseDelta, inverse: true },
    { label: stage2Text("trendBalance"), value: comparison.current.balance, delta: comparison.balanceDelta, inverse: false },
  ];

  return `
    <section class="section reveal" style="--delay:1">
      <div class="section-head"><div class="section-title">${stage2Text("trendTitle")}</div></div>
      <div class="trend-grid">
        ${items.map((item) => `
          <div class="trend-card">
            <div class="trend-label">${item.label}</div>
            <div class="trend-value ${item.label === stage2Text("trendExpense") ? "expense" : item.label === stage2Text("trendIncome") ? "income" : ""}">${moneyInline(item.value, false)}</div>
            <div class="trend-meta">
              ${comparison.hasPrevious ? trendDeltaMarkup(item.delta, item.inverse) : `<span class="trend-delta neutral">${stage2Text("trendNoPrev")}</span>`}
              <span>${stage2Text("trendVsPrev")}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderDailyAllowanceSection(ym, delay) {
  const allowance = dailyAllowance(ym);
  const subtitle = allowance.isPast
    ? stage2Text("dailyAllowancePast")
    : allowance.isCurrent
      ? stage2Text("dailyAllowanceCurrent", { days: String(allowance.daysLeft) })
      : stage2Text("dailyAllowanceFuture");

  return `
    <section class="section reveal" style="--delay:${delay}">
      <div class="daily-card panel">
        <div>
          <div class="section-title">${stage2Text("dailyAllowanceTitle")}</div>
          <div class="daily-copy">${subtitle}</div>
        </div>
        <div class="daily-value ${allowance.perDay < 0 ? "expense" : "income"}">${moneyInline(allowance.perDay, true)}</div>
        <div class="daily-meta">
          <span>${stage2Text("dailyAllowanceDays")}</span>
          <strong>${allowance.daysLeft}</strong>
        </div>
      </div>
    </section>
  `;
}

function renderSmartInsightsSection(ym, delay) {
  const insights = smartInsights(ym);
  const cards = [
    insights.growth
      ? {
          title: stage2Text("smartGrowth"),
          copy: stage2Text("smartGrowthCopy", {
            name: insights.growth.name,
            amount: formatNumber(insights.growth.delta, Math.abs(insights.growth.delta % 1) > 0 ? 2 : 0),
          }),
          tone: "income",
        }
      : {
          title: stage2Text("smartGrowth"),
          copy: stage2Text("smartNoData"),
          tone: "neutral",
        },
    insights.stable
      ? {
          title: stage2Text("smartStable"),
          copy: stage2Text("smartStableCopy", {
            name: insights.stable.name,
            amount: formatNumber(insights.stable.absDelta, Math.abs(insights.stable.absDelta % 1) > 0 ? 2 : 0),
          }),
          tone: "neutral",
        }
      : {
          title: stage2Text("smartStable"),
          copy: stage2Text("smartNeutralCopy"),
          tone: "neutral",
        },
    insights.cut
      ? {
          title: stage2Text("smartCut"),
          copy: insights.cut.overspend > 0
            ? stage2Text("smartCutOverCopy", {
                name: insights.cut.name,
                amount: formatNumber(insights.cut.overspend, Math.abs(insights.cut.overspend % 1) > 0 ? 2 : 0),
              })
            : stage2Text("smartCutSpendCopy", { name: insights.cut.name }),
          tone: insights.cut.overspend > 0 ? "expense" : "warning",
        }
      : {
          title: stage2Text("smartCut"),
          copy: stage2Text("smartNeutralCopy"),
          tone: "neutral",
        },
  ];

  return `
    <section class="section reveal" style="--delay:${delay}">
      <div class="section-head"><div class="section-title">${stage2Text("smartTitle")}</div></div>
      <div class="smart-grid">
        ${cards.map((card) => `
          <div class="smart-card ${card.tone}">
            <strong>${escapeHtml(card.title)}</strong>
            <span>${escapeHtml(card.copy)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHome() {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const recent = monthTransactions(viewMonth).slice(0, 5);
  const goalsPreview = [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved)).slice(0, 2);
  const setup = setupSteps();
  const doneCount = setup.filter((step) => step.done).length;
  const setupProgress = (doneCount / setup.length) * 100;
  const alerts = [];
  const total = budgetTotal();
  const overBudget = budgets.filter((item) => item.over);

  if (!monthTransactions(viewMonth).length) {
    alerts.push({ tone: "neutral", icon: "○", title: text("insightStartTitle"), copy: text("insightStartCopy") });
  }
  if (total !== 100) {
    alerts.push({ tone: "warning", icon: "!", title: text("insightBudgetWarnTitle"), copy: text("insightBudgetWarnCopy", { total: formatNumber(total, 0) }) });
  }
  if (income <= 0) {
    alerts.push({ tone: "warning", icon: "₿", title: text("insightIncomeMissingTitle"), copy: text("insightIncomeMissingCopy") });
  }
  if (overBudget.length) {
    alerts.push({ tone: "danger", icon: "×", title: text("insightOverTitle"), copy: text("insightOverCopy", { count: String(overBudget.length) }) });
  }
  if (!alerts.length) {
    alerts.push({ tone: "success", icon: "✓", title: text("insightHealthyTitle"), copy: text("insightHealthyCopy") });
  }

  const setupHtml = shouldShowSetupCard() ? `
    <section class="section reveal" style="--delay:3">
      <div class="section-head"><div class="section-title">${text("setupTitle")}</div></div>
      <div class="setup-card panel">
        <div class="setup-top">
          <div>
            <div class="setting-title">${text("setupTitle")}</div>
            <div class="setting-copy">${text("setupCopy")}</div>
          </div>
          <div class="setup-badge">${doneCount}/${setup.length}</div>
        </div>
        <div class="setup-track"><div class="setup-fill" style="width:${setupProgress}%"></div></div>
        <div class="setup-list">
          ${setup.map((step) => `
            <div class="setup-item ${step.done ? "complete" : ""}">
              <div class="setup-mark">${step.done ? "✓" : "•"}</div>
              <div class="setup-copy">
                <strong>${escapeHtml(step.title)}</strong>
                <span>${escapeHtml(step.copy)}</span>
                ${step.done ? "" : `<button class="link-button" style="margin-top:8px" onclick="${step.action}">${step.actionLabel}</button>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  ` : `
    <section class="section reveal" style="--delay:3">
      <div class="setting-card">
        <div class="setting-title">${text("setupDoneTitle")}</div>
        <div class="setting-copy">${text("setupDoneCopy")}</div>
      </div>
    </section>
  `;

  const budgetHtml = budgets.map((category) => `
    <div class="budget-card ${category.over ? "over" : ""}" data-cat="${category.id}">
      <div class="budget-head">
        <div>
          <div class="budget-name">${category.icon} ${escapeHtml(category.name)}</div>
          <div class="budget-pct">${formatNumber(category.budgetPct, 0)}%</div>
        </div>
        <div class="tx-amount ${category.over ? "expense" : "income"}">${moneyInline(category.left, category.left !== 0)}</div>
      </div>
      <div class="budget-stat">
        <div><span>${text("planned")}</span><strong>${moneyInline(category.planned, false)}</strong></div>
        <div><span>${text("spent")}</span><strong>${moneyInline(category.spent, false)}</strong></div>
      </div>
      <div class="budget-track"><div class="budget-fill" style="width:${Math.min(100, category.progress)}%;background:${category.color}"></div></div>
      <div class="budget-foot">${category.over ? text("overrun") : text("left")}: ${moneyInline(Math.abs(category.left), false)}</div>
    </div>
  `).join("");

  const recentHtml = recent.length
    ? renderTransactionGroups(recent, false)
    : `<div class="empty-state"><strong>${text("noTransactionsTitle")}</strong><span>${text("noTransactionsCopy")}</span><button class="btn btn-primary" onclick="startCreateTx('expense')">${text("addFirstTx")}</button></div>`;

  const goalsHtml = goalsPreview.length
    ? goalsPreview.map((goal) => {
        const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
        return `
          <div class="goal-card">
            <div class="goal-top">
              <div>
                <div class="goal-name">${escapeHtml(goal.name)}</div>
                <div class="goal-meta">${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</div>
              </div>
              <div class="tx-amount income">${formatNumber(progress, 0)}%</div>
            </div>
            <div class="goal-progress"><div class="goal-track"><div class="goal-fill" style="width:${progress}%;background:${goal.accent}"></div></div></div>
            <div class="goal-stats">
              <div>${text("goalProgress")}<strong>${moneyInline(goal.saved, false)}</strong></div>
              <div style="text-align:right">${text("goalTargetLabel")}<strong>${moneyInline(goal.target, false)}</strong></div>
            </div>
          </div>
        `;
      }).join("")
    : `<div class="empty-state"><strong>${text("noGoalsTitle")}</strong><span>${text("noGoalsCopy")}</span><button class="btn btn-secondary" onclick="showPage('goals');openGoalCreate();">${text("addFirstGoal")}</button></div>`;

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("homeEyebrow")}</div>
        <div class="page-title">${formatMonthLabel(viewMonth)}</div>
        <div class="page-subtitle">${text("appSub")}</div>
      </div>
      <div class="month-switch">
        <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
        <div class="month-label">
          <strong>${formatMonthLabel(viewMonth)}</strong>
          <span>${viewMonth}</span>
        </div>
        <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
      </div>
      <section class="hero-card reveal" style="--delay:0">
        <div class="hero-top">
          <div>
            <div class="hero-label">${text("balanceLabel")}</div>
            <div class="hero-balance"><span class="${balance < 0 ? "" : "accent"}">${balance < 0 ? "−" : ""}${formatNumber(Math.abs(balance), Math.abs(balance % 1) > 0 ? 2 : 0)}</span> <span class="money-code"><i class="byn">BYN</i></span></div>
          </div>
        </div>
        <div class="hero-footnote">${text("remainderLabel")}: ${moneyInline(balance, true)}</div>
        <div class="metric-grid">
          <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="startCreateTx('expense')">${text("quickExpense")}</button>
          <button class="btn btn-secondary" onclick="startCreateTx('income')">${text("quickIncome")}</button>
          <button class="btn btn-ghost" onclick="showPage('history')">${text("openHistory")}</button>
        </div>
      </section>
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${setupHtml}
      ${renderSmartInsightsSection(viewMonth, 4)}
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("issuesLabel")}</div></div>
        <div class="insight-list">
          ${alerts.map((alert) => `<div class="insight insight-${alert.tone}"><div class="insight-icon">${alert.icon}</div><div class="insight-copy"><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.copy)}</span></div></div>`).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:6">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div><button class="link-button" onclick="showPage('settings')">${text("navSettings")}</button></div>
        <div class="budget-grid">${budgetHtml}</div>
      </section>
      <section class="section reveal" style="--delay:7">
        <div class="section-head"><div class="section-title">${text("recentTitle")}</div><button class="link-button" onclick="showPage('history')">${text("seeAll")}</button></div>
        ${recentHtml}
      </section>
      <section class="section reveal" style="--delay:8">
        <div class="section-head"><div class="section-title">${text("goalsPreview")}</div><button class="link-button" onclick="showPage('goals')">${text("seeAll")}</button></div>
        ${goalsHtml}
      </section>
    </div>
  `;
}

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
}

function updateAppChrome() {
  document.body.dataset.page = currentPage;
}

const renderHistoryStage1 = renderHistory;
renderHistory = function () {
  return renderHistoryStage1().replace(
    /<div class="page-subtitle">[\s\S]*?<\/div>/,
    `<div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>`
  );
};

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyListTab")} &middot; ${text("historyAnalyticsTab")} &middot; ${text("historyCalendarTab")}</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
}

const renderHistoryFinalStage1 = renderHistory;
renderHistory = function () {
  return renderHistoryFinalStage1().replace(
    /<div class="page-subtitle">[\s\S]*?<\/div>/,
    `<div class="page-subtitle">${text("historyListTab")} / ${text("historyAnalyticsTab")} / ${text("historyCalendarTab")}</div>`
  );
};

function renderRecurringSection() {
  const recurringList = recurring.length
    ? recurring.map((rule) => `
      <div class="recurring-item ${rule.active ? "" : "paused"}">
        <div class="recurring-item-copy">
          <div class="recurring-topline">
            <strong>${escapeHtml(rule.desc)}</strong>
            <span class="status-pill ${rule.active ? "active" : "paused"}">${recurringStatusLabel(rule)}</span>
          </div>
          <div class="recurring-meta">${escapeHtml(recurringTemplateLabel(rule.template))} &middot; ${text("recurringEveryMonth")} ${rule.day}</div>
          <div class="recurring-meta">${rule.type === "income" ? text("incomeLabel") : categoryName(rule.cat)} &middot; ${moneyInline(rule.amount, false)}</div>
        </div>
        <div class="recurring-actions">
          <button class="goal-chip" onclick="toggleRecurringActive('${rule.id}')">${rule.active ? text("recurringPaused") : text("recurringActive")}</button>
          <button class="goal-chip danger" onclick="deleteRecurring('${rule.id}')">${text("delete")}</button>
        </div>
      </div>
    `).join("")
    : `
      <div class="empty-state">
        <strong>${text("recurringEmptyTitle")}</strong>
        <span>${text("recurringEmptyCopy")}</span>
        <button class="btn btn-secondary" onclick="startCreateRecurring('expense')">${text("recurringAdd")}</button>
      </div>
    `;

  return `
    <section class="section reveal" style="--delay:2">
      <div class="section-head">
        <div class="section-title">${text("recurringTitle")}</div>
        <button class="link-button" onclick="startCreateRecurring('expense')">${text("recurringAdd")}</button>
      </div>
      <div class="setting-card">
        <div class="setting-copy">${text("recurringCopy")}</div>
        <div class="recurring-list">${recurringList}</div>
      </div>
    </section>
  `;
}

function renderTransactionItem(tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "💸" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">
          ${escapeHtml(label)} &middot; ${tx.date}
          ${tx.recurringId ? ` <span class="tx-pill">${text("recurringSourceBadge")}</span>` : ""}
        </div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
}

function renderAdd() {
  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("addEyebrow")}</div>
        <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
        <div class="page-subtitle">${text("addCopy")}</div>
      </div>
      <section class="form-card panel reveal" style="--delay:0">
        <div class="field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value)">
        </div>
        <div class="button-row" style="margin-top:18px">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
}

function renderSettings() {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      ${renderStatusStack("settings")}
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      ${renderRecurringSection()}
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
}

function loadDemoData() {
  const demo = createDemoData();
  transactions = demo.transactions;
  goals = demo.goals;
  recurring = migrateRecurring(demo.recurring || []);
  saveTransactions();
  saveGoals();
  saveRecurring();
  dismissOnboarding();
  currentPage = "home";
  ensureRecurringTransactions(viewMonth);
  showToast(text("toastDemoLoaded"));
  render();
}

function setupConnectivity() {
  if (setupConnectivity.bound) return;
  setupConnectivity.bound = true;

  window.addEventListener("online", () => {
    isOnline = true;
    ratesUiState.lastError = null;
    showToast(text("toastOnline"));
    render();
    if (shouldRefreshRates()) refreshRatesFromNBRB({ silent: true });
  });

  window.addEventListener("offline", () => {
    isOnline = false;
    showToast(text("toastOffline"));
    render();
  });
}

function setupRatesAutoRefresh() {
  clearInterval(setupRatesAutoRefresh.timer);
  setupRatesAutoRefresh.timer = setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (!isOnline) return;
    if (!shouldRefreshRates()) return;
    refreshRatesFromNBRB({ silent: true });
  }, RATES_POLL_INTERVAL_MS);
}

function setupRatesAutoRefresh() {
  clearInterval(setupRatesAutoRefresh.timer);
  setupRatesAutoRefresh.timer = setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (!isOnline) return;
    if (!shouldRefreshRates()) return;
    refreshRatesFromNBRB({ silent: true });
  }, RATES_POLL_INTERVAL_MS);
}

function render() {
  ensureRecurringTransactions(viewMonth);
  syncLanguage();
  applyNavText();
  updateActiveNav();
  updateAppChrome();
  const screen = document.getElementById("screen");
  if (currentPage === "home") screen.innerHTML = renderHome();
  else if (currentPage === "history") screen.innerHTML = renderHistory();
  else if (currentPage === "add") screen.innerHTML = renderAdd();
  else if (currentPage === "goals") screen.innerHTML = renderGoals();
  else screen.innerHTML = renderSettings();
  renderOverlay();
  saveAppSession();
}

function init() {
  settings = migrateSettings(load(STORAGE.settings, null));
  transactions = migrateTransactions(load(STORAGE.transactions, load("txs", [])));
  goals = migrateGoals(load(STORAGE.goals, null), load("envs", []));
  recurring = migrateRecurring(load(STORAGE.recurring, null));
  txDraft = createEmptyTxDraft("expense");
  goalDraft = createEmptyGoalDraft();
  restoreAppSession(load(STORAGE.session, null));
  syncLanguage();
  setupConnectivity();
  setupAppPersistence();
  setupRatesAutoRefresh();
  ensureRecurringTransactions(viewMonth);
  render();
  updateAppChrome();
  clearInterval(init.chromeTimer);
  init.chromeTimer = setInterval(updateAppChrome, 60000);
  document.addEventListener("visibilitychange", () => {
    updateAppChrome();
    if (document.visibilityState === "visible" && isOnline && shouldRefreshRates()) refreshRatesFromNBRB();
  });
  if (shouldRefreshRates() && isOnline) refreshRatesFromNBRB();
}

function renderGoals() {
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const nearest = goals.length ? [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0] : null;

  const editor = goalEditorMode ? `
    <div class="inline-form panel">
      <p class="form-caption">${goalEditorMode === "edit" ? text("editGoal") : text("addGoal")}</p>
      <div class="field"><label class="label">${text("goalNameLabel")}</label><input class="input" type="text" value="${escapeHtml(goalDraft.name)}" oninput="updateGoalDraft('name', this.value)"></div>
      <div class="field"><label class="label">${text("goalTargetLabel")}</label><input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(goalDraft.target)}" oninput="updateGoalDraft('target', this.value)"></div>
      <div class="field"><label class="label">${text("goalSavedLabel")}</label><input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(goalDraft.saved)}" oninput="updateGoalDraft('saved', this.value)"></div>
      <div class="button-row" style="margin-top:16px">
        <button class="btn btn-primary" onclick="saveGoalRecord()">${goalEditorMode === "edit" ? text("updateGoal") : text("saveGoal")}</button>
        <button class="btn btn-ghost" onclick="cancelGoalEditor()">${text("cancel")}</button>
      </div>
    </div>
  ` : "";

  const adjustGoal = adjustGoalId ? `
    <div class="inline-form panel">
      <p class="form-caption">${text("adjustGoalTitle")}: ${escapeHtml(goals.find((goal) => goal.id === adjustGoalId)?.name || "")}</p>
      <div class="field"><label class="label">${text("adjustAmountLabel")}</label><input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(adjustGoalAmount)}" oninput="updateGoalAdjust(this.value)"></div>
      <div class="button-row" style="margin-top:16px">
        <button class="btn btn-primary" onclick="applyGoalAdjust(1)">${text("topUpGoal")}</button>
        <button class="btn btn-secondary" onclick="applyGoalAdjust(-1)">${text("withdrawGoal")}</button>
        <button class="btn btn-ghost" onclick="cancelGoalAdjust()">${text("cancel")}</button>
      </div>
    </div>
  ` : "";

  const goalsList = goals.length ? [...goals].map((goal) => {
    const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
    return `
      <div class="goal-card">
        <div class="goal-top">
          <div><div class="goal-name">${escapeHtml(goal.name)}</div><div class="goal-meta">${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</div></div>
          <div class="tx-amount income">${formatNumber(progress, 0)}%</div>
        </div>
        <div class="goal-progress"><div class="goal-track"><div class="goal-fill" style="width:${progress}%;background:${goal.accent}"></div></div></div>
        <div class="goal-stats">
          <div>${text("goalProgress")}<strong>${moneyInline(goal.saved, false)}</strong></div>
          <div style="text-align:right">${text("goalTargetLabel")}<strong>${moneyInline(goal.target, false)}</strong></div>
        </div>
        <div class="goal-actions" style="margin-top:14px">
          <button class="goal-chip" onclick="openGoalAdjust('${goal.id}')">${text("topUpGoal")}</button>
          <button class="goal-chip" onclick="openGoalEdit('${goal.id}')">${text("editGoal")}</button>
          <button class="goal-chip danger" onclick="removeGoal('${goal.id}')">${text("delete")}</button>
        </div>
      </div>
    `;
  }).join("") : `<div class="empty-state"><strong>${text("noGoalsTitle")}</strong><span>${text("noGoalsCopy")}</span><button class="btn btn-primary" onclick="openGoalCreate()">${text("addFirstGoal")}</button></div>`;

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("goalsEyebrow")}</div>
        <div class="page-title">${text("goalsTitle")}</div>
        <div class="page-subtitle">${text("goalsCopy")}</div>
      </div>
      <section class="goal-summary-card panel reveal" style="--delay:0">
        <strong>${text("goalsTitle")}</strong>
        <div class="goal-summary-grid">
          <div class="metric-card"><div class="metric-label">${text("totalSaved")}</div><div class="metric-value income">${moneyInline(totalSaved, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("totalTarget")}</div><div class="metric-value">${moneyInline(totalTarget, false)}</div></div>
        </div>
        <div class="hint">${text("nearestGoal")}: ${nearest ? escapeHtml(nearest.name) + " · " + formatNumber(Math.min(100, (nearest.saved / nearest.target) * 100), 0) + "%" : "—"}</div>
        <div class="button-row" style="margin-top:16px"><button class="btn btn-primary" onclick="openGoalCreate()">${text("addGoal")}</button></div>
      </section>
      ${editor}
      ${adjustGoal}
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("navGoals")}</div></div>
        ${goalsList}
      </section>
    </div>
  `;
}

function renderSettings() {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      <section class="section reveal" style="--delay:2">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" onclick="refreshRatesFromNBRB()">${text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
}

function updateDesktopRail() {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const setup = setupSteps();
  const overCount = categoryBudgetsForMonth(viewMonth).filter((item) => item.over).length;
  const nearest = goals.length ? [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0] : null;
  const firstAlert = overCount
    ? text("insightOverCopy", { count: String(overCount) })
    : budgetTotal() !== 100
      ? text("insightBudgetWarnCopy", { total: formatNumber(budgetTotal(), 0) })
      : text("insightHealthyCopy");

  document.getElementById("rail-kicker").textContent = "";
  document.getElementById("rail-title").textContent = formatMonthLabel(viewMonth);
  document.getElementById("rail-copy").textContent = text("appSub");
  document.getElementById("rail-month-label").textContent = text("balanceLabel");
  document.getElementById("rail-balance").innerHTML = moneyInline(balance, true);
  document.getElementById("rail-balance-copy").textContent =
    currentPage === "add" ? text("addCopy")
    : currentPage === "history" ? text("historyTitle")
    : currentPage === "goals" ? text("goalsCopy")
    : currentPage === "settings" ? text("settingsCopy")
    : text("appSub");
  document.getElementById("rail-income-label").textContent = text("incomeLabel");
  document.getElementById("rail-expense-label").textContent = text("expenseLabel");
  document.getElementById("rail-income").innerHTML = moneyInline(income, false);
  document.getElementById("rail-expense").innerHTML = moneyInline(expense, false);
  document.getElementById("rail-points-title").textContent = text("issuesLabel");
  document.getElementById("rail-points").innerHTML = `
    <div class="rail-point">
      <div class="rail-point-dot">1</div>
      <div><strong>${text("issuesLabel")}</strong><span>${escapeHtml(firstAlert)}</span></div>
    </div>
    <div class="rail-point">
      <div class="rail-point-dot">2</div>
      <div><strong>${text("setupTitle")}</strong><span>${setup.filter((step) => step.done).length}/${setup.length} · ${escapeHtml(shouldShowSetupCard() ? text("setupCopy") : text("setupDoneCopy"))}</span></div>
    </div>
    <div class="rail-point">
      <div class="rail-point-dot">3</div>
      <div><strong>${text("goalsTitle")}</strong><span>${escapeHtml(nearest ? nearest.name + " · " + formatNumber(Math.min(100, (nearest.saved / nearest.target) * 100), 0) + "%" : text("noGoalsCopy"))}</span></div>
    </div>
  `;
}

function moneyInline(value, withSign) {
  const sign = withSign ? (value > 0 ? "+" : value < 0 ? "-" : "") : "";
  const digits = Math.abs(value % 1) > 0 ? 2 : 0;
  return `
    <span class="money-inline">
      <span class="money-amount">${sign}${formatNumber(Math.abs(value), digits)}</span>
      <span class="money-code money-code-byn" aria-label="BYN"><i class="byn">BYN</i></span>
    </span>
  `;
}

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const historyFilters = `
    <div class="history-filter-sheet">
      <div class="field">
        <label class="label">${text("filterType")}</label>
        <select class="select" onchange="setHistoryTypeFilter(this.value)">
          <option value="all" ${historyTypeFilter === "all" ? "selected" : ""}>${text("allTypes")}</option>
          <option value="expense" ${historyTypeFilter === "expense" ? "selected" : ""}>${text("expensesOnly")}</option>
          <option value="income" ${historyTypeFilter === "income" ? "selected" : ""}>${text("incomeOnly")}</option>
        </select>
      </div>
      <div class="field">
        <label class="label">${text("filterCategory")}</label>
        <select class="select" onchange="setHistoryCategoryFilter(this.value)">
          <option value="all" ${historyCategoryFilter === "all" ? "selected" : ""}>${text("allCategories")}</option>
          ${getCategories().map((category) => `<option value="${category.id}" ${historyCategoryFilter === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
        </select>
      </div>
    </div>
  `;

  const historyContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : `<div class="empty-state"><strong>${text("emptyHistoryTitle")}</strong><span>${text("emptyHistoryCopy")}</span></div>`;

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyAnalyticsTab")} и ${text("historyListTab").toLowerCase()} теперь собраны в один мобильный поток.</div>
      </div>
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">‹</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">›</button>
          </div>
          <div class="page-tabs page-tabs-mobile">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${historyFilters}
          <section class="section section-tight">${historyContent}</section>
        ` : analyticsContent}
      </section>
    </div>
  `;
}

function renderAdd() {
  const amountValue = Number(txDraft.amount);
  const previewValue = Number.isFinite(amountValue) ? Math.abs(amountValue) : 0;

  return `
    <div class="page page-add">
      <section class="add-hero-card panel reveal" style="--delay:0">
        <div class="add-hero-top">
          <div>
            <div class="eyebrow">${text("addEyebrow")}</div>
            <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
          </div>
          <div class="add-mode-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
        </div>
        <div class="page-subtitle">${text("addCopy")}</div>
        <div class="add-amount-preview ${txDraft.type === "income" ? "income" : "expense"}">${moneyInline(previewValue, false)}</div>
        <div class="field add-quick-field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented add-type-switch">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field add-quick-field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
      </section>
      <section class="composer-sheet panel reveal" style="--delay:1">
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input input-amount" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row chip-row-categories">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value)">
        </div>
        <div class="composer-actions">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
}

function formatStatusTime() {
  return new Intl.DateTimeFormat(localeCode(), {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function chromeTitle() {
  if (currentPage === "home") return formatMonthLabel(viewMonth);
  if (currentPage === "history") return text("historyTitle");
  if (currentPage === "add") return editingTxId ? text("addTitleEdit") : text("addTitleNew");
  if (currentPage === "goals") return text("goalsTitle");
  return text("settingsTitle");
}

function chromeSubtitle() {
  if (currentPage === "home") {
    return text("balanceLabel") + " / " + formatMonthLabel(viewMonth);
  }
  if (currentPage === "history") {
    return text("historyAnalyticsTab") + " / " + formatMonthLabel(viewMonth);
  }
  if (currentPage === "add") {
    return txDraft && txDraft.type === "income" ? text("incomeType") : text("expenseType");
  }
  if (currentPage === "goals") {
    return goals.length ? String(goals.length) + " / " + text("navGoals") : text("goalsEyebrow");
  }
  return settings && settings.ratesUpdatedAt
    ? text("ratesUpdatedLabel") + ": " + formatRateDate(settings.ratesUpdatedAt)
    : text("settingsEyebrow");
}

function updateAppChrome() {
  const timeEl = document.getElementById("status-time");
  const kickerEl = document.getElementById("app-toolbar-kicker");
  const titleEl = document.getElementById("app-toolbar-title");
  const subtitleEl = document.getElementById("app-toolbar-subtitle");

  document.body.dataset.page = currentPage;
  if (goalEditorMode || adjustGoalId) {
    document.body.dataset.goalSheet = "open";
  } else {
    delete document.body.dataset.goalSheet;
  }
  if (!timeEl || !kickerEl || !titleEl || !subtitleEl) return;
  timeEl.textContent = formatStatusTime();
  kickerEl.textContent = "";
  titleEl.textContent = chromeTitle();
  subtitleEl.textContent = chromeSubtitle();
}

function renderOverlay() {
  const root = document.getElementById("overlay-root");
  const shouldShow = forceOnboarding || (!onboardingSeen && transactions.length === 0 && goals.length === 0);
  if (!shouldShow) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-kicker">${text("onboardingKicker")}</div>
        <div class="modal-title">${text("onboardingTitle")}</div>
        <div class="modal-copy">${text("onboardingCopy")}</div>
        <div class="step-grid">
          <div class="step-card">
            <div class="step-index">1</div>
            <strong>${text("onboardingStep1Title")}</strong>
            <span>${text("onboardingStep1Copy")}</span>
          </div>
          <div class="step-card">
            <div class="step-index">2</div>
            <strong>${text("onboardingStep2Title")}</strong>
            <span>${text("onboardingStep2Copy")}</span>
          </div>
          <div class="step-card">
            <div class="step-index">3</div>
            <strong>${text("onboardingStep3Title")}</strong>
            <span>${text("onboardingStep3Copy")}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="startOnboardingFlow()">${text("onboardingPrimary")}</button>
          <button class="btn btn-secondary" onclick="loadDemoData()">${text("onboardingDemo")}</button>
          <button class="btn btn-ghost" onclick="dismissOnboarding()">${text("onboardingLater")}</button>
        </div>
      </div>
    </div>
  `;
}

function render() {
  syncLanguage();
  applyNavText();
  updateActiveNav();
  updateAppChrome();
  const screen = document.getElementById("screen");
  if (currentPage === "home") screen.innerHTML = renderHome();
  else if (currentPage === "history") screen.innerHTML = renderHistory();
  else if (currentPage === "add") screen.innerHTML = renderAdd();
  else if (currentPage === "goals") screen.innerHTML = renderGoals();
  else screen.innerHTML = renderSettings();
  renderOverlay();
}

function renderTransactionItem(tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "рџ’ё" : category.icon;
  return `
    <button class="tx-button" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "var(--green-soft)" : category.soft};color:${tx.type === "income" ? "var(--green)" : "var(--text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">
          ${escapeHtml(label)} · ${tx.date}
          ${tx.recurringId ? ` <span class="tx-pill">${text("recurringSourceBadge")}</span>` : ""}
        </div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "в€’"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
}

function renderStatusStack(page) {
  const cards = [];
  const fromFileProtocol = typeof location !== "undefined" && location.protocol === "file:";

  if (!isOnline) {
    cards.push({
      tone: "offline",
      title: text("noInternetTitle"),
      copy: text("noInternetCopy"),
    });
  }

  if (page === "settings") {
    if (fromFileProtocol && !settings.ratesUpdatedAt) {
      cards.push({
        tone: "warning",
        title: text("ratesFileProtocolTitle"),
        copy: text("ratesFileProtocolCopy"),
      });
    } else if (ratesUiState.lastError && ratesUiState.lastError !== "offline") {
      cards.push({
        tone: "danger",
        title: text("ratesErrorTitle"),
        copy: text("ratesErrorCopy"),
      });
    } else if (!settings.ratesUpdatedAt) {
      cards.push({
        tone: "warning",
        title: text("ratesNeverUpdatedTitle"),
        copy: text("ratesNeverUpdatedCopy"),
      });
    } else if (!isOnline) {
      cards.push({
        tone: "warning",
        title: text("ratesOfflineTitle"),
        copy: text("ratesOfflineCopy"),
      });
    }
  }

  if (!cards.length) return "";

  return `
    <div class="status-stack">
      ${cards.map((card) => `
        <div class="status-card ${card.tone}">
          <strong>${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.copy)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHistoryEmptyState(monthly, filtered, mode) {
  if (!monthly.length) {
    return `
      <div class="empty-state empty-state-strong">
        <strong>${text("emptyMonthTitle")}</strong>
        <span>${text("emptyMonthCopy")}</span>
        <button class="btn btn-primary" onclick="startCreateTx('expense')">${text("emptyMonthAction")}</button>
      </div>
    `;
  }

  if (!filtered.length) {
    return `
      <div class="empty-state">
        <strong>${text("emptyHistoryTitle")}</strong>
        <span>${text("emptyHistoryCopy")}</span>
        <button class="btn btn-secondary" onclick="resetHistoryFilters()">${text("resetFilters")}</button>
      </div>
    `;
  }

  if (mode === "calendar") {
    return `
      <div class="empty-state">
        <strong>${text("emptyCalendarDayTitle")}</strong>
        <span>${text("emptyCalendarDayCopy")}</span>
      </div>
    `;
  }

  return "";
}

function renderHistoryFilters(options) {
  const opts = options || {};
  return `
    <div class="history-filter-block">
      <div class="section-head section-head-compact">
        <div class="section-title">${text("historyFiltersTitle")}</div>
        ${historyActiveFiltersCount() ? `<button class="link-button" onclick="resetHistoryFilters()">${text("resetFilters")}</button>` : ""}
      </div>
      <div class="field">
        <label class="label">${text("filterSearch")}</label>
        <input class="input history-search" type="search" placeholder="${escapeHtml(text("filterSearchPlaceholder"))}" value="${escapeHtml(historySearchQuery)}" oninput="setHistorySearchQuery(this.value)">
      </div>
      <div class="history-filter-grid">
        <div class="field">
          <label class="label">${text("filterType")}</label>
          <select class="select" onchange="setHistoryTypeFilter(this.value)">
            <option value="all" ${historyTypeFilter === "all" ? "selected" : ""}>${text("allTypes")}</option>
            <option value="expense" ${historyTypeFilter === "expense" ? "selected" : ""}>${text("expensesOnly")}</option>
            <option value="income" ${historyTypeFilter === "income" ? "selected" : ""}>${text("incomeOnly")}</option>
          </select>
        </div>
        <div class="field">
          <label class="label">${text("filterCategory")}</label>
          <select class="select" onchange="setHistoryCategoryFilter(this.value)">
            <option value="all" ${historyCategoryFilter === "all" ? "selected" : ""}>${text("allCategories")}</option>
            ${getCategories().map((category) => `<option value="${category.id}" ${historyCategoryFilter === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
          </select>
        </div>
        ${opts.hideDate ? "" : `
          <div class="field">
            <label class="label">${text("filterDate")}</label>
            <input class="input" type="date" value="${escapeHtml(historyDateFilter)}" oninput="setHistoryDateFilter(this.value)">
          </div>
        `}
        <div class="field">
          <label class="label">${text("filterMinAmount")}</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(historyAmountMin)}" oninput="setHistoryAmountMin(this.value)">
        </div>
        <div class="field">
          <label class="label">${text("filterMaxAmount")}</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(historyAmountMax)}" oninput="setHistoryAmountMax(this.value)">
        </div>
      </div>
    </div>
  `;
}

function renderHistoryCalendar(monthly) {
  const filtered = filteredCalendarTransactions();

  if (!monthly.length) {
    return renderHistoryEmptyState(monthly, filtered, "calendar");
  }

  if (!filtered.length) {
    return `
      ${renderHistoryFilters({ hideDate: true })}
      ${renderHistoryEmptyState(monthly, filtered, "list")}
    `;
  }

  const [year, month] = viewMonth.split("-").map(Number);
  const totalDays = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const availableDates = [...new Set(filtered.map((tx) => tx.date))].sort();
  const activeDate = availableDates.includes(historySelectedDate) ? historySelectedDate : availableDates[0];
  historySelectedDate = activeDate;
  const dayList = filtered.filter((tx) => tx.date === activeDate);
  const dayIncome = dayList.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
  const dayExpense = dayList.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
  const cells = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(`<div class="calendar-day calendar-day-empty" aria-hidden="true"></div>`);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const iso = buildRecurringDate(viewMonth, day);
    const items = filtered.filter((tx) => tx.date === iso);
    const expense = items.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    const income = items.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const total = income - expense;
    const hasItems = items.length > 0;
    cells.push(`
      <button class="calendar-day ${hasItems ? "has-items" : ""} ${activeDate === iso ? "active" : ""}" onclick="selectHistoryDate('${iso}')">
        <span class="calendar-day-number">${day}</span>
        <span class="calendar-day-meta ${total < 0 ? "expense" : income > 0 ? "income" : ""}">
          ${hasItems ? (expense > 0 ? "−" + formatNumber(expense, 0) : "+" + formatNumber(income, 0)) : "·"}
        </span>
      </button>
    `);
  }

  return `
    ${renderHistoryFilters({ hideDate: true })}
    <section class="section section-tight">
      <div class="calendar-card">
        <div class="calendar-weekdays">
          ${text("weekdaysShort").map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
        </div>
        <div class="calendar-grid">${cells.join("")}</div>
      </div>
    </section>
    <section class="section section-tight">
      <div class="calendar-detail panel">
        <div class="calendar-detail-head">
          <div>
            <div class="section-title">${text("calendarDayEntries")}</div>
            <div class="calendar-detail-date">${formatDateLabel(activeDate)}</div>
          </div>
          <div class="calendar-detail-total">${text("calendarDayTotal")}: ${moneyInline(dayIncome - dayExpense, true)}</div>
        </div>
        <div class="calendar-day-stats">
          <div class="metric-card"><div class="metric-label">${text("calendarDayIncome")}</div><div class="metric-value income">${moneyInline(dayIncome, false)}</div></div>
          <div class="metric-card"><div class="metric-label">${text("calendarDayExpense")}</div><div class="metric-value expense">${moneyInline(dayExpense, false)}</div></div>
        </div>
        ${dayList.length ? renderTransactionGroups(dayList, false) : renderHistoryEmptyState(monthly, filtered, "calendar")}
      </div>
    </section>
  `;
}

function renderRecurringSection() {
  const recurringList = recurring.length
    ? recurring.map((rule) => `
      <div class="recurring-item ${rule.active ? "" : "paused"}">
        <div class="recurring-item-copy">
          <div class="recurring-topline">
            <strong>${escapeHtml(rule.desc)}</strong>
            <span class="status-pill ${rule.active ? "active" : "paused"}">${recurringStatusLabel(rule)}</span>
          </div>
          <div class="recurring-meta">${escapeHtml(recurringTemplateLabel(rule.template))} · ${text("recurringEveryMonth")} ${rule.day}</div>
          <div class="recurring-meta">${rule.type === "income" ? text("incomeLabel") : categoryName(rule.cat)} · ${moneyInline(rule.amount, false)}</div>
        </div>
        <div class="recurring-actions">
          <button class="goal-chip" onclick="toggleRecurringActive('${rule.id}')">${rule.active ? text("recurringPaused") : text("recurringActive")}</button>
          <button class="goal-chip danger" onclick="deleteRecurring('${rule.id}')">${text("delete")}</button>
        </div>
      </div>
    `).join("")
    : `
      <div class="empty-state">
        <strong>${text("recurringEmptyTitle")}</strong>
        <span>${text("recurringEmptyCopy")}</span>
        <button class="btn btn-secondary" onclick="startCreateRecurring('expense')">${text("recurringAdd")}</button>
      </div>
    `;

  return `
    <section class="section reveal" style="--delay:2">
      <div class="section-head">
        <div class="section-title">${text("recurringTitle")}</div>
        <button class="link-button" onclick="startCreateRecurring('expense')">${text("recurringAdd")}</button>
      </div>
      <div class="setting-card">
        <div class="setting-copy">${text("recurringCopy")}</div>
        <div class="recurring-list">${recurringList}</div>
      </div>
    </section>
  `;
}

function renderHistory() {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const expensesOnly = monthly.filter((tx) => tx.type === "expense");
  const averageExpense = expensesOnly.length ? expense / expensesOnly.length : 0;
  const onTrack = budgets.filter((item) => !item.over).length;
  const resultsMeta = historyActiveFiltersCount() ? `${historyActiveFiltersCount()} / ${text("historyFiltersTitle").toLowerCase()}` : formatMonthLabel(viewMonth);

  const historyOverview = monthly.length ? `
    <div class="history-summary history-summary-mobile">
      <div class="metric-card"><div class="metric-label">${text("incomeLabel")}</div><div class="metric-value income">${moneyInline(income, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("expenseLabel")}</div><div class="metric-value expense">${moneyInline(expense, false)}</div></div>
      <div class="metric-card"><div class="metric-label">${text("remainderLabel")}</div><div class="metric-value">${moneyInline(balance, false)}</div></div>
    </div>
  ` : "";

  const listContent = filtered.length
    ? renderTransactionGroups(filtered, true)
    : renderHistoryEmptyState(monthly, filtered, "list");

  const analyticsContent = monthly.length
    ? `
      ${historyOverview}
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("historyAnalyticsTab")}</div></div>
        <div class="setting-card analytics-card">
          <div class="setting-row"><div><div class="setting-title">${text("biggestCategory")}</div><div class="setting-copy">${topCategory ? escapeHtml(topCategory.name) : "—"}</div></div><div class="tx-amount expense">${topCategory ? moneyInline(topCategory.spent, false) : "—"}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("averageExpense")}</div><div class="setting-copy">${text("expensesOnly")}</div></div><div class="tx-amount">${moneyInline(averageExpense, false)}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("operationsCount")}</div><div class="setting-copy">${formatMonthLabel(viewMonth)}</div></div><div class="tx-amount">${monthly.length}</div></div>
          <div class="setting-row"><div><div class="setting-title">${text("categoriesOnTrack")}</div><div class="setting-copy">${text("budgetTitle")}</div></div><div class="tx-amount income">${onTrack}/${budgets.length}</div></div>
        </div>
      </section>
      <section class="section section-tight">
        <div class="section-head"><div class="section-title">${text("budgetTitle")}</div></div>
        <div class="setting-card analytics-card">
          ${budgets.map((category) => `
            <div class="stat-row">
              <div class="stat-line">
                <div class="stat-name">${category.icon} ${escapeHtml(category.name)}</div>
                <div class="stat-track"><div class="stat-fill" style="width:${Math.min(100, category.progress)}%;background:${category.over ? "var(--red)" : category.color}"></div></div>
                <div class="stat-value">${moneyInline(category.spent, false)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page page-history">
      <div class="page-head page-head-compact">
        <div class="eyebrow">${text("historyEyebrow")}</div>
        <div class="page-title">${text("historyTitle")}</div>
        <div class="page-subtitle">${text("historyAnalyticsTab")} и ${text("historyListTab").toLowerCase()} теперь собраны в один мобильный поток.</div>
      </div>
      ${renderStatusStack("history")}
      <div class="history-top-stack reveal" style="--delay:0">
        <div class="history-switcher-card panel">
          <div class="month-switch history-month-switch">
            <button class="month-button" onclick="changeMonth(-1)">&lsaquo;</button>
            <div class="month-label"><strong>${formatMonthLabel(viewMonth)}</strong><span>${viewMonth}</span></div>
            <button class="month-button" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
          <div class="page-tabs page-tabs-mobile page-tabs-triple">
            <button class="tab-button ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="tab-button ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
            <button class="tab-button ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('calendar')">${text("historyCalendarTab")}</button>
          </div>
        </div>
      </div>
      <section class="history-sheet panel reveal" style="--delay:1">
        ${historyMode === "list" ? `
          ${historyOverview}
          ${renderHistoryFilters()}
          <div class="filter-summary-bar"><strong>${text("resultsFound")}: ${filtered.length}</strong><span>${resultsMeta}</span></div>
          <section class="section section-tight">${listContent}</section>
        ` : historyMode === "calendar" ? renderHistoryCalendar(monthly) : analyticsContent}
      </section>
    </div>
  `;
}

function renderAdd() {
  const amountValue = Number(txDraft.amount);
  const previewValue = Number.isFinite(amountValue) ? Math.abs(amountValue) : 0;
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;

  return `
    <div class="page page-add">
      <section class="add-hero-card panel reveal" style="--delay:0">
        <div class="add-hero-top">
          <div>
            <div class="eyebrow">${text("addEyebrow")}</div>
            <div class="page-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
          </div>
          <div class="add-mode-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
        </div>
        <div class="page-subtitle">${text("addCopy")}</div>
        <div class="add-amount-preview ${txDraft.type === "income" ? "income" : "expense"}">${moneyInline(previewValue, false)}</div>
        <div class="field add-quick-field">
          <label class="label">${text("typeLabel")}</label>
          <div class="segmented add-type-switch">
            <button class="segment ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="segment ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
        </div>
        <div class="field add-quick-field">
          <label class="label">${text("quickAmountsLabel")}</label>
          <div class="chip-row">
            ${quickAmountPresets().map((amount) => `<button class="chip-button ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">${amount}</button>`).join("")}
          </div>
        </div>
      </section>
      <section class="composer-sheet panel reveal" style="--delay:1">
        <div class="field">
          <label class="label">${text("amountLabel")}</label>
          <input class="input input-amount" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)">
        </div>
        ${txDraft.type === "expense" ? `
          <div class="field">
            <label class="label">${text("quickCategoriesLabel")}</label>
            <div class="chip-row chip-row-categories">
              ${getCategories().map((category) => `<button class="chip-button ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">${escapeHtml(category.icon + " " + category.name)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label class="label">${text("categoryLabel")}</label>
            <select class="select" onchange="updateTxDraft('cat', this.value)">
              ${getCategories().map((category) => `<option value="${category.id}" ${txDraft.cat === category.id ? "selected" : ""}>${escapeHtml(category.icon + " " + category.name)}</option>`).join("")}
            </select>
          </div>
        ` : ""}
        <div class="field">
          <label class="label">${text("descriptionLabel")}</label>
          <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
        </div>
        <div class="field">
          <label class="label">${text("dateLabel")}</label>
          <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
        </div>
        ${canConfigureRecurring ? `
          <div class="recurring-inline-card">
            <div class="setting-row recurring-inline-row">
              <div>
                <div class="setting-title">${text("recurringLabel")}</div>
                <div class="setting-copy">${text("recurringHint")}</div>
              </div>
              <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" onclick="toggleTxRecurring()" aria-pressed="${txDraft.recurringEnabled ? "true" : "false"}"><span></span></button>
            </div>
            ${txDraft.recurringEnabled ? `
              <div class="history-filter-grid recurring-inline-grid">
                <div class="field">
                  <label class="label">${text("recurringTemplateLabel")}</label>
                  <select class="select" onchange="setRecurringTemplate(this.value)">
                    ${RECURRING_TEMPLATES.map((template) => `<option value="${template}" ${txDraft.recurringTemplate === template ? "selected" : ""}>${text("recurringTemplate" + template.charAt(0).toUpperCase() + template.slice(1))}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label class="label">${text("recurringDayLabel")}</label>
                  <input class="input" type="number" min="1" max="31" value="${escapeHtml(String(txDraft.recurringDay || Number(String(txDraft.date).slice(8, 10))))}" oninput="updateTxDraft('recurringDay', this.value)">
                </div>
              </div>
            ` : ""}
          </div>
        ` : `
          <div class="status-card info inline-status">
            <strong>${text("recurringSourceBadge")}</strong>
            <span>${text("recurringManageHint")}</span>
          </div>
        `}
        <div class="composer-actions">
          <button class="btn btn-primary" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <button class="btn btn-ghost" onclick="cancelTxEdit()">${text("cancel")}</button>
          ${editingTxId ? `<button class="btn btn-danger" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
        </div>
      </section>
    </div>
  `;
}

function renderSettings() {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="converter-row">
      <div><div class="converter-code">${code}</div><div class="converter-name">${text("currencies")[code]}</div></div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page">
      <div class="page-head">
        <div class="eyebrow">${text("settingsEyebrow")}</div>
        <div class="page-title">${text("settingsTitle")}</div>
        <div class="page-subtitle">${text("settingsCopy")}</div>
      </div>
      ${renderStatusStack("settings")}
      <section class="section reveal" style="--delay:0">
        <div class="section-head"><div class="section-title">${text("languageLabel")}</div></div>
        <div class="setting-card">
          <div class="lang-grid">
            <button class="lang-button ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="lang-button ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:1">
        <div class="section-head"><div class="section-title">${text("budgetSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("budgetSettingsCopy")}</div>
          ${getCategories().map((category) => `
            <div class="setting-row">
              <div><div class="setting-title">${category.icon} ${escapeHtml(category.name)}</div><div class="setting-copy">${text("planned")}</div></div>
              <div style="display:flex;align-items:center;gap:8px"><input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)"><span class="tx-meta">%</span></div>
            </div>
          `).join("")}
          <div class="budget-total ${total === 100 ? "ok" : "warn"}">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </div>
      </section>
      ${renderRecurringSection()}
      <section class="section reveal" style="--delay:3">
        <div class="section-head"><div class="section-title">${text("rateSettingsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-copy">${text("rateSettingsCopy")}</div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesSourceLabel")}</div>
              <div class="setting-copy">${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</div>
            </div>
            <button class="btn btn-secondary" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-title">${text("ratesUpdatedLabel")}</div>
              <div class="setting-copy">${formatRateDate(settings.ratesUpdatedAt)}</div>
            </div>
            <div class="tx-amount">BYN</div>
          </div>
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="setting-row">
              <div>
                <div class="setting-title">${settings.rates[code].scale} ${code} = BYN</div>
                <div class="setting-copy">${text("currencies")[code]}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <input class="setting-input" type="number" step="1" value="${formatNumber(settings.rates[code].scale, 0)}" onchange="updateRate('${code}', 'scale', this.value)">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="section reveal" style="--delay:4">
        <div class="section-head"><div class="section-title">${text("toolsLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-title">${text("converterLabel")}</div>
          <div class="setting-copy">${text("toolHint")}</div>
          <div class="converter-currencies" style="margin-top:14px">${currencies.map((code) => `<button class="currency-pill ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="converter-display">
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
            <div class="converter-caption">${text("converterFrom")}: ${text("currencies")[convFrom]}</div>
          </div>
          <div class="converter-results">${converterResults}</div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-ghost" onclick="openOnboardingGuide()">${text("replayGuide")}</button>
          </div>
        </div>
      </section>
      <section class="section reveal" style="--delay:5">
        <div class="section-head"><div class="section-title">${text("dataLabel")}</div></div>
        <div class="setting-card">
          <div class="setting-row">
            <div><div class="setting-title">${text("baseCurrencyLabel")}</div><div class="setting-copy">${text("baseCurrencyCopy")}</div></div>
            <div class="tx-amount">BYN</div>
          </div>
          <div class="button-row" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="exportData()">${text("exportData")}</button>
            <button class="btn btn-secondary" onclick="triggerImport()">${text("importData")}</button>
            <button class="btn btn-danger" onclick="resetAllData()">${text("resetData")}</button>
          </div>
          <div class="hint">${text("resetCopy")}</div>
        </div>
      </section>
    </div>
  `;
}

function loadDemoData() {
  const demo = createDemoData();
  transactions = demo.transactions;
  goals = demo.goals;
  recurring = migrateRecurring(demo.recurring || []);
  saveTransactions();
  saveGoals();
  saveRecurring();
  dismissOnboarding();
  currentPage = "home";
  ensureRecurringTransactions(viewMonth);
  showToast(text("toastDemoLoaded"));
  render();
}

function setupConnectivity() {
  if (setupConnectivity.bound) return;
  setupConnectivity.bound = true;

  window.addEventListener("online", () => {
    isOnline = true;
    ratesUiState.lastError = null;
    showToast(text("toastOnline"));
    render();
    if (shouldRefreshRates()) refreshRatesFromNBRB();
  });

  window.addEventListener("offline", () => {
    isOnline = false;
    showToast(text("toastOffline"));
    render();
  });
}

function render() {
  ensureRecurringTransactions(viewMonth);
  syncLanguage();
  applyNavText();
  updateActiveNav();
  updateAppChrome();
  const screen = document.getElementById("screen");
  if (currentPage === "home") screen.innerHTML = renderHome();
  else if (currentPage === "history") screen.innerHTML = renderHistory();
  else if (currentPage === "add") screen.innerHTML = renderAdd();
  else if (currentPage === "goals") screen.innerHTML = renderGoals();
  else screen.innerHTML = renderSettings();
  renderOverlay();
  saveAppSession();
}

function init() {
  settings = migrateSettings(load(STORAGE.settings, null));
  transactions = migrateTransactions(load(STORAGE.transactions, load("txs", [])));
  goals = migrateGoals(load(STORAGE.goals, null), load("envs", []));
  recurring = migrateRecurring(load(STORAGE.recurring, null));
  txDraft = createEmptyTxDraft("expense");
  goalDraft = createEmptyGoalDraft();
  restoreAppSession(load(STORAGE.session, null));
  syncLanguage();
  setupConnectivity();
  setupAppPersistence();
  setupRatesAutoRefresh();
  ensureRecurringTransactions(viewMonth);
  render();
  updateAppChrome();
  clearInterval(init.chromeTimer);
  init.chromeTimer = setInterval(updateAppChrome, 60000);
  document.addEventListener("visibilitychange", () => {
    updateAppChrome();
    if (document.visibilityState === "visible" && isOnline && shouldRefreshRates()) refreshRatesFromNBRB({ silent: true });
  });
  if (shouldRefreshRates() && isOnline) refreshRatesFromNBRB({ silent: true });
}

init();

// renderHistory is defined in app-overrides.js
