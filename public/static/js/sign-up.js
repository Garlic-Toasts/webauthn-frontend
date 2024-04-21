const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

async function signUp()
{
    const login = document.getElementById('login').value;

    if (!checkLogin(login))
        return;

    const created = await fetch(`https://garlictoasts.ru/api/auth/create/${login}`, {
        method: 'POST'
    });

    if (created.status % 100 != 2) {
        showErrorMessage("Пользователь с таким именем уже существует");
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
        showErrorMessage("Что-то пошло не так, попробуйте позже");
    }
}

async function signIn()
{
    const login = document.getElementById('login').value;

    if (!checkLogin(login))
        return;

    const resp = await fetch(`https://garlictoasts.ru/api/auth/login/${login}`);
    if (resp.status % 100 != 2) {
        showErrorMessage("Пользователь не найден");
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
        showErrorMessage("Что-то пошло не так, попробуйте позже");
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
            showErrorMessage("Слишком короткое имя пользователя");
        return false;
    }
    else if (login.length > 20)
    {
        showErrorMessage("Слишком длинное имя пользователя");
        return false;
    }
    return true;
}

function showErrorMessage(text)
{
    if (document.getElementById("error-message")) {
        document.getElementById("error-message").remove();
    }
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("id", "error-message");
    warningMessage.innerText = text;

    document.querySelector("#errors").append(warningMessage)
    console.log(text)
}

