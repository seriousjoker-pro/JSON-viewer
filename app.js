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

const translations = {
  it: {
    metaDescription: "Esplora e visualizza i tuoi dati JSON come un diagramma interattivo, direttamente nel browser.",
    documentTitle: "JSON Explorer — visualizzatore interattivo",
    languageLabel: "Lingua dell'interfaccia",
    privacyTopNote: "I tuoi dati restano sul dispositivo",
    eyebrow: "JSON, finalmente leggibile",
    headline: "Esplora i dati,",
    headlineHighlight: "un nodo alla volta.",
    introCopy: "Incolla o carica un JSON e trasformalo in una struttura interattiva. Espandi gli oggetti, cerca una proprietà e segui ogni percorso.",
    workspaceLabel: "Editor e visualizzatore JSON",
    sourceKicker: "01 / SORGENTE",
    yourJson: "Il tuo JSON",
    openFile: "Apri file",
    editorLabel: "Inserisci o modifica il JSON",
    editorHint: "JSON standard · modifica qui i tuoi dati",
    renderStructure: "Visualizza struttura",
    visualizationKicker: "02 / VISUALIZZAZIONE",
    dataStructure: "Struttura dati",
    collapseAll: "Chiudi tutto",
    expandAll: "Espandi tutto",
    searchLabel: "Cerca in struttura",
    searchPlaceholder: "Cerca chiave o valore…",
    copyJson: "Copia JSON formattato",
    copy: "Copia",
    fullscreen: "Schermo intero",
    ready: "Pronto per esplorare",
    graphLabel: "Diagramma interattivo della struttura JSON",
    noResults: "Nessun risultato trovato",
    tryAnotherSearch: "Prova un'altra chiave o un altro valore.",
    canvasControls: "Controlli del diagramma",
    zoomOut: "Riduci zoom",
    zoomIn: "Aumenta zoom",
    fitGraph: "Adatta",
    fitGraphLabel: "Centra e adatta diagramma",
    canvasHint: "Trascina per spostarti · rotella per zoom",
    object: "Oggetto",
    value: "Valore",
    localPrivate: "Locale e privato",
    pageFooter: "Un modo più chiaro di leggere i tuoi JSON.",
    textChanged: "Il testo è cambiato: premi Visualizza struttura per aggiornare i collegamenti alle righe.",
    pathLine: "{path} · Riga {line}",
    character: "{count} caratter{suffix}",
    invalidJson: "JSON non valido",
    parseError: "JSON non valido alla riga {line}, colonna {column}. {detail}",
    parseErrorRaw: "JSON non valido: {detail}",
    root: "Radice",
    arrayPreview: "Lista di elementi",
    objectPreview: "Oggetto con proprietà",
    item: "elemento",
    items: "elementi",
    collapse: "Riduci",
    expand: "Espandi",
    path: "Percorso",
    structureUpdated: "Struttura aggiornata.",
    stats: "{objects} oggetti · {arrays} array · {values} valori",
    result: "risultato",
    results: "risultati",
    exitFullscreen: "Esci da schermo intero",
    fullscreenConsoleError: "Impossibile cambiare la visualizzazione a schermo intero.",
    fullscreenError: "Impossibile attivare lo schermo intero. Verifica i permessi del browser.",
    copySuccess: "JSON formattato copiato negli appunti.",
    clipboardError: "Impossibile accedere agli appunti. Verifica i permessi del browser.",
    readFileError: "Impossibile leggere il file selezionato.",
    fileLoaded: "File caricato: {name}",
    fileErrorWithName: "{detail} (file: {name})",
    openFileError: "Impossibile aprire il file \"{name}\". Verifica che esista e che sia leggibile.",
  },
  en: {
    metaDescription: "Explore and visualize your JSON data as an interactive diagram, right in your browser.",
    documentTitle: "JSON Explorer — interactive viewer",
    languageLabel: "Interface language",
    privacyTopNote: "Your data stays on your device",
    eyebrow: "JSON, finally readable",
    headline: "Explore your data,",
    headlineHighlight: "one node at a time.",
    introCopy: "Paste or load JSON and turn it into an interactive structure. Expand objects, search for a property, and follow every path.",
    workspaceLabel: "JSON editor and viewer",
    sourceKicker: "01 / SOURCE",
    yourJson: "Your JSON",
    openFile: "Open file",
    editorLabel: "Enter or edit JSON",
    editorHint: "Standard JSON · edit your data here",
    renderStructure: "View structure",
    visualizationKicker: "02 / VISUALIZATION",
    dataStructure: "Data structure",
    collapseAll: "Collapse all",
    expandAll: "Expand all",
    searchLabel: "Search structure",
    searchPlaceholder: "Search key or value…",
    copyJson: "Copy formatted JSON",
    copy: "Copy",
    fullscreen: "Full screen",
    ready: "Ready to explore",
    graphLabel: "Interactive diagram of the JSON structure",
    noResults: "No results found",
    tryAnotherSearch: "Try another key or value.",
    canvasControls: "Diagram controls",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    fitGraph: "Fit",
    fitGraphLabel: "Center and fit diagram",
    canvasHint: "Drag to pan · scroll to zoom",
    object: "Object",
    value: "Value",
    localPrivate: "Local and private",
    pageFooter: "A clearer way to read your JSON.",
    textChanged: "The text has changed: click View structure to update the line references.",
    pathLine: "{path} · Line {line}",
    character: "{count} character{suffix}",
    invalidJson: "Invalid JSON",
    parseError: "Invalid JSON at line {line}, column {column}. {detail}",
    parseErrorRaw: "Invalid JSON: {detail}",
    root: "Root",
    arrayPreview: "List of items",
    objectPreview: "Object with properties",
    item: "item",
    items: "items",
    collapse: "Collapse",
    expand: "Expand",
    path: "Path",
    structureUpdated: "Structure updated.",
    stats: "{objects} objects · {arrays} arrays · {values} values",
    result: "result",
    results: "results",
    exitFullscreen: "Exit full screen",
    fullscreenConsoleError: "Unable to change the full-screen view.",
    fullscreenError: "Unable to enter full screen. Check your browser permissions.",
    copySuccess: "Formatted JSON copied to clipboard.",
    clipboardError: "Unable to access the clipboard. Check your browser permissions.",
    readFileError: "Unable to read the selected file.",
    fileLoaded: "File loaded: {name}",
    fileErrorWithName: "{detail} (file: {name})",
    openFileError: "Unable to open file \"{name}\". Check that it exists and is readable.",
  },
};

