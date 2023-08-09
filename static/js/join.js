

const join = () => {
    $('.main_join').hide();
    $('.join_info').css('display', 'flex');
}

const user_join = () => {
    let id= $('#id').val();
    let pw= $('#pw').val();
    let name= $('#name').val();
    let phone= $('#phone').val();
    let formData = new FormData();
    formData.append("id_give", id);
    formData.append("pw_give", pw);
    formData.append("name_give", name);
    formData.append("phone_give", phone);
    fetch('/join/user', { method: "POST", body: formData, }).then((response) => response.json()).then((data) => {
        alert(data["msg"]);
        window.location.reload();
    });
}