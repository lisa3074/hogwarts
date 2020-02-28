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
  expelled: false,
  halfBlood: "",
  pureBlood: "",
  muggle: ""
};

function init() {
  HTML.jsonUrl = "https://petlatkea.dk/2020/hogwarts/students.json";
  HTML.jsonBlood = "https://petlatkea.dk/2020/hogwarts/families.json";
  HTML.filterButtons = document.querySelectorAll(".filter");
  HTML.secondFilterButtons = document.querySelectorAll(".sort");
  HTML.sortButton = document.querySelectorAll(".button");
  HTML.filter = "Alle";
  HTML.sort = "Alle"; //???
  HTML.sortList;
  HTML.filteredStudents = [];
  HTML.allStudents = [];
  HTML.direction;
  HTML.directionHouse;
  HTML.filterSecond = "Alle";
  HTML.notes;
  HTML.fullName;
  HTML.lastName;
  HTML.json = 0;
  HTML.halfBlood;
  HTML.pureBlood;
  HTML.sortFilter = "Alle";
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
  HTML.sortButton.forEach(sortButton => {
    sortButton.addEventListener("click", sort);
  });

  document.querySelector(".filter_mobile>select").addEventListener("change", selectFilter);
  document.querySelector(".sort_mobile>select").addEventListener("change", selectSort);

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
  //BLACKBOX found: https://medium.com/javascript-in-plain-english/how-to-detect-a-sequence-of-keystrokes-in-javascript-83ec6ffd8e93
  document.addEventListener("keydown", event => {
    const theKey = "t";
    const key = event.key.toLowerCase();
    if (theKey.indexOf(key) === -1) return;
    hackTheSystem();
  });

  //SOURCE FOR SEARCH FUNCTION: https://stackoverflow.com/questions/36897978/js-search-using-keyup-event-on-input-tag?fbclid=IwAR24tcWciO4KrDAUf0twPqnqm0MJgNC0hRBB8jZPPiXx7i0B7kryyX4ygvc
  const search = document.querySelector(".search");
  search.addEventListener("keyup", function() {
    console.log("keystroke");
    const list = HTML.filteredStudents.filter(student => student.fullName.toLowerCase().includes(search.value.toLowerCase()));
    fetchList(list);
  });

  //calls the async function with the jsonUrl and the function that should be called after the async,.
  fetchJson(HTML.jsonUrl, makeObjects);
  fetchJson(HTML.jsonBlood, makeBlood);
}

//Uses the url parameter, so the url can change depending on the calling function.
//Callback is called with the variable that is the json, which is sent on to the next function.
async function fetchJson(url, callback) {
  console.log("fetchJson");
  const response = await fetch(url);
  const jsonEntries = await response.json();
  callback(jsonEntries);
}

function makeBlood(jsonEntries) {
  HTML.halfBlood = jsonEntries.half;
  HTML.pureBlood = jsonEntries.pure;

  console.log(HTML.halfBlood);
  console.log(HTML.pureBlood);

  countJSON();
}

function countJSON() {
  HTML.json++;
  if (HTML.json == 2) {
    console.log(HTML.json);
    compareBlood();
    //fetchList(HTML.allStudents);
  }
}

function compareBlood() {
  HTML.allStudents.forEach(student => {
    const isPure = HTML.pureBlood.includes(student.lastName);
    const isHalf = HTML.halfBlood.includes(student.lastName);
    //const isFalse = HTML.pureBlood.includes(student.lastName);
    if (isPure) {
      console.log("pure");
      student.pureBlood = true;
      student.halfBlood = false;
      student.muggle = false;
    } else if (isHalf) {
      student.pureBlood = false;
      student.halfBlood = true;
      student.muggle = false;
    } else {
      console.log("pure");
      student.pureBlood = false;
      student.halfBlood = false;
      student.muggle = true;
    }
  });
  console.log(HTML.allStudents);
  fetchList(HTML.allStudents);
}

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

    HTML.fullName = studentObject.fullName;
    HTML.lastName = studentObject.lastName;
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
  //fetchList(HTML.allStudents);
  countJSON(HTML.allStudents);
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
function selectSort() {
  HTML.sortFilter = event.target.value;
  //fetchJson(HTML.jsonUrl, makeObjects);
  console.log(event.target.value);
  SecondFiltretStudents(HTML.sortFilter);
}

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
  console.log(filter);
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

//------------- DISPLAY FUNCTIONS -------------

