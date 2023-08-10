function getCampsite() {
  const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=200&pageNo=1&MobileOS=AND&MobileApp=MobileApp&serviceKey=xnDGzEMy1enkoO3MGCskM%2Bk1VXDvugoOwdbFa2ZJ5bpeKzlLwXeZoFUOVB8hMy76m2u1fJBHkKN7EUjYTizHtg%3D%3D&_type=json`;
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
        center: new kakao.maps.LatLng(37.522278, 126.974722),
        level: 10,
      };
      var map = new kakao.maps.Map(mapContainer, mapOption);
      const apiData = data.response.body.items.item;
      var imageSrc = "../static/img/map_marker.svg";
      (imageSize = new kakao.maps.Size(40, 50)), // 마커이미지의 크기입니다
        (imageOption = { offset: new kakao.maps.Point(27, 69) }); // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다
      console.log(apiData[0])
      // 마커가 지도 위에 표시되도록 설정합니다
      for (let i = 0; i < apiData.length; i++) {
        if (apiData[i].lctCl == "산") {
          let lat = apiData[i].mapY;
          let lon = apiData[i].mapX;
          let title = apiData[i].facltNm;
          let addr = apiData[i].addr1;
          let tel = apiData[i].tel;
          let homepage = apiData[i].homepage;

          var markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );
          var content = `
          <div class="info">
          <div class="title"><span>${title}</span></div>
          <div class="address"><span>${addr}</span></div>
          <div class="tel"><span>${tel !== '' ? tel : '전화정보가 없습니다'}</span></div>
          <div class="homepage"><a href="${homepage}">홈페이지</a></div>
      </div>`;
    //         <div class="info">
    //     <div class="title"><span>${title}</span></div>
    //     <div class="address"><span>${addr}</span></div>
    //     <div class="tel"><span>${tel}</span></div>
    //     <div class="homepage"><a href="${homepage}">홈페이지</a></div>
    // </div>

          var marker = new kakao.maps.Marker({
            //   map: map,
            position: new kakao.maps.LatLng(lat, lon),
          });

          marker.setMap(map);

          let overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition(),
          });

          kakao.maps.event.addListener(marker, "mouseover", function () {
            overlay.setMap(map);
          });

          kakao.maps.event.addListener(marker, "mouseout", function () {
            setTimeout(function () {
              overlay.setMap();
            });
          });
        }
      }
    });
}
getCampsite();
