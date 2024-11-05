async function updateMarkdown(mdContent, imageUrls) {
    let newContent = mdContent;

    imageUrls.forEach(({original, path, newUrl}) => {
        newContent = newContent.replace(original, original.replace(path, newUrl));
    });

    return newContent;
}

module.exports = {
    updateMarkdown
}; 