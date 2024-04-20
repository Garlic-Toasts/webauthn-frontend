const { startRegistration,browserSupportsWebAuthnAutofill } = SimpleWebAuthnBrowser;

async function signUp()
{
    const login = document.getElementById('login').value;
    console.log(login)

    const resp = await fetch('/generate-registration-options');

    let attResp = await startRegistration(await resp.json());

    const verificationResp = await fetch('/verify-registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(attResp),
    });

    const verificationJSON = await verificationResp.json();

    console.log(verificationJSON)
}

//startRegistration();
browserSupportsWebAuthnAutofill();