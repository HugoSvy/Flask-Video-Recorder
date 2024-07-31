const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const capturedImage = document.getElementById('capturedImage');

// Accéder à la webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Capturer une image du flux vidéo
captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    capturedImage.src = imageData;

    // Envoyer l'image capturée à l'API Flask
    fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Image uploaded successfully');
            // Récupérer et afficher l'image modifiée depuis l'API Flask
            fetch('/api/get_image')
                .then(response => response.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    capturedImage.src = url;
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                });
        } else {
            console.error('Image upload failed');
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
});
