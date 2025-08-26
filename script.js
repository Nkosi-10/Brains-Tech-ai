const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");





// WE REMOVE THE Beta key word : https://generativelanguage.googleapis.com/v1{beta}/models/gemini-1.5-flash:generateContent?key=$GOOGLE_API_KEY


//API setup 
const API_KEY = "abcd1234efgh5678abcd1234efgh5678abcd1234";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null, 
    file:{
        data:null,
        mime_type: null
    } 
}

const chatHistory = [];

const initialInputHeight = messageInput.scrollHeight;



// create message element with dynamic classes and returns it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div")
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
//genearte bot response using AI
const geneteBotResponse =  async(incomingMessageDiv) =>{
    const messageElement = incomingMessageDiv.querySelector(".message-text")
    
    //add user message to chat history
    chatHistory.push({
        role: "user" , 
        parts: [{ text: userData.message}, ...(userData.file.data ? [{inline_data: userData.file }] : [])]
      });

    //API request options
    const requestOptions ={
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            contents: chatHistory
        })
    }
    try{

        //fetch bot response from API
        const response =  await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        //console.log(data);
        //Extract and display bots response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // adding response to chat history
        chatHistory.push({
            role: "model" , 
            parts: [{ text: userData.message}]
            });
    }   catch(error){
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    }   finally{
        userData.file = {}
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"})


    }
}

//handles outgoing user message
const handleOutgoingMessage = (e) => {
    //preventing form form from suBmitting
    e.preventDefault();
//storing users message by creating a glol Object so that it could be accessible throughout the project
    userData.message = messageInput.value.trim();
    // clearing the text area after the message has been sent
    messageInput.value ="";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event('input'));



    //create and display user message
    const messageContent =`<div class="message-text"></div>
                           ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});


// simulates bot message with thinking indicator after a delay
    setTimeout(() =>{

      const messageContent =`
              <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
      </div>`;
      const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
      chatBody.appendChild(incomingMessageDiv);
      chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"})

      geneteBotResponse(incomingMessageDiv);
    }, 600);

}

// Handles enter key press for sending message
messageInput.addEventListener("keydown",(e) => {
    // by implementing the trim()method, it removes whitespace from the sides of the string 
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
        handleOutgoingMessage(e);
    }
})

//adjusting input height dynamically 
messageInput.addEventListener("input", ()=> {
    messageInput.style.height = `${initialInputHeight}px`
    messageInput.style.height = `${messageInput.scrollHeight}px`
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px"

});

//Handle file input change and preview the selected file 
fileInput.addEventListener("change", ()=>{
    const file = fileInput.files[0];
    if(!file) return;

    //console.log(file);

    const reader = new FileReader()
    reader.onload = (e) =>{
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

// storing file data in userData
        userData.file={
            data:base64String,
            mime_type: file.type
        } 
        fileInput.value =  "";
        // console.log(userData);
    }

    reader.readAsDataURL(file);
})
//cancel file upload
fileCancelButton.addEventListener('click', ()=>{
    userData.file ={};
    fileUploadWrapper.classList.remove("file-uploaded");

})

//start the emoji picker and emoji selection 
const picker = new EmojiMart.Picker({
    theme: "dark",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) =>{
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker"){
            document.body.classList.toggle("show-emoji-picker")
        }else{
            document.body.classList.remove("show-emoji-picker")
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e))
document.querySelector("#file-upload").addEventListener("click", ()=> fileInput.click())

chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Auto-open chatbot on load and make it fullscreen on small devices
window.addEventListener("load", () => {
    document.body.classList.add("show-chatbot");
});