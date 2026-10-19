const STORAGE_KEY = "expenses";
let expenses = loadExpenses();

const form = document.getElementById("expense-form");
const formTitle = document.getElementById("form-title");
const idInput = document.getElementById("expense-id");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const errorEl = document.getElementById("error");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
const clearFiltersBtn = document.getElementById("clear-filters");

const totalEl = document.getElementById("total");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");

function loadExpenses() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        return [];
    }
}
function saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
function validate(title, amountRaw, category, date) {
    if (title.trim() === "") return "Title is required.";
    if (amountRaw === "") return "Amount is required.";

    const amount = Number(amountRaw);
    if (!Number.isFinite(amount)) return "Amount must be a number.";
    if (amount <= 0) return "Amount must be greater than zero.";
    if (category === "") return "Please choose a category.";
    if (date === "") return "Date is required.";
    return "";
}

form.addEventListener ("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value;
    const amountRaw = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    const message = validate(title, amountRaw, category, date);
    if (message) {
        errorEl.textContent = message;
        return;
    }
    errorEl.textContent = "";
    const editingId = idInput.value;

    if (editingId) {
        const expense = expenseS.find((x) => x.id === editingId);
        expense.title = title.trim();
        expense.amount = Number(amountRaw);
        expense.category = category;
        expense.date = date;
    } else {
        expenses.push ({
            id: Date.now().toString(),
            title: title.trim(),
            amount: Number(amountRaw),
            category: category,
            date: date,
        });
    }
    saveExpenses();
    resetForm();
    render();
});
function resetForm() {
    form.reset();
    idInput.value = "";
    errorEl.textContent = "";
    formTitle.textContent = "Add expense";
    submitBtn.textContent = "Add";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

listEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.classList.contains("delete")) {
        expenses = expenses.filter((x) => x.id !==id);
        saveExpenses();
        render();
    }
    if (btn.classList.contains("edit")) {
        const expense = expenses.find((x) => x.id === id);
        idInput.value = expense.id;
        titleInput.value = expense.title;
        amountInput.value = expense.amount;
        categoryInput.value  = expense.category;
        dateInput.value = expense.date;
        formTitle.textContent = "Edit expense";
        submitBtn.textContent = "Save";
        cancelBtn.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth"});
    }
});
filterCategory.addEventListener("change", render);
filterDate.addEventListener("change", render);

clearFiltersBtn.addEventListener("click", function () {
  filterCategory.value = "";
  filterDate.value = "";
  render();
});

function getFilteredExpenses() {
  return expenses.filter(function (x) {
    const categoryOk = filterCategory.value === "" || x.category === filterCategory.value;
    const dateOk = filterDate.value === "" || x.date === filterDate.value;
    return categoryOk && dateOk;
  });
}

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

function render() {
  const visible = getFilteredExpenses();

  visible.sort((a, b) => b.date.localeCompare(a.date));

  const total = visible.reduce((sum, x) => sum + x.amount, 0);
  totalEl.textContent = money.format(total);

  listEl.innerHTML = "";
  emptyEl.hidden = visible.length > 0;

  visible.forEach(function (x) {
    const li = document.createElement("li");

    const top = document.createElement("div");
    top.className = "item-top";

    const title = document.createElement("span");
    title.className = "item-title";
    title.textContent = x.title;

    const amount = document.createElement("span");
    amount.textContent = money.format(x.amount);

    top.append(title, amount);

    const meta = document.createElement("div");
    meta.className = "item-meta";
    meta.textContent = x.category + " · " + x.date;

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "secondary edit";
    editBtn.textContent = "Edit";
    editBtn.dataset.id = x.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.id = x.id;

    actions.append(editBtn, deleteBtn);
    li.append(top, meta, actions);
    listEl.appendChild(li);
  });
}

dateInput.valueAsDate = new Date();
render();