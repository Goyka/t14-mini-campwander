$(document).ready(function () {
    $('.comment').hide();
    $('#comment-slide').click(function () {
        $('.comment').slideDown().css('display', 'flex');
        show_comment()
    })
    $('#comment-close').click(function () {
        close_comment()
    })
});

let prevSelectId = 0;

function close_comment() {
    $('.comment').slideUp();
}

function show_comment() {
    fetch('/comment').then(res => res.json()).then(data => {
        const rows = data['result']
        $('#comments').empty()
        rows.forEach(({ comment, num: id, date, writer }) => {
            const html = /* html */`
                            <div id="comment-one-${id}" class="comment-one">
                                <div class="comment-info">
                                    <span>${writer}</span>
                                    <span>${date}</span>
                                </div>
                                <div class="comment-text">
                                    ${comment}
                                </div>
                                <div class="comment-button">
                                    <button id="update-form-${id}">수정</button>
                                    <button onclick="delete_comment(${id})">삭제</button>
                                </div>
                            </div>
                            <div id="update-comment-box-${id}" class="comment-box comment-update">
                                <textarea id="update-text-${id}" rows="3" autocomplete="off">${comment}</textarea>
                                <i onclick="update_comment(${id})" class="bi bi-send"></i>
                            </div>
                            `

            const comments = document.querySelector("#comments");
            comments.insertAdjacentHTML("afterbegin", html);

            const currentButton = document.querySelector(`#update-form-${id}`);
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
        })
    })
}



function update_comment(commentId) {
    let update_give = $(`#update-text-${commentId}`).val()

    let formData = new FormData();
    formData.append("update_give", update_give);

    fetch(`/commentUpdate/${commentId}`, { method: "PUT", body: formData }).then(response => response.json()).then(data => {
        alert(data["msg"]);
        show_comment()
    })
}

function delete_comment(commentId) {

    if (confirm("정말로 삭제하시겠습니까?")) {
        fetch(`/comment/${commentId}`, { method: "DELETE" }).then(response => response.json()).then(data => {
            alert(data["msg"]);
            show_comment()
        })
            .catch(error => console.error("에러 발생: ", error));
    }
}

function save_comment() {
    let comment = $('#comment-text').val()
    let comment_date = new Date().toLocaleString();

    let formData = new FormData();
    formData.append("comment_give", comment);
    formData.append("date_give", comment_date.slice(0, -3));

    //작성자 아이디 받아오기
    // formData.append("writer_give", comment);

    fetch('/comment', { method: "POST", body: formData, }).then((response) => response.json()).then((data) => {
        alert(data["msg"]);
        show_comment()
    });
}