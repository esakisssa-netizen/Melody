const floorNumber = document.getElementById("floorNumber");
const modalFloor = document.getElementById("modalFloor");
const floorLine = document.getElementById("floorLine");
const floorHotspots = document.getElementById("floorHotspots");
const buildingMain = document.getElementById("buildingMain");

const floorUp = document.getElementById("floorUp");
const floorDown = document.getElementById("floorDown");

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");

const apartmentsList = document.getElementById("apartmentsList");
const rooms = document.querySelectorAll(".room");

let currentFloor = 7;

const minFloor = 2;
const maxFloor = 18;
const floorCount = maxFloor - minFloor + 1;

function formatFloor(number) {
  return number < 10 ? `0${number}` : String(number);
}

function getApartmentsForFloor(floor) {
  const roomTypes = [1, 2, 2, 3, 1, 2, 3, 2, 1];

  return roomTypes.map((roomsCount, index) => {
    const apartmentNumber = floor * 100 + index + 1;

    const baseArea = [38.4, 50.2, 52.8, 75.1, 41.3, 56.7, 82.4, 49.9, 44.6][
      index
    ];

    const area = (baseArea + floor * 0.3 + index * 0.2).toFixed(1);

    return {
      id: index + 1,
      number: apartmentNumber,
      rooms: roomsCount,
      area,
      sold: (floor + index) % 5 === 0,
    };
  });
}

function getFloorTop(floor) {
  const buildingHeight = buildingMain.offsetHeight;
  const floorHeight = buildingHeight / floorCount;
  const floorIndex = floor - minFloor;

  return buildingHeight - floorHeight * (floorIndex + 1);
}

function updateFloor() {
  floorNumber.textContent = formatFloor(currentFloor);
  modalFloor.textContent = formatFloor(currentFloor);

  const top = getFloorTop(currentFloor);
  const height = buildingMain.offsetHeight / floorCount;

  floorLine.style.top = `${top}px`;
  floorLine.style.height = `${height}px`;

  renderApartments();
}

function createFloorHotspots() {
  floorHotspots.innerHTML = "";

  const buildingHeight = buildingMain.offsetHeight;
  const floorHeight = buildingHeight / floorCount;

  for (let floor = minFloor; floor <= maxFloor; floor++) {
    const hotspot = document.createElement("div");

    hotspot.classList.add("floor-hotspot");
    hotspot.dataset.floor = floor;

    hotspot.style.top = `${getFloorTop(floor)}px`;
    hotspot.style.height = `${floorHeight}px`;

    hotspot.addEventListener("mouseenter", () => {
      currentFloor = floor;
      updateFloor();
    });

    hotspot.addEventListener("click", () => {
      currentFloor = floor;
      updateFloor();
      modal.classList.add("show");
    });

    floorHotspots.append(hotspot);
  }
}

function renderApartments() {
  const apartments = getApartmentsForFloor(currentFloor);

  apartmentsList.innerHTML = "";

  rooms.forEach((room) => {
    room.classList.remove("active-room");
    room.classList.remove("sold");
  });

  apartments.forEach((apartment) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.dataset.room = apartment.id;

    link.textContent = `кв. ${apartment.number}, ${apartment.rooms} комн. ${apartment.area} кв. м.`;

    if (apartment.sold) {
      link.classList.add("sold");
    }

    link.addEventListener("mouseenter", () => {
      highlightRoom(apartment.id);
    });

    link.addEventListener("mouseleave", () => {
      removeRoomHighlight();
    });

    link.addEventListener("click", (event) => {
      event.preventDefault();

      document
        .querySelectorAll(".apartments-list a")
        .forEach((item) => item.classList.remove("selected"));

      link.classList.add("selected");
      highlightRoom(apartment.id);
    });

    li.append(link);
    apartmentsList.append(li);

    const room = document.querySelector(`.room[data-room="${apartment.id}"]`);

    if (room) {
      room.textContent = `${apartment.area} м²`;

      if (apartment.sold) {
        room.classList.add("sold");
      }
    }
  });
}

function highlightRoom(roomId) {
  removeRoomHighlight();

  const room = document.querySelector(`.room[data-room="${roomId}"]`);

  if (room) {
    room.classList.add("active-room");
  }
}

function removeRoomHighlight() {
  rooms.forEach((room) => room.classList.remove("active-room"));
}

rooms.forEach((room) => {
  room.addEventListener("mouseenter", () => {
    const roomId = room.dataset.room;

    highlightRoom(roomId);

    document.querySelectorAll(".apartments-list a").forEach((link) => {
      link.classList.remove("selected");

      if (link.dataset.room === roomId) {
        link.classList.add("selected");
      }
    });
  });

  room.addEventListener("mouseleave", () => {
    removeRoomHighlight();
  });
});

floorUp.addEventListener("click", () => {
  if (currentFloor < maxFloor) {
    currentFloor++;
    updateFloor();
  }
});

floorDown.addEventListener("click", () => {
  if (currentFloor > minFloor) {
    currentFloor--;
    updateFloor();
  }
});

openModal.addEventListener("click", () => {
  modal.classList.add("show");
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modal.classList.remove("show");
  }
});

createFloorHotspots();
updateFloor();

window.addEventListener("resize", () => {
  createFloorHotspots();
  updateFloor();
});