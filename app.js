const rowTop = document.querySelector("#row-top");
const rowBottom = document.querySelector("#row-bottom");
const temp = document.querySelector("#temp");
const time = document.querySelector("#time");
const timely = document.querySelector(".timely");

async function weather(lat, longitude) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${longitude}8&appid=a5306befb0a219baa64ca8d6292dbfe7`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  const fetchData = await data.json();
  // row-top
  const today = new Date();
  const rowTopDiv1 = document.createElement("div");
  const rowTopDiv2 = document.createElement("div");

  rowTopDiv1.classList.add("col");
  rowTopDiv2.classList.add("col");

  rowTopDiv1.innerText = fetchData.timezone;
  rowTopDiv2.innerText = today.toLocaleDateString();

  rowTop.appendChild(rowTopDiv1);
  rowTop.appendChild(rowTopDiv2);

  // temp or time
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  temp.innerHTML = `${Math.ceil(fetchData.current.temp - 273.15)}&deg`;
  const timep1 = document.createElement("p");
  const timep2 = document.createElement("p");
  const timeh2 = document.createElement("h2");

  const imgPath = `http://openweathermap.org/img/wn/${fetchData.current.weather[0].icon}@2x.png`;
  timep1.innerText = today.toLocaleTimeString();
  timeh2.innerHTML = `<b>${days[today.getDay()]}</b>`;
  timep2.innerHTML = `${fetchData.current.weather[0].main} <img src= ${imgPath}>`;

  time.appendChild(timep1);
  time.appendChild(timeh2);
  time.appendChild(timep2);

  // hourly
  for (let i = 1; i < 7; i++) {
    let unix_timestamp = fetchData.hourly[i].dt;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    const timeStamp = hours < 12 ? " AM" : " PM";
    hours = `${((hours + 11) % 12) + 1}` + ": 00";
    const weatherIcon = fetchData.hourly[i].weather[0].icon;
    const imgPath = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    const hourlyDiv = document.createElement("div");
    // hourlyDiv.classList.add("row");
    hourlyDiv.classList.add("hourly");
    hourlyDiv.innerHTML = `<div><img src=${imgPath}></div> <div><b>${hours}${timeStamp}</b></div>`;
    timely.appendChild(hourlyDiv);
  }

  // row bottom
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 1; i < 8; i++) {
    let unix_timestamp = fetchData.daily[i].dt;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(unix_timestamp * 1000);
    // Day part from the timestamp
    const day = shortDays[date.getDay()];

    const bottomDiv = document.createElement("div");
    const bottomInnerDiv1 = document.createElement("div");
    const bottomInnerDiv2 = document.createElement("div");
    bottomDiv.classList.add("col");
    bottomInnerDiv1.classList.add("row");
    bottomInnerDiv2.classList.add("row");
    bottomInnerDiv1.innerText = day;
    bottomInnerDiv2.innerHTML = `${Math.ceil(
      fetchData.daily[i].temp.day - 273.15
    )}&deg`;
    bottomDiv.appendChild(bottomInnerDiv1);
    bottomDiv.appendChild(bottomInnerDiv2);
    rowBottom.appendChild(bottomDiv);
  }
  console.log(fetchData);
}

navigator.geolocation.getCurrentPosition(function (position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  weather(lat, long);
});