function fetchList(studentObject) {
  console.log("fetchList");
  document.querySelector("#student_list").innerHTML = "";
  //console.log(HTML.filteredStudents);
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
    const hacked = document.querySelector(".hacked");
    if (hacked) {
      hackTheSystem(student);
    } else {
      squadToggle(student);
    }
  });
  prefectClone.addEventListener("click", function() {
    prefectToggle(student);
  });

  document.querySelector("#student_list").appendChild(clone);
}

function expelledToggle(student) {
  console.log("expelledToggle");
  if (student.fullName == "Lisa 'awesome' søndergaard") {
    console.log("NEJ!");
    document.querySelector(".noBox").classList.remove("hide");
  } else if (student.expelled === true) {
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
  if (student.theHouse == "Slytherin" || student.pureBlood == true) {
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
  document.querySelector(".submit").addEventListener("click", displayNotations);

  function displayNotations() {
    document.querySelector(".submit").removeEventListener("click", displayNotations);
    console.log("Save student");
    console.log(student);
    student.textNotations = document.querySelector(".notes").value;
    console.log(student);
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
  }
}

function displayStudentDetails(student) {
  if (student.middleName == "") {
    document.querySelector(".pop_name").textContent = `${student.firstName} ${student.lastName}`;
  }
  document.querySelector(".popup").classList = "popup";
  document.querySelector(".pop_name").textContent = `${student.firstName} ${student.middelName} ${student.lastName}`;
  document.querySelector(".pop_nick").textContent = student.nickName;
  document.querySelector(".pop_gender").textContent = student.gender;
  if (student.pureBlood == true) {
    document.querySelector(".pop_blood").textContent = "Pure";
  } else if (student.halfBlood == true) {
    document.querySelector(".pop_blood").textContent = "Half";
  } else {
    document.querySelector(".pop_blood").textContent = "Muggle";
  }

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

function sort() {
  console.log("sort");
  if (this.dataset.direction == "asc") {
    document.querySelector(".sort_ab").textContent = "Name Z → A";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: NAME A → Z";
    this.dataset.direction = "dsc";
  } else if (this.dataset.direction == "dsc") {
    document.querySelector(".sort_ab").textContent = "Name A → Z";
    document.querySelector(".sortDisplay").textContent = "DISPLAYING: NAME Z → A";
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

function hackTheSystem(student) {
  console.log("hackTheSystem");
  /*   const clone = document.querySelector(".temp").content.cloneNode(true);
  const squad = document.querySelectorAll(".hack");
  const squad = document.querySelectorAll(".hack");
  
  squadClone.removeEventListener("click", function() {}); */
  let random = Math.floor(Math.random() * 2) + 1;

  /*  document.querySelectorAll(".hack").forEach(hacked => {
    hacked.classList.add("hacked");
  }); */

  HTML.allStudents.splice(2, 0, {
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
  /*
  squadClone.removeEventListener("click", function() {});
  squad.forEach(squadBut => {
    squadBut.addEventListener("click", function() {
      console.log("hackTheSystem click squad");
        if (student.theHouse == "Slytherin" || student.pureBlood == true) {
        if (student.squad === true) {
          student.squad = false;
        } else {
          student.squad = true;
        }
        
        setInterval(() => {
      
        }, 500);
  
        fetchList(HTML.filteredStudents);
      } else {
        document.querySelector(".promptbox").classList.remove("hide");
        document.querySelector(".no").textContent = "OK";
        document.querySelector(".remove").classList.add("hide");
        document.querySelector(".promptbox").classList.remove("hide");
        document.querySelector(".prompttext").classList.add("hide");
        document.querySelector(".squadtext").classList.remove("hide");
      }   
    });
  });*/

  /* 
   console.log("hackTheSystem click squad");
    if (student.theHouse == "Slytherin" || student.pureBlood == true) {
      if (student.squad === true) {
        student.squad = false;
      } else {
        student.squad = true;
      }
      
      setInterval(() => {
    
      }, 500);

      fetchList(HTML.filteredStudents);
    } else {
      document.querySelector(".promptbox").classList.remove("hide");
      document.querySelector(".no").textContent = "OK";
      document.querySelector(".remove").classList.add("hide");
      document.querySelector(".promptbox").classList.remove("hide");
      document.querySelector(".prompttext").classList.add("hide");
      document.querySelector(".squadtext").classList.remove("hide");
    }  */

  fetchList(HTML.allStudents);
}
