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
const graphCanvas = document.querySelector("#graph-canvas");
const graph = document.querySelector("#graph");
const message = document.querySelector("#parse-message");
const searchInput = document.querySelector("#search-input");
const summary = document.querySelector("#tree-summary");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const sourceSize = document.querySelector("#source-size");
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
  if (!match) return error.message;
  const position = Number(match[1]);
  const beforeError = source.slice(0, position);
  const line = beforeError.split("\n").length;
  const column = position - beforeError.lastIndexOf("\n");
  return `JSON non valido alla riga ${line}, colonna ${column}. ${error.message}`;
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
  if (node.path === "$") return "Root";
  return node.isArrayItem ? `[${node.key}]` : node.key;
}

function getNodePreview(node) {
  if (!node.isContainer) return displayValue(node.value);
  if (node.type === "array") return "Lista di elementi";
  return "Oggetto con proprietà";
}

function getNodeCount(node) {
  return `${node.children.length} ${node.children.length === 1 ? "elemento" : "elementi"}`;
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
      ? `${node.expanded ? "−" : "+"}  ${node.expanded ? "Riduci" : "Espandi"} · ${getNodeCount(node)}`
      : getNodeCount(node);
    setText(group, action, 17, 74, "node-footnote");
  } else {
    setText(group, `Percorso  ${truncateText(node.path, 29)}`, 17, 74, "node-footnote");
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

function renderGraph({ fit = false } = {}) {
  if (!rootNode) return;
  const visibleRoot = !searchVisible || searchVisible.has(rootNode.path);
  emptyState.hidden = visibleRoot;
  graph.replaceChildren();
  if (!visibleRoot) return;

  measureSubtree(rootNode);
  placeNodes(rootNode, 0, graphPadding);
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
    summary.textContent = "JSON non valido";
    resultCount.textContent = "";
    emptyState.hidden = true;
    message.className = "message error";
    message.textContent = getParseError(error, input.value);
    return;
  }

  expandedPaths.clear();
  expandedPaths.add("$");
  rootNode = buildNode("$", data, "$");
  searchInput.value = "";
  searchMatches = new Set();
  searchVisible = null;
  resultCount.textContent = "";
  message.className = "message success";
  message.textContent = "Struttura aggiornata.";
  const stats = getStats(data);
  summary.textContent = `${stats.objects} oggetti · ${stats.arrays} array · ${stats.values} valori`;
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
  const query = searchInput.value.trim().toLocaleLowerCase("it");
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
    resultCount.textContent = `${searchMatches.size} ${searchMatches.size === 1 ? "risultato" : "risultati"}`;
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
  renderGraph({ fit: true });
});

document.querySelector("#collapse-button").addEventListener("click", () => {
  if (!rootNode) return;
  for (const node of collectAllNodes(rootNode)) setExpanded(node, false);
  renderGraph({ fit: true });
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
  if (!node?.isContainer || !node.children.length) return;
  setExpanded(node, !node.expanded);
  renderGraph({ fit: true });
});

graph.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const nodeElement = event.target.closest(".graph-node");
  if (!nodeElement || !rootNode) return;
  event.preventDefault();
  const node = findNode(rootNode, nodeElement.dataset.path);
  if (!node?.isContainer || !node.children.length) return;
  setExpanded(node, !node.expanded);
  renderGraph({ fit: true });
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
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(renderFrame);
  renderFrame = window.requestAnimationFrame(() => renderGraph({ fit: true }));
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
