"use strict";
window.addEventListener("DOMContentLoaded", init);

const HTML = {};

const Student = {
  firstName: "",
  middelName: "",
  lastName: "",
  nickName: "No nickname",
  photo: "",
  theHouse: "",
  fullName: "",
  prefect: false,
  squad: false,
  otherNotations: false,
  textNotations: undefined,
  expelled: false
};

function init() {
  HTML.jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
  HTML.filterButtons = document.querySelectorAll(".filter");
  HTML.secondFilterButtons = document.querySelectorAll(".sort");
  HTML.sortButton = document.querySelector(".sort_ab");
  HTML.filter = "Alle";
  HTML.sort = "Alle"; //???
  HTML.filteredStudents = [];
  HTML.allStudents = [];
  HTML.direction;
  HTML.filterSecond = "Alle";
  HTML.notes;
  start();
}

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
    element.addEventListener("click", filter);
  });
  HTML.secondFilterButtons.forEach(element => {
    element.addEventListener("click", secondFilterChosen);
  });
  HTML.sortButton.addEventListener("click", sort);
  document.querySelector("select").addEventListener("change", selectFilter);

  document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".popup").classList = "popup hide";
    document.querySelector(".notes").value = "";
  });
  document.querySelector(".no").addEventListener("click", function() {
    document.querySelector(".promptbox").classList.add("hide");
  });

  //selectFilter();
  //calls the async function with the jsonUrl and the function that should be called after the async,.
  fetchJson(HTML.jsonUrl, makeObjects);
  // fetchList();
}

//Uses the url parameter, so the url can change depending on the calling function.
//Callback is called with the variable that is the json, which is sent on to the next function.
async function fetchJson(url, callback) {
  console.log("fetchJson");
  const response = await fetch(url);
  const jsonEntries = await response.json();
  callback(jsonEntries);
  // fetchList();
}

function makeObjects(jsonEntries) {
  console.log("makeObjects");
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

    const find = middle.substring(0, 1);
    if (find === '"' || find === "'") {
      studentObject.nickName = nick;
    } else {
      studentObject.middelName = middle;
    }
    HTML.allStudents.push(studentObject);
  });
  fetchList(HTML.allStudents);
}

function selectFilter() {
  HTML.filter = event.target.value;
  //fetchJson(HTML.jsonUrl, makeObjects);
  console.log(event.target.value);
  sendFiltretStudents(HTML.filter);
}

function filter() {
  console.log("filter");
  HTML.filterButtons.forEach(button => {
    button.classList.remove("chosen");
  });
  this.classList.add("chosen");
  HTML.filter = this.dataset.kategori;
  sendFiltretStudents(HTML.filter);
}

function sendFiltretStudents(filter) {
  console.log("sendFiltretStudents");
  const filteredStudents = filterStudentsByHouse(filter);
  HTML.filteredStudents = filteredStudents;
  console.log(HTML.filteredStudents);
  fetchList(HTML.filteredStudents);
  //sortFiltered(HTML.filteredStudents);
}

function filterStudentsByHouse(filter) {
  console.log("filterStudentsByHouse");
  const filteredStudents = HTML.allStudents.filter(filterFunction);

  function filterFunction(student) {
    return student.theHouse === filter || "Alle" === filter;
  }
  return filteredStudents;
}

// ------------ SECOND FILTER ------------------

function secondFilterChosen() {
  console.log("secondFilterChosen");
  HTML.secondFilterButtons.forEach(button => {
    button.classList.remove("chosen_sort");
  });
  this.classList.add("chosen_sort");
  HTML.filterSecond = this.dataset.add;
  SecondFiltretStudents(HTML.filterSecond);
}

function SecondFiltretStudents(filter) {
  const sortedStudents = filterStudentsBySorts(filter);
  //sortFiltered(sortedStudents);
  fetchList(sortedStudents);
}

function filterStudentsBySorts(filter) {
  console.log("filterStudentsBySorts");
  const filteredStudents = HTML.filteredStudents.filter(filterFunction);

  function filterFunction(student) {
    if (filter == "prefect") {
      return student.prefect === true;
    } else if (filter == "squad") {
      return student.squad === true;
    } else if (filter == "expelled") {
      return student.expelled === true;
    } else if (filter == "otherNotations") {
      return student.otherNotations === true;
    } else if (filter == "Alle") {
      return filter === "Alle";
    }
  }

  return filteredStudents;
}
//Function til sortering A -> B
/* function sortFiltered() {
  console.log("sortFiltered");
  HTML.filteredStudents = sortList(HTML.direction); //, HTML.direction);
  fetchList(HTML.filteredStudents);
} */

//------------------- CHECKBOXES -------------------

//------------- DISPLAY FUNCTIONS -------------

function fetchList(studentObject) {
  console.log("fetchList");
  document.querySelector("#student_list").innerHTML = "";
  console.log(HTML.filteredStudents);
  studentObject.forEach(displayStudents);
}

