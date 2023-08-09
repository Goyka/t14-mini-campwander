function onGeoOk(position){
    const API_KEY = "644c72ac73a88cbfdfe5222010672164"
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    const forecastURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`    
    // 3시간 단위 5일 간 날씨정보

    fetch(forecastURl).then(res => res.json()).then((data) => {
        // const location = document.querySelector("유저 위치정보가 들어갈 클래스명")
        // location.innerText = data.city.name
        console.log(data.city.name)
    })
}

function onGeoError(){
    alert("Can't find you!")
}
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)
// 현재 위치 표시
//-----------------------오늘 한 일---------------------------------------
// 핀을 클릭했을 때 해당위치의 날씨예보가 나오게끔.
// 핀 위치의 위도와 경도를 받아서
// 1. 핀을 누르면 goCamp함수 실행, 해당위치 캠핑장의 위치를 고캠핑 api에서 mapX 와 mapY로 가져온다.
// 2. 가져온 값을 return해서 날씨예보 관련 함수에서 가져오면??


function goCamp(){
    const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=10&pageNo=1&MobileOS=AND&MobileApp=MobileApp&serviceKey=xnDGzEMy1enkoO3MGCskM%2Bk1VXDvugoOwdbFa2ZJ5bpeKzlLwXeZoFUOVB8hMy76m2u1fJBHkKN7EUjYTizHtg%3D%3D&_type=json`;
    const config = {
        headers:{
            'Accept': 'application/json'
        }
    }
    return fetch(url, config).then(res => res.json()).then((data) => {
        let lat = data.response.body.items.item[0].mapY
        let lon = data.response.body.items.item[0].mapX
        return {lat, lon}
    })
}

function weather(){

 goCamp().then((a)=>{
    let lat = a.lat
    let lon = a.lon
    console.log(lat, lon)
    const API_KEY = "644c72ac73a88cbfdfe5222010672164"
    const forecastURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`    
    // 3시간 단위 5일 간 날씨정보
    fetch(forecastURl).then(res => res.json()).then((data) => {
       console.log(data.list[0].weather[0].main, data.list[0].wind.speed)
           // data.list[i].weather[0].main : 현재 위치의 날씨정보
           // data.list[i].wind.speed : 현재 위치의 풍속
   })
 })
 .catch((error)=>{
    console.error("Error fetching coordinates :", error)
 })

}
weather()
// ------------내일 할 일------------------------------------
// 3. 날씨예보 리스트가 거의 40개 정도 되는데 이 중 몇개만 가져와서 html에 붙이는 방법..
// 4. goCamp함수에서 특정 지역의 lat와 lon를 받아오는 방법...