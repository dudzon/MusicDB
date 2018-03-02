// Global Variables

const searchBtn = document.body.querySelector('.search__bar__form--button');
const artistQuery = document.body.querySelector('.search__bar__form--input');
const container = document.body.querySelector('.container');
const form = document.body.querySelector('#search_form');
const error = document.body.querySelector('.error_message'); 
const parent = document.body.querySelector('.search__bar');
const wrapper = document.body.querySelector('.search__bar__wrapper');
const header = document.body.querySelector('.search__bar__wrapper--header');
const formContainer = document.querySelector('.search__bar__form--container');
const formIcon = document.querySelector('.search__bar__form--icon'); 
const artist = document.querySelectorAll('.album__list__details--artist');
const title = document.querySelectorAll('.album__list__details--title');




// Event Listeners
searchBtn.addEventListener('click',getData,false); /* Show Data */
form.addEventListener('submit',tabSearch,false);  /* Show Data when pressed TAB on search input field */
artistQuery.addEventListener('keydown',hideError,false);
window.addEventListener('scroll',fixedSearchBar,false);
// Copy input value

function searchArtist(){
    const artist = artistQuery.value;
    const query = artist.replace(/\s/g,"+").toLowerCase(); /* replace spaces with + sign to provide correct content request */
    return query;
   
}

// Get data from database
function getData(){
    container.innerHTML =''; /* Remove elements from previous search */
    const data = searchArtist(); 
    const method = 'GET';
    const url = `https://itunes.apple.com/search?term=${data}&entity=album&attribute=artistTerm`;  /* Content request */
    const xhr = new XMLHttpRequest();

    xhr.open(method,url,true);/* Open AJAX request */
    xhr.onload = function(){
        if(this.status == 200 && this.readyState == 4){
            const dataReceived = parseData(this); /* Parse this.responseText */
            const outputData = dataReceived.results; 
            console.log(outputData);
            if (outputData.length > 0 ){ /* If there are any results display them on page */
              loadData(outputData);
            }else{
                error.style.display = 'block';
            }
        }
    }
    xhr.send();
    artistQuery.value = '';/* Reset input field */
}

// Helper function to parse data from server

function parseData(data){
    let response = JSON.parse(data.responseText);
    return response;
}

// Show data on website
/* Create document fragment, fill it with correct information retrieved from the database and append each result to div with 'container' class. */

function loadData(output){

    for ( let i = 0; i < output.length; i++){
    
        let frag = document.createRange().createContextualFragment(`  
        <section class="album__list">
            <div class="album__list__album--item">
                <div class="album__list__album--thumbnail">
                 <img src="${output[i].artworkUrl100.replace(/100/g,'400')}"
                    alt="Album Cover">
                </div>
                <div class="album__list__album__details">
                    <div class="album__list__details--artist">${output[i].artistName}</div>
                    <div class="album__list__details--title">${output[i].collectionName}</div>
                    <div class="album__list__details--offer">
                        <div class="album__list__details--price">
                            <span>Price:</span>${output[i].collectionPrice || 'to be announced'} ${output[i].currency}
                        </div>
                        <a href="${output[i].collectionViewUrl}" target="_blank" class="album__list__album--shop">
                            <span>
                                <i class="fas fa-shopping-cart"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>`);
       container.appendChild(frag);

    }
    const artist = Array.from(document.querySelectorAll('.album__list__details--artist'));
    const title = Array.from(document.querySelectorAll('.album__list__details--title'));
    
    
// media query event handler

if (matchMedia) {
  const mq = window.matchMedia("(max-width: 575.98px)");
  mq.addListener(WidthChange);
  WidthChange(mq);
}


// media query change
    function WidthChange(mq) {
        if (mq.matches) {
        shave('.album__list__details--artist',100); /* Truncate strings in artist name and title in smallest resolution */
        shave('.album__list__details--title',50);
    } else{
        shave('.album__list__details--artist',500);
        shave('.album__list__details--title',500);
    }
    }

}
 


//  Show data when user presses ENTER key.
function tabSearch(e){
    e.preventDefault();
    if (e.target.tagName == 'FORM'){
        searchBtn.click();
    }
}

function hideError(){
    if(error.style.display = 'block'){
        error.style.display = 'none';
    }
}

function fixedSearchBar(){
    const distance = calculateScrollHeight();
    if( distance > 10){
    //     console.log('10%scroll')

        parent.className = 'search__bar--fixed';
        wrapper.className= 'search__bar__wrapper--fixed';
        header.className= 'search__bar__wrapper--header--fixed';
        form.className= 'search__bar__form--fixed';
        formContainer.className='search__bar__form--container--fixed';
        formIcon.className= 'search__bar__form--icon--fixed';
        artistQuery.className='search__bar__form--input--fixed';
        searchBtn.className='search__bar__form--button--fixed';
        } else if(distance <= 10){
        parent.className = 'search__bar';
        wrapper.className= 'search__bar__wrapper';
        header.className= 'search__bar__wrapper--header';
        form.className= 'search__bar__form';
        formContainer.className='search__bar__form--container';
        formIcon.className= 'search__bar__form--icon';
        artistQuery.className='search__bar__form--input';
        searchBtn.className='search__bar__form--button';
        }
        
    }

// Function to calculate how much percentage of the page has been scrolled down by the user

function calculateScrollHeight() {
    const windowHeight = window.innerHeight; /* Get the height of the browser window */
    const scrollTop = window.pageYOffset; /* How much user scrolled page vertically */
    const docHeight = getDocumentHeight(); /* Document height */
    const heightDiff = docHeight - windowHeight;/* Difference between document height and browser height */
    const percentageScrolled = Math.floor(scrollTop/heightDiff * 100); /* Percentage of page scrolled by the user */
    return percentageScrolled;
}

function getDocumentHeight(){
    const doc = document;
    return Math.max(doc.body.scrollHeight,
                    doc.body.offsetHeight,
                    doc.body.clientHeight);
}


