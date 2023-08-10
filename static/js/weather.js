function onGeoOk(position) {
  const API_KEY = "8e50a627e2b8642baa1e1badf8695cc3";
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const forecastURl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  // 3시간 단위 5일 간 날씨정보

  fetch(forecastURl)
    .then((res) => res.json())
    .then((data) => {
      const location = document.querySelector(".user__location span");
      location.innerText = `현재위치 : ${data.name}`;
    });
}

function onGeoError() {
  alert("Can't find you!");
}
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
// 현재 위치 표시
//-----------------------오늘 한 일---------------------------------------
// 핀을 클릭했을 때 해당위치의 날씨예보가 나오게끔.
// 핀 위치의 위도와 경도를 받아서
// 1. 핀을 누르면 goCamp함수 실행, 해당위치 캠핑장의 위치를 고캠핑 api에서 mapX 와 mapY로 가져온다.
// 2. 가져온 값을 return해서 날씨예보 관련 함수에서 가져오면??

function goCamp() {
  const API_KEY = "8e50a627e2b8642baa1e1badf8695cc3";
  const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=300&pageNo=1&MobileOS=AND&MobileApp=MobileApp&serviceKey=xnDGzEMy1enkoO3MGCskM%2Bk1VXDvugoOwdbFa2ZJ5bpeKzlLwXeZoFUOVB8hMy76m2u1fJBHkKN7EUjYTizHtg%3D%3D&_type=json`;
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  return fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      var mapContainer = document.getElementById("map");
      var mapOption = {
        center: new kakao.maps.LatLng(37.5345, 126.9946),
        level: 6,
      };

      var map = new kakao.maps.Map(mapContainer, mapOption);
      // 마커가 지도 위에 표시되도록 설정합니다

      for (let i = 0; i < data.response.body.items.item.length; i++) {
        if (data.response.body.items.item[i].lctCl == "산") {
          let lat = data.response.body.items.item[i].mapY;
          let lon = data.response.body.items.item[i].mapX;
          let addr = data.response.body.items.item[i].addr1;
          let title = data.response.body.items.item[i].facltNm;
          let info = data.response.body.items.item[i].featureNm;
          let num = data.response.body.items.item[i].contentId;

          let formData = new FormData();
          formData.append("title_give", title);
          formData.append("num_give", num);

          fetch("/camp", { method: "POST", body: formData })
            .then((res) => res.json())
            .then((data) => {});
          const forecastURl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
          fetch(forecastURl, config)
            .then((res) => res.json())
            .then((data) => {
              console.log(data.weather[0].main, data.wind.speed);

              var content = `
              <div class="info">
                <div class="title">${title}</div>
                <div>${addr}</div>
                <div title="weather"> // 날씨 들어갈 곳 // </div>
              </div>
              `;

              var marker = new kakao.maps.Marker({
                //   map: map,
                position: new kakao.maps.LatLng(lat, lon),
              });

              marker.setMap(map);

              let overlay = new kakao.maps.CustomOverlay({
                content: content,
                position: marker.getPosition(),
              });

              kakao.maps.event.addListener(marker, "mousedown", function () {
                overlay.setMap(map);
              });

              kakao.maps.event.addListener(marker, "mouseup", function () {
                setTimeout(function () {
                  overlay.setMap();
                });
              });
            });
        }
      }
    });
}
function closeOverlay() {
  const overlayList = document.querySelectorAll(".info");

  if (overlayList.length > 0) {
    overlayList.forEach((overlay) => {
      overlay.parentElement.style.display = "none";
      window.location.reload();
    });
  }
}
// function closeOverlay() {
//     const overlayList = document.querySelectorAll('.info');

//     if (overlayList.length > 0) {
//         overlayList.forEach(overlay => {
//             overlay.parentElement.style.display = 'none';
//         });
//     }
// }
goCamp();
// setMap() 메서드는 마커를 지도 객체에 연결하는 데 사용. 이 메서드를 호출하고 map 객체를 인수로 전달하여, 해당 지도에 마커를 표시.
// marker: 지도에 표시할 마커 객체.
// map: 마커가 표시될 지도 객체.
// marker.setMap(map): 마커를 지도에 표시하기 위해 마커 객체를 해당 지도 객체와 연결.
// 따라서, 작성한 marker.setMap(map)은 마커를 생성하고 해당 지도에 표시하라는 의미.
