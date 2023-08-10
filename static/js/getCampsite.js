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

            // 마커가 지도 위에 표시되도록 설정합니다
            for (let i = 0; i < apiData.length; i++) {
                if (apiData[i].lctCl == "산") {
                    let lat = apiData[i].mapY;
                    let lon = apiData[i].mapX;
                    let spotNm = apiData[i].facltNm;
                    let addr = apiData[i].addr1;

                    var markerImage = new kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize,
                        imageOption
                    );

                    var marker = new kakao.maps.Marker({
                        image: markerImage,
                        map: map,
                        position: new kakao.maps.LatLng(lat, lon),
                    });
                    marker.setMap(map);
                    // let textIn = `<p></p> ${spotNm} <br> ${addr}`;
                    // var content = document.createElement("div");

                    // div.className = "overlaybox";
                    // content.innerHTML = textIn;
                    // var position = marker.getPosition();

                    // var customOverlay = new kakao.maps.CustomOverlay({
                    // content: content,
                    // map: map,
                    // position: position,
                    // });
                    // customOverlay.setMap(null);
                    // kakao.maps.event.addListener(
                    // marker,
                    // "click",
                    // function (customOverlay) {
                    // return function () {
                    // customOverlay.setMap(map);
                    // };
                    // }
                    // );
                }
            }
        });
}
getCampsite();