/* =========================================
   ELEMENTS
========================================= */

const openingScreen =
    document.getElementById("openingScreen");

const openButton =
    document.getElementById("openButton");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    document.getElementById("musicIcon");

const voiceNote =
    document.getElementById("voiceNote");

const voiceButton =
    document.getElementById("voiceButton");

const voiceIcon =
    document.getElementById("voiceIcon");

const voiceText =
    document.getElementById("voiceText");

const voiceProgress =
    document.getElementById("voiceProgress");


/* =========================================
   OPEN WEBSITE
========================================= */

openButton.addEventListener("click", () => {

    openingScreen.classList.add("hide");

    /*
        Browser biasanya mengizinkan audio
        setelah user melakukan interaction.

        Karena tombol ini diklik user,
        kita bisa menjalankan background music.
    */

    backgroundMusic.volume = 0.35;

    backgroundMusic.play()
        .then(() => {

            musicIcon.textContent = "♫";

        })
        .catch((error) => {

            console.log(
                "Music tidak dapat dimainkan:",
                error
            );

        });

});


/* =========================================
   BACKGROUND MUSIC CONTROL
========================================= */

let musicPlaying = false;


musicButton.addEventListener("click", () => {

    if (musicPlaying) {

        backgroundMusic.pause();

        musicPlaying = false;

        musicIcon.textContent = "🔇";

    } else {

        backgroundMusic.play();

        musicPlaying = true;

        musicIcon.textContent = "♫";

    }

});


backgroundMusic.addEventListener("play", () => {

    musicPlaying = true;

    musicIcon.textContent = "♫";

});


backgroundMusic.addEventListener("pause", () => {

    musicPlaying = false;

    musicIcon.textContent = "🔇";

});


/* =========================================
   VOICE NOTE
========================================= */

let voicePlaying = false;


voiceButton.addEventListener("click", () => {

    if (voicePlaying) {

        voiceNote.pause();

        voicePlaying = false;

        voiceIcon.textContent = "▶";

        voiceText.textContent = "Play Voice Note";

    } else {

        voiceNote.play();

        voicePlaying = true;

        voiceIcon.textContent = "Ⅱ";

        voiceText.textContent = "Pause Voice Note";

    }

});


/* =========================================
   VOICE PROGRESS
========================================= */

voiceNote.addEventListener("timeupdate", () => {

    if (!voiceNote.duration) {
        return;
    }

    const progress =
        (voiceNote.currentTime / voiceNote.duration) * 100;

    voiceProgress.style.width =
        `${progress}%`;

});


/* =========================================
   VOICE NOTE ENDED
========================================= */

voiceNote.addEventListener("ended", () => {

    voicePlaying = false;

    voiceIcon.textContent = "▶";

    voiceText.textContent = "Play Voice Note";

    voiceProgress.style.width = "0%";

});


/* =========================================
   PHOTO LIGHTBOX
========================================= */

const photoCards =
    document.querySelectorAll(".photo-card");