const languageSelect = document.querySelector("#language-select");
let language = "it";
let currentMessage = null;
let invalidJson = false;
let openedFileName = null;
let fullscreenError = false;

function translate(key, values = {}) {
  if (key === "fileErrorWithName" && values.prior) {
    values = { ...values, detail: translate(values.prior.key, values.prior.values) };
  }
  return translations[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name]);
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.content = translate(element.dataset.i18nContent);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translate(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = translate(element.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelector("#headline-highlight").textContent = translate("headlineHighlight");
  document.title = openedFileName ? `${openedFileName} — JSON Explorer` : translate("documentTitle");
  updateFullscreenLabel();
  if (fullscreenError) fullscreenMessage.textContent = translate("fullscreenError");
  formatSourceSize();
  if (currentMessage) {
    message.className = `message ${currentMessage.type}`;
    message.textContent = translate(currentMessage.key, currentMessage.values);
  }
  if (rootNode) {
    const stats = getStats(rootNode.value);
    summary.textContent = translate("stats", stats);
    renderGraph();
  } else if (invalidJson) {
    summary.textContent = translate("invalidJson");
  }
  if (searchInput.value.trim()) {
    resultCount.textContent = `${searchMatches.size} ${translate(searchMatches.size === 1 ? "result" : "results")}`;
  }
}

function showMessage(key, type, values = {}) {
  currentMessage = { key, type, values };
  message.className = `message ${type}`;
  message.textContent = translate(key, values);
}

const input = document.querySelector("#json-input");
const graphCanvas = document.querySelector("#graph-canvas");
const graph = document.querySelector("#graph");
const message = document.querySelector("#parse-message");
const searchInput = document.querySelector("#search-input");
const summary = document.querySelector("#tree-summary");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const sourceSize = document.querySelector("#source-size");
const visualPanel = document.querySelector(".visual-panel");
const fullscreenButton = document.querySelector("#fullscreen-button");
const fullscreenLabel = document.querySelector("#fullscreen-label");
const fullscreenMessage = document.querySelector("#fullscreen-message");
const expandedPaths = new Set(["$"]);
const cardWidth = 246;
const cardHeight = 82;
const columnGap = 78;
const rowGap = 24;
const graphPadding = 42;
let rootNode = null;
let camera = { x: 0, y: 0, scale: 1 };
let graphSize = { width: 0, height: 0 };
let searchMatches = new Set();
let searchVisible = null;
let dragState = null;
let suppressGraphClick = false;
let renderFrame = 0;
let renderedSource = "";
let sourceRanges = new Map();
let pendingSourceNode = null;

function indexSourceRanges(source) {
  // Token offsets refer to the original text, including whitespace and escaped keys.
  const tokens = [...source.matchAll(/"(?:\\[\s\S]|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g)];
  const ranges = new Map();
  let cursor = 0;
  function readValue(path) {
    const first = tokens[cursor++];
    if (first[0] === "{" || first[0] === "[") {
      const isArray = first[0] === "[";
      const closing = isArray ? "]" : "}";
      let index = 0;
      while (tokens[cursor][0] !== closing) {
        let key = String(index++);
        if (!isArray) {
          key = JSON.parse(tokens[cursor++][0]);
          cursor += 1;
        }
        readValue(getPath(path, key, isArray));
        if (tokens[cursor][0] === ",") cursor += 1;
      }
      cursor += 1;
    }
    const last = tokens[cursor - 1];
    ranges.set(path, { start: first.index, end: last.index + last[0].length });
  }
  readValue("$");
  return ranges;
}

function revealSourceValue(node) {
  const isFullscreen = document.fullscreenElement === visualPanel
    || visualPanel.classList.contains("panel-fullscreen");
  if (input.value !== renderedSource) {
    showMessage("textChanged", "error");
    return;
  }
  const range = sourceRanges.get(node.path);
  if (!range) return;
  if (!isFullscreen) input.focus({ preventScroll: true });
  input.setSelectionRange(range.start, range.end);
  if (isFullscreen) {
    pendingSourceNode = node;
    return;
  }
  pendingSourceNode = null;
  const before = renderedSource.slice(0, range.start);
  const line = before.split("\n").length;
  const style = window.getComputedStyle(input);
  const lineHeight = Number.parseFloat(style.lineHeight);
  input.scrollTop = Math.max(0, (line - 1) * lineHeight - input.clientHeight / 2 + lineHeight);
  const column = range.start - before.lastIndexOf("\n") - 1;
  input.scrollLeft = Math.max(0, column * Number.parseFloat(style.fontSize) * 0.6 - input.clientWidth / 2);
  input.scrollIntoView({ block: "nearest", inline: "nearest" });
  showMessage("pathLine", "success", { path: node.path, line });
}

function activateNode(node) {
  if (!node) return;
  if (node.isContainer && node.children.length) {
    setExpanded(node, !node.expanded);
    renderGraph({ center: node });
  }
  revealSourceValue(node);
}

function formatSourceSize() {
  const length = input.value.length;
  const suffix = language === "it" ? (length === 1 ? "e" : "i") : (length === 1 ? "" : "s");
  sourceSize.textContent = translate("character", {
    count: length.toLocaleString(language === "it" ? "it-IT" : "en-US"),
    suffix,
  });
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

function buildNode(key, value, path, isArrayItem = false) {
  const children = getChildren(value).map(([childKey, childValue, childIsArrayItem]) =>
    buildNode(childKey, childValue, getPath(path, childKey, childIsArrayItem), childIsArrayItem),
  );
  return {
    key,
    value,
    path,
    isArrayItem,
    type: getType(value),
    children,
    isContainer: value !== null && typeof value === "object",
    expanded: path === "$",
    x: 0,
    y: 0,
    subtreeHeight: cardHeight,
  };
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
  if (!match) return { key: "parseErrorRaw", values: { detail: error.message } };
  const position = Number(match[1]);
  const beforeError = source.slice(0, position);
  const line = beforeError.split("\n").length;
  const column = position - beforeError.lastIndexOf("\n");
  return { key: "parseError", values: { line, column, detail: error.message } };
}

function collectMatches(node, query, matches, visible) {
  const ownText = `${node.key} ${node.path} ${node.isContainer ? "" : displayValue(node.value)}`;
  if (ownText.toLocaleLowerCase("it").includes(query)) matches.add(node.path);

  let childMatches = false;
  for (const child of node.children) {
    if (collectMatches(child, query, matches, visible)) childMatches = true;
  }
  const isVisible = matches.has(node.path) || childMatches;
  if (isVisible) visible.add(node.path);
  return isVisible;
}

function createSvgElement(name, attributes = {}, text = null) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  if (text !== null) element.textContent = text;
  return element;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function setText(element, text, x, y, className, attributes = {}) {
  const textElement = createSvgElement(
    "text",
    { x, y, class: className, ...attributes },
    text,
  );
  element.append(textElement);
  return textElement;
}

function getNodeLabel(node) {
  if (node.path === "$") return translate("root");
  return node.isArrayItem ? `[${node.key}]` : node.key;
}

function getNodePreview(node) {
  if (!node.isContainer) return displayValue(node.value);
  if (node.type === "array") return translate("arrayPreview");
  return translate("objectPreview");
}

function getNodeCount(node) {
  return `${node.children.length} ${translate(node.children.length === 1 ? "item" : "items")}`;
}

function createCard(node) {
  const attributes = {
    class: `graph-node node-${node.type}${node.path === "$" ? " node-root" : ""}${searchMatches.has(node.path) ? " node-match" : ""}`,
    transform: `translate(${node.x} ${node.y - cardHeight / 2})`,
    "data-path": node.path,
    role: "button",
    tabindex: "0",
    "aria-label": `${getNodeLabel(node)}, ${node.type}${node.isContainer ? `, ${getNodeCount(node)}` : `: ${displayValue(node.value)}`}`,
  };
  if (node.isContainer && node.children.length) attributes["aria-expanded"] = String(node.expanded);
  const group = createSvgElement("g", attributes);
  group.append(createSvgElement("title", {}, `${node.path}\n${node.isContainer ? getNodeCount(node) : displayValue(node.value)}`));
  group.append(
    createSvgElement("rect", {
      class: "node-card",
      width: cardWidth,
      height: cardHeight,
      rx: 11,
    }),
    createSvgElement("rect", {
      class: "node-accent",
      x: 0,
      y: 13,
      width: 3,
      height: 31,
      rx: 1.5,
    }),
  );

  const label = getNodeLabel(node);
  setText(group, truncateText(label, 27), 17, 25, "node-label");

  const badgeWidth = node.type.length * 6.2 + 18;
  group.append(
    createSvgElement("rect", {
      class: `node-type type-${node.type}`,
      x: cardWidth - badgeWidth - 12,
      y: 12,
      width: badgeWidth,
      height: 19,
      rx: 5,
    }),
  );
  setText(
    group,
    node.type,
    cardWidth - badgeWidth / 2 - 12,
    25,
    `node-type-label type-label-${node.type}`,
    { "text-anchor": "middle" },
  );

  setText(group, truncateText(getNodePreview(node), 31), 17, 49, `node-preview preview-${node.type}`);
  group.append(createSvgElement("line", { class: "node-divider", x1: 14, y1: 59, x2: cardWidth - 14, y2: 59 }));
  if (node.isContainer) {
    const action = node.children.length
      ? `${node.expanded ? "−" : "+"}  ${translate(node.expanded ? "collapse" : "expand")} · ${getNodeCount(node)}`
      : getNodeCount(node);
    setText(group, action, 17, 74, "node-footnote");
  } else {
    setText(group, `${translate("path")}  ${truncateText(node.path, 29)}`, 17, 74, "node-footnote");
  }
  return group;
}

function visibleChildren(node) {
  if (!node.isContainer || !node.expanded) return [];
  return node.children.filter((child) => !searchVisible || searchVisible.has(child.path));
}

function measureSubtree(node) {
  const children = visibleChildren(node);
  if (children.length === 0) {
    node.subtreeHeight = cardHeight;
    return node.subtreeHeight;
  }
  const childrenHeight = children.reduce((height, child) => height + measureSubtree(child), 0)
    + rowGap * (children.length - 1);
  node.subtreeHeight = Math.max(cardHeight, childrenHeight);
  return node.subtreeHeight;
}

function placeNodes(node, depth, top) {
  node.x = graphPadding + depth * (cardWidth + columnGap);
  node.y = top + node.subtreeHeight / 2;
  const children = visibleChildren(node);
  if (!children.length) return;

  const childrenHeight = children.reduce((height, child) => height + child.subtreeHeight, 0)
    + rowGap * (children.length - 1);
  let childTop = top + (node.subtreeHeight - childrenHeight) / 2;
  for (const child of children) {
    placeNodes(child, depth + 1, childTop);
    childTop += child.subtreeHeight + rowGap;
  }
}

function appendEdges(layer, node) {
  for (const child of visibleChildren(node)) {
    const startX = node.x + cardWidth;
    const endX = child.x;
    const middleX = startX + (endX - startX) / 2;
    layer.append(
      createSvgElement("path", {
        class: "graph-edge",
        d: `M ${startX} ${node.y} C ${middleX} ${node.y}, ${middleX} ${child.y}, ${endX} ${child.y}`,
      }),
      createSvgElement("circle", {
        class: "edge-port",
        cx: startX,
        cy: node.y,
        r: 3,
      }),
      createSvgElement("circle", {
        class: "edge-port",
        cx: endX,
        cy: child.y,
        r: 3,
      }),
    );
    appendEdges(layer, child);
  }
}

function appendNodes(layer, node) {
  layer.append(createCard(node));
  for (const child of visibleChildren(node)) appendNodes(layer, child);
}

function collectVisibleNodes(node, nodes = []) {
  nodes.push(node);
  for (const child of visibleChildren(node)) collectVisibleNodes(child, nodes);
  return nodes;
}

function applyCamera() {
  const layer = graph.querySelector(".graph-content");
  if (layer) layer.setAttribute("transform", `translate(${camera.x} ${camera.y}) scale(${camera.scale})`);
}

function fitGraph() {
  if (!rootNode) return;
  const viewportWidth = graphCanvas.clientWidth;
  const viewportHeight = graphCanvas.clientHeight;
  if (!viewportWidth || !viewportHeight) return;

  const scale = Math.min((viewportWidth - 76) / graphSize.width, 1);
  camera.scale = Math.max(0.18, scale);
  camera.x = (viewportWidth - graphSize.width * camera.scale) / 2;
  camera.y = viewportHeight / 2 - rootNode.y * camera.scale;
  applyCamera();
}

function renderGraph({ fit = false, anchor = null, center = null } = {}) {
  if (!rootNode) return;
  const visibleRoot = !searchVisible || searchVisible.has(rootNode.path);
  emptyState.hidden = visibleRoot;
  graph.replaceChildren();
  if (!visibleRoot) return;

  const anchorPosition = anchor ? { x: anchor.x, y: anchor.y } : null;
  measureSubtree(rootNode);
  placeNodes(rootNode, 0, graphPadding);
  if (anchorPosition) {
    camera.x += (anchorPosition.x - anchor.x) * camera.scale;
    camera.y += (anchorPosition.y - anchor.y) * camera.scale;
  }
  if (center) {
    camera.x = graphCanvas.clientWidth / 2 - (center.x + cardWidth / 2) * camera.scale;
    camera.y = graphCanvas.clientHeight / 2 - center.y * camera.scale;
  }
  const nodes = collectVisibleNodes(rootNode);
  const maxDepth = Math.max(...nodes.map((node) => Math.round((node.x - graphPadding) / (cardWidth + columnGap))));
  graphSize = {
    width: graphPadding * 2 + maxDepth * (cardWidth + columnGap) + cardWidth,
    height: rootNode.subtreeHeight + graphPadding * 2,
  };
  graph.setAttribute("viewBox", `0 0 ${graphCanvas.clientWidth || 800} ${graphCanvas.clientHeight || 480}`);
  graph.setAttribute("preserveAspectRatio", "none");

  const content = createSvgElement("g", { class: "graph-content" });
  const edges = createSvgElement("g", { class: "graph-edges" });
  const nodesLayer = createSvgElement("g", { class: "graph-nodes" });
  appendEdges(edges, rootNode);
  appendNodes(nodesLayer, rootNode);
  content.append(edges, nodesLayer);
  graph.append(content);
  if (fit) fitGraph();
  else applyCamera();
}

function renderJson() {
  pendingSourceNode = null;
  formatSourceSize();
  let data;
  try {
    data = JSON.parse(input.value);
  } catch (error) {
    rootNode = null;
    graph.replaceChildren();
    searchInput.value = "";
    searchMatches = new Set();
    searchVisible = null;
    invalidJson = true;
    summary.textContent = translate("invalidJson");
    resultCount.textContent = "";
    emptyState.hidden = true;
    const parseError = getParseError(error, input.value);
    showMessage(parseError.key, "error", parseError.values);
    return;
  }

  expandedPaths.clear();
  expandedPaths.add("$");
  renderedSource = input.value;
  sourceRanges = indexSourceRanges(renderedSource);
  rootNode = buildNode("$", data, "$");
  searchInput.value = "";
  searchMatches = new Set();
  searchVisible = null;
  resultCount.textContent = "";
  invalidJson = false;
  showMessage("structureUpdated", "success");
  const stats = getStats(data);
  summary.textContent = translate("stats", stats);
  renderGraph({ fit: true });
}

function findNode(node, path) {
  if (node.path === path) return node;
  for (const child of node.children) {
    const found = findNode(child, path);
    if (found) return found;
  }
  return null;
}

function setExpanded(node, expanded) {
  if (!node.isContainer) return;
  node.expanded = expanded;
  if (expanded) expandedPaths.add(node.path);
  else expandedPaths.delete(node.path);
}

function applySearch() {
  const query = searchInput.value.trim().toLocaleLowerCase(language);
  searchMatches = new Set();
  searchVisible = null;
  if (query && rootNode) {
    const visible = new Set();
    collectMatches(rootNode, query, searchMatches, visible);
    searchVisible = visible;
    for (const path of visible) {
      const node = findNode(rootNode, path);
      if (node && node.isContainer && node.children.some((child) => visible.has(child.path))) {
        setExpanded(node, true);
      }
    }
    resultCount.textContent = `${searchMatches.size} ${translate(searchMatches.size === 1 ? "result" : "results")}`;
  } else {
    resultCount.textContent = "";
    if (rootNode) {
      for (const node of collectVisibleNodes(rootNode)) {
        node.expanded = expandedPaths.has(node.path);
      }
    }
  }
  renderGraph({ fit: true });
}

function zoomAt(factor, clientX, clientY) {
  const bounds = graphCanvas.getBoundingClientRect();
  const pointX = clientX === undefined ? bounds.width / 2 : clientX - bounds.left;
  const pointY = clientY === undefined ? bounds.height / 2 : clientY - bounds.top;
  const graphX = (pointX - camera.x) / camera.scale;
  const graphY = (pointY - camera.y) / camera.scale;
  const scale = Math.max(0.18, Math.min(2, camera.scale * factor));
  camera.x = pointX - graphX * scale;
  camera.y = pointY - graphY * scale;
  camera.scale = scale;
  applyCamera();
}

document.querySelector("#render-button").addEventListener("click", renderJson);
input.addEventListener("input", formatSourceSize);
searchInput.addEventListener("input", applySearch);

document.querySelector("#expand-button").addEventListener("click", () => {
  if (!rootNode) return;
  for (const node of collectAllNodes(rootNode)) setExpanded(node, true);
  renderGraph({ anchor: rootNode });
});

document.querySelector("#collapse-button").addEventListener("click", () => {
  if (!rootNode) return;
  for (const node of collectAllNodes(rootNode)) setExpanded(node, false);
  renderGraph({ anchor: rootNode });
});

function collectAllNodes(node, nodes = []) {
  nodes.push(node);
  for (const child of node.children) collectAllNodes(child, nodes);
  return nodes;
}

graph.addEventListener("click", (event) => {
  if (suppressGraphClick) {
    suppressGraphClick = false;
    return;
  }
  const nodeElement = event.target.closest(".graph-node");
  if (!nodeElement || !rootNode) return;
  const node = findNode(rootNode, nodeElement.dataset.path);
  activateNode(node);
});

graph.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const nodeElement = event.target.closest(".graph-node");
  if (!nodeElement || !rootNode) return;
  event.preventDefault();
  const node = findNode(rootNode, nodeElement.dataset.path);
  activateNode(node);
});

graphCanvas.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".canvas-controls, .graph-node")) return;
  dragState = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    startX: camera.x,
    startY: camera.y,
    moved: false,
  };
  graphCanvas.setPointerCapture(event.pointerId);
});

