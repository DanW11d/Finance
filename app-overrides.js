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

const stage3State = {
  successTimer: null,
  swipeCloseBound: false,
};

function stage3Text(key) {
  const dict = {
    ru: {
      edit: "Изменить",
      remove: "Удалить",
      swipeHint: "Свайп влево",
      successSavedTitle: "Операция сохранена",
      successSavedCopy: "Запись сразу попала в текущий месяц.",
      successUpdatedTitle: "Изменения сохранены",
      successUpdatedCopy: "Операция обновлена без потери истории.",
      successDeletedTitle: "Операция удалена",
      successDeletedCopy: "Запись убрана из истории месяца.",
      successGoalSavedTitle: "Цель сохранена",
      successGoalSavedCopy: "Новая цель добавлена в твой план.",
      successGoalUpdatedTitle: "Цель обновлена",
      successGoalUpdatedCopy: "Параметры накопления сохранены.",
      successGoalAdjustTitle: "Накопления обновлены",
      successGoalAdjustCopy: "Прогресс цели пересчитан.",
    },
    be: {
      edit: "Змяніць",
      remove: "Выдаліць",
      swipeHint: "Свайп улева",
      successSavedTitle: "Аперацыя захавана",
      successSavedCopy: "Запіс адразу трапіў у бягучы месяц.",
      successUpdatedTitle: "Змены захаваны",
      successUpdatedCopy: "Аперацыя абноўлена без страты гісторыі.",
      successDeletedTitle: "Аперацыя выдалена",
      successDeletedCopy: "Запіс прыбраны з гісторыі месяца.",
      successGoalSavedTitle: "Мэта захавана",
      successGoalSavedCopy: "Новая мэта дададзена ў твой план.",
      successGoalUpdatedTitle: "Мэта абноўлена",
      successGoalUpdatedCopy: "Параметры назапашвання захаваны.",
      successGoalAdjustTitle: "Назапашванні абноўлены",
      successGoalAdjustCopy: "Прагрэс мэты пералічаны.",
    },
  };
  dict.en = {
    edit: "Edit",
    remove: "Delete",
    swipeHint: "Swipe left",
    successSavedTitle: "Transaction saved",
    successSavedCopy: "The entry has been added to the current month.",
    successUpdatedTitle: "Changes saved",
    successUpdatedCopy: "The transaction was updated without losing its history.",
    successDeletedTitle: "Transaction deleted",
    successDeletedCopy: "The entry has been removed from this month's history.",
    successGoalSavedTitle: "Goal saved",
    successGoalSavedCopy: "The new goal has been added to your plan.",
    successGoalUpdatedTitle: "Goal updated",
    successGoalUpdatedCopy: "The goal settings were saved.",
    successGoalAdjustTitle: "Savings updated",
    successGoalAdjustCopy: "The goal progress has been recalculated.",
  };
  const value = (dict[lang] || dict.ru)[key] ?? dict.ru[key];
  if (value === undefined) {
    console.warn(`[stage3Text] missing key: "${key}"`);
    return key;
  }
  return value;
}

function stage3SetNavMotion(mode) {
  document.body.dataset.stage3Nav = mode;
  clearTimeout(stage3SetNavMotion.timer);
  stage3SetNavMotion.timer = setTimeout(() => {
    delete document.body.dataset.stage3Nav;
  }, 360);
}

function stage3SyncGoalSheetState() {
  if (goalEditorMode || adjustGoalId) {
    document.body.dataset.goalSheet = "open";
  } else {
    delete document.body.dataset.goalSheet;
  }
}

function stage3EnsureSuccessRoot() {
  let root = document.getElementById("stage3-success-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "stage3-success-root";
    document.body.appendChild(root);
  }
  return root;
}

function stage3ShowSuccess(title, copy) {
  const root = stage3EnsureSuccessRoot();
  root.innerHTML = `
    <div class="success-float">
      <div class="success-float-mark">OK</div>
      <div class="success-float-copy">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(copy)}</span>
      </div>
    </div>
  `;
  clearTimeout(stage3State.successTimer);
  stage3State.successTimer = setTimeout(() => {
    root.innerHTML = "";
  }, 2200);
}

