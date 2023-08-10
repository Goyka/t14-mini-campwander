let isFetching = false; // 중복 호출 방지용 플래그
let fetchTimeout; // 호출 딜레이를 위한 timeout 변수

let campTitle;
let campId;
let campLat;
let campLon;

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

let 위도경도 = {};

function goCamp() {

    const API_KEY = "8e50a627e2b8642baa1e1badf8695cc3";
    const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=50&pageNo=1&MobileOS=AND&MobileApp=MobileApp&serviceKey=xnDGzEMy1enkoO3MGCskM%2Bk1VXDvugoOwdbFa2ZJ5bpeKzlLwXeZoFUOVB8hMy76m2u1fJBHkKN7EUjYTizHtg%3D%3D&_type=json`;
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
                    let tel = data.response.body.items.item[i].tel;
                    let homepage = data.response.body.items.item[i].homepage;
                    let num = data.response.body.items.item[i].contentId;
                    if (위도경도[title] === undefined) {
                        위도경도[title] = [];
                        위도경도[title].push([lat, lon]);
                    } else {
                        위도경도[title].push([lat, lon]);
                    }
                    // handle(title, num, lat, lon )

                    let formData = new FormData();
                    formData.append("title_give", title);
                    formData.append("num_give", num);

                    fetch("/camp", { method: "POST", body: formData })
                        .then((respose) => respose.json())
                        .then((data) => { });

                    const forecastURl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
                    fetch(forecastURl, config)
                        .then((res) => res.json())
                        .then((data) => {
                            let weather = data.weather[0].main
                            let wind = data.wind.speed;

                            var content = `<div class="warp">
                                            <div class="info">
                                                <div class="title">${title}</div>
                                                <div>${addr}</div>
                                                <div title="weather">날씨 : ${weather} / 풍속 : ${wind}</div>
                                                <div class="tel"><span>${tel !== '' ? tel : '전화정보가 없습니다'}</span></div>
                                                <div class="homepage"><a href="${homepage}">홈페이지</a></div>
                                            </div>`;

                            var marker = new kakao.maps.Marker({
                                //   map: map,
                                position: new kakao.maps.LatLng(lat, lon),
                            });

                            marker.setMap(map);
                            let overlay = new kakao.maps.CustomOverlay({
                                // info창 높이 조절
                                yAnchor: 1.5,
                                content: content,
                                position: marker.getPosition(),
                            });

                            marker.setMap(map);

                            let count = 0
                            kakao.maps.event.addListener(marker, "click", function () {

                                $('.comment').slideDown().css('display', 'flex');
                                // show_comment(campTitle, campId)
                                // handle(title, num, lat, lon)
                                count++
                                if (count % 2 !== 0) {
                                    overlay.setMap(map);
                                    handle(title, num, lat, lon)
                                } else if (count % 2 == 0) {
                                    overlay.setMap(null);
                                    count = 0;
                                }
                            }
                            );
                        });
                };
            }
        },
        );
}
goCamp()


// comment.js
function handle(title, num, lat, lon) {
    campTitle = title;
    campId = num;
    campLat = lat;
    campLon = lon;

    // executeAfterDelay();
    show_comment(campTitle, campId)
}


async function executeAfterDelay() {
    // 중복 호출 방지
    if (isFetching) return;

    isFetching = true;

    try {
        // show_comment() 함수 호출 등의 작업을 수행
        await show_comment(campTitle, campId);
    } catch (error) {
        console.error(error)
    } finally {
        isFetching = false;
        window.location.reload(true);
    }

    // 호출 딜레이 후에 다시 호출 가능하도록 설정

}


$(document).ready(function () {
    $('.comment').hide();
    $('#comment-slide').click(function () {
        // $('.comment-one').empty();
        show_comment(campTitle, campId)
        $('.comment').slideDown().css('display', 'flex');


    })
    $('#comment-close').click(function () {
        close_comment()
    })
});

let prevSelectId = 0;

function close_comment() {
    $('.comment').slideUp();
}

let user_id = null; // 세션 정보를 한 번만 받아오도록 수정

async function initSession() {
    try {
        const sessionResponse = await fetch('/get_session_id');
        const sessionData = await sessionResponse.json();
        user_id = sessionData.user_id;
    } catch (error) {
        console.error("세션 정보를 가져오는 중에 에러 발생: ", error);
    }
}

// 초기화 함수를 호출하여 세션 정보를 받아옴
initSession();



async function show_comment(campTitle, campId) {
    try {
        const sessionResponse = await fetch('/get_session_id');
        const sessionData = await sessionResponse.json();
        const user_id = sessionData.user_id;

        const response = await fetch(`/comment`);
        const data = await response.json();
        const rows = data.result;

        $('#comments').empty();
        console.log('forEach 위')
        rows.forEach(({ comment, num: id, date, writer, name }) => {
            console.log(name, campTitle)
            $('.comment-camp-name').text(campTitle)
            let html = ''
            if (name === campTitle) {
                html = /* html */`
                                <div id="comment-one-${id}" class="comment-one">
                                    <div class="comment-info">
                                        <span>${writer}</span>
                                        <span>${date}</span>
                                    </div>
                                    <div class="comment-text">
                                        ${comment}
                                    </div>
                                    <div id="comment-id-btn-${id}" class="comment-button">
                                        <button id="update-form-${id}">수정</button>
                                        <button id="delete-btn-${id}" onclick="delete_comment(${id})">삭제</button>
                                    </div>
                                </div>
                                <div id="update-comment-box-${id}" class="comment-box comment-update">
                                    <textarea id="update-text-${id}" rows="3" autocomplete="off">${comment}</textarea>
                                    <i onclick="update_comment(${id})" class="bi bi-send"></i>
                                </div>`;

                fetch('/get_session_id').then(response => response.json()).then(data => {
                    if (writer === user_id) {
                        const idButton = document.querySelector(`#comment-id-btn-${id}`);
                        // getElementById('id값') <- 얘가 더 성능이 좋아요.
                        idButton.style.display = "flex";
                    }
                });

                const comments = document.querySelector("#comments");
                comments.insertAdjacentHTML("afterbegin", html);

                const currentButton = document.querySelector(`#update-form-${id}`);
                const deleteButton = document.querySelector(`#delete-btn-${id}`);
                const currentForm = document.querySelector(`#update-comment-box-${id}`);
                const currentComment = document.querySelector(`#comment-one-${id}`);

                currentButton.addEventListener("click", () => {
                    if (!!prevSelectId) {
                        const prevForm = document.querySelector(`#update-comment-box-${prevSelectId}`);
                        const prevComment = document.querySelector(`#comment-one-${prevSelectId}`);
                        prevForm.style.display = "none";
                        prevComment.style.display = "block";
                    }

                    currentForm.style.display = "block";
                    currentComment.style.display = "none";
                    prevSelectId = id;
                })

                if (writer === user_id) {
                    currentButton.style.display = "flex"; // 수정 버튼 표시
                    deleteButton.style.display = "flex";
                }
            } else {
                console.log('틀려')
            }

        });
        console.log('forEach 아래', campTitle)
    } catch (error) {
        console.error("에러 발생: ", error);
    }
}



