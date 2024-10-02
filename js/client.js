

const socket = io('http://localhost:8001'); 

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var  audio = new Audio('ting.mp3')


const appendMessage = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    if (position=="left") {
        audio.play()
    }
}


const names = prompt('Enter your name to join'); // prompt should be here

// Notify server of the new user
socket.emit("new-user-joined", names);

socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'right');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // clear the input after sending
});

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});
socket.on('user-left', name => {
    appendMessage(`${name}: left the chat`, 'left');
});
