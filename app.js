const sampleData = {
  project: "JSON Explorer",
  version: 1,
  active: true,
  owner: {
    name: "Giulia Rossi",
    role: "Frontend developer",
    contact: {
      email: "giulia@example.com",
      location: "Milano, Italia",
    },
  },
  tags: ["visualizzazione", "json", "developer tools"],
  settings: {
    theme: "dark",
    autosave: false,
    options: null,
  },
};

const input = document.querySelector("#json-input");
const tree = document.querySelector("#tree");
const message = document.querySelector("#parse-message");
const searchInput = document.querySelector("#search-input");
const summary = document.querySelector("#tree-summary");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const sourceSize = document.querySelector("#source-size");

function formatSourceSize() {
  const length = input.value.length;
  sourceSize.textContent = `${length.toLocaleString("it-IT")} caratter${length === 1 ? "e" : "i"}`;
}

function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getPath(parent, key, isArrayItem) {
  if (isArrayItem) return `${parent}[${key}]`;
  if (/^[A-Za-z_$][\w$]*$/.test(key)) return `${parent}.${key}`;
  return `${parent}[${JSON.stringify(key)}]`;
}

function getChildren(value) {
  if (Array.isArray(value)) return value.map((child, index) => [String(index), child, true]);
  if (value !== null && typeof value === "object") {
    return Object.entries(value).map(([key, child]) => [key, child, false]);
  }
  return [];
}