const photoLightbox =
    document.getElementById("photoLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxCaption =
    document.getElementById("lightboxCaption");

const closeLightbox =
    document.getElementById("closeLightbox");

const prevPhoto =
    document.getElementById("prevPhoto");

const nextPhoto =
    document.getElementById("nextPhoto");


/*
    Simpan semua foto
*/

const photoData = [];

photoCards.forEach((card) => {

    const image =
        card.querySelector("img");

    const caption =
        card.querySelector("span");

    photoData.push({

        src: image.src,

        caption: caption
            ? caption.textContent
            : ""

    });

});


let currentPhoto = 0;


/* =========================================
   OPEN LIGHTBOX
========================================= */

function openPhoto(index) {

    currentPhoto = index;

    const photo =
        photoData[currentPhoto];

    lightboxImage.src =
        photo.src;

    lightboxCaption.textContent =
        photo.caption;

    photoLightbox.classList.add("active");

    /*
        Disable scroll ketika popup terbuka
    */

    document.body.style.overflow = "hidden";

}


/* =========================================
   CLOSE LIGHTBOX
========================================= */

function closePhoto() {

    photoLightbox.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================
   NEXT PHOTO
========================================= */

function showNextPhoto() {

    currentPhoto++;

    if (currentPhoto >= photoData.length) {

        currentPhoto = 0;

    }

    updateLightbox();

}


/* =========================================
   PREVIOUS PHOTO
========================================= */

function showPreviousPhoto() {

    currentPhoto--;

    if (currentPhoto < 0) {

        currentPhoto =
            photoData.length - 1;

    }

    updateLightbox();

}


/* =========================================
   UPDATE LIGHTBOX
========================================= */

function updateLightbox() {

    const photo =
        photoData[currentPhoto];


    /*
        Animasi kecil ketika berganti foto
    */

    lightboxImage.style.opacity = "0";

    lightboxImage.style.transform =
        "scale(.9)";


    setTimeout(() => {

        lightboxImage.src =
            photo.src;

        lightboxCaption.textContent =
            photo.caption;

        lightboxImage.style.opacity = "1";

        lightboxImage.style.transform =
            "scale(1)";

    }, 150);

}


/* =========================================
   CLICK PHOTO
========================================= */

photoCards.forEach((card, index) => {

    card.addEventListener("click", () => {

        openPhoto(index);

    });

});


/* =========================================
   BUTTON EVENTS
========================================= */

closeLightbox.addEventListener(
    "click",
    closePhoto
);


nextPhoto.addEventListener(
    "click",
    showNextPhoto
);


prevPhoto.addEventListener(
    "click",
    showPreviousPhoto
);


/* =========================================
   CLICK BACKGROUND TO CLOSE
========================================= */

photoLightbox.addEventListener(
    "click",
    (event) => {

        /*
            Hanya tutup jika yang diklik
            adalah area background.

            Jadi klik foto tidak menutup popup.
        */

        if (
            event.target === photoLightbox
        ) {

            closePhoto();

        }

    }
);


/* =========================================
   KEYBOARD CONTROL
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            ESC
        */

        if (
            event.key === "Escape" &&
            photoLightbox.classList.contains("active")
        ) {

            closePhoto();

        }


        /*
            Arrow Right
        */

        if (
            event.key === "ArrowRight" &&
            photoLightbox.classList.contains("active")
        ) {

            showNextPhoto();

        }


        /*
            Arrow Left
        */

        if (
            event.key === "ArrowLeft" &&
            photoLightbox.classList.contains("active")
        ) {

            showPreviousPhoto();

        }

    }
);


/* =========================================
   RANDOM FLOWER GENERATOR
========================================= */

const flowerContainer =
    document.querySelector(".floating-flowers");


const flowers = [
    "🌸",
    "🌼",
    "🌷",
    "🌺",
    "🌻"
];


function createFlower() {

    const flower =
        document.createElement("span");

    flower.classList.add("floating");

    flower.textContent =
        flowers[
            Math.floor(
                Math.random() * flowers.length
            )
        ];

    flower.style.left =
        Math.random() * 100 + "%";

    flower.style.fontSize =
        (15 + Math.random() * 20) + "px";

    flower.style.animationDuration =
        (10 + Math.random() * 12) + "s";

    flower.style.opacity =
        0.2 + Math.random() * 0.5;

    flowerContainer.appendChild(flower);


    /*
        Hapus element setelah animasi selesai
        supaya DOM tidak terus bertambah.
    */

    setTimeout(() => {

        flower.remove();

    }, 22000);

}


/*
    Munculkan bunga baru setiap beberapa detik
*/

setInterval(createFlower, 2500);


/* =========================================
   PAGE VISIBILITY
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
            Kalau tab ditinggalkan,
            jangan memaksa music berhenti.

            Browser akan mengatur sendiri
            sesuai policy-nya.
        */

        if (
            document.hidden &&
            !backgroundMusic.paused
        ) {

            console.log(
                "Website berada di background."
            );

        }

    }
);

