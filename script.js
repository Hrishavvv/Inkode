document.addEventListener("DOMContentLoaded", function() {
    const htmlInput = document.getElementById('html');
    const cssInput = document.getElementById('css');
    const jsInput = document.getElementById('js');
    const outputFrame = document.getElementById('output');
    const uploadFiles = document.getElementById('uploadFiles');

    // Object to store image data URLs by filename
    const imageStore = {};

    // Load code from local storage on page load
    function loadFromLocalStorage() {
        htmlInput.value = localStorage.getItem('html') || '';
        cssInput.value = localStorage.getItem('css') || '';
        jsInput.value = localStorage.getItem('js') || '';
        updateOutput(); // Render initial content if available
    }

    // Save code to local storage on page unload
    function saveToLocalStorage() {
        localStorage.setItem('html', htmlInput.value);
        localStorage.setItem('css', cssInput.value);
        localStorage.setItem('js', jsInput.value);
    }

    // Update the output preview by combining HTML, CSS, JS, and any uploaded images
    function updateOutput() {
        let htmlCode = htmlInput.value;
        const cssCode = `<style>${cssInput.value}</style>`;
        const jsCode = `<script>${jsInput.value}</script>`;

        // Replace image filenames in HTML code with data URLs from uploaded images
        htmlCode = htmlCode.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
            const imageUrl = imageStore[src] || src; // Use stored data URL if available, else keep src as-is
            return `<img src="${imageUrl}"`;
        });

        const code = htmlCode + cssCode + jsCode;

        // Render combined code in iframe
        outputFrame.contentDocument.open();
        outputFrame.contentDocument.write(code);
        outputFrame.contentDocument.close();
    }

    // Event listeners for updating the output on input changes
    htmlInput.addEventListener('input', updateOutput);
    cssInput.addEventListener('input', updateOutput);
    jsInput.addEventListener('input', updateOutput);
    window.addEventListener('beforeunload', saveToLocalStorage);

    // Load initial content from local storage
    loadFromLocalStorage();

    // Handle file uploads for images or folders
    uploadFiles.addEventListener('change', function(event) {
        const files = event.target.files;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                // Store image data URL by filename once the file is read
                reader.onload = function(e) {
                    imageStore[file.name] = e.target.result;
                    updateOutput(); // Re-render to apply any image references
                };

                reader.readAsDataURL(file);
            }
        });
    });

    // Open code in new tab with images included if any
    function openInNewTab() {
        let htmlCode = htmlInput.value;
        const cssCode = `<style>${cssInput.value}</style>`;
        const jsCode = `<script>${jsInput.value}</script>`;

        // Replace image filenames in HTML code with data URLs
        htmlCode = htmlCode.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
            const imageUrl = imageStore[src] || src;
            return `<img src="${imageUrl}"`;
        });

        const code = htmlCode + cssCode + jsCode;
        const newWindow = window.open();
        newWindow.document.write(code);
        newWindow.document.close();
    }

    // Assign openInNewTab to the button
    document.getElementById('openInNewTab').onclick = openInNewTab;
});
