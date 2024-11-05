const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const config = {
    smms: {
        tokenUrl: 'https://sm.ms/api/v2/token',
        uploadUrl: 'https://sm.ms/api/v2/upload',
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

async function uploadImage(imagePath, headers) {
    try {
        const formData = new FormData();
        formData.append('smfile', fs.createReadStream(imagePath));

        const response = await axios.post(config.smms.uploadUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                ...headers
            }
        });

        console.log(`Upload response for ${imagePath}:`, response.data);

        if (response.data.success) {
            return response.data.data.url;
        } else if (response.data.code === 'image_repeated') {
            return response.data.images;
        }
        throw new Error(`Upload failed: ${response.data.message}`);
    } catch (error) {
        handleUploadError(error, imagePath);
        return null;
    }
}

function handleUploadError(error, imagePath) {
    if (error.response) {
        console.error(`Server error for ${imagePath}:`, {
            status: error.response.status,
            data: error.response.data
        });
    } else if (error.request) {
        console.error(`Request error for ${imagePath}:`, error.message);
    } else {
        console.error(`Error uploading ${imagePath}:`, error.message);
    }
}

module.exports = {
    getAPIToken,
    uploadImage
}; 