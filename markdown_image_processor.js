const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

function isLocalFile(filePath) {
    return !filePath.startsWith('http') && !filePath.startsWith('https');
}

async function uploadImage(imagePath, config) {
    try {
        const formData = new FormData();
        formData.append('smfile', fs.createReadStream(imagePath));

        const response = await axios.post(config.imageHost.uploadUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                ...config.imageHost.headers
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

async function processImages(mdContent, config) {
    const matches = mdContent.matchAll(config.local.imagePattern);
    const imageUrls = [];

    for (const match of matches) {
        const [fullMatch, imagePath] = match;
        
        if (isLocalFile(imagePath)) {
            const absolutePath = path.resolve(path.dirname(config.local.mdFile), imagePath);
            
            if (fs.existsSync(absolutePath)) {
                const newUrl = await uploadImage(absolutePath, config);
                if (newUrl) {
                    imageUrls.push({
                        original: fullMatch,
                        path: imagePath,
                        newUrl: newUrl
                    });
                }
            } else {
                console.warn(`Warning: Image file not found: ${absolutePath}`);
            }
        }
    }

    return imageUrls;
}

module.exports = {
    processImages
}; 