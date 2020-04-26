var check_file_exist = 0
window.onload = () => {
    //open popup
    var modal = document.getElementById("myModal");

    var btn = document.getElementById("myBtnModal");

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const loading_icon_orange = document.getElementById('svg-loading-orange')
    const imageExample = document.getElementById('imageExample')
    // const playDiv = document.getElementById('playDiv')
    // playDiv.style.width = innerWidth * 0.71
    // playDiv.style.height = innerWidth * 0.71

    //upload image
    const imageCamera = document.getElementById('image-camera')
    const uploadImage = document.getElementById('upload-image')

    const video_preview = document.getElementById("myVideo");
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    var canvas1 = document.getElementById("rotate-canvas");
    var ctx1 = canvas1.getContext("2d");

    const canvas_hd = document.getElementById("myCanvasHD");
    const ctx_hd = canvas_hd.getContext("2d");
    var canvas1_hd = document.getElementById("rotate-canvasHD");
    var ctx1_hd = canvas1_hd.getContext("2d");

    imageCamera.onclick = () => {
        uploadImage.click()
        canvas.style.display = 'unset'
        video_preview.style.display = 'none'
        
    }



    const frame = new Image()
    frame.src = './images/photoframe.png'

    var i;

    canvas_hd.width = innerWidth * 2
    canvas_hd.height = innerWidth * 2

    if(window.innerWidth < 768){
        canvas.width = innerWidth * 0.65
        canvas.height = innerWidth * 0.65
    } else {
        canvas.width = innerWidth * 0.48
        canvas.height = innerWidth * 0.48
    }
    

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
        loading_icon_orange.style.display = 'none'
        imageExample.style.display = 'none'
        check_file_exist = 1
        // loader.style.display = 'none'
        // canvas.style.display = 'block'
    }
    //render canvas

    //render canvas hd
    renderCanvasHD = (image) => {
        // console.log(image)
        const rwh = image.width / image.height
        let newWidth = canvas_hd.width
        let newHeight = newWidth / rwh
        if (rwh > 1) {
            newHeight = canvas_hd.height
            newWidth = newHeight * rwh
        }

        const xOffset_hd = rwh > 1 ? ((canvas_hd.width - newWidth) / 2) : 0;
        const yOffset_hd = rwh <= 1 ? ((canvas_hd.height - newHeight) / 2) : 0;
        ctx_hd.clearRect(0, 0, canvas_hd.width, canvas_hd.height);
        ctx_hd.save();
        ctx_hd.drawImage(image, xOffset_hd, yOffset_hd, newWidth, newHeight);
        ctx_hd.drawImage(frame, 0, 0, canvas_hd.width, canvas_hd.height)
        ctx_hd.restore()
        check_file_exist = 1
    }
    //render canvas hd

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
        var data = canvas1.toDataURL("image/jpg", 1);
        const tempImage = new Image()
        tempImage.src = data
        tempImage.onload = () => renderCanvas(tempImage)

    }
    //rotate image for mobile

    //rotate imagehd for mobile
    drawRotatedHD = (degrees, image) => {
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

        canvas1_hd.width = tempW
        canvas1_hd.height = tempH
        ctx1_hd.clearRect(0, 0, canvas1_hd.width, canvas1_hd.height);
        ctx1_hd.save();
        ctx1_hd.translate(canvas1_hd.width, canvas1_hd.height);
        ctx1_hd.rotate(degrees * Math.PI / 180);
        ctx1_hd.drawImage(image, tempImageW, tempImageH);
        ctx1_hd.restore();
        var data_hd = canvas1_hd.toDataURL("image/jpg", 1);
        const tempImage_hd = new Image()
        tempImage_hd.src = data_hd
        tempImage_hd.onload = () => renderCanvasHD(tempImage_hd)
    }
    //rotate imagehd for mobile

    uploadImage.onchange = (value) => {
        imageCamera.style.display = 'none'
        handleUploadImage(value)
        handleUploadImageHD(value)
    }

    handleUploadImage = (e) => {
        clearInterval(i)
        const source = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(source);
        reader.onloadend = () => {
            loading_icon_orange.style.display = 'unset'
            const preview = new Image();
            preview.src = reader.result
            preview.onload = () => {
                const exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(reader.result));
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

    handleUploadImageHD = (e) => {
        clearInterval(i)
        const source = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(source);
        reader.onloadend = () => {
            const preview = new Image();
            preview.src = reader.result
            preview.onload = () => {
                const exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(reader.result));
                switch (exif.Orientation) {
                    case 8:
                        drawRotatedHD(-90, preview)
                        break;
                    case 3:
                        drawRotatedHD(180, preview)
                        break;
                    case 6:
                        drawRotatedHD(90, preview)
                        break;
                    default:
                        drawRotatedHD(0, preview)
                        break;
                }
            }
        }
    }
    //upload image HD

    //download image HD
    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/jpeg", 1);
        return image;
    }

    document.getElementById('myBtnModal').onclick = function () {
        modal.style.display = "block";
        var downloadButton = document.getElementById('doneDownload')
        downloadButton.onclick = () => {
            if(check_file_exist > 0){
                if (canvas.style.display == 'unset') {
                    var image = convertCanvasToImage(document.getElementById("myCanvasHD"));
                    download(image.src, 'image-redoxon', 'jpeg');
                } else {
                    var anchor = document.createElement('a');
    
                    // console.log(anchor);
                    anchor.setAttribute('href', video_preview.src);
                    anchor.setAttribute('download', 'video-redoxon');
                    anchor.click();

                    const obj_url = URL.createObjectURL(blob);
                    video_preview.src = obj_url;
                    // download(video_preview.src, 'video-redoxon','mp4');
                }
            } else {
                alert('Bạn chưa tải ảnh/video lên web!!!')
            }
            
        }
    }



    //upload
    const uploadFile = document.getElementById('upload-file')
    const uploadAll = document.getElementById('upload-all')
    uploadFile.onclick = () => uploadAll.click()
    uploadAll.onchange = (value) => {
        const type = value.target.files[0].type.split('/')[0]
        if (type === 'image') {
            handleUploadImage(value)
            canvas.style.display = 'unset'
            video_preview.style.display = 'none'
            imageCamera.style.display = 'none'
        } else {
            //video
            handleFiles(value.srcElement.files)
            canvas.style.display = 'none'
            video_preview.style.display = 'unset'
            imageExample.style.display = 'none'
            imageCamera.style.display = 'none'

            var source = value.target.files[0]
			var reader = new FileReader();
			var checkWidthHeighVideo = document.getElementById("checkWidthHeighVideo")
			reader.onloadend = function () {
                checkWidthHeighVideo.src = reader.result;
			}
			if (source) {
                reader.readAsDataURL(source);
			} else {
				checkWidthHeighVideo.src = "";
            }
        }
    }
    //upload

    var videoCamera = document.getElementById("video-camera"),
        uploadVideo = document.getElementById("upload-video");
    // urlSelect = document.getElementById("urlSelect");

    videoCamera.addEventListener("click", function (e) {
        if (uploadVideo) {
            uploadVideo.click();
            imageCamera.style.display = 'none'
            canvas.style.display = 'none'
            video_preview.style.display = 'unset'
            imageExample.style.display = 'none'
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);
}


const cloudName = 'djkc67zly';

const unsignedUploadPreset = 'redoxon-new';

var video_height
var video_width
// *********** Upload file to Cloudinary ******************** //
function uploadFileVideo(file) {
    
    var loading_icon_orange = document.getElementById('svg-loading-orange')
    loading_icon_orange.style.display = 'unset'
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   
    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
        

        console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);
    });

    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loading_icon_orange.style.display = 'none'
            let video_preview = document.getElementById("myVideo");
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            var url = response.secure_url;
            url = url.replace('/upload/', '/upload/fl_attachment/');
            //   alert(response.url);
            console.log(url)
            video_preview.src = url
            check_file_exist = 1

        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
}

// *********** Handle selected files ******************** //
var handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        uploadFileVideo(files[i]); // call the function to upload the file
    }
};