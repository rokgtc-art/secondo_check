const dashboardData = {
  staffCount: 12,
  dailySales: 0,
  cards: [
    { label: "Truffles", name: "트러플", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Dried Mushroom", name: "건버섯", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Amour", name: "아무르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Kaviari", name: "카비아리", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Terre Bormane", name: "테레보르마네", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Le Clos de Laure", name: "르끌로드로르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Marco Giacosa", name: "마르코 지아코사", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { label: "Etc", name: "기타", quantity: 0, sales: 0, note: "금일 출고 대기" },
  ],
};

const categoryRules = [
  {
    key: "트러플",
    label: "Truffles",
    match: ["트러플"],
  },
  {
    key: "건버섯",
    label: "Dried Mushroom",
    match: ["모렐", "포르치니", "트럼펫", "지롤"],
  },
  {
    key: "아무르",
    label: "Amour",
    match: ["아무르"],
  },
  {
    key: "카비아리",
    label: "Kaviari",
    match: ["카비아리"],
  },
  {
    key: "테레보르마네",
    label: "Terre Bormane",
    match: ["보르마네", "발사믹", "시트리노", "보르마노"],
  },
  {
    key: "르끌로드로르",
    label: "Le Clos de Laure",
    match: ["잼"],
  },
  {
    key: "마르코 지아코사",
    label: "Marco Giacosa",
    match: ["파스타"],
  },
  {
    key: "기타",
    label: "Etc",
    match: [],
  },
];

const currentDateElement = document.querySelector("#currentDate");
const currentTimeElement = document.querySelector("#currentTime");
const staffCountElement = document.querySelector("#staffCount");
const dailySalesDateElement = document.querySelector("#dailySalesDate");
const dailySalesElement = document.querySelector("#dailySales");
const dashboardGridElement = document.querySelector("#dashboardGrid");
const cardTemplate = document.querySelector("#cardTemplate");

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ko-KR").format(value)} 원`;
}

function formatQuantity(value) {
  return `출고수: ${new Intl.NumberFormat("ko-KR").format(value)}`;
}

function classifyCategory(productName = "") {
  const matchedCategory = categoryRules.find((category) =>
    category.match.some((keyword) => productName.includes(keyword)),
  );

  return matchedCategory ?? categoryRules[categoryRules.length - 1];
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

    card.querySelector(".card-title").textContent = cardData.name;
    card.querySelector(".card-label").textContent = cardData.label;
    card.querySelector(".card-chip").textContent = formatCurrency(cardData.sales);
    card.querySelector(".card-metric").textContent = formatQuantity(cardData.quantity);
    card.querySelector(".card-note").textContent = cardData.note;

    dashboardGridElement.appendChild(card);
  });
}

function initDashboard() {
  staffCountElement.textContent = `${dashboardData.staffCount} 명`;
  dailySalesElement.textContent = formatCurrency(dashboardData.dailySales);
  renderCards(dashboardData.cards);
  updateClock();
  setInterval(updateClock, 1000);
}

initDashboard();
