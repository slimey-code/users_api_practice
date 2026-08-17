
from flask import Flask,render_template,request

users = []



app = Flask(__name__, template_folder="../templates") 

@app.route("/")
def home():
    return render_template("main.html"), 200


@app.route("/api/register", methods=["POST"])
def RegisterUser():
    data = request.json
    
    newUser = {
        "id" : data["id"],                             #id needs to be done
        "username" : data["username"],
        "password" : data["password"]
    }
    if(newUser["id"] == {}):
        newUser["id"] == 0

    for user in users:                         #somewhy gives improper json
        print(user)
        if(users != [] and (user["username"] == data["username"])):
            return {"msg" : "username taken"}, 401

    if (newUser in users):
        return {"msg" : "user exists"}, 400


    users.append(newUser)
    return {"msg" : "user created"}, 201


@app.route("/api/login", methods=["POST"])
def Login():
    data = request.json
    
    currentUser = {          
        "id" : data["id"],                                       
        "username" : data["username"],
        "password" : data["password"]
    }
    
    print("\n current user:", currentUser)

    for user in users:
        if(
        user in users and
        user["id"] == currentUser["id"] and
        user["username"] == currentUser["username"] and
        user["password"] == currentUser["password"]
        ):

            return {"msg" : "login correct"}, 200
    
    return {"msg" : "login incorrect"}, 400



@app.route("/api/users")
def CheckUsers():
    return users, 200

@app.route("/api/users/<int:id>", methods=["GET"])
def CheckUser(id):
    if(users[id] != None):
        return users["id"], 200
    return {"msg" : "no user"}, 404

@app.route("/api/users/<int:id>", methods=["PATCH"])
def ChangeUser(id):
    data = request.json

    currentUser = {
        "id" : data["id"],
        "username" : data["newUsername"],
        "password" : data["newPassword"]
    }

    match data["change"]:
        case "username":
            users[currentUser["id"]]["username"] = data["newUsername"]
            return {"msg" : f"username changed to {data["newUsername"]}"}, 200
        case "password": 
            users[currentUser["id"]]["password"] = data["newPassword"]
            return {"msg" : f"pass changed to {data["newPassword"]}"}, 200


    return {"msg" : "no user"}, 404

@app.route("/api/users/<int:id>", methods=["DELETE"])
def DeleteUser(id):

    data = request.json


    for user in users:
        print(user["username"],"\n", data["username"])
        if(user["username"] == data["username"]):
            users.remove(user)
            return {"msg" : "user deleted"}, 200
    return {"msg" : "no user"}, 404

app.run()