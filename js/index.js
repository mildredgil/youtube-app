const API_KEY = "AIzaSyD86eJ2TcBZx8xp2g8NtlToLDSOfhO7850"
let previousToken = '';
let nextToken = '';
let queryValue = '';

let init = () => {
    submitHandler();
    pageHandlers();
}

let submitHandler = () => {
    let searchInput = document.querySelector("#search_bar");
    let submitBtn = document.querySelector("form > button[type='submit']");

    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if(searchInput.value.trim() !== "") {
            queryValue = searchInput.value;
            fetchVideos();
        }
    });
}

let pageHandlers = ()  => {
    let previousBtn = document.querySelector(".previous");
    
    previousBtn.addEventListener("click", (_) => {
        fetchVideosByToken(previousToken);
    })

    let nextBtn = document.querySelector(".next");
    nextBtn.addEventListener("click", (_) => {
        fetchVideosByToken(nextToken);
    })
}

let fetchVideos = () => {
    let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&q=${queryValue}&part=snippet&maxResults=10`;
    
    let settings = {
        method : "GET"
    }

    fetch(url, settings)
        .then(response => {
          if( response.ok )  {
              return response.json();
          }

          throw new Error(response.statusText);
        })
        .then( responseJSON => {
            console.log(responseJSON);
            displayResults(responseJSON);
            PageBtns(responseJSON);
        })
        .catch( err => {
            console.log( err );
        })
}

let fetchVideosByToken = (token) => {
    console.log(token);
    let url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${queryValue}&type=video&part=snippet&maxResults=10&pageToken=${token}`;
    
    let settings = {
        method : "GET"
    }

    fetch(url, settings)
        .then(response => {
          if( response.ok )  {
              return response.json();
          }

          throw new Error(response.statusText);
        })
        .then( responseJSON => {
            displayResults(responseJSON);
            PageBtns(responseJSON);
        })
        .catch( err => {
            console.log( err );
        })
}

let displayResults = (data) => {
    let items = data.items;
    let videoContent = document.querySelector(".videos");
    videoContent.innerHTML = "";

    for(let i = 0; i < items.length; i ++) {
        videoContent.innerHTML += `
        <a href="https://www.youtube.com/watch?v=${items[i].id.videoId}" target="_blank">
            <h2>${items[i].snippet.title}</h2>
            <img src="${items[i].snippet.thumbnails.default.url}"/>
        </a>`
    }
}

let PageBtns = (data) => {

    if(data.prevPageToken != null) {
        previousToken = data.prevPageToken;
        show(true, "previous");
    } else {
        show(false, "previous");
    }
    
    if(data.nextPageToken != null) {
        nextToken = data.nextPageToken;    
        show(true, "next");
    } else {
        show(false, "next");
    }
}

let show = (val, className) => {
    let pagesSection = document.querySelector(`.${className}`);
    
    if(val)
        pagesSection.classList.remove("hide");
    else
        pagesSection.classList.add("hide");
}

init();