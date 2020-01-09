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

// generateApiUrl is responsible for generating our api url based on the user input. We extented this version with the parameter offset. We use the pagination object which will be sent to us with every query we make. So we know how many gifs (obj) we will get. So when we say for example you receive 250 gifs for this query and we want to display 25 gifs per page we get 10 pages. If we now click on the 3rd page we query the api with offset of the 3*25 ((pageNumber-1)*displayedGifs) and a limit parameter of 25 (=#gifs we want to display). So we should get in the result div 25 gifs (the first 75 gifs are not resulted because we used the offset). Because the offset is defined in the url we put the offset parameter into the generateApiUrl function.
generateApiUrl = offset => {
  // we store our API key into a const variable
  const apiKey = "4p7w4YD3KnU48WzncbVg5PTrJYdGB4yk";

  // We are fetching from our search Element the input value of the user.
  const searchInput = document.getElementById("search").value;

  // We are fetching the input of the user from our drop-down menu. To do this we first select the element. We can implement the 2 following lines in 1 line but the readibility can suffer so we decided to split this part in 2 steps. First we select our drop-down menue

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

  /* Now we are concating the string we want to send. We use already the ES6 String literals. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals for it. We put our stored variables into our string via ${varName}. No + are needed anymore! We extented this version with the offset parameter*/
  const giphyAPI = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${apiKey}&offset=${offset}&limit=${selectValue}`;

  // We console.log now our string to check if we did it correctly. Later we will comment it out or delete this part. It's only needed to check if we did everything correctly.
  //console.log(giphyAPI);

  // Now we we return our string.
  return giphyAPI;
};

/* Next we prepare a function which get us the gifs from the giphy server based on our api call.
getGif is responsible for getting the data from the api and converts it into a json object
 */
getGif = offset => {
  document.getElementById("pagination").style.display = "block";
  // The getGif function will be only invoked if we press the search button. If we do this we have to set back our pagination to 1.
  generatePageNumber(1);
  // For this reason we call our generateApiUrl function, which returns us the url string we need and store it into a variable url. We now invoke the function with the offset parameter, which we will calculate with the formula (PAGE_NUMBER-1) * limit.

  const URL = generateApiUrl(offset);

  // Now we are ready to fetch our data! For this reason we use the javascript function fetch https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  fetch(URL)
    .then(function(resp) {
      //console.log(resp);

      if (!resp.ok) {
        document.getElementById("result").innerHTML = "Error blababla";
        throw Error(resp.statusText);
      } else {
        return resp.json();
      }

      // fetch returns us a string which we have to convert to a json object we can work with. it means we can use the . notation or ["key"] notation to get values out this object. We return now the json object to the next then to work with it.
    })
    .then(function(response) {
      // Now we console log our json object to understand the structure of this object. We need this to get the data we need for our task. in our case the url of the gifs we want to display. Maybe you want to check out the console.log at this point.
      console.log(response);

      /* We now want to display our gifs. So we create a new function with the name loadGifs and we invoke it and give it as parameter an array with our target object inside
            data = [gifObj1, gifObj2, gifObj3, ... gifObj10]. Check out the console.log and you will see that the json object starts with key=data and as a value it has an array stored with objects inside. So we write response.data to get an array of objects!

            We have to write our function first so we now are jumping to loadGifs ;-) */
      generatePagination(response.pagination);
      loadGifs(response.data);
    })
    .catch(err => console.log(err));
};
/* We will invoke this function from our function getGif. We seperated this 2 functionalities to be able to change things easier in the future!
loadGifs should take our json Object with our url insides and dynamically display it in our result div. For this reason we will generate html via javascript and put it into the DOM. That means it will be displayed for the user.
We give the loadGifs function an array as parameter (result) with functions inside so it can be used inside out loadGifs function


*/
//loadGifs is responsible to display the gifs
loadGifs = result => {
  // First we will clean our result div, because when we do the next search the result will be still be in our DOM. So have to get an empty div!
  cleanResultDiv();

  // Now we generate our HTML and put it into the DOM. element by element of our array. For this reason  use map, to iterate over our array.
  result.map(item => {
    /* map gives us now element by element the input for our functionality (we start with gifObj1 and we end with gifObj10 in our case). So for every element we want to get a particular url of the gif. Take a look into the api documentation to understand what the fixed_height key gives us.  https://developers.giphy.com/docs/api/schema#image-object

        The next line is really important to understand! How can I get a particular value of nested objects. Check out the structure with Postman. Every key gives us a value. In this case the key=item gives us as value again an object. Now we can call a key (images) on the given object. We again receive a value which is again an object. Again we use the key fixed_height to get again an object with the url inside of the gif with the fixed height of 200px. Finally we can can use the url key to get the url as a value (string)!  we store now the url of the gif we want to display. Which we will use in a generated img element with the attribute scr. Because we will display a lot of gifs we chose to use the downsampled version which gives us a faster loading time */
    const image = item.images.fixed_height_downsampled.url;

    // We console log here to check out if we really get the correct url in a string format
    //console.log(item.images.fixed_height_downsampled.url);

    // Finally we want to display the gifs for the user. We do this via generating HTML elements with javascript. We use the "famous" createElement Method of the document class "createElement". First we create for every gif url an image element and set the the attribute for it with .setAttribute. Here we make usage of the "scr" attribute and set it to the gif url we extracted from the array with the nested objects.
    const newImg = document.createElement("img");
    newImg.setAttribute("src", image);
    // We disabled the popup functionality
    // newImg.onclick = showPopUp;

    document.getElementById("result").appendChild(newImg);
  });
};

/* disabled PopUp 
showPopUp = event => {
    const IMG = event.target.attributes.src.value;

    Swal.fire({
        title: 'Oops...',
        imageUrl: IMG
    })
}*/

/* with the getLinks function we get all our <a> elements with the links https://www.w3schools.com/tags/tag_a.asp*/
getLinks = () => {
  /* The getElementsByTagName() method returns a collection of all elements in the document with the specified tag name, as a NodeList object. The NodeList object represents a collection of nodes. The nodes can be accessed by index numbers. The index starts at 0.
    NodeList explained: https://www.computerhope.com/jargon/n/nodelist.htm
    */

  return document.getElementsByTagName("a");
};
// the generatePagination function uses our pagination object from the api call and we link the onclick mouse event to all of our elements
generatePagination = data => {
  let links = getLinks(); //this returns us a NodeList object which be accessed by index numbers with the links inside
  for (let i = 0; i < links.length; i++) {
    links[i].onclick = e => changeIndex(e, data); // We use here an onclick event https://www.w3schools.com/jsref/event_onclick.asp . It is similar to eventListener. Find here an the differences explained. https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick. Here on click invokes our changeIndex function with 2 parameters event and data. e is the event from the mouse click and we get information which element was clicked etc.. furthermore we send our  ----
  }
};

//
changeIndex = (event, data) => {
  handleActives(event);
  const contentValue = parseInt(
    event.target.innerText
  ); /* Here we get the content of our pagination elements = pageNumber
    <li class="page-item"><a index="0" class="active page-link" href="#">1</a></li>*/

  const index = parseInt(
    event.target.attributes.index.value
  ); /* Here we get which element was clicked, because we want to decrease the page number if the first element is clicked and we want increase the page number if the last element was clicked. For this reason we defined an index attribute starting from 0 - 9 

    <li class="page-item"><a index="0" class="active page-link" href="#">1</a></li>
    <li class="page-item"><a index="1" class="page-link" href="#">2</a></li>
    ...
    <li class="page-item"><a index="9" class="page-link" href="#">10</a></li>
    */
  const count = data.count; // this is our limit based on our first call from our pagination object. So we can calculate our offset value.
  const offset = (contentValue - 1) * count; // with this formular we calculate our offset value for the query based on on the pageNumber=contentValue of our pagination elements (see line 47 in giphy_comment.html) and our limit=count => how many gifs are displayed.

  getGif(offset); // here we call our getGif function with our calculated offset value

  /* This part is responsible for the logic to decrease the pageNumber if the first element was clicked => index == 0 and increasing the pageNumber if the last element was clicked => index == 9. We call here our function generatePageNumber function to display the updated values in our pagination elements. */
  if (index == 9) {
    // Here we check if the last element was clicked and we update our pagination elements
    generatePageNumber(contentValue - 8);
  }
  if (contentValue > 1 && index == 0) {
    // Here we check if the first element was clicked and that we not going < 1 with our page numbers.
    generatePageNumber(contentValue - 1);
  }
};

// the handleActives function provides us with the functionality that if we press a pagination element we change the background color to show what element is active.
handleActives = event => {
  // we clean all the active classes - non of them are active anymore
  const elements = document.getElementsByClassName("active");
  for (let i = 0; i < elements.length; i++) {
    elements[i].className = "page-item";
  }

  // and here we add the active class to element which was clicked
  event.target.parentElement.className += " active";
};

/* With this little function we update the content of our pagination elements. We give the parameter start. which starts to fill our pagination elements with the start value and increases it from left to right. 
e.g. start value = 10
page 10 - 11 - 12 - ... 19
so if we press now our first element we get our contentValue=pageNumber from our
pagination element and we fire generatePageNumber with start=contentValue-1
e.g. 
page 20 - 21 - 22 - ... 29
we have contentValue of 20 and we get a start = 20 - 1 so we get
page 19 - 20 - 21 - ... 28 as a result */

generatePageNumber = start => {
  let links = getLinks();
  for (let i = start; i < start + 10; i++) {
    links[i - start].innerText = i;
  }
};
//This function cleans our result div to load new gifs inside triggered by a new query
cleanResultDiv = () => {
  document.getElementById("result").innerHTML = "";
};
// Here the fun starts;) we click our search button
document.getElementById("btn").addEventListener("click", getGif);