function update_comment(commentId) {
    let update_give = $(`#update-text-${commentId}`).val()

    let formData = new FormData();
    formData.append("update_give", update_give);

    fetch(`/commentUpdate/${commentId}`, { method: "PUT", body: formData }).then(response => response.json()).then(data => {
        alert(data["msg"]);
        show_comment(campTitle, campId)
    })
}

function delete_comment(commentId) {

    if (confirm("정말로 삭제하시겠습니까?")) {
        fetch(`/comment/${commentId}`, { method: "DELETE" }).then(response => response.json()).then(data => {
            alert(data["msg"]);
            show_comment(campTitle, campId)
        })
            .catch(error => console.error("에러 발생: ", error));
    }
}

function save_comment() {
    let comment = $('#comment-text').val()
    let comment_date = new Date().toLocaleString();
    let camp_title = campTitle;
    let camp_lat = campLat;
    let camp_lon = campLon;

    let formData = new FormData();
    formData.append("comment_give", comment);
    formData.append("date_give", comment_date.slice(0, -3));
    formData.append("camp_title", camp_title);
    formData.append("camp_lat", camp_lat);
    formData.append("camp_lon", camp_lon);
    console.log('저장 : ', camp_title)

    fetch('/comment', { method: "POST", body: formData, }).then((response) => response.json()).then((data) => {
        alert(data["msg"]);
        show_comment(campTitle, campId);
        $('#comment-text').val('');
    });
}

function logout() {
    window.location.href = '/logout';
}