graphCanvas.addEventListener("pointermove", (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const dx = event.clientX - dragState.x;
  const dy = event.clientY - dragState.y;
  if (Math.abs(dx) + Math.abs(dy) > 4) dragState.moved = true;
  if (!dragState.moved) return;
  camera.x = dragState.startX + dx;
  camera.y = dragState.startY + dy;
  applyCamera();
});

function endDrag(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const moved = dragState.moved;
  dragState = null;
  if (moved) {
    suppressGraphClick = true;
    window.setTimeout(() => {
      suppressGraphClick = false;
    }, 0);
  }
}

graphCanvas.addEventListener("pointerup", endDrag);
graphCanvas.addEventListener("pointercancel", endDrag);
graphCanvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  zoomAt(event.deltaY < 0 ? 1.12 : 0.89, event.clientX, event.clientY);
}, { passive: false });

document.querySelector("#zoom-in").addEventListener("click", () => zoomAt(1.2));
document.querySelector("#zoom-out").addEventListener("click", () => zoomAt(0.83));
document.querySelector("#fit-graph").addEventListener("click", fitGraph);

function scheduleGraphResize() {
  window.cancelAnimationFrame(renderFrame);
  renderFrame = window.requestAnimationFrame(() => renderGraph({ fit: true }));
}

