const axios = require('axios');

const config = {
    smms: {
        tokenUrl: 'https://sm.ms/api/v2/token',
        credentials: {
            // Here is your SM.MS account info(username, password)
            username: '',
            password: ''
        }
    }
};

async function getAPIToken() {
    try {
        const params = new URLSearchParams();
        params.append('username', config.smms.credentials.username);
        params.append('password', config.smms.credentials.password);

        const response = await axios.post(config.smms.tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        console.log('Full response:', response.data);

        if (response.data.success) {
            console.log('API Token:', response.data.data.token);
            return response.data.data.token;
        } else {
            throw new Error(`Failed to get token: ${response.data.message}`);
        }
    } catch (error) {
        if (error.response) {
            console.error('Server error:', {
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            console.error('Request error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}

module.exports = {
    getAPIToken
}; 