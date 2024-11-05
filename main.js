const fs = require('fs');
const markdownImageProcessor = require('./markdown_image_processor');
const markdownProcessor = require('./markdown_processor');
const tokenManager = require('./get_smms_token');

const config = {
    imageHost: {
        uploadUrl: 'https://sm.ms/api/v2/upload',
        headers: {
            'Authorization': '',
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }
    },
    local: {
        // Here is your markdown file path
        mdFile: '',
        imagePattern: /!\[.*?\]\((.*?)\)/g,
    }
};

async function initializeConfig() {
    try {
        config.imageHost.headers.Authorization = await tokenManager.getAPIToken();
        return true;
    } catch (error) {
        console.error('Failed to initialize config:', error);
        return false;
    }
}

async function processMarkdownImages() {
    try {
        console.log('Starting markdown image processing...');
        const initialized = await initializeConfig();
        if (!initialized) {
            throw new Error('Failed to initialize configuration');
        }
        const mdContent = fs.readFileSync(config.local.mdFile, 'utf8');
        const imageUrls = await markdownImageProcessor.processImages(mdContent, config);
        console.log(`Processed ${imageUrls.length} images`);
        const newContent = await markdownProcessor.updateMarkdown(mdContent, imageUrls);
        const newFilePath = config.local.mdFile.replace('.md', '_uploaded.md');
        fs.writeFileSync(newFilePath, newContent);
        
        console.log(`Process completed. New file saved as: ${newFilePath}`);
        return true;
    } catch (error) {
        console.error('Error in main process:', error);
        return false;
    }
}

async function main() {
    console.log('Starting image upload process...');
    const success = await processMarkdownImages();
    console.log(success ? 'Process finished successfully.' : 'Process finished with errors.');
}

main(); 