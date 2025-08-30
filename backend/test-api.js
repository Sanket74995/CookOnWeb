// Simple test script to verify API endpoints
const http = require('http');

const testEndpoints = async () => {
    console.log('Testing API endpoints...');

    // Test the root endpoint
    try {
        const response = await fetch('http://localhost:5000/');
        const data = await response.text();
        console.log('Root endpoint:', response.status, data);
    } catch (error) {
        console.log('Root endpoint test failed - server may not be running');
    }

    // Test registration endpoint (should fail without MongoDB but should respond)
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            }),
        });
        console.log('Register endpoint:', response.status);
    } catch (error) {
        console.log('Register endpoint test failed - server may not be running');
    }
};

testEndpoints();
