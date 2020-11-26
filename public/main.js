const socket = io();
const messageForm = document.querySelector("#message-form");
const msgContainer = document.querySelector("#message-container");
const nameInputEl = document.querySelector("#name-input");
const msgInputEl = document.querySelector("#message-input");
const msgTone = new Audio("/message-tone.mp3");
msgTone.pause();

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

msgInputEl.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInputEl.value} is typing a message...`,
  });
});

msgInputEl.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInputEl.value} is typing a message...`,
  });
});

msgInputEl.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("clients-total", (data) => {
  const el = document.querySelector("#client-total");
  if (el) el.innerText = `Total clients: ${data}`;
});

socket.on("chat-message", (data) => {
  clearFeedbackMsg();
  addMsgToUI(false, data);
  msgTone.play();
});

socket.on("feedback", (data) => {
  clearFeedbackMsg();
  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `;

  msgContainer.innerHTML += element;
});

function sendMessage() {
  if (msgInputEl.value === "") return;
  const data = {
    name: nameInputEl.value,
    message: msgInputEl.value,
    date: new Date(),
  };

  socket.emit("message", data);
  addMsgToUI(true, data);
  msgInputEl.value = "";
}

function addMsgToUI(isOwnMessage, data) {
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">
        ${data.message}
        <span>${data.name} ● ${moment(data.date).fromNow()}</span>
      </p>
    </li>
  `;
  msgContainer.innerHTML = msgContainer.innerHTML + element;
  scrollToBottom();
}

function scrollToBottom() {
  msgContainer.scrollTo(0, msgContainer.scrollHeight);
}

function clearFeedbackMsg() {
  document.querySelectorAll("li.message-feedback").forEach((el) => {
    el.parentElement.removeChild(el);
  });
}
