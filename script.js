var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
let ticketArr = [];
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");


let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
// To open close Modal container
let isModalPresent = false;
addBtn.addEventListener("click" , function() {
    if(!isModalPresent) {
        modalCont.style.display = "flex";
    }
    else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
});

