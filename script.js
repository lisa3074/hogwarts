let filter = "Alle";
let SortButtons = document.querySelectorAll(".filter");

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("start");
  document.querySelector(".popup").classList = "popup hide";
  document.querySelector(".alle").classList.add("chosen");
  SortButtons.forEach(element => {
    element.addEventListener("click", sort);
  });
  document.querySelector("select").addEventListener("change", function() {
    selectSort();
  });
  close();
  fetchJson();
}

async function fetchJson() {
  console.log("fetchJson");
  let response = await fetch("students1991.json");
  houses = await response.json();
  fetchHouses();
}

function fetchHouses() {
  console.log("fetchHouses");
  let studentTemplate = document.querySelector(".temp");
  let studentList = document.querySelector("#student_list");
  studentList.innerHTML = "";

  houses.forEach(house => {
    if (filter == house.house || filter == "Alle") {
      const clone = studentTemplate.cloneNode(true).content;
      clone.querySelector(".house").textContent += house.house;
      clone.querySelector(".name").textContent += house.fullname;
      clone.firstElementChild.addEventListener("click", function() {
        popUp(house);
      });
      studentList.appendChild(clone);
    }
  });
}

function sort() {
  console.log("sort");
  SortButtons.forEach(button => {
    button.classList.remove("chosen");
  });
  this.classList.add("chosen");
  filter = this.dataset.kategori;
  fetchJson();
}
function selectSort() {
  document.querySelector("select").addEventListener("change", function() {
    filter = event.target.value;
    fetchJson();
  });
}

function popUp(house) {
  console.log("popUp");
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = house.fullname;
  document.querySelector(".crest").src = "billeder/" + house.house + ".png";
  document.querySelector(".crest").alt = house.house + " crest";
  document.querySelector(".pop_house").textContent = house.house;
  //theme changes in relation to house in the json file
  document.querySelector(".popup").dataset.theme = house.house;
  const dataHouse = document.querySelector(".popup").dataset.house;
}

function close() {
  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
  });
}
