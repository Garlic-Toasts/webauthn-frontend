const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

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

        const verificationJSON = await verificationResp.json();
    } catch {
        showMessage("Что-то пошло не так, попробуйте позже", true);
    }

    showMessage("Вы успешно зарегистрировались")
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
    console.log(verificationJSON)
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