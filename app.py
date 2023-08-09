from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

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
    doc = {
        'id':id_receive,  
        'pw' : pw_receive,
        'name' : name_receive,
        'phone' : phone_receive   
        }
    db.user.insert_one(doc)
    
    return jsonify({'msg': '회원가입 완료!'})

@app.route("/bucket", methods=["GET"])
def bucket_get():
    all_buckets = list(db.bucket.find({},{'_id':False}))
    return jsonify({'result': all_buckets})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)