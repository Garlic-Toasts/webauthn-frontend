const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

window.onload = async () => {
    const passkeyId = localStorage.getItem("passkeyId");
    if (passkeyId != undefined)
        await displayUserInfo(passkeyId);
}

async function signUp()
{
    const login = document.getElementById('login').value;

    if (!checkLogin(login))
        return;

    const created = await fetch(`https://garlictoasts.ru/api/auth/create/${login}`, {
        method: 'POST'
    });

    if (created.status != 201) {
        showMessage("Пользователь с таким именем уже существует", true);
        return;
    }
    
    let verificationJSON;
    try {
        const resp = await fetch(`https://garlictoasts.ru/api/auth/register/${login}`);

        let attResp = await startRegistration(await resp.json());

        const verificationResp = await fetch(`https://garlictoasts.ru/api/auth/register/${login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attResp),
        });

        verificationJSON = await verificationResp.json();
    } catch {
        showMessage("Что-то пошло не так, попробуйте позже", true);
    }

    if (!verificationJSON.success) {
        showMessage("Что-то пошло не так, попробуйте позже", true);
    } else {
        showMessage("Вы успешно зарегистрировались");
    }
}

async function signIn()
{
    const login = document.getElementById('login').value;

    if (!checkLogin(login))
        return;

    const resp = await fetch(`https://garlictoasts.ru/api/auth/login/${login}`);
    if (resp.status != 200) {
        showMessage("Пользователь не найден", true);
        return;
    }

    let verificationJSON;

    try {
        let attResp = await startAuthentication(await resp.json());
        const verificationResp = await fetch(`https://garlictoasts.ru/api/auth/login/${login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attResp),
        });

        verificationJSON = await verificationResp.json();
    } catch {
        showMessage("Что-то пошло не так, попробуйте позже", true);
        return;
    }
    if (!verificationJSON.success) {
        showMessage("Что-то пошло не так, попробуйте позже", true);
        return;
    }
    
    const passkeyId = verificationJSON.passkey.id;
    localStorage.setItem("passkeyId", passkeyId);

    displayUserInfo(passkeyId)
}

function checkLogin(login)
{
    // if login is empty or too short
    if (login.length < 3)
    {
        // if login is not empty
        if (login.length != 0)
            showMessage("Слишком короткое имя пользователя", false);
        return false;
    }
    else if (login.length > 20)
    {
        showMessage("Слишком длинное имя пользователя", true);
        return false;
    }
    return true;
}

function showMessage(text, isError = false)
{
    if (document.getElementById("message")) {
        document.getElementById("message").remove();
    }
    let message = document.createElement("p");
    message.setAttribute("id", "message");

    if (isError)
        message.setAttribute("class", "error");
    else
        message.setAttribute("class", "success");

    message.innerText = text;

    document.querySelector("#messages").append(message)
}

async function displayUserInfo(passkeyId) {
    const userData = await fetch(`https://garlictoasts.ru/api/profile`, {
        method: 'GET', 
        headers: {
            "Authorization": `Bearer ${passkeyId}`
        },
    }).then((body) => {return body.json()});


    document.querySelector("#sign-up").innerHTML = `
        <h2 class="title_suc">Поздравляю, вы успешно авторизовались!</h2>
        <p class="suc">Ваш ключ аутентификации: <span id="key"></span></p>
        <h3>Ваш профиль</h3>
        <p class="suc">Логин: <span id="login"></span></p>
        <p class="suc">ID: <span id="user-id"></span></p>
        <p class="suc">Время создания: <br><span id="creation-date"></span> <span id="creation-time"></span></p>
        <button class="delete" onclick="quit()">Выйти</button>
    `;

    let date = new Date(userData.createdAt);
    let creationDay = date.getDate();
    if (creationDay < 10)
        creationDay = "0" + creationDay;
    let creationMonth = date.getMonth() + 1;
    if (creationMonth < 10)
        creationMonth = "0" + creationMonth;

    let creationDate = `${creationDay}.${creationMonth}.${date.getFullYear()}`;
    
    let creationHour = date.getHours();
    if (creationHour < 10)
        creationHour = "0" + creationHour;
    let creationTime = creationHour + userData.createdAt.slice(9,19);

    document.querySelector("#login").innerText = userData.login;
    document.querySelector("#user-id").innerText = userData.id;
    document.querySelector("#creation-time").innerText = creationTime;
    document.querySelector("#creation-date").innerText = creationDate;
    document.querySelector("#key").innerText = passkeyId;
    // document.querySelector("#device-name").innerText = getDeviceName();
}

function quit()
{
    localStorage.clear();
    window.location.reload();
}

// function getDeviceName() {
//     var userAgent = navigator.userAgent.toLowerCase();
  
//     if (userAgent.includes("mac")) {
//       return "Mac";
//     } else if (userAgent.includes("iphone")) {
//       return "iPhone";
//     } else if (userAgent.includes("ipad")) {
//       return "iPad";
//     } else if (userAgent.includes("android")) {
//       return "Android";
//     } else if (userAgent.includes("windows phone")) {
//       return "Windows Phone";
//     } else if (userAgent.includes("windows")) {
//       return "Windows PC";
//     } else if (userAgent.includes("linux")) {
//       return "Linux PC";
//     } else {
//       return "Неизвестное устройство";
//     }
// }