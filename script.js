//let HTML.filter = "Alle";

const HTML = {};
//let HTML.SortButtons = document.querySelectorAll(".filter");
//const HTML.jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
//let studentObject;

window.addEventListener("DOMContentLoaded", init);

const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  photo: "",
  theHouse: "",
  fullName: ""
};
const allStudents = [];

function init() {
  HTML.jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
  HTML.sortButtons = document.querySelectorAll(".filter");
  HTML.filter = "Alle";
  start();
}

function start() {
  //console.log("start");
  document.querySelector(".popup").classList = "popup hide";
  document.querySelector(".alle").classList.add("chosen");
  HTML.sortButtons.forEach(element => {
    element.addEventListener("click", sort);
  });
  document.querySelector("select").addEventListener("change", function() {
    selectSort();
  });
  close();
  fetchJson();
}

async function fetchJson() {
  //console.log("fetchJson");
  let response = await fetch(HTML.jsonUrl);
  jsonEntries = await response.json();
  makeObjects(jsonEntries);
  fetchHouses();
}

function makeObjects(jsonEntries) {
  jsonEntries.forEach(jsonStudent => {
    //console.log(jsonStudent);
    studentObject = Object.create(Student);

    //Raw json data
    //The whole string
    const nameSplit = jsonStudent.fullname;
    let gender = jsonStudent.gender;
    let house = jsonStudent.house;

    //Make all characters lowercase
    const smallCaps = nameSplit.toLowerCase();
    const smallGender = gender.toLowerCase();
    const smallHouse = house.toLowerCase();

    //Trimmed string
    let trimmedNames = smallCaps.trim();

    //Make strings prettier
    //Placeholding variable
    const findCharacters = /(\b[a-z](?!\s))/g;
    trimmedNames = trimmedNames.replace(findCharacters, function(capitalLetters) {
      //Uppercaseletters
      return capitalLetters.toUpperCase();
    });
    gender = smallGender.replace(findCharacters, function(capitalLetters) {
      //Uppercaseletters
      return capitalLetters.toUpperCase();
    });
    house = smallHouse.replace(findCharacters, function(capitalLetters) {
      //Uppercaseletters
      return capitalLetters.toUpperCase();
    });

    //find the first name in the string
    const firstSpace = trimmedNames.indexOf(" ");
    const first = trimmedNames.substring(0, firstSpace);

    //Find the last name in the string
    const lastSpace = trimmedNames.lastIndexOf(" ");
    const last = trimmedNames.substring(lastSpace, trimmedNames.length);

    //find the middel name in the string
    let middle = trimmedNames.substring(firstSpace + 1, lastSpace);

    //Trim all words
    let trimmedMiddel = middle.trim();
    let trimmedLast = last.trim();
    let trimmedFirst = first.trim();
    let trimmedHouse = house.trim();
    let trimmedGender = gender.trim();

    //Find nickName and remove ""
    //Search for " after the first character in trimmedMiddle
    const findNickEnd = trimmedMiddel.indexOf('"', 1);
    //Make a new string from 1 to findNickEnd (of trimmedMiddle)
    const nick = trimmedMiddel.substring(1, findNickEnd);

    //Send to object
    studentObject.fullName = trimmedNames;
    studentObject.firstName = trimmedFirst;
    studentObject.lastName = trimmedLast;
    studentObject.gender = trimmedGender;
    studentObject.theHouse = trimmedHouse;
    const find = trimmedMiddel.substring(0, 1);
    if (find === '"' || find === "'") {
      studentObject.nickName = nick;
      //console.log("Nickname");
      console.log(nick);
    } else {
      studentObject.middelName = trimmedMiddel;
      //console.log("Middlename");
    }
    allStudents.push(studentObject);
    //console.log(studentObject);
  });
}

function fetchHouses() {
  //console.log("fetchHouses");
  document.querySelector("#student_list").innerHTML = "";

  //allStudents.shift();
  allStudents.forEach(student => {
    if (HTML.filter == student.theHouse || HTML.filter == "Alle") {
      const clone = document.querySelector(".temp").content.cloneNode(true);
      clone.querySelector(".house").textContent = student.theHouse;
      clone.querySelector(".name").textContent = student.fullName;
      clone.firstElementChild.addEventListener("click", function() {
        popUp(student);
      });
      document.querySelector("#student_list").appendChild(clone);
      //console.log(student);
    }
  });
}

function sort() {
  //console.log("sort");
  HTML.SortButtons.forEach(button => {
    button.classList.remove("chosen");
  });
  this.classList.add("chosen");
  HTML.filter = this.dataset.kategori;
  fetchJson();
}
function selectSort() {
  document.querySelector("select").addEventListener("change", function() {
    HTML.filter = event.target.value;
    fetchJson();
  });
}

function popUp(student) {
  //console.log("popUp");
  if ((student.middleName = "")) {
    document.querySelector(".pop_name").textContent = `${student.firstName} ${student.lastName}`;
  }
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = `${student.firstName} ${student.middelName} ${student.lastName}`;
  document.querySelector(".pop_nick").textContent = student.nickName;
  document.querySelector(".pop_gender").textContent = student.gender;
  document.querySelector(".crest").src = "billeder/" + student.theHouse + ".png";
  document.querySelector(".crest").alt = student.theHouse + " crest";
  document.querySelector(".pop_house").textContent = student.theHouse;
  //theme changes in relation to house in the json file
  document.querySelector(".popup").dataset.theme = student.theHouse;
  const dataHouse = document.querySelector(".popup").dataset.house;
}

function close() {
  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
  });
}
