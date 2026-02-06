let currentReportNo = "";

function uploadFile() {
    const file = document.getElementById("fileInput").files[0];
    const reportNo = document.getElementById("reportNo").value;

    if(!reportNo){
        alert("Enter Report No");
        return;
    }

    currentReportNo = reportNo;

    // Loading message create
    let status = document.getElementById("statusMsg");
    if(!status){
        status = document.createElement("div");
        status.id = "statusMsg";
        status.style.marginTop = "20px";
        status.style.fontWeight = "bold";
        document.body.appendChild(status);
    }

    status.innerHTML = "Uploading document... 0%";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hertzupload");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dweefwzka/upload");

    // Upload progress
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            let percent = Math.round((e.loaded / e.total) * 100);
            status.innerHTML = "Uploading document... " + percent + "%";
        }
    };

    xhr.onload = function () {
        status.innerHTML = "Generating QR Code...";

        const data = JSON.parse(xhr.responseText);
        const fileUrl = data.secure_url;

        const fileName = fileUrl.split("/").pop();

        const finalUrl =
        "https://hertzinspn.co.in/documents/" +
        reportNo + "/" + fileName;

        const canvas = document.getElementById('qrcode');

        QRCode.toCanvas(canvas, finalUrl, function () {
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
