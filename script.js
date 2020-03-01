"use strict";
window.addEventListener("DOMContentLoaded", init);

const HTML = {};

// STUDENT OBJECT
const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "",
  photo: "",
  theHouse: "",
  fullName: "",
  prefect: false,
  squad: false,
  otherNotations: false,
  textNotations: undefined,
  expelled: false,
  halfBlood: "",
  pureBlood: "",
  muggle: ""
};

//GLOBAL VARIALBES IN OBJECT
function init() {
  HTML.jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
  HTML.jsonBlood = "https://petlatkea.dk/2020/hogwarts/families.json";
  HTML.filterButtons = document.querySelectorAll(".filter");
  HTML.secondFilterButtons = document.querySelectorAll(".sort");
  HTML.sortButton = document.querySelectorAll(".button");
  HTML.filter = "Alle";
  HTML.sortList;
  HTML.filteredStudents = [];
  HTML.allStudents = [];
  HTML.expelledStudent = [];
  HTML.direction;
  HTML.directionHouse;
  HTML.filterSecond = "Alle";
  HTML.notes;
  HTML.json = 0;
  HTML.halfBlood;
  HTML.pureBlood;
  HTML.sortFilter = "Alle";
  HTML.hacked;
  start();
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//------------------------ CONTROLLER FUNCTIONS ------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------

function start() {
  console.log("start");
  document.querySelector(".popup").classList = "popup hide";
  document.querySelector(".alle").classList.add("chosen");
  HTML.allStudents = HTML.filteredStudents;
  delegation();
}

function delegation() {
  console.log("delegation");
  HTML.filterButtons.forEach(element => {
    element.addEventListener("click", filterHouseDesktop);
  });
  HTML.secondFilterButtons.forEach(element => {
    element.addEventListener("click", secondaryFilterDesktop);
  });
  HTML.sortButton.forEach(sortButton => {
    sortButton.addEventListener("click", sortStudents);
  });

  document.querySelector(".filter_mobile>select").addEventListener("change", filterHouseMobile);
  document.querySelector(".sort_mobile>select").addEventListener("change", secondaryFilterMobile);

  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
    document.querySelector(".notes").value = "";
  });
  document.querySelector(".no").addEventListener("click", function() {
    document.querySelector(".promptbox").classList.add("hide");
  });

  document.querySelector(".argh").addEventListener("click", function() {
    document.querySelector(".noBox").classList.add("hide");
  });
  //BLACKBOX found: https://stackoverflow.com/questions/905222/enter-key-press-event-in-javascript
  document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      hackTheSystem();
    }
  });

  document.querySelector(".search").addEventListener("keyup", function() {
    searchList();
  });

  //calls the async function with the jsonUrl and the function that should be called after the async,.
  fetchJson(HTML.jsonUrl, makeObjects);
  fetchJson(HTML.jsonBlood, makeBlood);
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//------------------------ MODEL FUNCTIONS ------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------

//--------------------- SEARCH FUNCTION -------------------------
function searchList() {
  //SOURCE FOR SEARCH FUNCTION: https://stackoverflow.com/questions/36897978/js-search-using-keyup-event-on-input-tag?fbclid=IwAR24tcWciO4KrDAUf0twPqnqm0MJgNC0hRBB8jZPPiXx7i0B7kryyX4ygvc
  //The code makes the user able to search for student names.
  const search = document.querySelector(".search");
  const list = HTML.filteredStudents.filter(student => student.fullName.toLowerCase().includes(search.value.toLowerCase()));
  fetchList(list);
}

//----------------------- JSON FUNCTION ---------------------------
//Uses the url parameter, so the url can change depending on the calling function.
//Callback is called with the variable that is the json, which is sent on to the next function.
async function fetchJson(url, callback) {
  console.log("fetchJson");
  const response = await fetch(url);
  const jsonEntries = await response.json();
  callback(jsonEntries);
}

//--------------------- MAKE/CLEAN OBJECTS ------------------------
function makeObjects(jsonEntries) {
  console.log("makeObjects");
  jsonEntries.forEach(jsonStudent => {
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

    //Find the last name in the string
    const lastSpace = fullString.lastIndexOf(" ");
    const last = fullString.substring(lastSpace + 1, fullString.length);

    //find the first name in the string
    const firstSpace = fullString.indexOf(" ");
    const first = fullString.substring(0, firstSpace);

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
    studentObject.prefrect = "";

    HTML.studentHalfBlood = studentObject.halfBlood;
    HTML.studentPureBlood = studentObject.pureBlood;

    const find = middle.substring(0, 1);
    if (find === '"' || find === "'") {
      studentObject.nickName = nick;
    } else {
      studentObject.middelName = middle;
    }
    HTML.allStudents.push(studentObject);
  });
  countJSON(HTML.allStudents);
}

