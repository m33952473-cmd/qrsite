let currentReportNo = "";

function uploadFile() {
    const file = document.getElementById("fileInput").files[0];
    const reportNo = document.getElementById("reportNo").value;

    if(!reportNo){
        alert("Enter Report No");
        return;
    }

    currentReportNo = reportNo;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hertzupload");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dweefwzka/upload");

    const progressBox = document.getElementById("progressBox");
    const progressBar = document.getElementById("progressBar");
    progressBox.style.display = "block";

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percent + "%";
            progressBar.innerHTML = percent + "%";
        }
    };

    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        const fileUrl = data.secure_url;

        const finalUrl = "https://qrsite-drab.vercel.app/view.html?file=" + encodeURIComponent(fileUrl);

        const canvas = document.getElementById('qrcode');

        QRCode.toCanvas(canvas, finalUrl, function () {
            document.getElementById("downloadBtn").style.display = "inline-block";
        });
    };

    xhr.send(formData);
}

function downloadQR(){
    const canvas = document.getElementById('qrcode');
    const link = document.createElement('a');
    link.download = currentReportNo + ".png";
    link.href = canvas.toDataURL();
    link.click();
}
