const dashboardData = {
  staffCount: 5,
  dailySales: 0,
  cards: [
    { name: "트러플", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "건버섯", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "아무르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "카비아리", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "테레보르마네", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "르끌로드로르", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "지아코마르코사", quantity: 0, sales: 0, note: "금일 출고 대기" },
    { name: "기타", quantity: 0, sales: 0, note: "금일 출고 대기" },
  ],
};

const currentDateElement = document.querySelector("#currentDate");
const currentTimeElement = document.querySelector("#currentTime");
const staffCountElement = document.querySelector("#staffCount");
const dailySalesElement = document.querySelector("#dailySales");
const dashboardGridElement = document.querySelector("#dashboardGrid");
const cardTemplate = document.querySelector("#cardTemplate");

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

function formatQuantity(value) {
  return `출고수: ${new Intl.NumberFormat("ko-KR").format(value)}`;
}

function updateClock() {
  const now = new Date();

  currentDateElement.textContent = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);

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
    card.querySelector(".card-chip").textContent = formatCurrency(cardData.sales);
    card.querySelector(".card-metric").textContent = formatQuantity(cardData.quantity);
    card.querySelector(".card-note").textContent = cardData.note;

    dashboardGridElement.appendChild(card);
  });
}

function initDashboard() {
  staffCountElement.textContent = dashboardData.staffCount;
  dailySalesElement.textContent = formatCurrency(dashboardData.dailySales);
  renderCards(dashboardData.cards);
  updateClock();
  setInterval(updateClock, 1000);
}

initDashboard();
