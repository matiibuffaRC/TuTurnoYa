// fetch is native in Node 18+

async function test() {
    try {
        const loginRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@tuturnoya.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        console.log('Login:', loginData.token ? 'Success' : loginData);

        const token = loginData.token;

        const updateRes = await fetch('http://localhost:3001/barberos/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nombre: 'Mateo Editado' })
        });

        const updateData = await updateRes.json();
        console.log('Update:', updateRes.status, updateData);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