function displayValue(value) {
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

function createNode(key, value, path, depth, isArrayItem = false) {
  const childEntries = getChildren(value);
  const isContainer = childEntries.length > 0 || (value !== null && typeof value === "object");
  const node = document.createElement("div");
  node.className = "tree-node";
  node.dataset.search = `${key} ${path} ${isContainer ? "" : displayValue(value)}`.toLocaleLowerCase("it");

  if (isContainer) {
    const details = document.createElement("details");
    details.className = "tree-branch";
    details.open = depth === 0;
    details.dataset.initialOpen = String(details.open);

    const summaryRow = document.createElement("summary");
    summaryRow.className = "tree-row";
    const toggle = document.createElement("span");
    toggle.className = "tree-toggle";
    toggle.textContent = "›";
    toggle.setAttribute("aria-hidden", "true");
    summaryRow.append(toggle);
    appendKey(summaryRow, key, depth === 0, isArrayItem);

    const typeBadge = document.createElement("span");
    const type = Array.isArray(value) ? "array" : "object";
    typeBadge.className = `type-badge${type === "array" ? " array-badge" : ""}`;
    typeBadge.textContent = type;
    summaryRow.append(typeBadge);

    const itemCount = document.createElement("span");
    itemCount.className = "item-count";
    itemCount.textContent = `${childEntries.length} ${childEntries.length === 1 ? "elemento" : "elementi"}`;
    summaryRow.append(itemCount);

    const children = document.createElement("div");
    children.className = "tree-children";
    for (const [childKey, childValue, childIsArrayItem] of childEntries) {
      children.append(
        createNode(
          childKey,
          childValue,
          getPath(path, childKey, childIsArrayItem),
          depth + 1,
          childIsArrayItem,
        ),
      );
    }
    details.append(summaryRow, children);
    node.append(details);
    return node;
  }

  const row = document.createElement("div");
  row.className = "tree-row tree-leaf";
  appendKey(row, key, depth === 0, isArrayItem);

  const separator = document.createElement("span");
  separator.className = "tree-separator";
  separator.textContent = ":";
  row.append(separator);

  const valueElement = document.createElement("span");
  const type = getType(value);
  valueElement.className = `tree-value ${type}-value`;
  valueElement.textContent = displayValue(value);
  row.append(valueElement);
  node.append(row);
  return node;
}

function appendKey(row, key, isRoot, isArrayItem) {
  const keyElement = document.createElement("span");
  keyElement.className = `tree-key${isRoot ? " root-key" : ""}`;
  keyElement.textContent = isRoot ? "$" : isArrayItem ? `[${key}]` : key;
  row.append(keyElement);

  if (!isRoot && !isArrayItem) {
    const separator = document.createElement("span");
    separator.className = "tree-separator";
    separator.textContent = ":";
    row.append(separator);
  }
}

function getStats(value) {
  const stats = { objects: 0, arrays: 0, values: 0 };
  const pending = [value];

  while (pending.length) {
    const current = pending.pop();
    if (Array.isArray(current)) {
      stats.arrays += 1;
      for (const child of current) pending.push(child);
    } else if (current !== null && typeof current === "object") {
      stats.objects += 1;
      for (const child of Object.values(current)) pending.push(child);
    } else {
      stats.values += 1;
    }
  }
  return stats;
}

function getParseError(error, source) {
  const match = error.message.match(/position\s+(\d+)/i);
  if (!match) return error.message;

  const position = Number(match[1]);
  const beforeError = source.slice(0, position);
  const line = beforeError.split("\n").length;
  const column = position - beforeError.lastIndexOf("\n");
  return `JSON non valido alla riga ${line}, colonna ${column}. ${error.message}`;
}

function renderJson() {
  formatSourceSize();
  let data;
  try {
    data = JSON.parse(input.value);
  } catch (error) {
    tree.replaceChildren();
    searchInput.value = "";
    summary.textContent = "JSON non valido";
    resultCount.textContent = "";
    emptyState.hidden = true;
    message.className = "message error";
    message.textContent = getParseError(error, input.value);
    return;
  }

  tree.replaceChildren(createNode("$", data, "$", 0));
  searchInput.value = "";
  resultCount.textContent = "";
  emptyState.hidden = true;
  message.className = "message success";
  message.textContent = "Struttura aggiornata.";

  const stats = getStats(data);
  summary.textContent = `${stats.objects} oggetti · ${stats.arrays} array · ${stats.values} valori`;
}

function filterNode(node, query, matchingNodes) {
  const childNodes = node.querySelectorAll(":scope > details > .tree-children > .tree-node");
  let childMatches = false;
  for (const child of childNodes) {
    if (filterNode(child, query, matchingNodes)) childMatches = true;
  }

  const matches = node.dataset.search.includes(query);
  if (matches) matchingNodes.count += 1;
  const visible = matches || childMatches;
  node.hidden = !visible;

  const branch = node.querySelector(":scope > details");
  if (branch) {
    branch.open = query ? childMatches || (matches && branch.open) : branch.dataset.initialOpen === "true";
  }
  return visible;
}

function applySearch() {
  const query = searchInput.value.trim().toLocaleLowerCase("it");
  if (!query) {
    for (const node of tree.querySelectorAll(".tree-node")) node.hidden = false;
    for (const branch of tree.querySelectorAll(".tree-branch")) {
      branch.open = branch.dataset.initialOpen === "true";
    }
    resultCount.textContent = "";
    emptyState.hidden = true;
    return;
  }

  const root = tree.firstElementChild;
  if (!root) {
    resultCount.textContent = "0 risultati";
    emptyState.hidden = false;
    return;
  }

  const matchingNodes = { count: 0 };
  const visible = filterNode(root, query, matchingNodes);
  resultCount.textContent = `${matchingNodes.count} ${matchingNodes.count === 1 ? "risultato" : "risultati"}`;
  emptyState.hidden = visible;
}

document.querySelector("#render-button").addEventListener("click", renderJson);
input.addEventListener("input", formatSourceSize);
searchInput.addEventListener("input", applySearch);

document.querySelector("#expand-button").addEventListener("click", () => {
  for (const branch of tree.querySelectorAll(".tree-branch")) branch.open = true;
});

document.querySelector("#collapse-button").addEventListener("click", () => {
  for (const branch of tree.querySelectorAll(".tree-branch")) branch.open = false;
});

document.querySelector("#copy-button").addEventListener("click", async () => {
  try {
    const formatted = JSON.stringify(JSON.parse(input.value), null, 2);
    await navigator.clipboard.writeText(formatted);
    message.className = "message success";
    message.textContent = "JSON formattato copiato negli appunti.";
  } catch (error) {
    message.className = "message error";
    message.textContent =
      error instanceof SyntaxError
        ? getParseError(error, input.value)
        : "Impossibile accedere agli appunti. Verifica i permessi del browser.";
  }
});

document.querySelector("#file-input").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    input.value = await file.text();
    formatSourceSize();
    renderJson();
  } catch {
    message.className = "message error";
    message.textContent = "Impossibile leggere il file selezionato.";
  }
  event.target.value = "";
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

if (window.jsonExplorer) {
  window.jsonExplorer.onFileOpen(({ name, content }) => {
    input.value = content;
    formatSourceSize();
    renderJson();
    if (message.classList.contains("success")) {
      message.textContent = `File caricato: ${name}`;
      document.title = `${name} — JSON Explorer`;
    } else {
      message.textContent += ` (file: ${name})`;
    }
  });

  window.jsonExplorer.onFileError(({ name }) => {
    message.className = "message error";
    message.textContent = `Impossibile aprire il file "${name}". Verifica che esista e che sia leggibile.`;
  });
}

input.value = JSON.stringify(sampleData, null, 2);
renderJson();