function stage3BaseTxButton(tx) {
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
        ${currentPage === "history" && historyMode === "list" ? `<div class="tx-swipe-hint">${stage3Text("swipeHint")}</div>` : ""}
      </div>
      <div class="tx-side">
        <div class="tx-amount ${tx.type === "income" ? "income" : "expense"}">${tx.type === "income" ? "+" : "−"}${moneyInline(tx.amount, false)}</div>
        <div class="tx-edit-hint">${text("editHint")}</div>
      </div>
    </button>
  `;
}

function stage3CloseSwipes(exceptId) {
  document.querySelectorAll(".tx-swipe").forEach((row) => {
    if (exceptId && row.dataset.txId === exceptId) return;
    row.classList.remove("open", "dragging");
    row.dataset.offset = "0";
    row.style.setProperty("--swipe-offset", "0px");
  });
}

function stage3DeleteTx(id) {
  const deletingTx = transactions.find((item) => item.id === id);
  if (!deletingTx) return;
  if (!confirm(text("confirmDeleteTx"))) return;

  if (deletingTx.recurringId) {
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

  transactions = transactions.filter((item) => item.id !== id);
  saveTransactions();
  stage3CloseSwipes();
  showToast(text("toastTxDeleted"));
  stage3ShowSuccess(stage3Text("successDeletedTitle"), stage3Text("successDeletedCopy"));
  render();
}

function stage3EditTx(id) {
  stage3CloseSwipes();
  startEditTx(id);
}

function stage3BindSwipes() {
  document.querySelectorAll(".tx-swipe").forEach((row) => {
    if (row.dataset.stage3Bound === "1") return;
    row.dataset.stage3Bound = "1";

    const track = row.querySelector(".tx-swipe-track");
    let startX = 0;
    let startOffset = 0;
    let dragging = false;
    let moved = false;

    const setOffset = (value) => {
      const clamped = Math.max(-132, Math.min(0, value));
      row.dataset.offset = String(clamped);
      row.style.setProperty("--swipe-offset", `${clamped}px`);
      row.classList.toggle("open", clamped <= -72);
    };

    const finish = () => {
      if (!dragging) return;
      dragging = false;
      row.classList.remove("dragging");
      setOffset(Number(row.dataset.offset || 0) <= -72 ? -132 : 0);
      setTimeout(() => {
        moved = false;
      }, 10);
    };

    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stage3CloseSwipes(row.dataset.txId);
      dragging = true;
      moved = false;
      startX = event.clientX;
      startOffset = row.classList.contains("open") ? -132 : 0;
      row.classList.add("dragging");
      try {
        track.setPointerCapture(event.pointerId);
      } catch (error) {}
    });

    track.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 8) moved = true;
      setOffset(startOffset + delta);
    });

    track.addEventListener("pointerup", finish);
    track.addEventListener("pointercancel", finish);

    track.addEventListener("click", (event) => {
      if (moved || row.classList.contains("open")) {
        event.preventDefault();
        event.stopPropagation();
        if (row.classList.contains("open")) {
          stage3CloseSwipes();
        }
      }
    }, true);
  });

  if (!stage3State.swipeCloseBound) {
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".tx-swipe")) {
        stage3CloseSwipes();
      }
    });
    stage3State.swipeCloseBound = true;
  }
}

renderTransactionItem = function (tx) {
  const base = stage3BaseTxButton(tx);
  if (currentPage !== "history" || historyMode !== "list") {
    return base;
  }

  return `
    <div class="tx-swipe" data-tx-id="${tx.id}">
      <div class="tx-swipe-actions">
        <button class="tx-swipe-action edit" type="button" onclick="stage3EditTx('${tx.id}')"><strong>✎</strong><span>${stage3Text("edit")}</span></button>
        <button class="tx-swipe-action delete" type="button" onclick="stage3DeleteTx('${tx.id}')"><strong>×</strong><span>${stage3Text("remove")}</span></button>
      </div>
      <div class="tx-swipe-track">${base}</div>
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
    <div class="page page-goals">
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
        <div class="hint">${text("nearestGoal")}: ${nearest ? escapeHtml(nearest.name) + " · " + formatNumber(Math.min(100, (nearest.saved / nearest.target) * 100), 0) + "%" : "-"}</div>
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
};

const stage3BaseRender = render;
render = function () {
  stage3BaseRender();
  stage3SyncGoalSheetState();
  stage3EnsureSuccessRoot();
  stage3BindSwipes();
};

const stage3BaseShowPage = showPage;
showPage = function (page) {
  const order = ["home", "history", "add", "goals", "settings"];
  const from = order.indexOf(currentPage);
  const to = order.indexOf(page);
  stage3SetNavMotion(page === "add" ? "sheet" : (to >= from ? "forward" : "back"));
  stage3BaseShowPage(page);
};