function updateFullscreenState() {
  updateFullscreenLabel();
  document.body.classList.toggle(
    "has-fullscreen-panel",
    document.fullscreenElement === visualPanel || visualPanel.classList.contains("panel-fullscreen"),
  );
  scheduleGraphResize();
  if (!document.fullscreenElement && !visualPanel.classList.contains("panel-fullscreen") && pendingSourceNode) {
    const node = pendingSourceNode;
    pendingSourceNode = null;
    window.requestAnimationFrame(() => revealSourceValue(node));
  }
}

function updateFullscreenLabel() {
  const active = document.fullscreenElement === visualPanel
    || visualPanel.classList.contains("panel-fullscreen");
  fullscreenButton.setAttribute("aria-pressed", String(active));
  const label = translate(active ? "exitFullscreen" : "fullscreen");
  fullscreenLabel.textContent = label;
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
}

fullscreenButton.addEventListener("click", async () => {
  fullscreenError = false;
  fullscreenMessage.hidden = true;
  try {
    if (document.fullscreenElement === visualPanel) {
      await document.exitFullscreen();
    } else if (visualPanel.classList.contains("panel-fullscreen")) {
      visualPanel.classList.remove("panel-fullscreen");
      updateFullscreenState();
    } else if (document.fullscreenEnabled && visualPanel.requestFullscreen) {
      await visualPanel.requestFullscreen();
    } else {
      visualPanel.classList.add("panel-fullscreen");
      updateFullscreenState();
    }
  } catch (error) {
    console.error(translate("fullscreenConsoleError"), error);
    fullscreenError = true;
    fullscreenMessage.textContent = translate("fullscreenError");
    fullscreenMessage.hidden = false;
  }
});

