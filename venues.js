const SUPABASE_CONFIG = {
  url: "https://jlwdtaarbugcftvsvfxj.supabase.co",
  anonKey: "sb_publishable_OivJJC6gC2RCcMcDYEFN4w_PA5MbWTv",
  table: "daily_orders",
};

const venueDateElement = document.querySelector("#venueDate");
const venueSalesElement = document.querySelector("#venueSales");
const venueSectionNoteElement = document.querySelector("#venueSectionNote");
const venueGridElement = document.querySelector("#venueGrid");
const venueCardTemplate = document.querySelector("#venueCardTemplate");
const sortToggleElement = document.querySelector("#sortToggle");

let currentSortMode = "default";
let latestSummary = null;

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ko-KR").format(value)} 원`;
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

function formatDisplayDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
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

function getLatestDate(rows) {
  return rows.reduce((latestDate, row) => {
    const rowDate = row["일자"];
    if (!rowDate) {
      return latestDate;
    }

    return !latestDate || rowDate > latestDate ? rowDate : latestDate;
  }, "");
}

function summarizeVenues(rows) {
  const latestDate = getLatestDate(rows);
  const venueMap = new Map();
  let totalSales = 0;

  rows.forEach((row) => {
    if (row["일자"] !== latestDate) {
      return;
    }

    const venueName = row["업장명"] || "미등록 업장";
    const productName = row["품목명"] || "미등록 품목";
    const sales = toNumber(row["공급가액"]);

    if (!venueMap.has(venueName)) {
      venueMap.set(venueName, {
        name: venueName,
        sales: 0,
        products: new Set(),
        order: venueMap.size,
      });
    }

    const venue = venueMap.get(venueName);
    venue.sales += sales;
    venue.products.add(productName);
    totalSales += sales;
  });

  const venues = [...venueMap.values()]
    .map((venue) => ({
      name: venue.name,
      sales: venue.sales,
      note: `${venue.products.size}개 제품 출고`,
      products: [...venue.products].sort((a, b) => a.localeCompare(b, "ko-KR")),
      order: venue.order,
    }))
    .sort((a, b) => a.order - b.order);

  return {
    latestDate,
    totalSales,
    venues,
  };
}

function getSortedVenues(venues) {
  const copiedVenues = [...venues];

  if (currentSortMode === "sales") {
    return copiedVenues.sort((a, b) => b.sales - a.sales || a.order - b.order);
  }

  return copiedVenues.sort((a, b) => a.order - b.order);
}

function updateSortToggleLabel() {
  sortToggleElement.textContent =
    currentSortMode === "default" ? "발주 순서 정렬" : "매출액 정렬";
}

function renderFallback() {
  venueDateElement.textContent = "-";
  venueSalesElement.textContent = "0 원";
  venueSectionNoteElement.textContent = "업장별 출고 데이터를 불러오는 중입니다.";
  venueGridElement.innerHTML = "";
}

function renderVenueCards(venues) {
  venueGridElement.innerHTML = "";

  venues.forEach((venue) => {
    const card = venueCardTemplate.content.firstElementChild.cloneNode(true);
    const productList = card.querySelector(".card-list");

    card.querySelector(".card-title").textContent = venue.name;
    card.querySelector(".card-sales").textContent = formatCurrency(venue.sales);
    card.querySelector(".card-note").textContent = venue.note;

    venue.products.forEach((product) => {
      const listItem = document.createElement("li");
      const nameElement = document.createElement("span");

      nameElement.className = "item-name";
      nameElement.textContent = product;
      listItem.append(nameElement);
      productList.append(listItem);
    });

    venueGridElement.append(card);
  });
}

async function initVenueDashboard() {
  renderFallback();
  updateSortToggleLabel();

  try {
    const rows = await fetchRows();
    const summary = summarizeVenues(rows);
    latestSummary = summary;

    venueDateElement.textContent = formatDisplayDate(summary.latestDate);
    venueSalesElement.textContent = formatCurrency(summary.totalSales);
    renderVenueCards(getSortedVenues(summary.venues));
    venueSectionNoteElement.textContent = `금일 발주 업장 ${summary.venues.length} 개`;
  } catch (error) {
    console.error(error);
    venueSectionNoteElement.textContent = "Supabase 연결 실패 · 업장 데이터를 불러오지 못했습니다.";
  }
}

sortToggleElement.addEventListener("click", () => {
  currentSortMode = currentSortMode === "default" ? "sales" : "default";
  updateSortToggleLabel();

  if (latestSummary) {
    renderVenueCards(getSortedVenues(latestSummary.venues));
  }
});

initVenueDashboard();
