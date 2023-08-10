

const kakaokey = 'fe528db7b88eec7a775d6b1f97c8740c';

let user_info_id = [];

const join = () => {
    $('.main_join').hide();
    $('.join_info').css('display', 'flex');
    // 몽고디비에 저장된 모든 회원정보 ID
    fetch('/get_all_users').then(response => response.json()).then(data => {
        // 가져온 회원 정보 출력
        data['result'].forEach((x) => {
            user_info_id.push(x['id'])
        });
    })
        .catch(error => {
            console.error('오류 발생:', error);
        });
}

$(document).ready(function () {
    $('#join-id').keyup(function () {
        CheckId();
    });

    // 비밀번호 입력란에서 키보드 입력 시 이벤트 리스너 추가
    $('#join-pw').keyup(function () {
        checkPassword();
    });

    // 비밀번호 확인 입력란에서 키보드 입력 시 이벤트 리스너 추가
    $('#join-pw2').keyup(function () {
        checkPassword();
    });
});

function CheckId() {
    let id = $('#join-id').val();
    for (let i = 0; i < user_info_id.length; i++) {
        console.log(id)
        $('#join-id').css('border', '1px solid #1559ff')
        $('#id-match').css('display', 'none')
        if (id === user_info_id[i] || id === '' || id.includes(' ')) {
            $('#join-id').css('border', '1px solid red')
            $('#id-match').css('display', 'inline')
            $('#id-match').text('이 아이디는 사용하실 수 없습니다')
            return;
        }
    }
}

function checkPassword() {
    let pw = $('#join-pw').val();
    let pw2 = $('#join-pw2').val();
    $('#password-match').css('display', 'inline')
    if (pw === pw2) {
        $('#password-match').css('display', 'none');
        $('#join-pw').css('border', '1px solid #1559ff');
        $('#join-pw2').css('border', '1px solid #1559ff');
    } else {
        $('#password-match').text('비밀번호 불일치');
        $('#password-match').css('color', 'red')
    }
}

const user_join = () => {
    let id = $('#join-id').val();
    let pw = $('#join-pw').val();
    let pw2 = $('#join-pw2').val();
    if (pw !== pw2) {
        return;
    }
    let name = $('#join-name').val();
    let phone = $('#join-phone').val();
    let formData = new FormData();
    formData.append("id_give", id);
    formData.append("pw_give", pw);
    formData.append("name_give", name);
    formData.append("phone_give", phone);
    fetch('/join/user', { method: "POST", body: formData, }).then((response) => response.json()).then((data) => {
        alert(data["msg"]);
        window.location.href = '/login';
    });
}

const login = () => {
    let id = $('#id').val();
    let pw = $('#pw').val();
    let formData = new FormData();
    formData.append('id', id);
    formData.append('pw', pw);
    // let requestData = {
    //     id: id,
    //     pw: pw
    // };
    fetch('/login/user', { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data['success']) {
                console.log(data)
                // alert(`${data['user_id']}님 환영합니다`);
                window.location.href = '/';
            } else {
                alert('로그인 실패: ' + data['message']);
            }
        })
        .catch(error => {
            console.error('오류 발생:', error);
        });
}

function loginWithKakao() {
    console.log('카카오 로그인 함수 실행')
    Kakao.Auth.authorize({
        redirectUri: 'https://developers.kakao.com/tool/demo/oauth',
    });
}
// 아래는 데모를 위한 UI 코드입니다.
displayToken()
function displayToken() {
    var token = getCookie('authorize-access-token');

    if (token) {
        Kakao.Auth.setAccessToken(token);
        Kakao.Auth.getStatusInfo()
            .then(function (res) {
                if (res.status === 'connected') {
                    document.getElementById('token-result').innerText
                        = 'login success, token: ' + Kakao.Auth.getAccessToken();
                }
            })
            .catch(function (err) {
                Kakao.Auth.setAccessToken(null);
            });
    }
}

function getCookie(name) {
    // 쿠키 함수 실행
    var parts = document.cookie.split(name + '=');
    if (parts.length === 2) { return parts[1].split(';')[0]; }
}