const stage3BaseChangeMonth = changeMonth;
changeMonth = function (delta) {
  stage3SetNavMotion(delta > 0 ? "forward" : "back");
  stage3BaseChangeMonth(delta);
};

const stage3BaseStartCreateTx = startCreateTx;
startCreateTx = function (type) {
  stage3SetNavMotion("sheet");
  stage3BaseStartCreateTx(type);
};

const stage3BaseStartEditTx = startEditTx;
startEditTx = function (id) {
  stage3SetNavMotion("sheet");
  stage3BaseStartEditTx(id);
};

const stage3BaseCancelTxEdit = cancelTxEdit;
cancelTxEdit = function () {
  stage3SetNavMotion("back");
  stage3BaseCancelTxEdit();
};

const stage3BaseOpenGoalCreate = openGoalCreate;
openGoalCreate = function () {
  stage3SetNavMotion("sheet");
  stage3BaseOpenGoalCreate();
  stage3SyncGoalSheetState();
};

const stage3BaseOpenGoalEdit = openGoalEdit;
openGoalEdit = function (id) {
  stage3SetNavMotion("sheet");
  stage3BaseOpenGoalEdit(id);
  stage3SyncGoalSheetState();
};

const stage3BaseCancelGoalEditor = cancelGoalEditor;
cancelGoalEditor = function () {
  stage3SetNavMotion("back");
  stage3BaseCancelGoalEditor();
  stage3SyncGoalSheetState();
};

const stage3BaseOpenGoalAdjust = openGoalAdjust;
openGoalAdjust = function (id) {
  stage3SetNavMotion("sheet");
  stage3BaseOpenGoalAdjust(id);
  stage3SyncGoalSheetState();
};

const stage3BaseCancelGoalAdjust = cancelGoalAdjust;
cancelGoalAdjust = function () {
  stage3SetNavMotion("back");
  stage3BaseCancelGoalAdjust();
  stage3SyncGoalSheetState();
};

const stage3BaseSubmitTx = submitTx;
submitTx = function () {
  const wasEditing = Boolean(editingTxId);
  const beforeCount = transactions.length;
  stage3BaseSubmitTx();
  if (!wasEditing && transactions.length === beforeCount + 1) {
    stage3ShowSuccess(stage3Text("successSavedTitle"), stage3Text("successSavedCopy"));
  } else if (wasEditing && !editingTxId && currentPage === "home") {
    stage3ShowSuccess(stage3Text("successUpdatedTitle"), stage3Text("successUpdatedCopy"));
  }
};

const stage3BaseDeleteEditingTx = deleteEditingTx;
deleteEditingTx = function () {
  const deletingId = editingTxId;
  stage3BaseDeleteEditingTx();
  if (deletingId && !transactions.some((item) => item.id === deletingId)) {
    stage3ShowSuccess(stage3Text("successDeletedTitle"), stage3Text("successDeletedCopy"));
  }
};

const stage3BaseSaveGoalRecord = saveGoalRecord;
saveGoalRecord = function () {
  const beforeCount = goals.length;
  const wasEditing = goalEditorMode === "edit";
  stage3BaseSaveGoalRecord();
  stage3SyncGoalSheetState();
  if (!wasEditing && goals.length === beforeCount + 1) {
    stage3ShowSuccess(stage3Text("successGoalSavedTitle"), stage3Text("successGoalSavedCopy"));
  } else if (wasEditing && !goalEditorMode) {
    stage3ShowSuccess(stage3Text("successGoalUpdatedTitle"), stage3Text("successGoalUpdatedCopy"));
  }
};

const stage3BaseApplyGoalAdjust = applyGoalAdjust;
applyGoalAdjust = function (direction) {
  const before = JSON.stringify(goals);
  stage3BaseApplyGoalAdjust(direction);
  stage3SyncGoalSheetState();
  if (before !== JSON.stringify(goals)) {
    stage3ShowSuccess(stage3Text("successGoalAdjustTitle"), stage3Text("successGoalAdjustCopy"));
  }
};

const stage3BaseRemoveGoal = removeGoal;
removeGoal = function (id) {
  const beforeCount = goals.length;
  stage3BaseRemoveGoal(id);
  if (goals.length === beforeCount - 1) {
    stage3ShowSuccess(stage3Text("successDeletedTitle"), stage3Text("successDeletedCopy"));
  }
};

updateAppChrome();