function makeBlood(jsonEntries) {
  HTML.halfBlood = jsonEntries.half;
  HTML.pureBlood = jsonEntries.pure;
  countJSON();
}

function countJSON() {
  HTML.json++;
  if (HTML.json == 2) {
    console.log(HTML.json);
    compareBlood();
  }
}

function compareBlood() {
  HTML.allStudents.forEach(student => {
    //If the list of names in the current blodtype includes the specific student lastname
    const isPure = HTML.pureBlood.includes(student.lastName);
    const isHalf = HTML.halfBlood.includes(student.lastName);
    if (isPure) {
      student.pureBlood = true;
      student.halfBlood = false;
      student.muggle = false;
    } else if (isHalf) {
      student.pureBlood = false;
      student.halfBlood = true;
      student.muggle = false;
    } else {
      student.pureBlood = false;
      student.halfBlood = false;
      student.muggle = true;
    }
  });
  sortFromStart(HTML.filteredStudents);
}

function sortFromStart() {
  const direction = "dsc";
  const sortedList = sortList(direction);
  fetchList(sortedList);
}
//------------------ HOUSE FILTER FUNCTIONS ---------------------

//MOBILE FILTERING (HOUSE)
function filterHouseMobile() {
  HTML.filter = event.target.value;
  findFiltretStudents(HTML.filter);
}

//DESKTOP FILTERING (HOUSE)
function filterHouseDesktop() {
  console.log("filter");
  HTML.filterButtons.forEach(button => {
    button.classList.remove("chosen");
  });
  this.classList.add("chosen");
  HTML.filter = this.dataset.kategori;
  findFiltretStudents(HTML.filter);
}

function findFiltretStudents(filter) {
  const filteredStudents = filterStudentsByHouse(filter);
  HTML.filteredStudents = filteredStudents;
  fetchList(HTML.filteredStudents);
}

function filterStudentsByHouse(filter) {
  console.log("filterStudentsByHouse");
  const filteredStudents = HTML.allStudents.filter(filterFunction);
  function filterFunction(student) {
    return student.theHouse === filter || "Alle" === filter;
  }
  return filteredStudents;
}

// --------------- FILTERING BY SECONDARY PREFERENCES ------------------

//MOBILE FILTERING (SECONDARY)
function secondaryFilterMobile() {
  HTML.sortFilter = event.target.value;
  console.log(event.target.value);
  findSecondaryFiltretStudents(HTML.sortFilter);
}

//DESKTOP FILTERING (SECONDARY)
function secondaryFilterDesktop() {
  console.log("secondFilterChosen");
  HTML.secondFilterButtons.forEach(button => {
    button.classList.remove("chosen_sort");
  });
  this.classList.add("chosen_sort");
  HTML.filterSecond = this.dataset.add;
  findSecondaryFiltretStudents(HTML.filterSecond);
}

function findSecondaryFiltretStudents(filter) {
  console.log(filter);
  if (filter == "expelled") {
    fetchList(HTML.expelledStudent);
  } else {
    const sortedStudents = filterStudentByPrefrences(filter);
    fetchList(sortedStudents);
  }
}

function filterStudentByPrefrences(filter) {
  console.log("filterStudentsBySorts");
  const filteredStudents = HTML.filteredStudents.filter(filterFunction);
  function filterFunction(student) {
    if (filter == "prefect") {
      return student.prefect === true;
    } else if (filter == "squad") {
      return student.squad === true;
    } else if (filter == "otherNotations") {
      return student.otherNotations === true;
    } else if (filter == "Alle") {
      return filter === "Alle";
    }
  }
  return filteredStudents;
}

// ------------------------ SORTING STUDENTS A-Z --------------------------

function sortList(direction) {
  console.log("sortList");
  const sortedList = HTML.filteredStudents.sort(compareName);

  function compareName(a, b) {
    //console.log("compareName");
    if (direction == "dsc") {
      // console.log("asc");
      if (a.fullName < b.fullName) {
        return -1;
      }
    } else if (direction == "asc") {
      // console.log("asc");
      if (b.fullName < a.fullName) {
        return -1;
      }
    } else if (direction == "dsce") {
      // console.log("asc");
      if (a.theHouse < b.theHouse) {
        return -1;
      }
    } else if (direction == "asce") {
      // console.log("asc");
      if (b.theHouse < a.theHouse) {
        return -1;
      }
    }
  }
  return sortedList;
}

