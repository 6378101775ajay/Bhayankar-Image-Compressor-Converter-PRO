
    self.addEventListener('install', e => {
        e.waitUntil(
          caches.open('img-compressor').then(cache => {
            return cache.addAll([
              '/',
              '/index.html',
              '/manifest.json',
              '/icon-192.png',
              '/icon-512.png'
            ]);
          })
        );
      });
      
      self.addEventListener('fetch', e => {
        e.respondWith(
          caches.match(e.request).then(res => res || fetch(e.request))
        );
      });
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
          .then(() => console.log('Service Worker Registered'));
      }
            
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const downloadLink = document.getElementById('downloadLink');

    let originalImage = null;

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          originalImage = new Image();
          originalImage.onload = function () {
            previewImage.src = evt.target.result;
          };
          originalImage.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    function processImage() {
      const quality = parseInt(document.getElementById('quality').value) / 100;
      const format = document.getElementById('format').value;
      const extension = format.split('/')[1];

      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(originalImage, 0, 0);

      let outputFormat = format;
      let fileExt = extension;

      if (format === 'image/gif') {
        outputFormat = 'image/png';
        fileExt = 'png';
        alert("GIF export limited in browser — saving as PNG.");
      }

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        previewImage.src = url;

        downloadLink.href = url;
        downloadLink.download = `converted.${fileExt}`;
        downloadLink.style.display = 'inline-block';
      }, outputFormat, quality);
    }
    
  