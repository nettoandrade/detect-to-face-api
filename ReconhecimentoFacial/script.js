const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.err(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height}
    faceapi.matchDimensions(canvas,displaySize)
    setInterval(async () => {
        const detect = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detect,displaySize)
        resizedDetections.forEach(detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, {label: 'Face'})
            drawBox.draw(canvas)
        });
    }, 100)    
})