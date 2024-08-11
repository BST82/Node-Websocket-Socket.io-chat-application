const socket = io();

const clientTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');  //ul container
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/ringtone.mp3')

//add event to message-form 
messageForm.addEventListener('submit',(e)=>{
    //to avoid reload the page
    e.preventDefault();
    sendMessage();
})

//handle client count event 
socket.on('client-total',(data)=>{
    console.log(data);
    clientTotal.innerText = `Total clients : ${data}`
    
})

//this function will call whenever some one send a message using form 
function sendMessage(){
    if(messageInput.value==='') return;
console.log(messageInput.value);

//json object data
const data = {
name : nameInput.value,
message : messageInput.value,
dateTime : new Date()
}
socket.emit('message',data)
addMessageToUi(true,data) //own Message
messageInput.value = ''
}

socket.on('chat-message',(data)=>{
    console.log(data);   
    messageTone.play();
    addMessageToUi(false,data) //Recieving the message not own message thats why added false 
})

function addMessageToUi(isOwnMessage, data) {
    clearFeedbackMessage();

    // Create the message element
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <div class="message-box">
                <p class="message-content">
                    ${data.message}
                </p>
                <span class="block text-xs text-gray-500 mt-1">
                    ${data.name} 🐧 ${moment(data.dateTime).fromNow()}
                </span>
            </div>
        </li>`;

    // Insert the element into the message container
    document.getElementById('message-container').innerHTML += element;

    // Scroll to the bottom of the message container
    scrollToBottom();
}


//function scroll to button autometically
function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

//event listener for who is typing message
messageInput.addEventListener('focus',(e)=>{
socket.emit('feedback',{
    feedback : `${nameInput.value} is typing a message ...`
})
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback : `${nameInput.value} is typing a message ...`
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback : ``
    })
})

socket.on('feed-back',(data)=>{
    clearFeedbackMessage();
    const element = ` <li class="message-feedback text-center">
                    <p class="feedback text-gray-400 italic" id="feedback">
                        ${data.feedback}
                    </p>
                </li>`;
                messageContainer.innerHTML += element;
})

//clear feedback message
function clearFeedbackMessage(){
    scrollToBottom();
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}