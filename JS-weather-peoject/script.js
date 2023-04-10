const userTab=document.querySelector("[data-userWeather]");

const searchTab=document.querySelector("[data-searchWeather]");

const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");

const searchForm=document.querySelector("[data-searchForm]");

const loadingScreen=document.querySelector(".loading-container");

const userInfoContainer=document.querySelector(".user-info-container");

let oldTab=userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(oldTab!=newTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
    
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
}
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

/// check if cordinates prsenet or not
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local cordinates nhi mile
        grantAccessContainer.classList.add("active");

    }
    else{
        const cordinates=JSON.parse(localCoordinates);
       fetchUserWeatherInfo(cordinates);

    }

}
 async function fetchUserWeatherInfo(cordinates){
    const {lat,lon}=cordinates;
    // grant location remove
    grantAccessContainer.classList.add("remove");

    // loading photo add
    loadingScreen.classList.add("active");
     try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const data=await response.json();
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);

     }
  catch(err){
    loadingScreen.classList.remove("active");

  }
   


 }


 // data show render function 
  function renderWeatherInfo(weatherINfo){


// we have fetch the data
const cityName=document.querySelector("[data-cityName]");

const countryIcon=document.querySelector("[data-countryIcon]");
 const desc = document.querySelector("[data-weatherdDesc]");
 const weatherIcon = document.querySelector("[data-weatherIcon]");
 const temp=document.querySelector("[data-temp]");
  const windspeed=document.querySelector("[data-windspeed]");
  const humidity=document.querySelector("[ data-humidity]");
  const cloudiness=document.querySelector("[data-cloudiness]");
 console.log("render data");
// Now we put fetch element in html elements
cityName.innerText=weatherINfo?.name;
countryIcon.src=`https://flagcdn.com/144x108/${weatherINfo?.sys?.country.toLowerCase()}.png`;
weatherIcon.src= `http://openweathermap.org/img/w/${weatherINfo?.weather?.[0]?.icon}.png`;
desc.innerText=weatherINfo?.weather?.[0]?.description;
temp.innerText=`${weatherINfo?.main?.temp}  °C `;
windspeed.innerText = `${weatherINfo?.wind?.speed} m/s`;
humidity.innerText = `${weatherINfo?.main?.humidity}%`;
cloudiness.innerText = `${weatherINfo?.clouds?.all}%`;

console.log("render complete")


  }

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("position leli");
    }
   
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    console.log("position se data render kr diya fetchuser ki tarahp")
}

   const grantAccessButton=document.querySelector("[data-grantAccess]");

   grantAccessButton.addEventListener("click",getLocation);


const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="") return ;
    else{
        fetchSearchWeatherInfo(cityName);
    }

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        //

    }
}



