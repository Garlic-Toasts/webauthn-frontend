const { startRegistration,browserSupportsWebAuthnAutofill } = SimpleWebAuthnBrowser;

async function signUp()
{
    const login = document.getElementById('login').value;

    const logined = await fetch(`https://garlictoasts.ru/api/auth/create/${login}`, {
        method: 'POST'
    });
    console.log(logined);

    const resp = await fetch(`https://garlictoasts.ru/api/auth/register/${login}`);
    console.log(resp)
    let attResp = await startRegistration(await resp.json());

    const verificationResp = await fetch(`https://garlictoasts.ru/api/auth/register/${login}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(attResp),
    });

    const verificationJSON = await verificationResp.json();

    console.log(verificationJSON)
}

async function signIn()
{
    const login = document.getElementById('login').value;

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

    console.log(verificationJSON)
}