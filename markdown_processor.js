const path = require('path');
const fs = require('fs');
const smmsClient = require('./smms_client');

function isLocalFile(filePath) {
    return !filePath.startsWith('http') && !filePath.startsWith('https');
}

async function processImages(mdContent, config) {
    const matches = mdContent.matchAll(config.local.imagePattern);
    const imageUrls = [];

    for (const match of matches) {
        const [fullMatch, imagePath] = match;
        
        if (isLocalFile(imagePath)) {
            const absolutePath = path.resolve(path.dirname(config.local.mdFile), imagePath);
            
            if (fs.existsSync(absolutePath)) {
                const newUrl = await smmsClient.uploadImage(absolutePath, config.imageHost.headers);
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

async function updateMarkdown(mdContent, imageUrls) {
    let newContent = mdContent;

    imageUrls.forEach(({original, path, newUrl}) => {
        newContent = newContent.replace(original, original.replace(path, newUrl));
    });

    return newContent;
}

module.exports = {
    processImages,
    updateMarkdown
}; 