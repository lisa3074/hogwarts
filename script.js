let filter = "Alle";
let SortButtons = document.querySelectorAll(".filter");
const jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
let student;

window.addEventListener("DOMContentLoaded", start);
const allStudents = [student];
const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  photo: "",
  theHouse: "",
  fullName: ""
};

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
  let response = await fetch(jsonUrl);
  houses = await response.json();
  prepareObjects(houses);
}

function fetchHouses(student) {
  console.log("fetchHouses");
  document.querySelector("#student_list").innerHTML = "";

  allStudents.forEach(() => {
    if (filter == student.theHouse || filter == "Alle") {
      const clone = document.querySelector(".temp").content.cloneNode(true);
      clone.querySelector(".house").textContent += student.theHouse;
      clone.querySelector(".name").textContent += student.fullName;
      clone.firstElementChild.addEventListener("click", function() {
        popUp(student);
      });
      document.querySelector("#student_list").appendChild(clone);
    }
  });
}

/* function fetchHouses(student) {
  // clear the list
  document.querySelector("#student_list").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent(student));
}

function displayStudent(student) {
  console.log("displayStudent");
  console.log(student);
  // create clone
  const clone = document.querySelector(".temp").content.cloneNode(true);

  // set clone data
  clone.querySelector(".house").textContent += student.theHouse;
  clone.querySelector(".name").textContent += student.fullName;

  // append clone to list
  document.querySelector("#student_list").appendChild(clone);
} */

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

function popUp() {
  console.log("popUp");
  if ((student.middleName = "")) {
    document.querySelector(".pop_name").textContent = `${student.firstName} ${student.lastName}`;
  }
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  document.querySelector(".pop_nick").textContent = student.nickName;
  document.querySelector(".pop_gender").textContent = student.gender;
  document.querySelector(".crest").src = "billeder/" + student.theHouse + ".png";
  document.querySelector(".crest").alt = student.theHouse + " crest";
  document.querySelector(".pop_house").textContent = student.theHouse;
  //theme changes in relation to house in the json file
  document.querySelector(".popup").dataset.theme = student.theHouse;
  const dataHouse = document.querySelector(".popup").dataset.house;
}

/* student.fullName = trimmedNames;
student.firstName = trimmedFirst;
student.lastName = trimmedLast;
student.gender = trimmedGender;
student.theHouse = trimmedHouse;
  student.nickName = nick;
  student.middelName = trimmedMiddel;*/

function close() {
  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
  });
}

function prepareObjects(houses) {
  houses.forEach(jsonStudent => {
    //console.log(jsonStudent);
    student = Object.create(Student);

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

    //Find special characters and thereby nickname
    const findSpecialCharacters = /(?!\s)/;
    const nick = trimmedMiddel.substring(findSpecialCharacters + 1, lastSpace);

    //Send to object
    student.fullName = trimmedNames;
    student.firstName = trimmedFirst;
    student.lastName = trimmedLast;
    student.gender = trimmedGender;
    student.theHouse = trimmedHouse;
    const find = trimmedMiddel.substring(0, 1);
    if (find === '"' || find === "'") {
      student.nickName = nick;
      console.log("Nickname");
    } else {
      student.middelName = trimmedMiddel;
      console.log("Middlename");
    }

    console.log(student);
    allStudents.push(student);
  });
  fetchHouses(student);
}
