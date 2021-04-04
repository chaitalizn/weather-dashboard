var lat;
var lon;
var city;
var cityList = [];
var forecastCardBox = $('#forecast-five-day');

if (!localStorage.getItem('cities')) {   
localStorage.setItem('cities', JSON.stringify(cityList));
}
var historyList = JSON.parse(localStorage.getItem('cities'));  

function findLatLon() {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=566ee57f3f41c9a418c16043339e7c83')
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {    

        lat = (response.coord.lat);
        lon = (response.coord.lon);

        var dateObject = new Date(response.dt * 1000);
        var humanDateFormat = (dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear());
        console.log(response);

        var cityDate = document.querySelector("#city-date");
        cityDate.textContent = city + ' - ' + humanDateFormat;

        function currentWeather() {
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&&exclude=minutely,hourly,alerts&appid=566ee57f3f41c9a418c16043339e7c83')
            .then(function(response) {
                return response.json();
            })
            .then(function(response)  {         
                
                var temp = response.current.temp;
                var wind = response.current.wind_speed;
                var humidity = response.current.humidity;
                var uvIndex = response.current.uvi;

                $("#currentTemp").text("Temp: " + temp + " °F");
                $("#currentWind").text("Wind: " + wind + " MPH");
                $("#currentHumidity").text("Humidity: " + humidity + " %");
                $('#currentUv').html('<p> UV Index: <span id="bg-color">' + uvIndex + '<span>');

                function uvColor() {
                    
                    if(uvIndex <= 2) {
                        $('#bg-color').css("background-color", "rgb(40, 149, 0)");
                    }
                    if(uvIndex >= 3 && uvIndex <= 5) {
                        $('#bg-color').css("background-color", "rgb(247, 228, 0)");
                    }
                    if(uvIndex >= 6 && uvIndex <= 7) {
                        $('#bg-color').css("background-color", "rgb(248, 89, 0)");
                    }
                    if(uvIndex >= 8 && uvIndex <= 10) {
                        $('#bg-color').css("background-color", "rgb(216, 0, 29)");
                    }
                    if(uvIndex > 10) {
                        $('#bg-color').css("background-color", "rgb(107, 73, 200)");
                    }
                }
                uvColor()
            })
        }
        currentWeather()
        


        function futureWeather() {
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&&exclude=minutely,hourly,alerts&appid=566ee57f3f41c9a418c16043339e7c83')
            .then(function(response) {
                return response.json();
            })
            .then(function(response)  {
                
                console.log(response);

                forecastCardBox.html('');

                for (i = 0; i <= 5; i++) {
                    var dateObject = new Date(response.daily[i].dt * 1000);
                    var humanDateFormat = (dateObject.getDate() + "/" + dateObject.getMonth() + "/" + dateObject.getFullYear());
                    var iconForecast = response.daily[i].weather[0].icon;
                    var tempForecast = response.daily[i].temp.day;
                    var windForecast = response.daily[i].wind_speed;
                    var humidityForecast = response.daily[i].humidity;
                                     
                    createForecastBox();

                    function createForecastBox() {
                    var forecastCardDiv = $('<div>');
                    forecastCardDiv.addClass('col-md card text-white bg-dark mb-3');
                    //forecastCardDiv.attr('id', 'forecast-card');

                    forecastCardDiv.html('<div class = "card-body"> <h4 class="card-title">' + humanDateFormat + ' </h4> <img class="icon" src="http://openweathermap.org/img/wn/' + iconForecast + '@2x.png"> <p class="card-text"> Temp: ' + tempForecast + ' °F </p> <p class="card-text"> Wind: ' + windForecast + ' MPH </p> <p class="card-text"> Humidity: ' + humidityForecast + '% </p>');
                    
                    forecastCardBox.append(forecastCardDiv);

                    // var forecastDate = $('<h4>');
                    // forecastDate.addClass('card-title');
                    // forecastDate.text(humanDateFormat);
                    // $('.day').append(forecastDate);

                    // var forecastIcon = $('<img>');
                    // forecastIcon.attr('src', 'http://openweathermap.org/img/wn/' + iconForecast + '@2x.png')
                    // $('#forecast-card').append(forecastIcon);
                    
                    // var forecastTemp = $('<p>');
                    // forecastTemp.addClass('card-text');
                    // forecastTemp.text('Temp: ' + tempForecast + ' °F');
                    // $('#forecast-card').append(forecastTemp);

                    // var forecastWind = $('<p>');
                    // forecastWind.addClass('card-text');
                    // forecastWind.text('Wind: ' + windForecast + ' MPH');
                    // $('#forecast-card').append(forecastWind);

                    // var forecastHumidity = $('<p>');
                    // forecastHumidity.addClass('card-text');
                    // forecastHumidity.text('Humidity: ' + humidityForecast + ' %');
                    // $('#forecast-card').append(forecastHumidity);

                    $('#forecast-five-day').append(forecastCardDiv);
                
                    }
                }
            })
        }

        futureWeather()
        

})
}


function myFunction() {
$('#search').click(function(){
    city = $('#userCitySearch').val();
    findLatLon();
                                                           
    if (historyList) {
        historyList.push(city);
        localStorage.setItem('cities', JSON.stringify(historyList));
    }

    pastSearchBtn()

})
}


function pastSearchBtn() {
    
    $('#past-search-btn').html('');

    for (i = 0; i < historyList.length; i++) {
        var btn = $('<button>');
        btn.addClass('btn btn-secondary my-1 mb-2 past-btn');
        btn.attr('type', 'button');
        btn.text(historyList[i]);
        btn.attr('value', historyList[i]);
        $('#past-search-btn').append(btn);
    }

    $('#past-search-btn').addEventListener("click", pastButtonHandler)
    
}

var pastButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".past-btn")) {
        city = event.target.value;
        findLatLon();
    }
}; 

myFunction()