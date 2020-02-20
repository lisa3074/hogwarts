"use strict";
window.addEventListener("DOMContentLoaded", init);

const HTML = {};
const allStudents = [];

const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  photo: "",
  theHouse: "",
  fullName: ""
};

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
  selectSort();
  close();
  //calls the async function with the jsonUrl and the function that should be called after the async,.
  fetchJson(HTML.jsonUrl, makeObjects);
}
//Uses the url parameter, so the url can change depending on the calling function.
//Callback is called with the variable that is the json, which is sent on to the next function.
async function fetchJson(url, callback) {
  //console.log("fetchJson");
  const response = await fetch(url);
  const jsonEntries = await response.json();
  callback(jsonEntries);
  fetchList();
}

function makeObjects(jsonEntries) {
  jsonEntries.forEach(jsonStudent => {
    //console.log(jsonStudent);
    const studentObject = Object.create(Student);

    //Raw json data / The whole string
    let fullString = jsonStudent.fullname.trim().toLowerCase();
    let gender = jsonStudent.gender.trim().toLowerCase();
    let house = jsonStudent.house.trim().toLowerCase();

    //replace the characters found by metacharacters
    fullString = fullString.replace(/(\b[a-z](?!\s))/g, function(capitalLetters) {
      return capitalLetters.toUpperCase();
    });
    gender = gender.replace(/(\b[a-z](?!\s))/g, function(capitalLetters) {
      return capitalLetters.toUpperCase();
    });
    house = house.replace(/(\b[a-z](?!\s))/g, function(capitalLetters) {
      return capitalLetters.toUpperCase();
    });

    //find the first name in the string
    const firstSpace = fullString.indexOf(" ");
    const first = fullString.substring(0, firstSpace);

    //Find the last name in the string
    const lastSpace = fullString.lastIndexOf(" ");
    const last = fullString.substring(lastSpace + 1, fullString.length);

    //find the middel name in the string
    let middle = fullString.substring(firstSpace + 1, lastSpace);

    //Find nickName and remove "". Search for " after the first character in middle
    const findNickEnd = middle.indexOf('"', 1);
    //Make a new string from 1 to findNickEnd (of middle)
    const nick = middle.substring(1, findNickEnd);

    //Send to object
    studentObject.fullName = fullString;
    studentObject.firstName = first;
    studentObject.lastName = last;
    studentObject.gender = gender;
    studentObject.theHouse = house;

    const find = middle.substring(0, 1);
    if (find === '"' || find === "'") {
      studentObject.nickName = nick;
    } else {
      studentObject.middelName = middle;
    }
    allStudents.push(studentObject);
  });
}

function fetchList() {
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
  HTML.sortButtons.forEach(button => {
    button.classList.remove("chosen");
  });
  this.classList.add("chosen");
  HTML.filter = this.dataset.kategori;
  //Calback function
  fetchJson(HTML.jsonUrl, makeObjects);
}
function selectSort() {
  document.querySelector("select").addEventListener("change", function() {
    HTML.filter = event.target.value;
    fetchJson(HTML.jsonUrl, makeObjects);
    console.log("change");
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
}

function close() {
  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
  });
}
