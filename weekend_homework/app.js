getQuote = () => {
  const URL =
    "https://programming-quotes-api.herokuapp.com/quotes/random/lang/en";

  fetch(URL)
    .then(function(resp) {
      return resp.json();
    })
    .then(function(response) {
      displayQuote(response);
    });
};

displayQuote = jsonObject => {
  //const author = jsonObject.author;
  //const quote = jsonObject.en;
  const { author: author, en: quote } = jsonObject;

  document.getElementById("author").innerHTML = `${author}`;
  document.getElementById("quote").innerHTML = `"${quote}"`;
};

document.getElementById("btn").addEventListener("click", getQuote);