function expelledToggle(student) {
  if (student.fullName == "Lisa 'awesome' søndergaard") {
    hackedErrorBox();
  } else if (student.expelled === true) {
    student.expelled = false;
    //Find the index of the student, remove from expelled array and show list
    const theStudent = HTML.expelledStudent.indexOf(student);
    HTML.expelledStudent.splice(theStudent, 1);
    fetchList(HTML.expelledStudent);
  } else {
    //Find the index of the student, remove from filtredlist array and show list
    student.expelled = true;
    HTML.expelledStudent.push(student);
    const theStudent = HTML.filteredStudents.indexOf(student);
    HTML.filteredStudents.splice(theStudent, 1);
    fetchList(HTML.filteredStudents);
  }
}

function squadToggle(student) {
  console.log("squadToggle");
  if (student.theHouse == "Slytherin" || student.pureBlood == true) {
    if (student.squad === true) {
      student.squad = false;
    } else {
      student.squad = true;
    }
    fetchList(HTML.filteredStudents);
  } else {
    squadErrorBox();
  }
}

function prefectToggle(student) {
  const prefectsArray = HTML.filteredStudents.filter(student => {
    return student.prefect === true;
  });
  //See what gender vs. house is already in the prefectsArray and test it against the clicked student
  const prefectType = prefectsArray.some(prefect => {
    return prefect.gender === student.gender && prefect.theHouse === student.theHouse;
  });
  if (student.prefect === true) {
    student.prefect = false;
  } else if (student.prefect === false) {
    if (prefectType) {
      prefectErrorBox(student);
      student.prefect = false;
    } else {
      student.prefect = true;
    }
  }
  fetchList(HTML.filteredStudents);
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//------------------------ DISPLAY FUNCTIONS ------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------

// ------------------- CLEAR LIST AND SET NUMBER --------------------

function fetchList(studentObject) {
  console.log("fetchList");
  document.querySelector("#student_list").innerHTML = "";
  studentObject.forEach(displayStudents);
  document.querySelector(".number").textContent = studentObject.length;
}

// ------------------- DISPLAY STUDENT LIST -------------------------

function displayStudents(student) {
  const clone = document.querySelector(".temp").content.cloneNode(true);
  const expelledClone = clone.querySelector("[data-check='expelled']");
  const squadClone = clone.querySelector("[data-check='squad']");
  const prefectClone = clone.querySelector("[data-check='prefect']");
  const otherNotationsClone = clone.querySelector("[data-check='otherNotations']");

  //Set text on specific student in list
  clone.querySelector(".house").textContent = student.theHouse;
  if (student.middelName != undefined) {
    clone.querySelector(".name").textContent = student.firstName + " " + student.middelName + " " + student.lastName;
  } else if (student.nickName != undefined) {
    clone.querySelector(".name").textContent = student.firstName + " " + student.nickName + " " + student.lastName;
  } else {
    clone.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  }

  //Show student prefrences
  if (student.expelled === false) {
    expelledClone.classList.add("grey");
  } else {
    expelledClone.classList.remove("grey");
  }
  if (student.squad === false) {
    squadClone.classList.add("grey");
  } else {
    squadClone.classList.remove("grey");
  }
  if (student.prefect === false) {
    prefectClone.classList.add("grey");
  } else {
    prefectClone.classList.remove("grey");
  }
  if (student.otherNotations === false) {
    otherNotationsClone.classList.add("grey");
  } else {
    otherNotationsClone.classList.remove("grey");
  }

  //Eventlistner on cloned items
  clone.querySelector(".wrapper").addEventListener("click", function() {
    displayPopUp(student);
  });
  expelledClone.addEventListener("click", function() {
    expelledToggle(student);
  });
  prefectClone.addEventListener("click", function() {
    prefectToggle(student);
  });
  squadClone.addEventListener("click", function() {
    if (HTML.hacked == true) {
      squadToggle(student);
      setTimeout(() => {
        squadToggle(student);
        document.querySelector(".sound1").play();
      }, 1500);
    } else {
      squadToggle(student);
    }
  });
  document.querySelector("#student_list").appendChild(clone);
}

function sortStudents() {
  console.log("sort");
  if (this.dataset.direction == "asc") {
    document.querySelector(".sort_ab").textContent = "Name Z → A";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: NAME Z → A";
    this.dataset.direction = "dsc";
  } else if (this.dataset.direction == "dsc") {
    document.querySelector(".sort_ab").textContent = "Name A → Z";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: NAME A → Z";
    this.dataset.direction = "asc";
  } else if (this.dataset.direction == "asce") {
    document.querySelector(".sortHouse_ab").textContent = "House Z → A";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: HOUSE A → Z";
    this.dataset.direction = "dsce";
  } else if (this.dataset.direction == "dsce") {
    document.querySelector(".sortHouse_ab").textContent = "House A → Z";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: HOUSE Z → A";
    this.dataset.direction = "asce";
  }
  HTML.direction = this.dataset.direction;
  const sortedList = sortList(HTML.direction);
  fetchList(sortedList);
}

// ------------------- DISPLAY DETAILS POPUP ------------------------

function displayPopUp(student) {
  //Set filter on icons for preferences
  if (student.expelled == true) {
    document.querySelector(".expelled>.size").classList.remove("grey");
  } else {
    document.querySelector(".expelled>.size").classList.add("grey");
  }
  if (student.squad == true) {
    document.querySelector(".squad>.size").classList.remove("grey");
  } else {
    document.querySelector(".squad>.size").classList.add("grey");
  }
  if (student.prefect == true) {
    document.querySelector(".prefect>.size").classList.remove("grey");
  } else {
    document.querySelector(".prefect>.size").classList.add("grey");
  }
  if (student.otherNotations == true) {
    document.querySelector(".OtherNotes>.size").classList.remove("grey");
  } else {
    document.querySelector(".OtherNotes>.size").classList.add("grey");
  }

  //theme changes in relation to house in the json file
  document.querySelector(".popup").dataset.theme = student.theHouse;

  //Call the nested function to display the user input in Other Notations
  document.querySelector(".submit").addEventListener("click", function() {
    displayNotations(student);
  });
  //Display the user input saves as textNotations in studentobject
  document.querySelector(".textNotes").textContent = student.textNotations;
  setStudentDetails(student);
}

function setStudentDetails(student) {
  //Set details
  if (student.middleName == "") {
    document.querySelector(".pop_name").textContent = `${student.firstName} ${student.lastName}`;
  }
  if (student.nickName == "") {
    student.nickName = "No nickname";
  }
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = `${student.firstName} ${student.middelName} ${student.lastName}`;
  document.querySelector(".pop_nick").textContent = student.nickName;
  document.querySelector(".pop_gender").textContent = student.gender;
  document.querySelector(".image").alt = student.theHouse + " crest";
  document.querySelector(".pop_house").textContent = student.theHouse;
  if (student.pureBlood == true) {
    document.querySelector(".pop_blood").textContent = "Pure";
  } else if (student.halfBlood == true) {
    document.querySelector(".pop_blood").textContent = "Half";
  } else {
    document.querySelector(".pop_blood").textContent = "Muggle";
  }
  //Set image
  document.querySelector(".image").src = "billeder/" + student.theHouse + ".png";
  document.querySelector(".profilepic").alt = student.firstName + " " + student.lastName;
  if (student.lastName == "Patil") {
    document.querySelector(".profilepic").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
  } else if (student.lastName == "Finch-Fletchley") {
    document.querySelector(".profilepic").src = "images/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  } else {
    document.querySelector(".profilepic").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  }
}

function displayNotations(student) {
  //Clean up
  document.querySelector(".submit").removeEventListener("click", displayNotations);

  //Save user input as textnotation in the array
  student.textNotations = document.querySelector(".notes").value;

  if (student.textNotations != "") {
    document.querySelector(".OtherNotes>.size").classList.remove("grey");
    student.otherNotations = true;
  } else {
    document.querySelector(".OtherNotes>.size").classList.add("grey");
    student.otherNotations = false;
  }

  //Remove the value in input 0,5s after cliking submit
  document.querySelector(".textNotes").textContent = student.textNotations;
  setTimeout(() => {
    document.querySelector(".notes").value = "";
  }, 500);
  fetchList(HTML.filteredStudents);
}

// ------------------- DISPLAY ERROR POPUPS ------------------------

function prefectErrorBox(student) {
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".prompttext").classList.remove("hide");
  document.querySelector(".squadtext").classList.add("hide");
  document.querySelector(".no").textContent = "No";
  document.querySelector(".remove").classList.remove("hide");

  //Show the right name in the dialogue box (the student that should be removed)
  HTML.filteredStudents.forEach(prefectStudent => {
    if (prefectStudent.prefect == true && prefectStudent.gender == student.gender && prefectStudent.theHouse == student.theHouse) {
      document.querySelector(".removedStudent").textContent = prefectStudent.fullName;
      document.querySelector(".addedStudent").textContent = student.fullName;
    }
    //Eventlister -> remove student when click on remove and add the current student
    document.querySelector(".remove").addEventListener("click", function() {
      if (prefectStudent.gender == student.gender) {
        prefectStudent.prefect = false;
        student.prefect = true;
        fetchList(HTML.filteredStudents);
      }
      document.querySelector(".promptbox").classList.add("hide");
    });
  });
}