/* =========================================
   LITTLE PHOTOBOOTH
========================================= */
(() => {
    const video = document.getElementById("pbVideo");
    if (!video) return;

    const startCameraButton = document.getElementById("pbStartCamera");
    const startSessionButton = document.getElementById("pbStartSession");
    const retakeButton = document.getElementById("pbRetake");
    const downloadButton = document.getElementById("pbDownload");
    const placeholder = document.getElementById("pbCameraPlaceholder");
    const cameraStatus = document.getElementById("pbCameraStatus");
    const status = document.getElementById("pbStatus");
    const driveStatus = document.getElementById("pbDriveStatus");
    const countdown = document.getElementById("pbCountdown");
    const photoCount = document.getElementById("pbPhotoCount");
    const strip = document.getElementById("pbStrip");
    const slotLabels = ["your smile goes here", "and another one", "one to remember"];

    // Paste your deployed Google Apps Script Web App URL here to enable Drive upload.
    const GOOGLE_DRIVE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxVkdEnA_SkYUUyzNXwhVEvcpwY7nQ-DJQ-Dhl03GjyVUgKqtEUkaHJwl_jKWDNvbGXnQ/exec";

    let cameraStream = null;
    let photos = [];
    let sessionRunning = false;

    function setStatus(message) { status.textContent = message; }
    function setDriveStatus(message) { driveStatus.textContent = message; }

    async function openCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setStatus("Browser ini tidak mendukung kamera. Buka website melalui HTTPS dan coba browser terbaru.");
            return;
        }
        startCameraButton.disabled = true;
        setStatus("Meminta izin kamera...");
        try {
            if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
                audio: false
            });
            video.srcObject = cameraStream;
            await video.play();
            placeholder.classList.add("is-hidden");
            cameraStatus.textContent = "Camera is ready";
            document.querySelector(".pb-live-dot")?.classList.add("is-live");
            startSessionButton.disabled = false;
            startCameraButton.textContent = "Restart Camera";
            setStatus("Camera ready! When you're ready, take your three photos.");
        } catch (error) {
            console.error("Photobooth camera error:", error);
            let message = "Kamera tidak dapat dibuka. Periksa izin kamera browser.";
            if (error.name === "NotAllowedError") message = "Izin kamera ditolak. Izinkan akses kamera dari pengaturan browser, lalu coba lagi.";
            if (error.name === "NotFoundError") message = "Kamera tidak ditemukan pada perangkat ini.";
            setStatus(message);
        } finally {
            startCameraButton.disabled = false;
        }
    }

    function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function runCountdown(seconds) {
        countdown.classList.add("is-visible");
        for (let i = seconds; i > 0; i--) {
            countdown.textContent = i;
            await wait(850);
        }
        countdown.textContent = "♡";
        await wait(250);
        countdown.classList.remove("is-visible");
    }

    function capturePhoto() {
        if (!video.videoWidth || !video.videoHeight) throw new Error("Kamera belum siap.");
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        // Mirror the captured image so it matches the selfie preview.
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.92);
    }

    function renderSlots() {
        const slots = strip.querySelectorAll(".pb-photo-slot");
        slots.forEach((slot, index) => {
            slot.replaceChildren();
            const number = document.createElement("span");
            number.textContent = String(index + 1).padStart(2, "0");
            slot.appendChild(number);
            if (photos[index]) {
                const img = document.createElement("img");
                img.src = photos[index];
                img.alt = `Photobooth photo ${index + 1}`;
                slot.appendChild(img);
            } else {
                const label = document.createElement("small");
                label.textContent = slotLabels[index];
                slot.appendChild(label);
            }
        });
        photoCount.textContent = `${photos.length} / 3`;
        const complete = photos.length === 3;
        downloadButton.disabled = !complete;
        retakeButton.disabled = photos.length === 0 || sessionRunning;
    }

    async function startSession() {
        if (!cameraStream || sessionRunning) return;
        sessionRunning = true;
        photos = [];
        renderSlots();
        startSessionButton.disabled = true;
        retakeButton.disabled = true;
        try {
            for (let i = 0; i < 3; i++) {
                setStatus(`Get ready for photo ${i + 1} of 3...`);
                await runCountdown(3);
                photos.push(capturePhoto());
                renderSlots();
                setStatus(`Photo ${i + 1} captured!`);
                if (i < 2) await wait(650);
            }
            setStatus("All three photos are ready! Download your photo strip to save it to your device and Google Drive.");
        } catch (error) {
            console.error("Photobooth capture error:", error);
            setStatus("Gagal mengambil foto. Pastikan kamera masih aktif, lalu coba lagi.");
        } finally {
            sessionRunning = false;
            startSessionButton.disabled = !cameraStream;
            retakeButton.disabled = photos.length === 0;
        }
    }

    function makePhotoStrip() {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const width = 900;
            const photoHeight = 675;
            const margin = 42;
            const gap = 24;
            const header = 105;
            const footer = 85;
            canvas.width = width;
            canvas.height = margin + header + (photoHeight * 3) + (gap * 2) + footer + margin;

            ctx.fillStyle = "#fffdf8";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#493b3d";
            ctx.textAlign = "center";
            ctx.font = "bold 44px Georgia, serif";
            ctx.fillText("little moments ♡", width / 2, margin + 42);
            ctx.fillStyle = "#c86b7c";
            ctx.font = "22px Arial, sans-serif";
            ctx.fillText("A MEMORY TO KEEP", width / 2, margin + 77);

            const imagePromises = photos.map(src => new Promise((res, rej) => {
                const img = new Image();
                img.onload = () => res(img);
                img.onerror = rej;
                img.src = src;
            }));
            Promise.all(imagePromises).then(images => {
                let y = margin + header;
                images.forEach(img => {
                    const targetRatio = width - margin * 2;
                    const ratio = Math.max(targetRatio / img.width, photoHeight / img.height);
                    const drawWidth = img.width * ratio;
                    const drawHeight = img.height * ratio;
                    const sx = (drawWidth - targetRatio) / 2 / ratio;
                    const sy = (drawHeight - photoHeight) / 2 / ratio;
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(margin, y, targetRatio, photoHeight);
                    ctx.clip();
                    ctx.drawImage(img, sx, sy, targetRatio / ratio, photoHeight / ratio, margin, y, targetRatio, photoHeight);
                    ctx.restore();
                    y += photoHeight + gap;
                });
                ctx.fillStyle = "#493b3d";
                ctx.font = "30px Georgia, serif";
                ctx.fillText("made with love  •  🌸", width / 2, canvas.height - margin - 22);
                resolve(canvas);
            }).catch(reject);
        });
    }

    async function downloadPhoto() {
        if (photos.length !== 3) return;
        downloadButton.disabled = true;
        setStatus("Preparing your photo strip...");
        try {
            const canvas = await makePhotoStrip();
            const link = document.createElement("a");
            link.download = `birthday-photobooth-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            setStatus("Your photo strip download has started. ♡");
            // If Drive has been configured, the Download action also saves a copy there.
            if (GOOGLE_DRIVE_WEB_APP_URL) {
                setDriveStatus("Photo downloaded. Sending a copy to Google Drive...");
                try {
                    await uploadCanvasToDrive(canvas);
                    setDriveStatus("Upload request sent. Check your Google Drive folder to confirm the file was created.");
                } catch (uploadError) {
                    console.error("Google Drive upload error:", uploadError);
                    setDriveStatus("Photo downloaded, but the Drive upload could not be sent. Check the Apps Script URL.");
                }
            } else {
                setDriveStatus("Photo downloaded to your device, but Google Drive is not connected yet. Configure GOOGLE_DRIVE_WEB_APP_URL in script.js.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Tidak bisa membuat hasil foto. Silakan coba lagi.");
        } finally {
            downloadButton.disabled = photos.length !== 3;
        }
    }

    async function uploadCanvasToDrive(canvas) {
        if (!GOOGLE_DRIVE_WEB_APP_URL) throw new Error("Google Apps Script URL is not configured.");
        const imageData = canvas.toDataURL("image/png").split(",")[1];
        const payload = {
            filename: `birthday-photobooth-${new Date().toISOString().replace(/[:.]/g, "-")}.png`,
            mimeType: "image/png",
            image: imageData
        };
        // Apps Script commonly does not expose CORS response headers; no-cors allows the POST,
        // but the browser cannot verify whether Drive created the file.
        await fetch(GOOGLE_DRIVE_WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });
    }


    startCameraButton.addEventListener("click", openCamera);
    startSessionButton.addEventListener("click", startSession);
    retakeButton.addEventListener("click", () => {
        photos = [];
        renderSlots();
        setStatus("Ready for another round! Take your three photos when you're ready.");
        startSession();
    });
    downloadButton.addEventListener("click", downloadPhoto);

    renderSlots();
    window.addEventListener("beforeunload", () => {
        if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    });
})();
