let photoHistoryFiltersOpen = false;

function photoText(key, vars) {
  const dict = {
    ru: {
      homeSection: "Обзор месяца",
      homeLead: "Личный бюджет, цели и быстрый контроль месяца",
      homeTotalLabel: "Общий счет",
      homeOverviewLabel: "Обзор месяца",
      homeGoalLabel: "Цель на месяц",
      homeGoalFallback: "Добавь первую цель, чтобы видеть прогресс месяца.",
      homeBannerTitle: "Планируй деньги спокойно и вовремя.",
      homeBudgetLabel: "Категории месяца",
      historySection: "Операции и аналитика",
      historyLead: "Аналитика и история теперь собраны в одном мобильном потоке.",
      historyListHeading: "Транзакции",
      historyFiltersToggle: "Поиск и фильтры",
      historyCalendarShortcut: "Календарь",
      historyAnalyticsStack: "Сводка месяца",
      addSection: "Быстрый ввод",
      addLead: "Короткий ввод: сумма, категория, дата и при желании короткая заметка.",
      addCategoriesLabel: "Категория",
      addMoreLabel: "Дополнительно",
      goalsSection: "Накопления",
      goalsLead: "Тут живут только реальные накопления: одна цель, понятный прогресс и быстрые пополнения.",
      goalsSummaryTitle: "Цели и накопления",
      goalsStickyButton: "Новая цель",
      settingsSection: "Правила и данные",
      settingsLead: "Тут настраиваются язык, бюджет по категориям, курсы валют и работа с данными.",
      languageCardTitle: "Язык",
      budgetCardTitle: "Настройка бюджета",
      ratesCardTitle: "Курсы валют",
      toolsCardTitle: "Инструменты",
      dataCardTitle: "Данные",
      ratesUpdatedShort: "Обновлено",
      fallbackSettingsCopy: "Экран настроек перерисован в безопасном режиме.",
      fallbackPageCopy: "Экран не удалось открыть. Попробуй обновить страницу.",
      fallbackErrorLabel: "Ошибка рендера",
    },
    be: {
      homeSection: "Агляд месяца",
      homeLead: "асабісты бюджэт, мэты і хуткі кантроль месяца",
      homeTotalLabel: "Агульны рахунак",
      homeOverviewLabel: "Агляд месяца",
      homeGoalLabel: "Мэта на месяц",
      homeGoalFallback: "Дадай першую мэту, каб бачыць прагрэс месяца.",
      homeBannerTitle: "Будуйце сваю будучыню сёння.",
      homeBudgetLabel: "Катэгорыі месяца",
      historySection: "Аперацыі і аналітыка",
      historyLead: "Аналітыка і гісторыя цяпер сабраны ў адзін мабільны паток.",
      historyListHeading: "Транзакцыі",
      historyFiltersToggle: "Пошук і фільтры",
      historyCalendarShortcut: "Каляндар",
      historyAnalyticsStack: "Агляд месяца",
      addSection: "Хуткі ўвод",
      addLead: "Робіце ўвод кароткім: сума, катэгорыя, дата і пры жаданні кароткая заўвага.",
      addCategoriesLabel: "Катэгорыя",
      addMoreLabel: "Дадаткова",
      goalsSection: "Назапашванні",
      goalsLead: "Тут жывуць толькі рэальныя назапашванні: адна мэта, зразумелы прагрэс і хуткія папаўненні.",
      goalsSummaryTitle: "Мэты і назапашванні",
      goalsStickyButton: "Новая мэта",
      settingsSection: "Правілы і даныя",
      settingsLead: "Тут наладжваюцца мова, працэнты бюджэту, ручныя курсы і праца з данымі.",
      languageCardTitle: "Мова",
      budgetCardTitle: "Размеркаванне бюджэту",
      ratesCardTitle: "Курсы валют",
      toolsCardTitle: "Інструменты",
      dataCardTitle: "Даныя",
      ratesUpdatedShort: "Абноўлена",
      fallbackSettingsCopy: "Экран налад перамаляваны ў бяспечным рэжыме.",
      fallbackPageCopy: "Экран не атрымалася адкрыць. Паспрабуй абнавіць старонку.",
      fallbackErrorLabel: "Памылка рэндэру",
    },
    en: {
      homeSection: "Month overview",
      homeLead: "Personal budget, goals and quick monthly control.",
      homeTotalLabel: "Total account",
      homeOverviewLabel: "Month overview",
      homeGoalLabel: "Goal for this month",
      homeGoalFallback: "Add your first goal to track monthly progress.",
      homeBannerTitle: "Build your financial future today.",
      homeBudgetLabel: "Month categories",
      historySection: "Operations and analytics",
      historyLead: "Analytics and history are gathered in one mobile flow.",
      historyListHeading: "Transactions",
      historyFiltersToggle: "Search and filters",
      historyCalendarShortcut: "Calendar",
      historyAnalyticsStack: "Month summary",
      addSection: "Quick entry",
      addLead: "Short flow: amount, category, date and optional note.",
      addCategoriesLabel: "Category",
      addMoreLabel: "More",
      goalsSection: "Savings",
      goalsLead: "This is where your real savings goals live.",
      goalsSummaryTitle: "Goals and savings",
      goalsStickyButton: "New goal",
      settingsSection: "Rules and data",
      settingsLead: "Language, budget, exchange rates and app data.",
      languageCardTitle: "Language",
      budgetCardTitle: "Budget setup",
      ratesCardTitle: "Exchange rates",
      toolsCardTitle: "Tools",
      dataCardTitle: "Data",
      ratesUpdatedShort: "Updated",
      fallbackSettingsCopy: "Settings screen was redrawn in safe mode.",
      fallbackPageCopy: "This screen failed to load. Try refreshing the page.",
      fallbackErrorLabel: "Render error",
      monthOverview: "Month overview",
      monthGoal: "Goal for this month",
      totalAccount: "Total account",
      progress: "Progress",
      buildFuture: "Build your financial future today.",
      transactionsHeading: "Transactions",
      openAll: "See all",
      filters: "Filters",
      calendar: "Calendar",
      quickNote: "Add a note...",
      quickGoal: "New goal",
      today: "Today",
      yesterday: "Yesterday",
      emptyDayTitle: "No transactions for this day",
      emptyDayCopy: "A calm day is also a good result.",
      menu: "Menu",
      close: "Close",
      extra: "Extra",
      themeBrand: text("appName"),
      goalTotal: "Total target",
    },
  };
  let value = (dict[lang] || dict.ru)[key] ?? dict.ru[key];
  if (value === undefined) {
    console.warn(`[photoText] missing key: "${key}"`);
    value = key;
  }
  if (vars && typeof value === "string") {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replace(new RegExp("\\{" + name + "\\}", "g"), replacement);
    }
  }
  return value;
}

function photoTimeLabel() {
  return typeof formatStatusTime === "function" ? formatStatusTime() : "23:57";
}

function photoStatusBar() {
  return `
    <div class="photo-status-bar">
      <div>${photoTimeLabel()}</div>
      <div class="photo-status-right">
        <span class="photo-signal"><i></i><i></i><i></i><i></i></span>
        <span class="photo-network">5G</span>
        <span class="photo-battery"><span></span></span>
      </div>
    </div>
  `;
}

function photoTopChrome(config) {
  return `
    <div class="photo-top">
      ${photoStatusBar()}
      <div class="photo-brand-row">
        <div class="photo-brand-copy">
          <div class="photo-app-mini-title">${escapeHtml(config.miniTitle || "")}</div>
          <div class="photo-app-mini-subtitle">${escapeHtml(config.miniSubtitle || "")}</div>
        </div>
        <div class="photo-island"></div>
      </div>
      <div class="photo-section-kicker">${escapeHtml(config.section || "")}</div>
      <h1 class="photo-display-title ${config.compact ? "compact" : ""}">${escapeHtml(config.displayTitle || "")}</h1>
      ${config.lead ? `<p class="photo-lead">${escapeHtml(config.lead)}</p>` : ""}
    </div>
  `;
}

function photoMonthSwitch(extraActionsHtml) {
  return `
    <section class="photo-panel">
      <div class="photo-month-switch ${extraActionsHtml ? "with-actions" : ""}">
        <button class="photo-month-btn" onclick="changeMonth(-1)">&lsaquo;</button>
        <div class="photo-month-label">
          <strong>${formatMonthLabel(viewMonth)}</strong>
          <span>${viewMonth}</span>
        </div>
        ${extraActionsHtml || `<button class="photo-month-btn" onclick="changeMonth(1)">&rsaquo;</button>`}
      </div>
    </section>
  `;
}

