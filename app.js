const SUPABASE_CONFIG = {
  url: "https://jlwdtaarbugcftvsvfxj.supabase.co",
  anonKey: "sb_publishable_OivJJC6gC2RCcMcDYEFN4w_PA5MbWTv",
  table: "daily_orders",
};

const dashboardData = {
  staffCount: 12,
  dailySales: 0,
  cards: [
    { label: "Truffles", name: "트러플", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Amour", name: "아무르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Kaviari", name: "카비아리", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Terre Bormane", name: "테레보르마네", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Le Clos de Laure", name: "르끌로드로르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Marco Giacosa", name: "마르코 지아코사", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Dried Mushroom", name: "건버섯", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Frozen Truffles", name: "냉동트러플", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Etc", name: "기타", quantity: 0, sales: 0, note: "금일 출고 대기" },
  ],
};

const categoryRules = [
  { key: "트러플", label: "Truffles", match: ["트러플"] },
  { key: "아무르", label: "Amour", match: ["아무르"] },
  { key: "카비아리", label: "Kaviari", match: ["카비아리"] },
  { key: "테레보르마네", label: "Terre Bormane", match: ["보르마네", "발사믹", "시트리노", "보르마노"] },
  { key: "르끌로드로르", label: "Le Clos de Laure", match: ["잼"] },
  { key: "마르코 지아코사", label: "Marco Giacosa", match: ["파스타"] },
  { key: "건버섯", label: "Dried Mushroom", match: ["모렐", "포르치니", "트럼펫", "지롤"] },
  { key: "냉동트러플", label: "Frozen Truffles", match: ["냉동", "페리고", "썸머", "중국트러플"] },
  { key: "기타", label: "Etc", match: [] },
];

const currentDateElement = document.querySelector("#currentDate");
const currentTimeElement = document.querySelector("#currentTime");
const staffCountElement = document.querySelector("#staffCount");
const dailySalesDateElement = document.querySelector("#dailySalesDate");
const dailySalesElement = document.querySelector("#dailySales");
const dashboardGridElement = document.querySelector("#dashboardGrid");
const cardTemplate = document.querySelector("#cardTemplate");
const sectionNoteElement = document.querySelector("#sectionNote");

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ko-KR").format(value)} 원`;
}

function getQuantityUnit(categoryName) {
  return ["트러플", "건버섯", "냉동트러플"].includes(categoryName) ? "g" : "개";
}

function formatQuantity(value, categoryName) {
  return `출고: ${new Intl.NumberFormat("ko-KR").format(value)} ${getQuantityUnit(categoryName)}`;
}

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (value == null || value === "") {
    return 0;
  }

  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function classifyCategory(productName = "") {
  if (["냉동", "페리고", "썸머", "중국트러플"].some((keyword) => productName.includes(keyword))) {
    return categoryRules.find((category) => category.key === "냉동트러플");
  }

  const matchedCategory = categoryRules.find((category) =>
    category.match.some((keyword) => productName.includes(keyword)),
  );

  return matchedCategory ?? categoryRules[categoryRules.length - 1];
}

function createEmptyCards() {
  return categoryRules.map((category) => ({
    label: category.label,
    name: category.key,
    quantity: 0,
    sales: 0,
    note: "금일 출고 대기",
    items: new Map(),
  }));
}

function updateClock() {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);

  currentDateElement.textContent = formattedDate;
  dailySalesDateElement.textContent = formattedDate;
  currentTimeElement.textContent = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}

function renderCards(cards) {
  dashboardGridElement.innerHTML = "";

  cards.forEach((cardData) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const listElement = card.querySelector(".card-list");
    const chipElement = card.querySelector(".card-chip");
    const salesElement = document.createElement("span");
    const quantityElement = document.createElement("span");

    card.querySelector(".card-title").textContent = cardData.name;
    card.querySelector(".card-label").textContent = cardData.label;
    salesElement.className = "card-sales";
    quantityElement.className = "card-quantity-inline";
    salesElement.textContent = formatCurrency(cardData.sales);
    quantityElement.textContent = formatQuantity(cardData.quantity, cardData.name);
    chipElement.replaceChildren(salesElement, quantityElement);
    card.querySelector(".card-metric").textContent = "";
    card.querySelector(".card-note").textContent = cardData.note;

    if (cardData.items?.length) {
      cardData.items.forEach((item) => {
        const listItem = document.createElement("li");
        const nameElement = document.createElement("span");
        const quantityElement = document.createElement("span");

        nameElement.className = "item-name";
        quantityElement.className = "item-qty";
        nameElement.textContent = item.name;
        quantityElement.textContent = `${new Intl.NumberFormat("ko-KR").format(item.quantity)} ${getQuantityUnit(
          cardData.name,
        )}`;

        listItem.append(nameElement, quantityElement);
        listElement.append(listItem);
      });
    }

    dashboardGridElement.appendChild(card);
  });
}

function renderFallback() {
  staffCountElement.textContent = `${dashboardData.staffCount} 명`;
  dailySalesElement.textContent = formatCurrency(dashboardData.dailySales);
  renderCards(dashboardData.cards);
  sectionNoteElement.textContent = "현재는 임시 데이터로 구성되어 있습니다.";
}

async function fetchRows() {
  const url = new URL(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`);
  url.searchParams.set("select", "*");
  url.searchParams.set("limit", "5000");

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_CONFIG.anonKey,
      Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase fetch failed (${response.status}): ${text}`);
  }

  return JSON.parse(text);
}

function summarizeRows(rows) {
  const cards = createEmptyCards();
  const cardMap = new Map(cards.map((card) => [card.name, card]));
  let totalSales = 0;

  rows.forEach((row) => {
    const productName = row["품목명"] ?? "";
    const quantity = toNumber(row["수량"]);
    const sales = toNumber(row["공급가액"]);
    const category = classifyCategory(productName);
    const card = cardMap.get(category.key);

    totalSales += sales;

    if (!card) {
      return;
    }

    card.quantity += quantity;
    card.sales += sales;
    if (productName) {
      const previousQuantity = card.items.get(productName) ?? 0;
      card.items.set(productName, previousQuantity + quantity);
    }
  });

  return {
    totalSales,
    cards: cards.map((card) => ({
      label: card.label,
      name: card.name,
      quantity: card.quantity,
      sales: card.sales,
      note: card.items.size > 0 ? `${card.items.size}개 품목 출고` : "금일 발주 없음",
      items: [...card.items.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, quantity]) => ({ name, quantity })),
    })),
  };
}

async function initDashboard() {
  renderFallback();
  updateClock();
  setInterval(updateClock, 1000);

  try {
    const rows = await fetchRows();
    const summary = summarizeRows(rows);

    staffCountElement.textContent = `${dashboardData.staffCount} 명`;
    dailySalesElement.textContent = formatCurrency(summary.totalSales);
    renderCards(summary.cards);
    sectionNoteElement.textContent = `Supabase 실데이터 반영 완료 · 전체 ${rows.length}건 기준`;
  } catch (error) {
    console.error(error);
    sectionNoteElement.textContent = "Supabase 연결 실패 · 임시 데이터를 표시 중입니다.";
  }
}

initDashboard();