function squadErrorBox() {
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".no").textContent = "OK";
  document.querySelector(".remove").classList.add("hide");
  document.querySelector(".promptbox").classList.remove("hide");
  document.querySelector(".prompttext").classList.add("hide");
  document.querySelector(".squadtext").classList.remove("hide");
}

function hackedErrorBox() {
  document.querySelector(".noBox").classList.remove("hide");
}

// ----------------------- HACKING FUNCTIONs -------------------------

function hackTheSystem() {
  console.log("hackTheSystem");
  HTML.hacked = true;
  randomColor();
  youveBeenHacked();
  repeatSound();
  randomName();
  randomBlood();
  insertLisa();
  fetchList(HTML.allStudents);
}

function repeatSound() {
  document.querySelector(".sound").currentTime = 0;
  document.querySelector(".sound").play();
  setInterval(() => {
    document.querySelector(".sound").currentTime = 0;
    document.querySelector(".sound").play();
  }, 8800);
}

function randomColor() {
  setInterval(randomBackground, 30);

  function randomBackground() {
    // 6: Sætter baggrundsfarven til strengen der returneres fra getColorString
    document.querySelector("body").classList.add("opacity");
    document.querySelector("html").style.backgroundColor = randomColor();
  }
  //This function only call and recieve result and send it to the fisrt function
  function randomColor() {
    // 1: Udregner random numre til rgb
    let red = Math.floor(Math.random() * 255) + 1;
    let green = Math.floor(Math.random() * 255) + 1;
    let blue = Math.floor(Math.random() * 255) + 1;

    // 2: Kalder getColorString med variablerne som parametre
    // 5: Modtager herefter strengen fra getColorString og denne bruges i display når calculate() kaldes
    return getColorString(red, green, blue);
  }
  // 3: Bruger variabler som parametre for funtionen
  function getColorString(r, g, b) {
    // 4: returnerer strengen til der hvor den er kaldt i calculate
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function youveBeenHacked() {
  setTimeout(() => {
    document.querySelector(".hacked").textContent = "YOU'VE";
  }, 500);
  setTimeout(() => {
    document.querySelector(".hacked2").textContent = "BEEN";
  }, 1000);
  setTimeout(() => {
    document.querySelector(".hacked3").textContent = "HACKED";
  }, 1500);
}

function randomName() {
  HTML.filteredStudents.forEach(student => {
    let random = Math.floor(Math.random() * 30) + 1;
    student.firstName = HTML.allStudents[random].firstName;
  });
}

function randomBlood() {
  HTML.filteredStudents.forEach(student => {
    if (student.halfBlood == true || student.muggle == true) {
      student.halfBlood = false;
      student.muggle = false;
      student.pureBlood = true;
    } else {
      let random = Math.floor(Math.random() * 2) + 0;
      student.pureBlood = false;
      if (random == 1) {
        student.halfBlood = false;
      } else {
        student.halfBlood = true;
      }
      if (student.halfBlood == false) {
        student.muggle = true;
      } else {
        student.muggle = false;
      }
    }
  });
}

function insertLisa() {
  HTML.allStudents.splice(1, 0, {
    fullName: "Lisa 'awesome' søndergaard",
    firstName: "Lisa",
    middelName: "Bianca Søndergaard",
    nickName: "awesome",
    lastName: "Søndergaard",
    theHouse: "Slytherin",
    prefect: false,
    squad: false,
    otherNotations: false,
    textNotations: undefined,
    expelled: false,
    gender: "girl"
  });
}
