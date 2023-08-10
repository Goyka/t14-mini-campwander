from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import bcrypt
app = Flask(__name__)
app.secret_key = 'your_secret_key_here' #  세션을 만들때 필요함

from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.qef1qmv.mongodb.net/?retryWrites=true&w=majority')
db = client.miniproject

@app.route('/')
def home():
   return render_template('main.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/join')
def join():
    return render_template('join.html')

@app.route('/join/user', methods=["post"])
def join_post():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    name_receive = request.form['name_give']
    phone_receive = request.form['phone_give']

    # 비밀번호를 해싱하여 저장
    hashed_pw = bcrypt.hashpw(pw_receive.encode('utf-8'), bcrypt.gensalt())

    doc = {
        'id':id_receive,  
        'pw' : hashed_pw.decode('utf-8'),
        'name' : name_receive,
        'phone' : phone_receive   
    }
    db.user.insert_one(doc)
    
    return jsonify({'msg': '회원가입 완료!'})

@app.route("/login/user", methods=["POST"])
def login_post():
    id_receive = request.form['id']
    pw_receive = request.form['pw']
    
    user = db.user.find_one({'id': id_receive}, {'_id': False})
    
    if user and bcrypt.checkpw(pw_receive.encode('utf-8'), user['pw'].encode('utf-8')):
        session['user_id'] = id_receive
        session['user_name'] = user['name']  # 사용자 닉네임 세션에 저장
        return jsonify({'success': True, 'message': '로그인 성공'})

    else:
        return jsonify({'success': False, 'message': '로그인 실패'})
    
@app.route("/logout")
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))

@app.route('/profile')
def profile():
    if 'user_name' in session:
        # user_id = session['user_id']
        user_name = session['user_name']
        # 여기에서 해당 사용자 정보를 데이터베이스 등에서 가져와 사용할 수 있음
        return f'안녕하세요, {user_name}님! 프로필 페이지입니다.'
    else:
        return '로그인이 필요합니다.'

@app.route('/get_all_users')
def all_users():
    all_users = list(db.user.find({},{'_id':False}))
    return jsonify({'result': all_users})


@app.route("/comment", methods=["POST"])
def comment_post():
    comment_receive = request.form['comment_give']
    date_receive = request.form['date_give']
    
    # writer = request.form['writer_give']
    
    comment_list = list(db.comment.find({}, {'_id': False}))
    count = len(comment_list) + 1
    doc = {
        'writer': '작성자',
        'name': '캠핑장이름',
        'num': count,
        'comment': comment_receive,
        'date' : date_receive
    }
    db.comment.insert_one(doc)

    return jsonify({'msg': '댓글이 저장되었습니다'})

@app.route("/commentUpdate/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    update_receive = request.form['update_give']
    db.comment.update_one({'num':comment_id},{'$set':{'comment':update_receive}})
    return jsonify({'msg': '댓글이 수정되었습니다'})


@app.route('/comment/<int:comment_id>', methods=["DELETE"])
def delete_comment(comment_id):
    db.comment.delete_one({"num": int(comment_id)})
    return jsonify({"msg": "댓글이 삭제되었습니다."})
    
@app.route("/comment", methods=["GET"])
def comment_get():
    all_comments = list(db.comment.find({},{'_id':False}))
    return jsonify({'result': all_comments})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