document.addEventListener("fullscreenchange", updateFullscreenState);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && visualPanel.classList.contains("panel-fullscreen")) {
    visualPanel.classList.remove("panel-fullscreen");
    updateFullscreenState();
    fullscreenButton.focus();
  }
});
window.addEventListener("resize", scheduleGraphResize);
new ResizeObserver(scheduleGraphResize).observe(graphCanvas);

document.querySelector("#copy-button").addEventListener("click", async () => {
  try {
    const formatted = JSON.stringify(JSON.parse(input.value), null, 2);
    await navigator.clipboard.writeText(formatted);
    showMessage("copySuccess", "success");
  } catch (error) {
    if (error instanceof SyntaxError) {
      const parseError = getParseError(error, input.value);
      showMessage(parseError.key, "error", parseError.values);
    } else {
      showMessage("clipboardError", "error");
    }
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
    showMessage("readFileError", "error");
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
      showMessage("fileLoaded", "success", { name });
      openedFileName = name;
      document.title = `${name} — JSON Explorer`;
    } else {
      showMessage("fileErrorWithName", "error", { name, prior: currentMessage });
    }
  });

  window.jsonExplorer.onFileError(({ name }) => {
    showMessage("openFileError", "error", { name });
  });
}

input.value = JSON.stringify(sampleData, null, 2);
try {
  const savedLanguage = localStorage.getItem("json-explorer-language");
  if (savedLanguage && translations[savedLanguage]) language = savedLanguage;
} catch {}
languageSelect.value = language;
languageSelect.addEventListener("change", () => {
  language = languageSelect.value;
  try {
    localStorage.setItem("json-explorer-language", language);
  } catch {}
  applyTranslations();
});
applyTranslations();
renderJson();
