/* 
Basic knowledge about APIs and what we investigated before we started to code:
API stands for Application Programming Interface. An API is a software intermediary that allows two applications to talk to each other.  In other words, an API is the messenger that delivers your request to the provider that you’re requesting it from and then delivers the response back to you. For this reason we need an address we are sending our request. Sometimes authentication is needed sometimes not. 

Authentication is the process by which an application confirms user identity. Applications have traditionally persisted identity through session cookies, relying on session IDs stored server-side. This forces developers to create session storage that is either unique to each server, or implemented as a totally separate session storage layer.

Token authentication is a more modern approach and is designed solve problems session IDs stored server-side can’t. Using tokens in place of session IDs can lower your server load, streamline permission management, and provide better tools for supporting a distributed or cloud-based infrastructure.

So we went to the website of giphy on looked at the api documentation: https://developers.giphy.com/docs/api#quick-start-guide pushed the button: "create an app" - logged in with our data and received a user-token: 4p7w4YD3KnU48WzncbVg5PTrJYdGB4. It is also called an api key. 

In the documentation we find also the url we have to use for particular endpoints. for example the Search Endpoint, Trending Endpoint, Translate Endpoint, etc... depending what we want we choose a particular endpoint, means address we will use for our request. (api.giphy.com/v1/gifs/search, api.giphy.com/v1/gifs/trending, api.giphy.com/v1/gifs/translate, ... ). 

Usually you find also examples which shows you already implementation code snippets. https://developers.giphy.com/docs/resource/#code-examples which you can copy and modify for your needs.


We now want to implement a functionality which generates our API URL for later use. So we declare a function with the name generateApiUrl we can use everywhere in the code, because it is in the global context. All variables in the function are the execution context of the function, so they are not accessible in the global context

console.log(apiKey)
will return an error

*/
// generateApiUrl is responsible for generating our api url based on the user input
generateApiUrl = () => {
  // we store our API key into a const variable
  const apiKey = "4p7w4YD3KnU48WzncbVg5PTrJYdGB4yk";

  // We are fetching from our search Element the input value of the user.
  const searchInput = document.getElementById("search").value;

  // We are fetching the input of the user from our drop-down menue. To do this we first select the element. We can implement the 2 following lines in 1 line but the readibility can suffer so we decided to split this part in 2 steps. First we select our drop-down menue

  const select = document.getElementById("limit");

  /* we have now our select object we can work with. https://www.w3schools.com/jsref/coll_select_options.asp. now we use our selectedIndex method on our select object to get the value which is stored in our html document. https://www.w3schools.com/jsref/prop_select_selectedindex.asp 
    <select id="limit">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
    we get the select index from the user input. e.g. index=0 selects the first line of our options (we get the position) after that we get the value which we stored in the attribute value. In case of index=0 the value=10;
    We store the result in a the selectValue variable for later use in the api url. We will define the limit parameter with it
*/
  const selectValue = select.options[select.selectedIndex].value;

  /* Now we are concating the string we want to send. We use already the ES6 String literals. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals for it. We put our stored variables into our string via ${varName}. No + are needed anymore!*/
  const giphyAPI = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${apiKey}&limit=${selectValue}`;

  // We console.log now our string to check if we did it correctly. Later we will comment it out or delete this part. It's only needed to check if we did everything correctly.
  console.log(giphyAPI);

  // Now we we return our string.
  return giphyAPI;
};

/* Next we prepare a function which get us the gifs from the giphy server based on our api call.
getGif is responsible for getting the data from the api and converts it into a json object
 */
getGif = () => {
  // For this reason we call our generateApiUrl function, which returns us the url string we need and store it into a variable url
  const url = generateApiUrl();

  // Now we are ready to fetch our data! For this reason we use the javascript function fetch https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  fetch(url)
    .then(function(resp) {
      // fetch returns us a string which we have to convert to a json object we can work with. it means we can use the . notation or ["key"] notation to get values out this object. We return now the json object to the next then to work with it.
      return resp.json();
    })
    .then(function(response) {
      // Now we console log our json object to understand the structur of this object. We need this to get the data we need for our task. in our case the url of the gifs we want to display. Maybe you want to check out the console.log at this point.
      console.log(response);

      /* We now want to display our gifs. So we create a new function with the name loadGifs and we invoke it and give it as parameter an array with our target object inside 
      data = [gifObj1, gifObj2, gifObj3, ... gifObj10]. Check out the console.log and you will see that the json object starts with key=data and as a value it has an array stored with objects inside. So we write response.data to get an array of objects!
      
      We have to write our function first so we now are jumping to loadGifs ;-) */
      loadGifs(response.data);
    });
};
/* We will invoke this function from our function getGif. We seperated this 2 functionalities to be able to change things easier in the future! 
loadGifs should take our json Object with our url insides and dynamically display it in our result div. For this reason we will generate html via javascript and put it into the DOM. That means it will be displayed for the user.
We give the loadGifs function an array as parameter (result) with functions inside so it can be used inside out loadGifs function 


*/
//loadGifs is responsible to display the gifs
loadGifs = result => {
  // First we will clean our result div, because when we do the next search the result will be still be in our DOM. So have to get an empty div!
  document.getElementById("result").innerHTML = "";

  // Now we generate our HTML and put it into the DOM. element by element of our array. For this reason  use map, to iterate over our array.
  result.map(item => {
    /* map gives us now element by element the input for our functionality (we start with gifObj1 and we end with gifObj10 in our case). So for every element we want to get a particular url of the gif. Take a look into the api documentation to understand what the fixed_height key gives us.  https://developers.giphy.com/docs/api/schema#image-object 
    The next line is really important to understand! How can I get a particular value of nested objects. Check out the structure with Postman. Every key gives us a value. In this case the key=item gives us as value again an object. Now we can call a key (images) on the given object. We again receive a value which is again an object. Again we use the key fixed_height to get again an object with the url inside of the gif with the fixed height of 200px. Finally we can can use the url key to get the url as a value (string)!  we store now the url of the gif we want to display. Which we will use in a generated img element with the attribute scr.*/
    const image = item.images.fixed_height.url;

    // We console log here to check out if we really get the correct url in a string format
    console.log(item.images.fixed_height.height);

    // Finally we want to display the gifs for the user. We do this via generating HTML elements with javascript. We use the "famous" createElement Method of the document class "createElement". First we create for every gif url an image element and set the the attribute for it with .setAttribute. Here we make usage of the "scr" attribute and set it to the gif url we extracted from the array with the nested objects.
    const newImg = document.createElement("img");
    newImg.setAttribute("src", image);

    // Now we put the new generated element into the result div via the appendChild method and it will displayed in the browser. It it important to understand this happens element by element from our array we sent to this function (see map on top). After all elements put into this function the function ends and our work is done. But keep in mind. For now we only prepared functionality for being used (function declartion). Nothing was invoked yet!!
    document.getElementById("result").appendChild(newImg);
  });
};

/* Now finally the fun can start :-). We put an eventListener on our search button. https://www.w3schools.com/js/js_htmldom_eventlistener.asp . Our eventListiner waits that our search button is clicked. Then the eventListener invokes our getGif function (=callback function: A callback is a function that is to be executed after another function has finished executing — hence the name ‘call back’.) So we don't use getGif() this would immediatly start the getGif function and would not wait for the click

So how does it work. 

The user puts words which desribe the gifs the user is looking for. The user maybe changes the limit (default is indexPosition=0 with value 10). After that the user clicks the the search button. Now the getGif function will be invoked. Finally something happens :-)
If you now go the the getGif function in the code you will see that the getGifs function calls the generateApiUrl function. generateApiUrl returns the url based on our user input of the search field and the limit dropdown. Then it fetches the data and converts it into a json object. After the data is prepared the getGifs function calls the loadGifs function with an array of objects as parameter. loadGifs now is responsible for displaying the data. */

// The button is responsible to start the entire process
document.getElementById("btn").addEventListener("click", getGif);
