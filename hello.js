const captureButton = document.getElementById("capture-button");
const video = document.getElementById("video");
let canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error("Error accessing camera:", error);
    });

// Capture the image
captureButton.addEventListener("click", () => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/jpeg");
    const imageBlob = dataURItoBlob(imageDataURL);
    uploadToS3(imageBlob);
});

// Convert data URL to Blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
}

// Upload to S3 (replace with your S3 configuration and credentials)
function uploadToS3(blob) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://your-s3-bucket.s3.amazonaws.com/your-image-path");
    xhr.setRequestHeader("Content-Type", "image/jpeg");
    xhr.onload = () => {
        console.log("Image uploaded successfully!");
    };
    xhr.onerror = () => {
        console.error("Image upload failed!");
    };
    xhr.send(blob);
}
