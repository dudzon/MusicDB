// Global Variables

const searchBtn = document.body.querySelector('.search__bar__form--button');
const artistQuery = document.body.querySelector('.search__bar__form--input');
const container = document.body.querySelector('.container');

// Event Listeners
searchBtn.addEventListener('click',getData,false); /* Show Data */



// Copy input value

function searchArtist(){
    const artist = artistQuery.value;
    const query = artist.replace(/\s/g,"+").toLowerCase(); /* replace spaces with + sign to provide correct content request */
    return query;
   
}

// Get data from database
function getData(){
    const data = searchArtist(); 
    const method = 'GET';
    const url = `https://itunes.apple.com/search?term=${data}&entity=album`;  /* Content request */
    const xhr = new XMLHttpRequest();

    xhr.open(method,url,true);/* Open AJAX request */
    xhr.onload = function(){
        if(this.status == 200 && this.readyState == 4){
            const dataReceived = parseData(this); /* Parse this.responseText */
            const outputData = dataReceived.results; 
            if (outputData.length > 0){ /* If there are any results display them on page */
              loadData(outputData);
            }
        }
    }
    xhr.send();
}

// Helper function to parse data from server

function parseData(data){
    let response = JSON.parse(data.responseText);
    return response;
}

// Show data on website
/* Create document fragment, fill with correct inormation retrieved from the database and append each result to div with 'container' class. */

function loadData(output){
    for ( let i = 0; i < output.length; i++){
        let frag = document.createRange().createContextualFragment(`  
        <section class="album__list">
            <div class="album__list__album--item">
                <div class="album__list__album--thumbnail">
                    <img src="${output[i].artworkUrl100}"
                        alt="Album Cover">
                </div>
                <div class="album__list__album__details">
                    <div class="album__list__details--artist">${output[i].artistName}</div>
                    <div class="album__list__details--title">${output[i].collectionName}</div>
                    <div class="album__list__details--offer">
                        <div class="album__list__details--price">
                            <span>Price:</span>${output[i].collectionPrice} ${output[i].currency};
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
   
}