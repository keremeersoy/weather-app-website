const wrapper = document.querySelector(".wrapper")
inputPart = wrapper.querySelector(".input-part")
infoTxt = inputPart.querySelector(".info-txt")
inputField = inputPart.querySelector("input")
locationBtn = inputPart.querySelector("button")
wIcon = document.querySelector(".weather-part img");
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    // kullanıcı enter'a basmışsa ve giriş değeri boş değilse 
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ // tarayıcınız geolocation'u destekliyorsa
        navigator.geolocation.getCurrentPosition(onSuccess, onError) // lokasyon alma başarılıysa onSuccess, değilse onError methodu çalışacak.
    }else{
        alert("Tarayıcınız geolocation api'ı desteklemiyor")
    }
})

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=a5c20de7202ac2e5887f83469818330f&lang=tr`
    fetchData();
}

function onError(error){
    infoTxt.innerText = "Konum erişimi reddedildi."
    infoTxt.classList.add("error")
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a5c20de7202ac2e5887f83469818330f&lang=tr`;
    fetchData();
}

//data yüklenirken 
function fetchData(){
    infoTxt.innerText = "Hava durumu gösteriliyor...";
    infoTxt.classList.add("pending")
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

//  hava durumu açıklamasının ilk harfini büyük yapmak için
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// hava durumu ayrıntılarını verecek
function weatherDetails(info){
    if(info.cod == "404"){ //hatalı şehir girişi
        infoTxt.classList.replace("pending", "error")
        infoTxt.innerText = `${inputField.value} geçerli bir şehir değil`;
    }
    else{ //doğru şehir girişi
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){ // hava durumuna göre gösterilecek icon'un seçilmesi
            wIcon.src = "Weather Icons/clear.svg";
        }
        else if(id >= 200 && id <= 232){
            wIcon.src = "Weather Icons/storm.svg";
        }
        else if(id >= 600 && id <= 622){
            wIcon.src = "Weather Icons/snow.svg";
        }
        else if(id >= 701 && id <= 781){
            wIcon.src = "Weather Icons/haze.svg";
        }
        else if(id >= 801 && id <= 804){
            wIcon.src = "Weather Icons/cloud.svg";
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "Weather Icons/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = capitalizeFirstLetter(description);
        wrapper.querySelector(".location span").innerText = `${city} , ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error")
        wrapper.classList.add("active")
        console.log(info)
    }
}

// hava detayları gösterildikten sonra geri dönebilmek için geri tuşu fonksiyonu
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});