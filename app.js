// let boxes= document.querySelectorAll(".box");
// let resetBtn= document.querySelector("#reset-btn");
// let newButton =document.querySelector("#new-btn");
// let msgContainer = document.querySelector(".msgcontainer");
// let msg = document.querySelector("#msg");

// let turno = true;

// const winPatterns=[
//     [0,1,2],
//     [0,3,6],
//     [0,4,8],
//     [1,4,7],
//     [2,5,8],
//     [2,4,6],
//     [3,4,5],
//     [6,7,8]
// ];


// const resetGame= ()=>{
//     turno = true;
//     enableBoxes();
//     msgContainer.classList.add("hidden");
//     msgContainer.classList.remove("flex");
// }



// boxes.forEach((box) => {
//    box.addEventListener("click",() =>{
//     console.log("box was clicked.");
//     if(turno === true){//player o
//         box.innerText = "O";
//         turno = false;
//     }
//     else{//player x
//         box.innerText = "X";
//         turno = true;
//     }
//     box.disabled = true;
//     checkWinner();
//    }) 
// });
// const disableBoxes = () =>{
//     for(let box of boxes){
//         box.disabled = true;
//     }
// }
// const enableBoxes = () =>{
//     for(let box of boxes){
//         box.disabled = false;
//         box.innerText = "";
//     }
// }
// const showWinner = (winner) =>{
//     msg.innerText = `Congratulations, Winner is ${winner}`;
//     msgContainer.classList.remove("hidden");
//     msgContainer.classList.add("flex");
// }

// const checkWinner = () =>{
//     for(let pattern of winPatterns){
//         let number1 = boxes[pattern[0]].innerText;
//         let number2 = boxes[pattern[1]].innerText;
//         let number3 = boxes[pattern[2]].innerText;
        
//         if(number1 !="" && number2 !="" && number3 !=""){
//             if(number1 === number2 && number2 === number3){
//                 console.log("Winner", number1);
//                 showWinner(number1);
//                 disableBoxes();
//             }
//         }
//     }
// }
// newButton.addEventListener("click", resetGame);
// resetBtn.addEventListener("click", resetGame);
// ─── Tic-Tac-Toe ────────────────────────────────────────────────────────────

// ─── Tic-Tac-Toe Game (Aapka original code) ───
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msgcontainer");
let msg = document.querySelector("#msg");

let turno = true;

const winPatterns = [
    [0,1,2],[0,3,6],[0,4,8],
    [1,4,7],[2,5,8],[2,4,6],
    [3,4,5],[6,7,8]
];

const resetGame = () => {
    turno = true;
    enableBoxes();
    msgContainer.classList.add("hidden");
    msgContainer.classList.remove("flex");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        box.innerText = turno ? "O" : "X";
        turno = !turno;
        box.disabled = true;
        checkWinner();
    });
});

const disableBoxes = () => { for (let box of boxes) box.disabled = true; };
const enableBoxes  = () => {
    for (let box of boxes) { box.disabled = false; box.innerText = ""; }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hidden");
    msgContainer.classList.add("flex");
    sendBotContext(`Game ended! ${winner} won.`);
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern.map(i => boxes[i].innerText);
        if (a !== "" && a === b && b === c) {
            showWinner(a);
            disableBoxes();
            return;
        }
    }
    if ([...boxes].every(b => b.innerText !== "")) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hidden");
        msgContainer.classList.add("flex");
        sendBotContext("Game ended in a draw.");
    }
};

newButton.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);


// ─── Chatbot API Calling ───
const BACKEND_URL = "http://127.0.0.1:8000";
const SESSION_ID  = "session_12345"; // Simple ID rakhi hai

const chatMessages = document.getElementById("chat-messages");
const chatInput    = document.getElementById("chat-input");
const chatSend     = document.getElementById("chat-send");

// Screen par message dikhane ka function
function addBubble(text) {
    const bubble = document.createElement("div");
    bubble.textContent = text;
    bubble.style.marginTop = "10px";
    chatMessages.appendChild(bubble);
}

// Backend ko message bhejne ka function
async function sendMessage(userText, displayUser = true) {
    if (userText === "") return;
    
    if (displayUser === true) {
        addBubble("You: " + userText);
    }

    try {
        const res = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: SESSION_ID, message: userText }),
        });

        const data = await res.json();
        addBubble("Bot: " + data.response);

    } catch (err) {
        addBubble("Error: Server not running.");
    }
}

// Bot ko hidden message bhejna
async function sendBotContext(contextMsg) {
    await sendMessage(contextMsg, false); // false matlab user ko nahi dikhega
}

// Send Button click event
chatSend.addEventListener("click", () => {
    const text = chatInput.value;
    chatInput.value = "";
    sendMessage(text);
});


// ─── Simple Open/Close Chat Logic ───
const chatToggleBtn = document.getElementById("chat-toggle-btn");
const chatPanel = document.getElementById("chat-panel");
const chatCloseBtn = document.getElementById("chat-close-btn");

// Chat kholne ka button
chatToggleBtn.addEventListener("click", function() {
    chatPanel.style.display = "block"; // Chat dikhao
    chatToggleBtn.style.display = "none"; // Button chupao
});

// Chat band karne ka button
chatCloseBtn.addEventListener("click", function() {
    chatPanel.style.display = "none"; // Chat chupao
    chatToggleBtn.style.display = "block"; // Button wapas dikhao
});