const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

async function startVideo(){
    let stream = null;
    try{
        stream = await navigator.mediaDevices.getUserMedia({audio:false,video:true})
        video.srcObject = stream;
    }
    catch(err){
        alert("unable to connect your device")
        console.log(err)
    }
}

video.addEventListener('play',()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas);
    const dimention = {width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,dimention);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections,dimention)

        canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections)

    },50);
});