function photoMetricCard(label, value, tone) {
  return `
    <div class="photo-mini-card">
      <div class="photo-metric-title">${escapeHtml(label)}</div>
      <div class="photo-metric-value ${tone || ""}">${value}</div>
    </div>
  `;
}

function txCurrencyVisual(code, mode) {
  const currency = transactionCurrencyCode(code);
  const symbols = {
    USD: "$",
    EUR: "€",
    RUB: "₽",
  };
  const className = mode === "chip" ? "ref-currency-chip-label" : "ref-add-amount-code-label";
  if (currency === "BYN") {
    return `<span class="${className} is-byn"><i class="byn">BYN</i></span>`;
  }
  return `<span class="${className} is-symbol">${escapeHtml(symbols[currency] || currency)}</span>`;
}

function photoBudgetRows(budgets) {
  return budgets.map((category) => `
    <div class="photo-setting-row">
      <div class="photo-setting-copy">
        <strong>${escapeHtml(category.icon + " " + category.name)}</strong>
        <span>${text("planned")}</span>
      </div>
      <div class="tx-amount ${category.over ? "expense" : ""}">${moneyInline(category.spent, false)}</div>
    </div>
  `).join("");
}

function togglePhotoHistoryFilters() {
  photoHistoryFiltersOpen = !photoHistoryFiltersOpen;
  render();
}

function photoHistoryActions() {
  const calendarActive = historyMode === "calendar";
  const filtersActive = photoHistoryFiltersOpen || historyActiveFiltersCount() > 0;
  return `
    <div class="photo-segmented">
      <button class="photo-segment-btn ${historyMode === "list" ? "active" : ""}" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
      <button class="photo-segment-btn ${historyMode === "analytics" ? "active" : ""}" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
      <div class="photo-icon-row">
        <button class="photo-icon-chip ${calendarActive ? "active" : ""}" onclick="setHistoryMode('${calendarActive ? "list" : "calendar"}')" title="${photoText("historyCalendarShortcut")}">#</button>
        <button class="photo-icon-chip ${filtersActive ? "active" : ""}" onclick="togglePhotoHistoryFilters()" title="${photoText("historyFiltersToggle")}">&#9906;</button>
      </div>
    </div>
  `;
}

function photoHistoryFiltersBlock() {
  if (!photoHistoryFiltersOpen && historyActiveFiltersCount() === 0) return "";
  return `<section class="photo-filter-panel photo-panel">${renderHistoryFilters()}</section>`;
}

function photoTxMarkup(tx) {
  const category = CATEGORY_META.find((item) => item.id === tx.cat) || CATEGORY_META[0];
  const label = tx.type === "income" ? text("incomeLabel") : categoryName(tx.cat);
  const icon = tx.type === "income" ? "$" : category.icon;
  const time = refTxTime(tx);
  const originalMeta = transactionCurrencyCode(tx.currency) !== "BYN"
    ? ` · ${currencyCompactValue(tx.originalAmount ?? tx.amount, tx.currency)}`
    : "";
  return `
    <button class="tx-button photo-tx-row" onclick="startEditTx('${tx.id}')">
      <div class="tx-icon" style="background:${tx.type === "income" ? "rgba(216,255,73,0.12)" : category.soft};color:${tx.type === "income" ? "var(--photo-lime)" : "var(--photo-text)"}">${icon}</div>
      <div class="tx-copy">
        <strong>${escapeHtml(tx.desc || label)}</strong>
        <div class="tx-meta">${escapeHtml(label + originalMeta)}</div>
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "-"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-time">${escapeHtml(time || tx.date)}</div>
      </div>
    </button>
  `;
}

renderTransactionItem = function (tx) {
  return photoTxMarkup(tx);
};

