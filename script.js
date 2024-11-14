document.addEventListener("DOMContentLoaded", function() {
    const htmlInput = document.getElementById('html');
    const cssInput = document.getElementById('css');
    const jsInput = document.getElementById('js');
    const outputFrame = document.getElementById('output');
    const uploadFiles = document.getElementById('uploadFiles');
    const imageStore = {};

    function loadFromLocalStorage() {
        htmlInput.value = localStorage.getItem('html') || '';
        cssInput.value = localStorage.getItem('css') || '';
        jsInput.value = localStorage.getItem('js') || '';
        updateOutput(); 
    }

    function saveToLocalStorage() {
        localStorage.setItem('html', htmlInput.value);
        localStorage.setItem('css', cssInput.value);
        localStorage.setItem('js', jsInput.value);
    }

    function updateOutput() {
        let htmlCode = htmlInput.value;
        const cssCode = `<style>${cssInput.value}</style>`;
        const jsCode = `<script>${jsInput.value}</script>`;

        htmlCode = htmlCode.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
            const imageUrl = imageStore[src] || src;
            return `<img src="${imageUrl}"`;
        });

        const code = htmlCode + cssCode + jsCode;

        outputFrame.contentDocument.open();
        outputFrame.contentDocument.write(code);
        outputFrame.contentDocument.close();
    }

    htmlInput.addEventListener('input', updateOutput);
    cssInput.addEventListener('input', updateOutput);
    jsInput.addEventListener('input', updateOutput);
    window.addEventListener('beforeunload', saveToLocalStorage);

    loadFromLocalStorage();

    uploadFiles.addEventListener('change', function(event) {
        const files = event.target.files;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    imageStore[file.name] = e.target.result;
                    updateOutput();
                };

                reader.readAsDataURL(file);
            }
        });
    });

    function openInNewTab() {
        let htmlCode = htmlInput.value;
        const cssCode = `<style>${cssInput.value}</style>`;
        const jsCode = `<script>${jsInput.value}</script>`;

        htmlCode = htmlCode.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
            const imageUrl = imageStore[src] || src;
            return `<img src="${imageUrl}"`;
        });

        const code = htmlCode + cssCode + jsCode;
        const newWindow = window.open();
        newWindow.document.write(code);
        newWindow.document.close();
    }

    document.getElementById('openInNewTab').onclick = openInNewTab;
});
