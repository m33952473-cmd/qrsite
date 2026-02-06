let currentReportNo = "";

function uploadFile() {
    const file = document.getElementById("fileInput").files[0];
    const reportNo = document.getElementById("reportNo").value;
    const status = document.getElementById("statusMsg");

    if(!reportNo){
        alert("Enter Report No");
        return;
    }

    currentReportNo = reportNo;
    status.innerHTML = "Uploading document... 0%";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hertzupload");

    // ⭐ file ka naam report no. banega
    formData.append("public_id", reportNo);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dweefwzka/upload");

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100);
            status.innerHTML = "Uploading document... " + percent + "%";
        }
    };

    xhr.onload = function () {
        status.innerHTML = "Generating QR Code...";

        const finalUrl =
        "https://hertzinspn.co.in/documents/" + reportNo;

        QRCode.toCanvas(document.getElementById('qrcode'), finalUrl, function () {
            status.innerHTML = "✅ Upload Complete & QR Ready";
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