renderHome = function () {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const budgets = categoryBudgetsForMonth(viewMonth);
  const nearestGoal = goals.length ? [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0] : null;
  const budgetFocus = budgets.filter((item) => item.planned > 0).sort((a, b) => b.spent - a.spent).slice(0, 3);
  const goalProgress = nearestGoal && nearestGoal.target > 0 ? Math.min(100, (nearestGoal.saved / nearestGoal.target) * 100) : 0;
  const progress = income > 0 ? Math.min(100, Math.max(8, (Math.max(balance, 0) / income) * 100)) : Math.min(100, Math.max(8, goalProgress));

  return `
    <div class="page photo-page photo-home">
      ${photoTopChrome({
        miniTitle: formatMonthLabel(viewMonth),
        miniSubtitle: `${text("balanceLabel")} / ${formatMonthLabel(viewMonth)}`,
        section: photoText("homeSection"),
        displayTitle: formatMonthLabel(viewMonth),
        lead: photoText("homeLead"),
      })}
      ${photoMonthSwitch()}
      ${renderStatusStack("home")}
      <section class="photo-panel photo-hero-panel">
        <div class="photo-card-label">${photoText("homeTotalLabel")}</div>
        <div class="photo-hero-amount ${balance < 0 ? "expense" : ""}">${moneyInline(balance, false)}</div>
        <div class="photo-hero-foot">${text("remainderLabel")}: ${moneyInline(balance, true)}</div>
        <div class="photo-progress"><span style="width:${progress}%"></span></div>
      </section>
      <section class="photo-section">
        <div class="photo-section-title">${photoText("homeOverviewLabel")}</div>
        <div class="photo-grid-2">
          ${photoMetricCard(text("incomeLabel"), moneyInline(income, false), "income")}
          ${photoMetricCard(text("expenseLabel"), moneyInline(expense, false), "expense")}
        </div>
      </section>
      <section class="photo-panel photo-goal-panel">
        <div class="photo-card-label">${photoText("homeGoalLabel")}</div>
        ${nearestGoal ? `
          <div class="photo-goal-head">
            <div>
              <strong>${escapeHtml(nearestGoal.name)}</strong>
              <div class="photo-goal-copy">${text("goalRemaining")}: ${moneyInline(Math.max(0, nearestGoal.target - nearestGoal.saved), false)}</div>
            </div>
            <div class="photo-goal-percent">${formatNumber(goalProgress, 0)}%</div>
          </div>
          <div class="photo-progress"><span style="width:${goalProgress}%;background:${nearestGoal.accent}"></span></div>
          <div class="photo-goal-meta">
            <span>${text("goalProgress")}: ${moneyInline(nearestGoal.saved, false)}</span>
            <span>${text("goalTargetLabel")}: ${moneyInline(nearestGoal.target, false)}</span>
          </div>
        ` : `
          <div class="photo-summary-copy">${photoText("homeGoalFallback")}</div>
          <div class="photo-sticky-action" style="position:static;padding-top:12px;background:none"><button class="photo-sticky-btn" onclick="showPage('goals');openGoalCreate();">${text("addGoal")}</button></div>
        `}
      </section>
      <section class="photo-panel">
        <div class="photo-section-title">${photoText("homeBudgetLabel")}</div>
        ${photoBudgetRows(budgetFocus.length ? budgetFocus : budgets.slice(0, 3))}
      </section>
      ${renderSmartInsightsSection(viewMonth, 0)}
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

  const analyticsContent = monthly.length
    ? `
      <section class="photo-panel photo-analytics-stack">
        <div class="photo-panel-title">${photoText("historyAnalyticsStack")}</div>
        <div class="photo-setting-row">
          <div class="photo-setting-copy">
            <strong>${text("incomeLabel")}</strong>
            <span>${formatMonthLabel(viewMonth)}</span>
          </div>
          <div class="tx-amount income">${moneyInline(income, false)}</div>
        </div>
        <div class="photo-setting-row">
          <div class="photo-setting-copy">
            <strong>${text("expenseLabel")}</strong>
            <span>${formatMonthLabel(viewMonth)}</span>
          </div>
          <div class="tx-amount expense">${moneyInline(expense, false)}</div>
        </div>
        <div class="photo-setting-row">
          <div class="photo-setting-copy">
            <strong>${text("remainderLabel")}</strong>
            <span>${topCategory ? escapeHtml(topCategory.name) : formatMonthLabel(viewMonth)}</span>
          </div>
          <div class="tx-amount">${moneyInline(balance, false)}</div>
        </div>
        <div class="photo-setting-row">
          <div class="photo-setting-copy">
            <strong>${text("averageExpense")}</strong>
            <span>${text("expensesOnly")}</span>
          </div>
          <div class="tx-amount">${moneyInline(averageExpense, false)}</div>
        </div>
      </section>
      ${renderTrendSection(viewMonth)}
      ${renderDailyAllowanceSection(viewMonth, 2)}
      ${renderSmartInsightsSection(viewMonth, 3)}
    `
    : `<div class="empty-state"><strong>${text("analyticsEmptyTitle")}</strong><span>${text("analyticsEmptyCopy")}</span></div>`;

  return `
    <div class="page photo-page photo-history">
      ${photoTopChrome({
        miniTitle: text("historyTitle"),
        miniSubtitle: `${text("historyAnalyticsTab")} / ${formatMonthLabel(viewMonth)}`,
        section: photoText("historySection"),
        displayTitle: text("historyTitle"),
        lead: photoText("historyLead"),
        compact: true,
      })}
      <section class="photo-panel photo-switch-panel">
        <div class="photo-month-switch with-actions">
          <button class="photo-month-btn" onclick="changeMonth(-1)">&lsaquo;</button>
          <div class="photo-month-label">
            <strong>${formatMonthLabel(viewMonth)}</strong>
            <span>${viewMonth}</span>
          </div>
          <div class="photo-icon-row">
            <button class="photo-icon-chip ${historyMode === "calendar" ? "active" : ""}" onclick="setHistoryMode('${historyMode === "calendar" ? "list" : "calendar"}')" title="${photoText("historyCalendarShortcut")}">#</button>
            <button class="photo-month-btn" onclick="changeMonth(1)">&rsaquo;</button>
          </div>
        </div>
        ${photoHistoryActions()}
      </section>
      ${renderStatusStack("history")}
      ${historyMode === "list" ? `
        <section class="photo-grid-2">
          ${photoMetricCard(text("incomeLabel"), moneyInline(income, false), "income")}
          ${photoMetricCard(text("expenseLabel"), moneyInline(expense, false), "expense")}
        </section>
        <section class="photo-section">
          <div class="photo-history-head">
            <strong>${photoText("historyListHeading")}</strong>
            <button class="photo-filter-toggle ${photoHistoryFiltersOpen || historyActiveFiltersCount() ? "active" : ""}" onclick="togglePhotoHistoryFilters()">${photoText("historyFiltersToggle")}</button>
          </div>
          ${photoHistoryFiltersBlock()}
          <section class="photo-panel photo-list-panel">
            ${filtered.length ? renderTransactionGroups(filtered, true) : renderHistoryEmptyState(monthly, filtered, "list")}
          </section>
        </section>
      ` : historyMode === "calendar" ? `
        <section class="photo-panel">${renderHistoryCalendar(monthly)}</section>
      ` : analyticsContent}
    </div>
  `;
};

renderAdd = function () {
  const categories = getCategories();
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;

  return `
    <div class="page photo-page photo-add">
      ${photoTopChrome({
        miniTitle: editingTxId ? text("addTitleEdit") : text("addTitleNew"),
        miniSubtitle: txDraft.type === "income" ? text("incomeType") : text("expenseType"),
        section: photoText("addSection"),
        displayTitle: editingTxId ? text("addTitleEdit") : text("addTitleNew"),
        lead: photoText("addLead"),
        compact: true,
      })}
      <div class="photo-add-shell">
        <section class="photo-panel">
          <div class="photo-card-head">
            <div>
              <div class="photo-card-label">${text("amountLabel")}</div>
              <div class="photo-panel-title">${editingTxId ? text("addTitleEdit") : text("addTitleNew")}</div>
            </div>
            <div class="photo-type-badge ${txDraft.type === "income" ? "income" : "expense"}">${txDraft.type === "income" ? text("incomeType") : text("expenseType")}</div>
          </div>
          <div class="photo-amount-input-wrap">
            <input class="photo-amount-input ${txDraft.type === "expense" ? "expense" : "income"}" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(txDraft.amount)}" oninput="updateTxDraft('amount', this.value)" placeholder="0">
            <span class="photo-amount-code"><i class="byn">BYN</i></span>
          </div>
          <div class="photo-segmented no-extra" style="margin-top:18px">
            <button class="photo-segment-btn ${txDraft.type === "expense" ? "active" : ""}" onclick="setTxType('expense')">${text("expenseType")}</button>
            <button class="photo-segment-btn ${txDraft.type === "income" ? "active" : ""}" onclick="setTxType('income')">${text("incomeType")}</button>
          </div>
          <div class="photo-chip-row">
            ${quickAmountPresets().map((amount) => `<button class="photo-chip ${String(amount) === String(txDraft.amount) ? "active" : ""}" onclick="setQuickAmount(${amount})">+${amount}</button>`).join("")}
          </div>
        </section>
        ${txDraft.type === "expense" ? `
          <section class="photo-panel">
            <div class="photo-history-head" style="margin-bottom:16px">
              <strong>${photoText("addCategoriesLabel")}</strong>
            </div>
            <div class="photo-category-grid">
              ${categories.map((category) => `
                <button class="photo-category-btn ${txDraft.cat === category.id ? "active" : ""}" onclick="setDraftCategory('${category.id}')">
                  <strong>${category.icon}</strong>
                  <span>${escapeHtml(category.name)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        ` : ""}
        <section class="photo-panel">
          <div class="photo-card-label">${photoText("addMoreLabel")}</div>
          <div class="photo-fields-grid">
            <div class="field">
              <label class="label">${text("dateLabel")}</label>
              <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
            </div>
            <div class="field">
              <label class="label">${text("descriptionLabel")}</label>
              <input class="input" type="text" placeholder="${escapeHtml(text("descriptionPlaceholder"))}" value="${escapeHtml(txDraft.desc)}" oninput="updateTxDraft('desc', this.value)">
            </div>
          </div>
          ${canConfigureRecurring ? `
            <div class="photo-advanced-toggle">
              <div>
                <div class="photo-card-label" style="margin-bottom:6px">${text("recurringLabel")}</div>
                <div class="photo-summary-copy">${text("recurringHint")}</div>
              </div>
              <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" onclick="toggleTxRecurring()" aria-pressed="${txDraft.recurringEnabled ? "true" : "false"}"><span></span></button>
            </div>
            ${txDraft.recurringEnabled ? `
              <div class="photo-fields-grid">
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
          ` : `
            <div class="photo-summary-copy" style="margin-top:16px">${text("recurringManageHint")}</div>
          `}
        </section>
        <div class="photo-save-bar">
          <button class="photo-save-btn" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
          <div class="photo-chip-row" style="margin-top:10px">
            <button class="photo-chip" onclick="cancelTxEdit()">${text("cancel")}</button>
            ${editingTxId ? `<button class="photo-chip" style="color:var(--photo-red)" onclick="deleteEditingTx()">${text("delete")}</button>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;
};

renderGoals = function () {
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const nearest = goals.length ? [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0] : null;

  const editor = goalEditorMode ? `
    <div class="stage3-sheet-backdrop" onclick="cancelGoalEditor()"></div>
    <div class="inline-form panel stage3-sheet-card">
      <div class="stage3-sheet-grabber"></div>
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
    <div class="stage3-sheet-backdrop" onclick="cancelGoalAdjust()"></div>
    <div class="inline-form panel stage3-sheet-card">
      <div class="stage3-sheet-grabber"></div>
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
      <div class="photo-goal-card">
        <div class="photo-goal-row">
          <div>
            <div class="photo-goal-title">${escapeHtml(goal.name)}</div>
            <div class="photo-goal-sub">${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</div>
          </div>
          <div class="photo-goal-percent">${formatNumber(progress, 0)}%</div>
        </div>
        <div class="photo-progress"><span style="width:${progress}%;background:${goal.accent}"></span></div>
        <div class="photo-goal-meta">
          <span>${text("goalProgress")}: ${moneyInline(goal.saved, false)}</span>
          <span>${text("goalTargetLabel")}: ${moneyInline(goal.target, false)}</span>
        </div>
        <div class="photo-goal-actions">
          <button class="photo-goal-chip" onclick="openGoalAdjust('${goal.id}')">${text("topUpGoal")}</button>
          <button class="photo-goal-chip" onclick="openGoalEdit('${goal.id}')">${text("editGoal")}</button>
          <button class="photo-goal-chip danger" onclick="removeGoal('${goal.id}')">${text("delete")}</button>
        </div>
      </div>
    `;
  }).join("") : `<div class="empty-state"><strong>${text("noGoalsTitle")}</strong><span>${text("noGoalsCopy")}</span></div>`;

  return `
    <div class="page photo-page photo-goals">
      ${photoTopChrome({
        miniTitle: text("goalsTitle"),
        miniSubtitle: `${goals.length} / ${text("navGoals")}`,
        section: photoText("goalsSection"),
        displayTitle: text("goalsTitle"),
        lead: photoText("goalsLead"),
        compact: true,
      })}
      ${renderStatusStack("goals")}
      <div class="photo-goals-stack">
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("goalsSummaryTitle")}</div>
          <div class="photo-grid-2" style="margin-top:16px">
            ${photoMetricCard(text("totalSaved"), moneyInline(totalSaved, false), "income")}
            ${photoMetricCard(text("totalTarget"), moneyInline(totalTarget, false), "")}
          </div>
          <div class="photo-summary-copy">${text("nearestGoal")}: ${nearest ? escapeHtml(nearest.name) : "-"}</div>
          <div class="photo-sticky-action" style="position:static;padding-top:14px;background:none">
            <button class="photo-sticky-btn" onclick="openGoalCreate()">${photoText("goalsStickyButton")}</button>
          </div>
        </section>
        <section>${goalsList}</section>
      </div>
      ${editor}
      ${adjustGoal}
      <div class="photo-sticky-action">
        <button class="photo-sticky-btn" onclick="openGoalCreate()">${photoText("goalsStickyButton")}</button>
      </div>
    </div>
  `;
};

renderSettings = function () {
  const total = budgetTotal();
  const converterAmount = Number(convAmount || 0);
  const currencies = ["BYN", "EUR", "USD", "RUB"];
  const converterResults = currencies.filter((code) => code !== convFrom).map((code) => `
    <div class="photo-setting-row">
      <div class="photo-setting-copy">
        <strong>${code}</strong>
        <span>${text("currencies")[code]}</span>
      </div>
      <div class="converter-value">${currencyValue(convertCurrency(convFrom, code, converterAmount || 0), code)}</div>
    </div>
  `).join("");

  return `
    <div class="page photo-page photo-settings">
      ${photoTopChrome({
        miniTitle: text("settingsTitle"),
        miniSubtitle: `${photoText("ratesUpdatedShort")} ${formatRateDate(settings.ratesUpdatedAt)}`,
        section: photoText("settingsSection"),
        displayTitle: text("settingsTitle"),
        lead: photoText("settingsLead"),
        compact: true,
      })}
      ${renderStatusStack("settings")}
      <div class="photo-settings-stack">
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("languageCardTitle")}</div>
          <div class="photo-language-segment" style="margin-top:16px">
            <button class="photo-lang-btn ${lang === "ru" ? "active" : ""}" onclick="setLang('ru')">Русский</button>
            <button class="photo-lang-btn ${lang === "be" ? "active" : ""}" onclick="setLang('be')">Беларуская</button>
          </div>
        </section>
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("budgetCardTitle")}</div>
          <div class="photo-summary-copy">${text("budgetSettingsCopy")}</div>
          <div style="margin-top:14px">
            ${getCategories().map((category) => `
              <div class="photo-budget-row">
                <div class="photo-budget-copy">
                  <strong>${category.icon} ${escapeHtml(category.name)}</strong>
                  <span>${text("planned")}</span>
                </div>
                <div class="photo-budget-input">
                  <input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)">
                  <span class="tx-meta">%</span>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="hint" style="margin-top:12px">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
        </section>
        <div class="photo-recurring-wrap">${renderRecurringSection()}</div>
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("ratesCardTitle")}</div>
          <div style="margin-top:14px">
            <div class="photo-setting-row">
              <div class="photo-setting-copy">
                <strong>${text("ratesSourceLabel")}</strong>
                <span>${settings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual")}</span>
              </div>
              <button class="photo-filter-toggle" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
            </div>
            ${["USD", "EUR", "RUB"].map((code) => `
              <div class="photo-setting-row">
                <div class="photo-setting-copy">
                  <strong>${settings.rates[code].scale} ${code} = BYN</strong>
                  <span>${text("currencies")[code]}</span>
                </div>
                <div class="photo-budget-input">
                  <input class="setting-input" type="number" step="0.0001" value="${formatNumber(settings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
                </div>
              </div>
            `).join("")}
          </div>
        </section>
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("toolsCardTitle")}</div>
          <div class="photo-chip-row">${currencies.map((code) => `<button class="photo-chip ${convFrom === code ? "active" : ""}" onclick="setConverterFrom('${code}')">${code}</button>`).join("")}</div>
          <div class="field" style="margin-top:16px">
            <label class="label">${text("converterLabel")}</label>
            <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(convAmount)}" oninput="updateConverterAmount(this.value);render();">
          </div>
          <div style="margin-top:14px">${converterResults}</div>
        </section>
        <section class="photo-panel">
          <div class="photo-panel-title">${photoText("dataCardTitle")}</div>
          <div class="photo-summary-copy">${text("baseCurrencyCopy")}</div>
          <div class="photo-chip-row" style="margin-top:16px">
            <button class="photo-chip" onclick="exportData()">${text("exportData")}</button>
            <button class="photo-chip" onclick="triggerImport()">${text("importData")}</button>
            <button class="photo-chip" style="color:var(--photo-red)" onclick="resetAllData()">${text("resetData")}</button>
          </div>
        </section>
      </div>
    </div>
  `;
};

function refText(key) {
  const dict = {
    ru: {
      monthOverview: "Обзор месяца",
      monthGoal: "Цель на месяц",
      totalAccount: "Общий счет",
      progress: "Прогресс",
      buildFuture: "Строй свое финансовое завтра.",
      transactionsHeading: "Транзакции",
      openAll: "Показать все",
      filters: "Фильтры",
      calendar: "Календарь",
      quickNote: "Добавить заметку...",
      quickGoal: "Новая цель",
      today: "Сегодня",
      yesterday: "Вчера",
      emptyDayTitle: "Нет операций за этот день",
      emptyDayCopy: "Спокойный день тоже считается хорошим результатом.",
      settingsLead: "Язык, бюджет, курсы и данные приложения.",
      menu: "Меню",
      close: "Закрыть",
      tools: "Инструменты",
      extra: "Дополнительно",
      themeBrand: text("appName"),
      goalTotal: "Суммарная цель",
    },
    be: {
      monthOverview: "Агляд месяца",
      monthGoal: "Мэта на месяц",
      totalAccount: "Агульны рахунак",
      progress: "Прагрэс",
      buildFuture: "Будуйце сваю будучыню сёння.",
      transactionsHeading: "Транзакцыі",
      openAll: "Глядзець усё",
      filters: "Фільтры",
      calendar: "Каляндар",
      quickNote: "Дадаць нататку...",
      quickGoal: "Новая мэта",
      today: "Сёння",
      yesterday: "Учора",
      emptyDayTitle: "Няма транзакцый за гэты дзень",
      emptyDayCopy: "Спакойны дзень таксама добры вынік.",
      settingsLead: "Мова, бюджэт, курсы і дадзеныя праграмы.",
      menu: "Меню",
      close: "Закрыць",
      tools: "Інструменты",
      extra: "Дадаткова",
      themeBrand: text("appName"),
      goalTotal: "Сумарная мэта",
    },
  };

  return (dict[lang] || dict.ru)[key] || dict.ru[key] || key;
}

function refIcon(name) {
  const icons = {
    menu: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <path d="M5 7h14"></path>
        <path d="M5 12h14"></path>
        <path d="M5 17h14"></path>
      </svg>
    `,
    close: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <path d="M6 6l12 12"></path>
        <path d="M18 6l-12 12"></path>
      </svg>
    `,
    grid: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="4" width="6" height="6" rx="1.5"></rect>
        <rect x="14" y="4" width="6" height="6" rx="1.5"></rect>
        <rect x="4" y="14" width="6" height="6" rx="1.5"></rect>
        <rect x="14" y="14" width="6" height="6" rx="1.5"></rect>
      </svg>
    `,
    chart: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M6 15l4-4 3 3 5-6"></path>
        <path d="M5 19h14"></path>
      </svg>
    `,
    coin: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="7"></circle>
        <path d="M9.5 10.5c0-1 1-1.75 2.5-1.75s2.5.75 2.5 1.75-1 1.5-2.5 1.75-2.5.75-2.5 1.75 1 1.75 2.5 1.75 2.5-.75 2.5-1.75"></path>
      </svg>
    `,
  };

  return icons[name] || icons.menu;
}

function refTopbarButton(icon, onclick, title, active) {
  return `
    <button class="ref-topbar-btn ${active ? "active" : ""}" type="button" onclick="${onclick || "void(0)"}" aria-label="${escapeHtml(title || "")}">
      ${refIcon(icon)}
    </button>
  `;
}

function refAvatar() {
  return `
    <div class="ref-avatar" aria-hidden="true">
      <div class="ref-avatar-core"></div>
    </div>
  `;
}

function refTopbar(config) {
  const titleClass = config.brand ? "ref-topbar-title brand" : "ref-topbar-title";
  const leftIcon = config.leftIcon || "";
  const leftAction = config.leftAction || "void(0)";
  const rightButtons = (config.rightButtons || []).map((button) =>
    refTopbarButton(button.icon, button.onclick, button.title, button.active)
  ).join("");
  const leftButton = leftIcon ? refTopbarButton(leftIcon, leftAction, config.leftTitle || refText(leftIcon)) : "";
  const showAvatar = Boolean(config.avatar);
  const rightSide = rightButtons || showAvatar
    ? `
      <div class="ref-topbar-right">
        ${rightButtons}
        ${showAvatar ? refAvatar() : ""}
      </div>
    `
    : "";

  return `
    <header class="ref-topbar">
      <div class="ref-topbar-left">
        ${leftButton}
        <div class="${titleClass}">${escapeHtml(config.title || "")}</div>
      </div>
      ${rightSide}
    </header>
  `;
}

function refSplitTitle(value) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return escapeHtml(String(value || ""));
  return `${escapeHtml(words[0])}<br>${escapeHtml(words.slice(1).join(" "))}`;
}

function refMonthPillParts(ym) {
  const [year, month] = String(ym).split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const parts = new Intl.DateTimeFormat(localeCode(), {
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const monthPart = parts.filter((part) => part.type === "month").map((part) => part.value).join("").trim();
  const yearPart = parts.filter((part) => part.type === "year").map((part) => part.value).join("").trim();
  return {
    month: monthPart,
    year: lang === "en" ? yearPart : `${yearPart} г.`,
  };
}

function refMonthPill() {
  const monthParts = refMonthPillParts(viewMonth);
  return `
    <div class="ref-month-pill">
      <button type="button" onclick="changeMonth(-1)">&lsaquo;</button>
      <span class="ref-month-pill-copy">
        <strong>${escapeHtml(monthParts.month)}</strong>
        <small>${escapeHtml(monthParts.year)}</small>
      </span>
      <button type="button" onclick="changeMonth(1)">&rsaquo;</button>
    </div>
  `;
}

function refGoalCategoryHint() {
  if (lang === "be") return "Аперацыя ў катэгорыі «Мэты» не стварае мэту аўтаматычна.";
  if (lang === "en") return "A transaction in the Goals category does not create a goal automatically.";
  return "Операция в категории «Цели» не создает цель автоматически.";
}

function refMetricMini(label, value, tone, icon) {
  return `
    <div class="ref-mini-stat ${tone || ""}">
      <div class="ref-mini-icon">${icon || refIcon("chart")}</div>
      <div class="ref-mini-label">${escapeHtml(label)}</div>
      <div class="ref-mini-value ${tone || ""}">${value}</div>
    </div>
  `;
}

function refShiftMonth(ym, delta) {
  const [year, month] = String(ym).split("-").map(Number);
  const shifted = new Date(year, month - 1 + delta, 1);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}`;
}

function refShiftDay(iso, delta) {
  const [year, month, day] = String(iso).split("-").map(Number);
  const shifted = new Date(year, month - 1, day + delta);
  return shifted.toISOString().slice(0, 10);
}

function refHistoryDayLabel(iso) {
  const today = isoToday();
  if (iso === today) return refText("today");
  if (iso === refShiftDay(today, -1)) return refText("yesterday");
  return formatDateLabel(iso);
}

function refTxTime(tx) {
  if (!tx.createdAt) return "";
  const stamp = new Date(tx.createdAt);
  if (Number.isNaN(stamp.getTime())) return "";
  return new Intl.DateTimeFormat(localeCode(), {
    hour: "2-digit",
    minute: "2-digit",
  }).format(stamp);
}

function refTransactionGroupsMarkup(items) {
  if (!items.length) {
    return `
      <div class="ref-empty-day">
        <strong>${refText("emptyDayTitle")}</strong>
        <span>${refText("emptyDayCopy")}</span>
      </div>
    `;
  }

  const groups = [];
  for (const tx of items) {
    const group = groups[groups.length - 1];
    if (!group || group.date !== tx.date) {
      groups.push({ date: tx.date, items: [tx] });
    } else {
      group.items.push(tx);
    }
  }

  const today = isoToday();
  const yesterday = refShiftDay(today, -1);
  if (viewMonth === currentMonthValue() && !groups.some((group) => group.date === yesterday)) {
    const insertAt = groups.findIndex((group) => group.date < yesterday);
    const placeholder = { date: yesterday, empty: true, items: [] };
    if (insertAt === -1) groups.push(placeholder);
    else groups.splice(insertAt, 0, placeholder);
  }

  return groups.map((group) => `
    <section class="ref-day-group">
      <div class="ref-day-label">${escapeHtml(refHistoryDayLabel(group.date))}</div>
      ${group.empty
        ? `
          <div class="ref-empty-day">
            <strong>${refText("emptyDayTitle")}</strong>
            <span>${refText("emptyDayCopy")}</span>
          </div>
        `
        : group.items.map((tx) => renderTransactionItem(tx)).join("")}
    </section>
  `).join("");
}

function refDaysInMonth(ym) {
  const [year, month] = String(ym).split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function refDailyAllowance(ym, balance) {
  const currentMonth = currentMonthValue();
  if (ym < currentMonth) return Math.max(0, balance);
  const lastDay = refDaysInMonth(ym);
  const remaining = ym === currentMonth
    ? Math.max(1, lastDay - Number(isoToday().slice(8, 10)) + 1)
    : lastDay;
  return Math.max(0, balance) / remaining;
}

function refAnalyticsMarkup(ym) {
  const income = monthIncome(ym);
  const expense = monthExpenses(ym);
  const balance = income - expense;
  const previousMonth = refShiftMonth(ym, -1);
  const previousExpense = monthExpenses(previousMonth);
  const delta = expense - previousExpense;
  const deltaPct = previousExpense > 0 ? (delta / previousExpense) * 100 : 0;
  const budgets = categoryBudgetsForMonth(ym);
  const topCategory = [...budgets].sort((a, b) => b.spent - a.spent)[0];
  const allowance = refDailyAllowance(ym, balance);
  const overBudget = budgets.filter((item) => item.over).length;

  return `
    <div class="ref-analytics-stack">
      <section class="ref-card ref-analytics-card">
        <div class="ref-card-kicker">${text("historyAnalyticsTab")}</div>
        <div class="ref-analytics-row">
          <span>${text("incomeLabel")}</span>
          <strong class="income">${moneyInline(income, false)}</strong>
        </div>
        <div class="ref-analytics-row">
          <span>${text("expenseLabel")}</span>
          <strong class="expense">${moneyInline(expense, false)}</strong>
        </div>
        <div class="ref-analytics-row">
          <span>${text("remainderLabel")}</span>
          <strong>${moneyInline(balance, false)}</strong>
        </div>
      </section>
      <section class="ref-card ref-analytics-card">
        <div class="ref-card-kicker">${stage2Text("trendTitle")}</div>
        <div class="ref-analytics-note ${delta > 0 ? "expense" : "income"}">
          ${delta === 0
            ? escapeHtml(stage2Text("trendNoPrev"))
            : `${delta > 0 ? "+" : ""}${formatNumber(deltaPct, 0)}% · ${escapeHtml(formatMonthLabel(previousMonth))}`}
        </div>
      </section>
      <section class="ref-card ref-analytics-card">
        <div class="ref-card-kicker">${stage2Text("dailyAllowanceTitle")}</div>
        <div class="ref-analytics-note">${moneyInline(allowance, false)}</div>
      </section>
      <section class="ref-card ref-analytics-card">
        <div class="ref-card-kicker">${stage2Text("smartTitle")}</div>
        <div class="ref-analytics-row">
          <span>${text("biggestCategory")}</span>
          <strong>${topCategory ? escapeHtml(topCategory.name) : "—"}</strong>
        </div>
        <div class="ref-analytics-row">
          <span>${text("categoriesOnTrack")}</span>
          <strong class="${overBudget ? "expense" : "income"}">${budgets.length - overBudget}/${budgets.length}</strong>
        </div>
      </section>
    </div>
  `;
}

function refGoalAccent(goal, index) {
  return goal.accent || ["#d8ff49", "#9fdd56", "#f6d24c", "#6de2ff"][index % 4];
}

function refGoalBadge(index) {
  const glyphs = ["✦", "◉", "✳", "✧"];
  return glyphs[index % glyphs.length];
}

renderHome = function () {
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);
  const balance = income - expense;
  const monthly = monthTransactions(viewMonth);
  const nearestGoal = goals.length
    ? [...goals].sort((a, b) => (a.target - a.saved) - (b.target - b.saved))[0]
    : null;
  const hasGoalCategoryTx = monthly.some((tx) => tx.cat === "goals");
  const goalProgress = nearestGoal && nearestGoal.target > 0
    ? Math.min(100, (nearestGoal.saved / nearestGoal.target) * 100)
    : 0;
  const progress = income > 0
    ? Math.min(100, Math.max(0, (Math.max(balance, 0) / income) * 100))
    : balance > 0
      ? 100
      : 0;

  return `
    <div class="page ref-page ref-home">
      <section class="ref-hero-head">
        <div class="ref-home-month-row">
          ${refMonthPill()}
        </div>
        <div class="ref-hero-copy">
          <h1 class="ref-display">${refSplitTitle(text("balanceLabel"))}</h1>
        </div>
      </section>
      ${renderStatusStack("home")}
      <section class="ref-card ref-balance-card">
        <div class="ref-card-kicker">${refText("totalAccount")}</div>
        <div class="ref-balance-value ${balance < 0 ? "expense" : ""}">${moneyInline(balance, false)}</div>
        <div class="ref-balance-progress"><span style="width:${progress}%"></span></div>
      </section>
      <section class="ref-section-block">
        <div class="ref-section-label">${refText("monthOverview")}</div>
        <div class="ref-overview-grid">
          ${refMetricMini(text("incomeLabel"), moneyInline(income, false), "income", refIcon("chart"))}
          ${refMetricMini(text("expenseLabel"), moneyInline(expense, false), "expense", refIcon("coin"))}
        </div>
      </section>
      <section class="ref-card ref-goal-spotlight">
        <div class="ref-card-kicker">${refText("monthGoal")}</div>
        <div class="ref-goal-row">
          <div class="ref-goal-name ${nearestGoal ? "" : "is-empty"}">${nearestGoal ? escapeHtml(nearestGoal.name) : escapeHtml(text("noGoalsTitle"))}</div>
          <div class="ref-goal-share ${nearestGoal ? "" : "is-empty"}">${nearestGoal ? `${formatNumber(goalProgress, 0)}%` : "—"}</div>
        </div>
        <div class="ref-balance-progress"><span style="width:${goalProgress}%;background:${nearestGoal ? nearestGoal.accent : "var(--photo-lime)"}"></span></div>
        ${nearestGoal ? "" : `<div class="ref-goal-meta-row">${escapeHtml(hasGoalCategoryTx ? refGoalCategoryHint() : text("noGoalsCopy"))}</div>`}
      </section>
    </div>
  `;
};

renderHistory = function () {
  const filtered = filteredHistoryTransactions();
  const monthly = monthTransactions(viewMonth);
  const income = monthIncome(viewMonth);
  const expense = monthExpenses(viewMonth);

  return `
    <div class="page ref-page ref-history">
      <section class="ref-single-head">
        <h1 class="ref-single-title">${escapeHtml(text("historyTitle"))}</h1>
      </section>
      ${renderStatusStack("history")}
      <section class="ref-summary-grid">
        ${refMetricMini(text("incomeLabel"), moneyInline(income, false), "income", refIcon("chart"))}
        ${refMetricMini(text("expenseLabel"), moneyInline(expense, false), "expense", refIcon("coin"))}
      </section>
      <section class="ref-section-block">
        <div class="ref-section-head">
          <div class="ref-section-title">${refText("transactionsHeading")}</div>
          <div class="ref-segment">
            <button class="${historyMode === "list" ? "active" : ""}" type="button" onclick="setHistoryMode('list')">${text("historyListTab")}</button>
            <button class="${historyMode === "analytics" ? "active" : ""}" type="button" onclick="setHistoryMode('analytics')">${text("historyAnalyticsTab")}</button>
          </div>
        </div>
        <div class="ref-inline-actions ref-history-actions">
          <button class="ref-ghost-chip ${photoHistoryFiltersOpen || historyActiveFiltersCount() ? "active" : ""}" type="button" onclick="togglePhotoHistoryFilters()">${refText("filters")}</button>
          <button class="ref-ghost-chip ${historyMode === "calendar" ? "active" : ""}" type="button" onclick="setHistoryMode('${historyMode === "calendar" ? "list" : "calendar"}')">${refText("calendar")}</button>
        </div>
        ${(photoHistoryFiltersOpen || historyActiveFiltersCount()) ? `
          <section class="ref-card ref-filters-card">
            ${renderHistoryFilters()}
            <div class="ref-inline-actions">
              ${historyActiveFiltersCount() ? `<button class="ref-ghost-chip" type="button" onclick="resetHistoryFilters()">${text("resetFilters")}</button>` : ""}
            </div>
          </section>
        ` : ""}
        ${historyMode === "analytics"
          ? refAnalyticsMarkup(viewMonth)
          : historyMode === "calendar"
            ? `<section class="ref-card ref-calendar-shell">${renderHistoryCalendar(monthly)}</section>`
            : refTransactionGroupsMarkup(filtered)}
      </section>
    </div>
  `;
};

renderAdd = function () {
  const categories = getCategories().slice(0, 8);
  const canConfigureRecurring = !editingTxId || !txDraft.recurringLinkedId;
  const selectedCurrency = transactionCurrencyCode(txDraft.currency);
  const enteredAmount = Number(txDraft.amount || 0);
  const baseAmount = enteredAmount > 0 ? baseAmountFromInput(enteredAmount, selectedCurrency) : 0;
  const rateValue = selectedCurrency === "BYN" ? 1 : rateUnitValue(selectedCurrency);
  const currencyNote = selectedCurrency === "BYN"
    ? text("txCurrencyHint")
    : `${text("txCurrencyConverted")}: ${moneyInline(baseAmount, false)} / ${text("txCurrencyRate")}: 1 ${selectedCurrency} = ${moneyInline(rateValue, false)}`;

  return `
    <div class="page ref-page ref-add">
      ${refTopbar({
        title: editingTxId ? text("addTitleEdit") : text("addTitleNew"),
        leftIcon: "close",
        leftAction: editingTxId ? "cancelTxEdit()" : "showPage('home')",
        leftTitle: refText("close"),
      })}
      <section class="ref-card ref-add-card">
        <div class="ref-segment ref-type-segment">
          <button class="${txDraft.type === "expense" ? "active" : ""}" type="button" onclick="setTxType('expense')">${text("expenseType")}</button>
          <button class="${txDraft.type === "income" ? "active" : ""}" type="button" onclick="setTxType('income')">${text("incomeType")}</button>
        </div>
        <div class="ref-amount-label">${text("amountLabel")}</div>
        <div class="ref-add-amount-wrap ${txDraft.type === "expense" ? "expense" : ""}">
          <input
            class="ref-add-amount-input ${txDraft.type === "expense" ? "expense" : ""}"
            type="number"
            inputmode="decimal"
            step="0.01"
            min="0"
            value="${escapeHtml(txDraft.amount)}"
            oninput="updateTxDraft('amount', this.value)"
            placeholder="0"
          >
          <span class="ref-add-amount-code">${txCurrencyVisual(selectedCurrency, "amount")}</span>
        </div>
        <div class="ref-card-kicker ref-currency-kicker">${text("txCurrencyLabel")}</div>
        <div class="ref-currency-row">
          ${TX_CURRENCIES.map((code) => `
            <button class="ref-currency-chip ${selectedCurrency === code ? "active" : ""}" type="button" onclick="setTxCurrency('${code}')">
              ${txCurrencyVisual(code, "chip")}
            </button>
          `).join("")}
        </div>
        <div class="ref-currency-note">${currencyNote}</div>
        <div class="ref-quick-row">
          ${quickAmountPresets().map((amount) => `
            <button class="ref-ghost-chip ${String(amount) === String(txDraft.amount) ? "active" : ""}" type="button" onclick="setQuickAmount(${amount})">+${amount}</button>
          `).join("")}
        </div>
        ${txDraft.type === "expense" ? `
          <div class="ref-category-head">
            <strong>${photoText("addCategoriesLabel")}</strong>
            <span>${refText("openAll")}</span>
          </div>
          <div class="ref-category-grid">
            ${categories.map((category) => `
              <button class="ref-category-tile ${txDraft.cat === category.id ? "active" : ""}" type="button" onclick="setDraftCategory('${category.id}')">
                <strong>${category.icon}</strong>
                <span>${escapeHtml(category.name)}</span>
              </button>
            `).join("")}
          </div>
        ` : ""}
        <div class="ref-note-wrap">
          <input
            type="text"
            class="input"
            placeholder="${escapeHtml(refText("quickNote"))}"
            value="${escapeHtml(txDraft.desc)}"
            oninput="updateTxDraft('desc', this.value)"
          >
        </div>
        <div class="ref-date-row">
          <div class="field">
            <label class="label">${text("dateLabel")}</label>
            <input class="input" type="date" value="${escapeHtml(txDraft.date)}" oninput="updateTxDraft('date', this.value); updateTxDraft('recurringDay', Number(this.value.slice(8, 10) || txDraft.recurringDay || 1))">
          </div>
        </div>
        ${canConfigureRecurring ? `
          <div class="ref-recurring-row">
            <div>
              <div class="ref-card-kicker">${text("recurringLabel")}</div>
              <div class="ref-mini-help">${text("recurringHint")}</div>
            </div>
            <button class="toggle-switch ${txDraft.recurringEnabled ? "active" : ""}" type="button" onclick="toggleTxRecurring()"><span></span></button>
          </div>
        ` : ""}
        ${canConfigureRecurring && txDraft.recurringEnabled ? `
          <div class="ref-recurring-grid">
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
      </section>
      <div class="ref-bottom-cta">
        <button class="ref-primary-btn" type="button" onclick="submitTx()">${editingTxId ? text("updateTx") : text("saveTx")}</button>
      </div>
    </div>
  `;
};

renderGoals = function () {
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalProgress = totalTarget > 0 ? Math.min(100, (totalSaved / totalTarget) * 100) : 0;
  const editingGoal = goalEditorMode === "edit";
  const adjustGoalRecord = adjustGoalId ? goals.find((goal) => goal.id === adjustGoalId) : null;
  const adjustGoalProgress = adjustGoalRecord && adjustGoalRecord.target > 0
    ? Math.min(100, (adjustGoalRecord.saved / adjustGoalRecord.target) * 100)
    : 0;

  const editor = goalEditorMode ? `
    <div class="stage3-sheet-backdrop goal-sheet-backdrop" onclick="cancelGoalEditor()"></div>
    <div class="inline-form panel stage3-sheet-card goal-sheet-card goal-editor-sheet">
      <div class="stage3-sheet-grabber"></div>
      <div class="goal-sheet-head">
        <div>
          <h2 class="goal-sheet-title">${escapeHtml(editingGoal ? (goalDraft.name || text("editGoal")) : text("addGoal"))}</h2>
        </div>
        <button class="goal-sheet-close" type="button" onclick="cancelGoalEditor()" aria-label="${escapeHtml(text("cancel"))}">&times;</button>
      </div>
      <div class="goal-sheet-form">
        <div class="field goal-sheet-field">
          <label class="label">${text("goalNameLabel")}</label>
          <input class="input" type="text" value="${escapeHtml(goalDraft.name)}" oninput="updateGoalDraft('name', this.value)">
        </div>
        <div class="field goal-sheet-field">
          <label class="label">${text("goalTargetLabel")}</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(goalDraft.target)}" oninput="updateGoalDraft('target', this.value)">
        </div>
        <div class="field goal-sheet-field">
          <label class="label">${text("goalSavedLabel")}</label>
          <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(goalDraft.saved)}" oninput="updateGoalDraft('saved', this.value)">
        </div>
      </div>
      <div class="goal-sheet-actions">
        <button class="ref-primary-btn goal-sheet-primary" type="button" onclick="saveGoalRecord()">${editingGoal ? text("updateGoal") : text("saveGoal")}</button>
        <button class="goal-sheet-secondary" type="button" onclick="cancelGoalEditor()">${text("cancel")}</button>
      </div>
    </div>
  ` : "";

  const adjustGoal = adjustGoalId ? `
    <div class="stage3-sheet-backdrop goal-sheet-backdrop" onclick="cancelGoalAdjust()"></div>
    <div class="inline-form panel stage3-sheet-card goal-sheet-card goal-adjust-sheet">
      <div class="stage3-sheet-grabber"></div>
      <div class="goal-sheet-head">
        <div>
          <div class="goal-sheet-kicker">${text("adjustGoalTitle")}</div>
          <h2 class="goal-sheet-title">${escapeHtml(adjustGoalRecord?.name || "")}</h2>
        </div>
        <button class="goal-sheet-close" type="button" onclick="cancelGoalAdjust()" aria-label="${escapeHtml(text("cancel"))}">&times;</button>
      </div>
      <div class="goal-sheet-summary">
        <div class="goal-sheet-summary-line">
          <span>${text("goalProgress")}</span>
          <strong>${moneyInline(adjustGoalRecord?.saved || 0, false)}</strong>
        </div>
        <div class="goal-sheet-summary-line">
          <span>${text("goalTargetLabel")}</span>
          <strong>${moneyInline(adjustGoalRecord?.target || 0, false)}</strong>
        </div>
        <div class="ref-balance-progress"><span style="width:${adjustGoalProgress}%;background:${adjustGoalRecord?.accent || "var(--photo-lime)"}"></span></div>
      </div>
      <div class="field goal-sheet-field">
        <label class="label">${text("adjustAmountLabel")}</label>
        <input class="input" type="number" inputmode="decimal" step="0.01" value="${escapeHtml(adjustGoalAmount)}" oninput="updateGoalAdjust(this.value)">
      </div>
      <div class="goal-sheet-actions">
        <button class="ref-primary-btn goal-sheet-primary" type="button" onclick="applyGoalAdjust(1)">${text("topUpGoal")}</button>
        <button class="goal-sheet-secondary" type="button" onclick="applyGoalAdjust(-1)">${text("withdrawGoal")}</button>
        <button class="goal-sheet-secondary is-ghost" type="button" onclick="cancelGoalAdjust()">${text("cancel")}</button>
      </div>
    </div>
  ` : "";

  const goalsMarkup = goals.length
    ? goals.map((goal, index) => {
        const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
        const accent = refGoalAccent(goal, index);
        return `
          <section class="ref-card ref-goal-card2">
            <div class="ref-goal-card-head">
              <div class="ref-goal-badge" style="color:${accent}">${refGoalBadge(index)}</div>
              <div class="ref-goal-card-copy">
                <strong>${escapeHtml(goal.name)}</strong>
                <span>${text("goalRemaining")}: ${moneyInline(Math.max(0, goal.target - goal.saved), false)}</span>
              </div>
              <div class="ref-goal-status ${progress >= 100 ? "done" : ""}">${progress >= 100 ? "100%" : `${formatNumber(progress, 0)}%`}</div>
            </div>
            <div class="ref-balance-progress"><span style="width:${progress}%;background:${accent}"></span></div>
            <div class="ref-goal-meta-row">
              <span>${moneyInline(goal.saved, false)} / ${moneyInline(goal.target, false)}</span>
            </div>
            <div class="ref-goal-card-actions">
              <button class="ref-mini-chip" type="button" onclick="openGoalAdjust('${goal.id}')">${text("topUpGoal")}</button>
              <button class="ref-mini-chip" type="button" onclick="openGoalEdit('${goal.id}')">${text("editGoal")}</button>
              <button class="ref-mini-chip danger" type="button" onclick="removeGoal('${goal.id}')">${text("delete")}</button>
            </div>
          </section>
        `;
      }).join("")
    : `
      <section class="ref-card ref-goal-card2">
        <div class="ref-empty-day">
          <strong>${text("noGoalsTitle")}</strong>
          <span>${text("noGoalsCopy")}</span>
        </div>
      </section>
    `;

  return `
    <div class="page ref-page ref-goals">
      ${refTopbar({ brand: true })}
      <section class="ref-single-head">
        <h1 class="ref-single-title">${escapeHtml(text("goalsTitle"))}</h1>
      </section>
      ${renderStatusStack("goals")}
      <section class="ref-card ref-goals-hero">
        <div class="ref-goals-total-label">${refText("totalAccount")}</div>
        <div class="ref-goals-total-value">${moneyInline(totalSaved, false)}</div>
        <div class="ref-goals-total-target">${refText("goalTotal")} ${moneyInline(totalTarget, false)}</div>
        <div class="ref-goals-progress-copy">${refText("progress")} ${formatNumber(totalProgress, 1)}%</div>
        <div class="ref-balance-progress"><span style="width:${totalProgress}%"></span></div>
      </section>
      <div class="ref-goals-list">${goalsMarkup}</div>
      ${editor}
      ${adjustGoal}
      <div class="ref-bottom-cta">
        <button class="ref-primary-btn" type="button" onclick="openGoalCreate()">${refText("quickGoal")}</button>
      </div>
    </div>
  `;
};

renderSettings = function () {
  const activeSettings = getActiveSettings();
  const activeTheme = currentTheme();
  const total = budgetTotal();
  const ratesUpdated = activeSettings.ratesUpdatedAt ? formatRateDate(activeSettings.ratesUpdatedAt) : "—";
  const ratesSource = activeSettings.ratesSource === "nbrb" ? text("ratesSourceOfficial") : text("ratesSourceManual");

  return `
      <div class="page ref-page ref-settings">
        <section class="ref-single-head">
          <h1 class="ref-single-title">${escapeHtml(text("settingsTitle"))}</h1>
          <p class="ref-page-copy">${refText("settingsLead")}</p>
        </section>
      ${renderStatusStack("settings")}
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${photoText("languageCardTitle")}</div>
        <div class="ref-settings-pills">
          <button class="ref-ghost-chip ${lang === "ru" ? "active" : ""}" type="button" onclick="setLang('ru')">Русский</button>
          <button class="ref-ghost-chip ${lang === "be" ? "active" : ""}" type="button" onclick="setLang('be')">Беларуская</button>
          <button class="ref-ghost-chip ${lang === "en" ? "active" : ""}" type="button" onclick="setLang('en')">English</button>
        </div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${text("themeLabel")}</div>
        <div class="ref-page-copy">${text("themeCopy")}</div>
        <div class="ref-settings-pills">
          <button class="ref-ghost-chip ${activeTheme === "dark" ? "active" : ""}" type="button" onclick="setTheme('dark')">${text("themeDark")}</button>
          <button class="ref-ghost-chip ${activeTheme === "light" ? "active" : ""}" type="button" onclick="setTheme('light')">${text("themeLight")}</button>
        </div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${photoText("budgetCardTitle")}</div>
        <div class="ref-settings-list">
          ${getCategories().slice(0, 5).map((category) => `
            <div class="ref-settings-row">
              <div class="ref-settings-copy">
                <strong>${category.icon} ${escapeHtml(category.name)}</strong>
                <span>${text("planned")}</span>
              </div>
              <div class="ref-settings-input">
                <input class="setting-input" type="number" step="1" value="${formatNumber(category.budgetPct, 0)}" onchange="updateBudget('${category.id}', this.value)">
                <span>%</span>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="ref-page-copy">${text(total === 100 ? "budgetTotalOk" : "budgetTotalWarn", { total: formatNumber(total, 0) })}</div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${photoText("ratesCardTitle")}</div>
        <div class="ref-page-copy">${text("rateSettingsCopy")}</div>
        <div class="ref-settings-meta">
          <div class="ref-settings-meta-row">
            <span>${text("ratesSourceLabel")}</span>
            <strong>${escapeHtml(ratesSource)}</strong>
          </div>
          <div class="ref-settings-meta-row">
            <span>${text("ratesUpdatedLabel")}</span>
            <strong>${escapeHtml(ratesUpdated)}</strong>
          </div>
        </div>
        <div class="ref-settings-list">
          ${["USD", "EUR", "RUB"].map((code) => `
            <div class="ref-settings-row">
              <div class="ref-settings-copy">
                <strong>${code}</strong>
                <span>${activeSettings.rates[code].scale} ${code} = BYN</span>
              </div>
              <div class="ref-settings-input">
                <input class="setting-input" type="number" step="0.0001" value="${formatNumber(activeSettings.rates[code].officialRate, 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
              </div>
            </div>
          `).join("")}
        </div>
        <div class="ref-inline-actions">
          <button class="ref-primary-inline ${ratesUiState.loading ? "loading" : ""}" type="button" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
        </div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${photoText("dataCardTitle")}</div>
        <div class="ref-inline-actions">
          <button class="ref-ghost-chip" type="button" onclick="exportData()">${text("exportData")}</button>
          <button class="ref-ghost-chip" type="button" onclick="triggerImport()">${text("importData")}</button>
          <button class="ref-ghost-chip danger" type="button" onclick="resetAllData()">${text("resetData")}</button>
        </div>
      </section>
    </div>
  `;
};

function renderSafeSettingsFallback() {
  const activeTheme = currentTheme();
  const safeRates = (settings && settings.rates) ? settings.rates : DEFAULT_SETTINGS.rates;
  const safeUpdated = settings && settings.ratesUpdatedAt ? formatRateDate(settings.ratesUpdatedAt) : "—";
  return `
    <div class="page ref-page ref-settings">
      <section class="ref-single-head">
        <h1 class="ref-single-title">${escapeHtml(text("settingsTitle"))}</h1>
        <p class="ref-page-copy">${photoText("fallbackSettingsCopy")}</p>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${text("languageLabel")}</div>
        <div class="ref-settings-pills">
          <button class="ref-ghost-chip ${lang === "ru" ? "active" : ""}" type="button" onclick="setLang('ru')">Русский</button>
          <button class="ref-ghost-chip ${lang === "be" ? "active" : ""}" type="button" onclick="setLang('be')">Беларуская</button>
          <button class="ref-ghost-chip ${lang === "en" ? "active" : ""}" type="button" onclick="setLang('en')">English</button>
        </div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${text("themeLabel")}</div>
        <div class="ref-page-copy">${text("themeCopy")}</div>
        <div class="ref-settings-pills">
          <button class="ref-ghost-chip ${activeTheme === "dark" ? "active" : ""}" type="button" onclick="setTheme('dark')">${text("themeDark")}</button>
          <button class="ref-ghost-chip ${activeTheme === "light" ? "active" : ""}" type="button" onclick="setTheme('light')">${text("themeLight")}</button>
        </div>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${text("rateSettingsLabel")}</div>
        <div class="ref-settings-meta">
          <div class="ref-settings-meta-row">
            <span>${text("ratesUpdatedLabel")}</span>
            <strong>${escapeHtml(safeUpdated)}</strong>
          </div>
        </div>
        <div class="ref-settings-list">
          ${["USD", "EUR", "RUB"].map((code) => {
            const rate = safeRates[code] || { scale: 1, officialRate: 0 };
            return `
              <div class="ref-settings-row">
                <div class="ref-settings-copy">
                  <strong>${code}</strong>
                  <span>${rate.scale} ${code} = BYN</span>
                </div>
                <div class="ref-settings-input">
                  <input class="setting-input" type="number" step="0.0001" value="${formatNumber(Number(rate.officialRate || 0), 4)}" onchange="updateRate('${code}', 'officialRate', this.value)">
                </div>
              </div>
            `;
          }).join("")}
        </div>
        <div class="ref-inline-actions">
          <button class="ref-primary-inline ${ratesUiState.loading ? "loading" : ""}" type="button" ${ratesUiState.loading ? "disabled" : ""} onclick="refreshRatesFromNBRB()">${ratesUiState.loading ? "..." : text("updateRates")}</button>
        </div>
      </section>
    </div>
  `;
}

function renderSafePageFallback(page, error) {
  if (page === "settings") {
    return renderSafeSettingsFallback();
  }

  const titleMap = {
    home: text("navHome"),
    history: text("navHistory"),
    add: text("navAdd"),
    goals: text("navGoals"),
    settings: text("navSettings"),
  };

  return `
    <div class="page ref-page">
      <section class="ref-single-head">
        <h1 class="ref-single-title">${escapeHtml(titleMap[page] || "")}</h1>
        <p class="ref-page-copy">${photoText("fallbackPageCopy")}</p>
      </section>
      <section class="ref-card ref-settings-card">
        <div class="ref-card-kicker">${photoText("fallbackErrorLabel")}</div>
        <div class="ref-page-copy">${escapeHtml(String(error && error.message ? error.message : error || "Unknown error"))}</div>
      </section>
    </div>
  `;
}

const photoSafeBaseRender = render;
render = function () {
  try {
    photoSafeBaseRender();
  } catch (error) {
    console.error("photo render error", error);
    const screen = document.getElementById("screen");
    if (screen) {
      screen.innerHTML = renderSafePageFallback(currentPage, error);
    }
  }
};

render();
