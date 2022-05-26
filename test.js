let interval;
const messages = ["Hello", "Hi", "What's up?", "Sweet!"];

const showMessage = () => {
  generateMessage();
};

const generateMessage = () => {
  const div = document.getElementById("message");
  const randomNum = Math.floor(Math.random() * messages.length);
  const word = messages[randomNum];
  div.innerHTML = word;

  if (word == "Hi") {
    clearMessage(div);
  }
};

const clearMessage = (div) => {
  clearInterval(interval);
  div.innerHTML = "We are now finished!";
  startAgain();
};

const startAgain = () => {
  setTimeout(startInterval, 2000);
};

const startInterval = () => {
  setInterval(showMessage, 2000);
};
