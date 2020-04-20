window.onload = () => {
    const playDiv = document.getElementById('playDiv')
    playDiv.style.width = innerWidth * 0.71
    playDiv.style.height = innerWidth * 0.71

    //upload image
    const imageCamera = document.getElementById('image-camera')
    const uploadImage = document.getElementById('upload-image')
    imageCamera.onclick = () => uploadImage.click()

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    var canvas1 = document.getElementById("rotate-canvas");
    var ctx1 = canvas1.getContext("2d");
    const frame = new Image()
    frame.src = './images/photoframe.png'

    var i;

    canvas.width = innerWidth * 0.71
    canvas.height = innerWidth * 0.71
    //convert base64 to array buffer
    base64ToArrayBuffer = (base64) => {
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binaryString = atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    //convert base64 to array buffer

    //render canvas
    renderCanvas = (image) => {
        // console.log(image)
        const rwh = image.width / image.height
        let newWidth = canvas.width
        let newHeight = newWidth / rwh
        if (rwh > 1) {
            newHeight = canvas.height
            newWidth = newHeight * rwh
        }
        const xOffset = rwh > 1 ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = rwh <= 1 ? ((canvas.height - newHeight) / 2) : 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        ctx.restore()
        // loader.style.display = 'none'
        // canvas.style.display = 'block'
    }
    //render canvas

    //rotate image for mobile
    drawRotated = (degrees, image) => {
        let tempW = image.height
        let tempH = image.width
        let tempImageW;
        let tempImageH;
        switch (degrees) {
            case -90:
                tempImageW = 0
                tempImageH = -tempW
                break;
            case 90:
                tempImageW = -tempH
                tempImageH = 0
                break;
            case 180:
                tempW = image.width
                tempH = image.height
                tempImageW = 0
                tempImageH = 0
                break;
            default:
                tempW = image.width
                tempH = image.height
                tempImageW = -tempW
                tempImageH = -tempH
                break;
        }
        canvas1.width = tempW
        canvas1.height = tempH
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        ctx1.save();
        ctx1.translate(canvas1.width, canvas1.height);
        ctx1.rotate(degrees * Math.PI / 180);
        ctx1.drawImage(image, tempImageW, tempImageH);
        ctx1.restore();
        var data = canvas1.toDataURL("image/jpg");
        const tempImage = new Image()
        tempImage.src = data
        tempImage.onload = () => renderCanvas(tempImage)
    }
    //rotate image for mobile

    uploadImage.onchange = (value) => handleUploadImage(value)

    handleUploadImage = (e) => {
        clearInterval(i)
        video.src = ''
        playDiv.style.display = 'none'
        const source = e.target.files[0]
        const reader = new FileReader();
        // console.log(source)
        reader.readAsDataURL(source);
        // loader.style.display = 'block'
        // canvas.style.display = 'none'
        reader.onloadend = () => {
            const preview = new Image();
            preview.src = reader.result
            preview.onload = () => {
                const exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(reader.result));
                // document.getElementById('concat').innerText = exif.Orientation
                switch (exif.Orientation) {
                    case 8:
                        drawRotated(-90, preview)
                        break;
                    case 3:
                        drawRotated(180, preview)
                        break;
                    case 6:
                        drawRotated(90, preview)
                        break;
                    default:
                        drawRotated(0, preview)
                        break;
                }
            }
        }
    }
    //upload image

    //video
    const videoCamera = document.getElementById('video-camera')
    const uploadVideo = document.getElementById('upload-video')
    videoCamera.onclick = () => uploadVideo.click()

    //handle rotate for mobile
    drawRotatedVideo = (degrees, image) => {
        // alert(image.duration)
        // console.log('drawRotatedVideo')
        const tempCanvas = document.createElement('CANVAS')
        const tempctx = tempCanvas.getContext("2d");
        document.body.appendChild(tempCanvas)

        //recorder
        // const chunks = []
        // recorder = new MediaRecorder(tempctx.canvas.captureStream(30));
        // recorder.ondataavailable = (e) => {
        // 	if (e.data.size > 0) {
        // 		chunks.push(e.data);
        // 	}
        // };
        // recorder.onstop = () => {
        // 	const blob = new Blob(chunks, { type: 'video/mp4' });
        // 	const url = window.URL.createObjectURL(blob);
        // 	alert(url)
        // 	const rotatedVideo = document.createElement('VIDEO')
        // 	rotatedVideo.src = url
        // 	rotatedVideo.setAttribute('muted', '')
        // 	rotatedVideo.play()
        // 	rotatedVideo.onloadeddata = () => {
        // 		console.log('onstop')
        // 		renderCanvasVideo(rotatedVideo)
        // 	}
        // };
        // recorder.start()
        // setTimeout(() => {
        // 	recorder.stop()
        // }, image.duration * 1000);
        //recorder

        streaming(tempCanvas, image.duration)

        tempCanvas.height = 300
        tempCanvas.width = 300
        let tempW = image.videoHeight
        let tempH = image.videoWidth
        let tempImageW;
        let tempImageH;
        switch (degrees) {
            case -90:
                tempImageW = 0
                tempImageH = -tempW
                break;
            case 90:
                tempImageW = -tempH
                tempImageH = 0
                break;
            case 180:
                tempW = image.videoWidth
                tempH = image.videoHeight
                tempImageW = 0
                tempImageH = 0
                break;
            default:
                tempW = image.videoWidth
                tempH = image.videoHeight
                tempImageW = -tempW
                tempImageH = -tempH
                break;
        }
        tempCanvas.width = tempW
        tempCanvas.height = tempH
        tempctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempctx.translate(tempCanvas.width, tempCanvas.height);
        tempctx.rotate(degrees * Math.PI / 180);
        setInterval(() => {
            tempctx.drawImage(image, tempImageW, tempImageH);
        }, 20)
        tempctx.save();
        tempctx.restore();
    }
    //handle rotate for mobile

    renderImageVideo = (image) => {
        const rwh = image.videoWidth / image.videoHeight
        let newWidth = canvas.width
        let newHeight = newWidth / rwh
        if (rwh > 1) {
            newHeight = canvas.height
            newWidth = newHeight * rwh
        }
        const xOffset = rwh > 1 ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = rwh <= 1 ? ((canvas.height - newHeight) / 2) : 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(rwh, xOffset, yOffset, newWidth, newHeight)
        // streaming(image.duration)
        // i = setInterval(() => {
        ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        // }, 20)
        ctx.save();
        ctx.restore()
    }

    //handle add fram
    renderCanvasVideo = (image) => {
        const rwh = image.videoWidth / image.videoHeight
        let newWidth = canvas.width
        let newHeight = newWidth / rwh
        if (rwh > 1) {
            newHeight = canvas.height
            newWidth = newHeight * rwh
        }
        const xOffset = rwh > 1 ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = rwh <= 1 ? ((canvas.height - newHeight) / 2) : 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(rwh, xOffset, yOffset, newWidth, newHeight)
        // streaming(image.duration)
        i = setInterval(() => {
            ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        }, 20)
        ctx.save();
        ctx.restore()
        // loader.style.display = 'none'
        // canvas.style.display = 'block'
    }
    //handle add fram

    const video = document.createElement('VIDEO')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.muted = 'muted'
    video.setAttribute('preload', 'auto')
    // const playDiv = document.getElementById('playDiv')
    console.log(playDiv)
    playDiv.onclick = () => {
        playDiv.style.display = 'none'
        video.play()
        renderCanvasVideo(video)
    }
    video.onended = () => {
        clearInterval(i)
        playDiv.style.display = 'flex'
    }

    //handle upload video
    uploadVideo.onchange = (e) => handleUploadVideo(e)
    handleUploadVideo = (value) => {
        video.src = ''
        clearInterval(i)
        var source = value.target.files[0]
        const reader = new FileReader();
        if (source) {
            reader.readAsDataURL(source);
            video.src = URL.createObjectURL(source)
            video.onloadeddata = () => {
                playDiv.style.display = 'flex'
                renderImageVideo(video)
            }
        }
    }
    //handle upload video
    //video

    //recorder
    let recordedChunks = [];

    streaming = (time) => {
        recordedChunks = []
        const stream = canvas.captureStream(25)
        const options = { mimeType: "video/webm; codecs=vp9" };
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        setTimeout(event => {
            mediaRecorder.stop();
        }, time * 1000);
    }

    handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
            download();
        } else {
            // ...
        }
    }

    download = () => {
        // console.log(recordedChunks)
        var blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        var url = URL.createObjectURL(blob);
        // alert(url)
        console.log(url)
        const stream = document.createElement('video')
        stream.src = url
        stream.muted = 'muted'
        stream.play()
        document.body.appendChild(stream)
        // var a = document.createElement("a");
        // document.body.appendChild(a);
        // a.style = "display: none";
        // a.href = url;
        // a.download = "test.mp4";
        // a.click();
        // window.URL.revokeObjectURL(url);
    }
    //recorder

    //upload
    const uploadFile = document.getElementById('upload-file')
    const uploadAll = document.getElementById('upload-all')
    uploadFile.onclick = () => uploadAll.click()
    uploadAll.onchange = (value) => {
        const type = value.target.files[0].type.split('/')[0]
        if (type === 'image') {
            handleUploadImage(value)
        } else {
            handleUploadVideo(value)
        }
    }
    //upload
}