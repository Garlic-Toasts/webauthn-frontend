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
    
    const passkeyId = verificationJSON.passkeyId;
    localStorage.setItem("passkeyId", passkeyId);
    localStorage.setItem("keys", passkeyId);

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
    });
    console.log(userData)

    document.querySelector("#sign-up").innerHTML = `
        <div>
            <p class="title_suc">Поздравляю, вы успешно авторизовались!</p>
        </div>
        <div>
            <p class="suc">Ваш ключ аутентификации:</p>
        </div>
        <div>
            <h2 class="suc">Время начала сессии: <span id="session-start-time">[время]</span></h2>
            <p class="suc">Устройство: <span class="device-name">[устройство]</span></p>
            <button class="delete" onclick="quit()">Выйти</button>
        </div>
    `;

    // Получение текущего времени
    let currentTime = new Date();

    // Форматирование времени в строку с помощью функции pad()
    let formattedTime = currentTime.getHours().toString().padStart(2, '0') + ":" +
                        currentTime.getMinutes().toString().padStart(2, '0') + ":" +
                        currentTime.getSeconds().toString().padStart(2, '0');

    // Обновление текста внутри элемента span с id="session-start-time"
    document.getElementById("session-start-time").textContent = formattedTime;

    let deviceNameElements = document.querySelectorAll(".device-name");
    deviceNameElements.forEach(function(element) {
      element.textContent = getDeviceName();
    });
}

function quit()
{
    localStorage.clear();
    window.location.reload();
}

function getDeviceName() {
    var userAgent = navigator.userAgent.toLowerCase();
  
    if (userAgent.includes("mac")) {
      return "Mac";
    } else if (userAgent.includes("iphone")) {
      return "iPhone";
    } else if (userAgent.includes("ipad")) {
      return "iPad";
    } else if (userAgent.includes("android")) {
      return "Android";
    } else if (userAgent.includes("windows phone")) {
      return "Windows Phone";
    } else if (userAgent.includes("windows")) {
      return "Windows PC";
    } else if (userAgent.includes("linux")) {
      return "Linux PC";
    } else {
      return "Неизвестное устройство";
    }
}