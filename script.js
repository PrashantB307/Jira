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

//console.log(allPriorityColors);
 
// To remove and add active class from each priority color of
//  Modal container 
allPriorityColors.forEach(function (colorElement) {
    colorElement.addEventListener("click", function () {
        allPriorityColors.forEach(function (priorityColorElem) {
            priorityColorElem.classList.remove("active");
        });
        colorElement.classList.add("active");
        modalPriorityColor = colorElement.classList[0];
    });
});

// To Generate and display a ticket
modalCont.addEventListener("keydown", function (e) {
    let key = e.key;
    if(key == "Shift"){
        console.log(modalPriorityColor);
        console.log(textAreaCont.value);
        createTicket(modalPriorityColor, textAreaCont.value);
        modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function (colorElem) {
            colorElem.classList.remove("active");
        });
    }
}); 

// Function to create new ticket
function createTicket(ticketColor, data, ticketId) {
    let id = ticketId || uid();
    let ticketCont = document.createElement("div"); 
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>  
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>
    `;

    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);
    handleLock(ticketCont, id);

    // If ticket is being created for the 1st time,then ticket
    // id would be undefined.
    if(!ticketId) {
        ticketArr.push(
            {
                ticketColor, 
                data, 
                ticketId: id
            }
        );
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    }
};

// Get all tickets from local Storage
if(localStorage.getItem("tickets")) {
    ticketArr = JSON.parse(localStorage.getItem("tickets"));
    ticketArr.forEach(function(ticketObj) {
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
    })
} 

// Filter tickets on the basis of ticket colors
for(let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", function () {
        let currtoolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter(function (ticketObj) {
            if(currtoolBoxColor == ticketObj.ticketColor) return ticketObj;
            //return currtoolBoxColor == ticketObj.ticketColor;
        });

        // Remove all the tickets
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let  i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        // Display Filtered Tickets
        filteredTickets.forEach(function(ticketObj) {
            createTicket(
                ticketObj.ticketColor,
                ticketObj.data,
                ticketObj.ticketId
            );
        })
    })

    // To display all the tickets of all colors on double clicking.
    toolBoxColors[i].addEventListener("dblclick", function () {

        // Remove all the color specific tickets.
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove();
        }

        // Display all tickets.
        ticketArr.forEach(function (ticketObj) {
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId);
        });
    })
}

// On clicking remove BTN make color red and again click make white
let removeBtnActive = false;
removeBtn.addEventListener("click", function () {
    if(removeBtnActive) {
        removeBtn.style.color = "white";
    }
    else {
        removeBtn.style.color = "red";
    }
    removeBtnActive = !removeBtnActive;
});

// Remove tickets from local storage and UI
function handleRemoval(ticket, id) {
    ticket.addEventListener("click", function () {
        if(!removeBtnActive) return;
        // Local Storage remove
        // get idx of the ticket to be deleted
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);

        // Remove from browser storage and set updated array
        localStorage.setItem("tickets",JSON.stringify(ticketArr));

        // Fronted remove
        ticket.remove();
    });
}


// Returns idx of the tickets inside local storage array
function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex(function (ticketObj) {
        return ticketObj.ticketId == id;
    })
    return ticketIdx;
}

// Change priority color of the tickets
function handleColor(ticket, id) {
    let ticketColorStrip = ticket.querySelector(".ticket-color");
    
    ticketColorStrip.addEventListener("click", function () {
        let currTicketColor = ticketColorStrip.classList[1];
        // ['lightpink', 'lightgreen', 'lightblue', 'black']
        let currTicketColorIdx = colors.indexOf(currTicketColor);

        let newTicketColorIdx = currTicketColorIdx + 1;

        newTicketColorIdx = newTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];

        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        // Local storage update
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    });
}

// Lock and Unlock to make content editable true and false
function handleLock(ticket, id) {
    // Icons ko append in ticket

    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    //console.log(ticketLock);

    // Toggle of icons and content editable property
    ticketLock.addEventListener("click", function () {
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else {  // if lock is open
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        ticketArr[ticketIdx].data = ticketTaskArea.innerText;
        localStorage.setItem["tickets", JSON.stringify(ticketArr)]; 
    });
    
}