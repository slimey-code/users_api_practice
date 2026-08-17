const register_username = document.querySelector("#username_input_R");
const register_password = document.querySelector("#password_input_R");
const register_log = document.querySelector("#register_log");

const login_username = document.querySelector("#username_input_L");
const login_password = document.querySelector("#password_input_L");
const login_log = document.querySelector("#login_log");

const patch_username = document.querySelector("#username_input_P");
const patch_password = document.querySelector("#password_input_P");
const patch_log = document.querySelector("#patch_log");

const delete_username = document.querySelector("#username_input_D");

const users_log = document.querySelector("#users_log");
const delete_log = document.querySelector("#delete_log");


var current_username;
var current_password;
var current_id;

var logged_user = {"id" : null, "username" : null, "exists" : false};

async function GetUser(CURRENT_USERNAME) {


    const request_users = await fetch("/api/users");
    const data = await request_users.json();
    
    console.log("getUserId data: " + data);

    for(let i = 0; i < data.length;i++){
        console.log("data.lenght",data.length);
        if(data[i]["username"] == CURRENT_USERNAME){

            
            return {
                "id": data[i]["id"],
                "exists": true
            };
        }
        if(i+1 == data.length){
            console.log("previous user id: "+data[i]["id"]);
            console.log("now returning id: "+ `${data[i]["id"]+1}`);
            return {
                "id": data[i]["id"]+1,
                "exists": false
            };
        }
    }
    

    return {"id": 0, "exists": false};
    
}

async function GetUsers() {
    const request_users = await fetch("/api/users");
    const data = await request_users.json();
    
    var log_response = "";

    for(let i = 0; i < data.length;i++){
        log_response += 
        `
        </br>
        id: ${data[i]["id"]} 
        </br>
        username: ${data[i]["username"]} 
        </br>
        password: ${data[i]["password"]} 
        </br>
        `;
    }

    users_log.innerHTML = log_response;
}













async function RegisterUser() {

    current_username = register_username.value;
    current_password = register_password.value;
    var current_user = await GetUser(current_username);
    current_id = current_user["id"];

    console.log("currentID: "+ current_id);


    const request_register = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({
            "id" : current_id,
            "username" : current_username,
            "password" : current_password
        })
    });

    const response = await request_register.json();
    register_log.innerHTML = response.msg;
}




async function LoginUser() {

    current_username = login_username.value;
    current_password = login_password.value;
    var current_user = await GetUser(current_username);
    current_id = current_user["id"];


    const request_login = await fetch("/api/login",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            "id" : current_id,
            "username" : current_username,
            "password" : current_password
        })
    });

    const response = await request_login.json();
    
    var log_response = `${response.msg}`; 
    if (response.msg == "login correct"){

        logged_user = {"id": current_id, "username" : current_username, "exists" : true};
        log_response += `</br> currently logged in as: ${current_username}, have fun:D`;
        console.log(log_response);
    }

    login_log.innerHTML = log_response;
}






async function DeleteUser() {
    current_username = delete_username.value;
    var current_user = await GetUser(current_username);
    console.log("id before deleting: ", current_user["id"]);
     
    if(current_user["exists"]){
        delete_log.innerHTML = "login required";

        console.log("logged_username: ", logged_user["username"]);
        if(logged_user["username"] == current_username){

            const currentUserId = current_user["id"];
            const request_delete = await fetch(`/api/users/${currentUserId}`, {
                method : "DELETE",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    "id" : currentUserId,
                    "username" : current_username
                })
            });
            const response = await request_delete.json();
            delete_log.innerHTML = response.msg;
        };
    };
        
    if(!current_user["exists"]){
        delete_log.innerHTML = "user doesn't exist";
    };
}


async function PatchUser(change_info) {
    current_username = patch_username.value;
    current_password = patch_password.value;

    console.log(change_info);
    if(change_info != "username" && change_info != "password"){
        
         patch_log.innerHTML = "you though you can fool me by that? silly of you";
         return;
    }

    var current_user = logged_user;
    console.log("current user id: ", current_user["id"],"current user exists?" ,current_user["exists"]);

    if(current_user["exists"]){
        patch_log.innerHTML = "login required";

        console.log("logged_username: ", logged_user["username"]);

        const currentUserId = current_user["id"];
        const request_patch = await fetch(`/api/users/${currentUserId}`, {
            method : "PATCH",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                "id" : currentUserId,
                "newUsername" : current_username,
                "newPassword" : current_password,
                "change" : change_info
            })
        });
        const response = await request_patch.json();
        patch_log.innerHTML = response.msg;
        
    };
    if(!current_user["exists"]){
        patch_log.innerHTML = "user doesn't exist";
    };
    
}