function displayStudents(student) {
  console.log("displayStudents");
  //console.log(student);
  const clone = document.querySelector(".temp").content.cloneNode(true);

  const expelledClone = clone.querySelector("[data-check='expelled']");
  const squadClone = clone.querySelector("[data-check='squad']");
  const prefectClone = clone.querySelector("[data-check='prefect']");
  const otherNotationsClone = clone.querySelector("[data-check='otherNotations']");

  clone.querySelector(".house").textContent = student.theHouse;
  clone.querySelector(".name").textContent = student.fullName;
  clone.querySelector(".wrapper").addEventListener("click", function() {
    displayPopUp(student);
  });

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

  expelledClone.addEventListener("click", function() {
    expelledToggle(student);
  });
  squadClone.addEventListener("click", function() {
    squadToggle(student);
  });
  prefectClone.addEventListener("click", function() {
    prefectToggle(student);
  });

  document.querySelector("#student_list").appendChild(clone);
}

function expelledToggle(student) {
  console.log("expelledToggle");
  if (student.expelled === true) {
    student.expelled = false;
    console.log("expelled: " + student.expelled);
  } else {
    student.expelled = true;
    console.log("expelled: " + student.expelled);
  }
  fetchList(HTML.filteredStudents);
}

function squadToggle(student) {
  console.log("squadToggle");
  if (student.theHouse == "Slytherin") {
    if (student.squad === true) {
      student.squad = false;
      console.log("squad: " + student.squad);
    } else {
      student.squad = true;
      console.log("squad: " + student.squad);
    }
    fetchList(HTML.filteredStudents);
  } else {
    document.querySelector(".promptbox").classList.remove("hide");
    document.querySelector(".no").textContent = "OK";
    document.querySelector(".remove").classList.add("hide");
    document.querySelector(".promptbox").classList.remove("hide");
    document.querySelector(".prompttext").classList.add("hide");
    document.querySelector(".squadtext").classList.remove("hide");
  }
}

function prefectToggle(student) {
  const prefectsArray = HTML.filteredStudents.filter(student => {
    return student.prefect === true;
  });
  //See what gender vs. house there is in the prefectsArray and test it against the clicked student
  const prefectType = prefectsArray.some(prefect => {
    return prefect.gender === student.gender && prefect.theHouse === student.theHouse;
  });

  if (student.prefect === true) {
    student.prefect = false;
  } else if (student.prefect === false) {
    if (prefectType) {
      console.log("same gender from same house");
      displayPromptbox(student);
      student.prefect = false;
    } else {
      student.prefect = true;
    }
  }

  fetchList(HTML.filteredStudents);
}

function displayPromptbox(student) {
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
      if (prefectStudent.prefect == true && prefectStudent.gender == student.gender) {
        console.log("inde??");
        prefectStudent.prefect = false;
        student.prefect = true;
      }
      document.querySelector(".promptbox").classList.add("hide");
    });
  });
}

function displayPopUp(student) {
  displayStudentDetails(student);

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

  document.querySelector(".textNotes").textContent = student.textNotations;
  document.querySelector(".submit").addEventListener("click", function() {
    student.textNotations = document.querySelector(".notes").value;
    if (student.textNotations != "") {
      document.querySelector(".OtherNotes>.size").classList.remove("grey");
      student.otherNotations = true;
    } else {
      document.querySelector(".OtherNotes>.size").classList.add("grey");
      student.otherNotations = false;
    }
    document.querySelector(".textNotes").textContent = student.textNotations;
    setTimeout(() => {
      document.querySelector(".notes").value = "";
    }, 500);
  });
}

function displayStudentDetails(student) {
  if (student.middleName == "") {
    document.querySelector(".pop_name").textContent = `${student.firstName} ${student.lastName}`;
  }
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = `${student.firstName} ${student.middelName} ${student.lastName}`;
  document.querySelector(".pop_nick").textContent = student.nickName;
  document.querySelector(".pop_gender").textContent = student.gender;
  document.querySelector(".crest").src = "billeder/" + student.theHouse + ".png";
  document.querySelector(".image").alt = student.firstName + " " + student.lastName;
  if (student.firstName == "Padma") {
    document.querySelector(".image").src = "images/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
  } else if (student.lastName == "Patil") {
    document.querySelector(".image").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
  } else if (student.lastName == "Finch-Fletchley") {
    document.querySelector(".image").src = "images/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  } else {
    document.querySelector(".image").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  }
  console.log(document.querySelector(".image"));
  document.querySelector(".crest").alt = student.theHouse + " crest";
  document.querySelector(".pop_house").textContent = student.theHouse;
}

// ------------ SORTING FUNCTION (DUR IKKE)----------------

/* function sort() {
  console.log("sort");
  if (this.dataset.direction == "asc") {
    this.dataset.direction = "dsc";
  } else if (this.dataset.direction == "dsc") {
    this.dataset.direction = "asc";
  }
  HTML.direction = this.dataset.direction;
  //HTML.sort = this.dataset.add;
  const sortedList = sortList(HTML.sort, HTML.direction);
  console.log(sortedList);
  //fetchList(sortedList);
}
function sortList(sort, direction) {
  console.log("sortList");
  const sortedList = HTML.filteredStudents.sort(compareName);

  function compareName(a, b) {
    console.log("compareName");
    if (direction == "asc") {
      console.log("asc");
      //VIRKER IKKE
      if (a[sort] < b[sort]) {
        return -1;
      }
    } else {
      console.log("dsc");
    }
  }

  return sortedList;
} */
