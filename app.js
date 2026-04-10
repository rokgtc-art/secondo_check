const dashboardData = {
  staffCount: 5,
  cards: [
    { name: "트러플", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "건버섯", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "아무르", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "카비아리", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "테레보르마네", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "르끌로드로르", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "지아코마르코사", sales: 0, note: "데이터 연동 전 임시 값" },
    { name: "기타", sales: 0, note: "데이터 연동 전 임시 값" },
  ],
};

const currentDateElement = document.querySelector("#currentDate");
const currentTimeElement = document.querySelector("#currentTime");
const staffCountElement = document.querySelector("#staffCount");
const dashboardGridElement = document.querySelector("#dashboardGrid");
const cardTemplate = document.querySelector("#cardTemplate");

function formatCurrency(value) {
  return `매출: ${new Intl.NumberFormat("ko-KR").format(value)}원`;
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
    card.querySelector(".card-metric").textContent = formatCurrency(cardData.sales);
    card.querySelector(".card-note").textContent = cardData.note;

    dashboardGridElement.appendChild(card);
  });
}

function initDashboard() {
  staffCountElement.textContent = dashboardData.staffCount;
  renderCards(dashboardData.cards);
  updateClock();
  setInterval(updateClock, 1000);
}

initDashboard();
