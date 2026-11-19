/* =========================================
   ELEMENTS
========================================= */
const openingScreen = document.getElementById("openingScreen");
const openButton = document.getElementById("openButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");


const BACKGROUND_VOLUME = 0.35;
const DUCKED_MUSIC_VOLUME = 0.07;

// Daftar voice note
const voiceNotes = [
    {
        audio: document.getElementById("voiceNote1"),
        button: document.getElementById("voiceButton1"),
        icon: document.getElementById("voiceIcon1"),
        text: document.getElementById("voiceText1"),
        progress: document.getElementById("voiceProgress1"),
        label: "Play Voice Note 1"
    },
    {
        audio: document.getElementById("voiceNote2"),
        button: document.getElementById("voiceButton2"),
        icon: document.getElementById("voiceIcon2"),
        text: document.getElementById("voiceText2"),
        progress: document.getElementById("voiceProgress2"),
        label: "Play Voice Note 2"
    }
];

// Web Audio API
let audioContext = null;
let backgroundGain = null;

function setupAudioGraph() {
    if (audioContext) return;

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        console.warn("Web Audio API tidak tersedia.");
        return;
    }

    audioContext = new AudioContextClass();

    // Jalur background music
    const backgroundSource =
        audioContext.createMediaElementSource(backgroundMusic);

    backgroundGain = audioContext.createGain();
    backgroundGain.gain.value = BACKGROUND_VOLUME;

    backgroundSource.connect(backgroundGain);
    backgroundGain.connect(audioContext.destination);

    // Jalur voice notes
    voiceNotes.forEach(note => {
        if (!note.audio) return;

        const voiceSource =
            audioContext.createMediaElementSource(note.audio);

        voiceSource.connect(audioContext.destination);
    });
}

function resumeAudioContext() {
    setupAudioGraph();

    if (audioContext && audioContext.state === "suspended") {
        return audioContext.resume();
    }

    return Promise.resolve();
}

function anyVoiceNotePlaying() {
    return voiceNotes.some(note =>
        note.audio &&
        !note.audio.paused &&
        !note.audio.ended
    );
}

function updateBackgroundVolume() {
    const targetVolume = anyVoiceNotePlaying()
        ? DUCKED_MUSIC_VOLUME
        : BACKGROUND_VOLUME;

    if (backgroundGain && audioContext) {
        // Perubahan volume lebih halus
        backgroundGain.gain.cancelScheduledValues(
            audioContext.currentTime
        );

        backgroundGain.gain.setTargetAtTime(
            targetVolume,
            audioContext.currentTime,
            0.15
        );
    } else {
        // Fallback jika Web Audio API tidak tersedia
        backgroundMusic.volume = targetVolume;
    }
}

function updateVoiceNoteUI(note, isPlaying) {
    note.icon.textContent = isPlaying ? "Ⅱ" : "▶";

    note.text.textContent = isPlaying
        ? `Pause ${note.label.replace("Play ", "")}`
        : note.label;
}

function resetVoiceNote(note) {
    note.audio.pause();
    note.audio.currentTime = 0;
    note.progress.style.width = "0%";

    updateVoiceNoteUI(note, false);
}

/* =========================================
   OPEN WEBSITE
========================================= */

openButton.addEventListener("click", async () => {
    openingScreen.classList.add("hide");

    try {
        // Mulai audio context dari interaksi pengguna
        const resumePromise = resumeAudioContext();

        updateBackgroundVolume();

        const playPromise = backgroundMusic.play();

        await Promise.all([
            resumePromise,
            playPromise
        ]);

        musicIcon.textContent = "♫";

    } catch (error) {
        console.error("Music tidak dapat dimainkan:", error);
    }
});

/* =========================================
   BACKGROUND MUSIC CONTROL
========================================= */

musicButton.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
        try {
            const resumePromise = resumeAudioContext();

            updateBackgroundVolume();

            const playPromise = backgroundMusic.play();

            await Promise.all([
                resumePromise,
                playPromise
            ]);

        } catch (error) {
            console.error("Music tidak dapat dimainkan:", error);
        }

    } else {
        backgroundMusic.pause();
    }
});

backgroundMusic.addEventListener("play", () => {
    musicIcon.textContent = "♫";
    updateBackgroundVolume();
});

backgroundMusic.addEventListener("pause", () => {
    musicIcon.textContent = "🔇";
});

/* =========================================
   TWO VOICE NOTES
========================================= */

voiceNotes.forEach(note => {
    if (!note.audio || !note.button) return;

    note.button.addEventListener("click", async () => {

        // Jika sedang diputar, pause
        if (!note.audio.paused && !note.audio.ended) {
            note.audio.pause();
            return;
        }

        // Hentikan voice note lainnya
        voiceNotes.forEach(other => {
            if (other !== note) {
                resetVoiceNote(other);
            }
        });

        try {
            // Resume AudioContext dan mulai voice note
            const resumePromise = resumeAudioContext();

            const playPromise = note.audio.play();

            await Promise.all([
                resumePromise,
                playPromise
            ]);

        } catch (error) {
            console.error(
                "Voice note tidak dapat dimainkan:",
                error
            );

            updateVoiceNoteUI(note, false);
            updateBackgroundVolume();
        }
    });

    note.audio.addEventListener("play", () => {
        updateVoiceNoteUI(note, true);
        updateBackgroundVolume();
    });

    note.audio.addEventListener("pause", () => {
        updateVoiceNoteUI(note, false);
        updateBackgroundVolume();
    });

    note.audio.addEventListener("ended", () => {
        note.progress.style.width = "0%";

        updateVoiceNoteUI(note, false);
        updateBackgroundVolume();
    });

    note.audio.addEventListener("timeupdate", () => {
        if (note.audio.duration) {
            note.progress.style.width =
                `${note.audio.currentTime / note.audio.duration * 100}%`;
        }
    });
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
   LITTLE PHOTOBOOTH (4 TAKES -> 8 SLOTS, 1080x1920)
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

    const TOTAL_PHOTOS = 4;
    const OUTPUT_WIDTH = 1080;
    const OUTPUT_HEIGHT = 1920;
    const slotLabels = ["your smile", "another one", "keep going", "one to remember"];

    // Paste your deployed Google Apps Script Web App URL here to enable Drive upload.
    const GOOGLE_DRIVE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxVkdEnA_SkYUUyzNXwhVEvcpwY7nQ-DJQ-Dhl03GjyVUgKqtEUkaHJwl_jKWDNvbGXnQ/exec";

    let cameraStream = null;
    let photos = [];
    let sessionRunning = false;

    // Urutan 8 slot: tiap angka = indeks foto (0-3), muncul 2x.
    // Aturan: tidak ada foto yang sama dalam satu baris (slot 0-1, 2-3, 4-5, 6-7).
    function createLayout() {
        const base = Array.from({ length: TOTAL_PHOTOS }, (_, i) => i).flatMap(i => [i, i]);
        let result;
        do {
            result = [...base];
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
        } while (result.some((value, k) => k % 2 === 0 && value === result[k + 1]));
        return result;
    }

    let layout = createLayout();

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
            setStatus("Camera ready! When you're ready, take your four photos.");
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

    // 8 slot (2 kolom x 4 baris): foto ke-N tampil di kedua kolom pada baris ke-N
    function renderSlots() {
        const slots = strip.querySelectorAll(".pb-photo-slot");
        slots.forEach((slot, index) => {
            const photoIndex = layout[index];
            slot.replaceChildren();
            const number = document.createElement("span");
            number.textContent = String(photoIndex + 1).padStart(2, "0");
            slot.appendChild(number);
            if (photos[photoIndex]) {
                const img = document.createElement("img");
                img.src = photos[photoIndex];
                img.alt = `Photobooth photo ${photoIndex + 1}`;
                slot.appendChild(img);
            } else {
                const label = document.createElement("small");
                label.textContent = slotLabels[photoIndex];
                slot.appendChild(label);
            }
        });
        photoCount.textContent = `${photos.length} / ${TOTAL_PHOTOS}`;
        const complete = photos.length === TOTAL_PHOTOS;
        downloadButton.disabled = !complete;
        retakeButton.disabled = photos.length === 0 || sessionRunning;
    }

    async function startSession() {
        if (!cameraStream || sessionRunning) return;
        sessionRunning = true;
        photos = [];
        layout = createLayout();
        renderSlots();
        startSessionButton.disabled = true;
        retakeButton.disabled = true;
        try {
            for (let i = 0; i < TOTAL_PHOTOS; i++) {
                setStatus(`Get ready for photo ${i + 1} of ${TOTAL_PHOTOS}...`);
                await runCountdown(3);
                photos.push(capturePhoto());
                renderSlots();
                setStatus(`Photo ${i + 1} captured!`);
                if (i < TOTAL_PHOTOS - 1) await wait(650);
            }
            setStatus("All four photos are ready! Download your photo strip to save it to your device and Google Drive.");
        } catch (error) {
            console.error("Photobooth capture error:", error);
            setStatus("Gagal mengambil foto. Pastikan kamera masih aktif, lalu coba lagi.");
        } finally {
            sessionRunning = false;
            startSessionButton.disabled = !cameraStream;
            retakeButton.disabled = photos.length === 0;
        }
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Hasil akhir: 1080 x 1920, 8 foto (4 foto diduplikasi ke 2 kolom)
        // Hasil akhir 1080 x 1920: dua tiket, masing-masing 4 foto (total 8 foto)
    async function makePhotoStrip() {
        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_WIDTH;
        canvas.height = OUTPUT_HEIGHT;
        const ctx = canvas.getContext("2d");

        // Pastikan font sudah siap sebelum digambar ke canvas
        try {
            await Promise.all([
                document.fonts.load("italic 80px 'DM Serif Display'"),
                document.fonts.load("80px 'DM Serif Display'"),
                document.fonts.load("700 60px Poppins")
            ]);
        } catch (e) { /* fallback font */ }

        const W = OUTPUT_WIDTH;
        const H = OUTPUT_HEIGHT;
        const MAROON = "#6b1114";
        const CREAM = "#fdf1e6";
        const INK = "#7a1519";
        const SERIF = "'DM Serif Display', serif";

        // ---------- Ukuran layout ----------
        const outer = 40;                       // jarak tiket ke tepi canvas
        const gap = 40;                         // jarak antar tiket
        const tW = (W - outer * 2 - gap) / 2;   // 480
        const tH = H - outer * 2;               // 1840
        const ty = outer;
        const f = 18;                           // jarak garis frame dalam
        const frameW = tW - f * 2;
        const frameH = tH - f * 2;
        const frameY = ty + f;

        const titleH = 150, infoH = 150, saveH = 70, brandH = 190;
        const infoTop = frameY + titleH;
        const infoBottom = infoTop + infoH;
        const saveBottom = frameY + frameH - brandH;
        const saveTop = saveBottom - saveH;

        const photosTop = infoBottom + 24;
        const photosBottom = saveTop - 24;
        const pGap = 16;
        const pad = 28;
        const pW = frameW - pad * 2;
        const pH = (photosBottom - photosTop - pGap * 3) / 4;
        const dateText = "Today, she turns";

        // ---------- Helper ----------
        function fitFont(text, makeFont, maxW, startSize) {
            let size = startSize;
            ctx.font = makeFont(size);
            while (ctx.measureText(text).width > maxW && size > 10) {
                size -= 2;
                ctx.font = makeFont(size);
            }
            return size;
        }

        function roundedRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        // Bentuk tiket: sudut cekung + tepi kiri/kanan bergerigi
        function ticketPath(x, y, w, h) {
            const cr = 34;      // radius sudut cekung
            const nr = 15;      // radius gerigi
            const n = Math.floor((h - cr * 2) / 50);
            const step = (h - cr * 2) / n;
            const centers = [];
            for (let k = 0; k < n; k++) centers.push(y + cr + step * (k + 0.5));

            ctx.beginPath();
            ctx.moveTo(x + cr, y);
            ctx.lineTo(x + w - cr, y);
            ctx.arc(x + w, y, cr, Math.PI, Math.PI / 2, true);
            centers.forEach(cy => {
                ctx.lineTo(x + w, cy - nr);
                ctx.arc(x + w, cy, nr, -Math.PI / 2, Math.PI / 2, true);
            });
            ctx.lineTo(x + w, y + h - cr);
            ctx.arc(x + w, y + h, cr, -Math.PI / 2, -Math.PI, true);
            ctx.lineTo(x + cr, y + h);
            ctx.arc(x, y + h, cr, 0, -Math.PI / 2, true);
            for (let k = centers.length - 1; k >= 0; k--) {
                const cy = centers[k];
                ctx.lineTo(x, cy + nr);
                ctx.arc(x, cy, nr, Math.PI / 2, -Math.PI / 2, true);
            }
            ctx.lineTo(x, y + cr);
            ctx.arc(x, y, cr, Math.PI / 2, 0, true);
            ctx.closePath();
        }

        function hLine(x1, x2, y) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        }
        function vLine(x, y1, y2) {
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
        }

        function drawTicket(tx) {
            const fx = tx + f;
            const cx = fx + frameW / 2;

            // Badan tiket
            ticketPath(tx, ty, tW, tH);
            ctx.fillStyle = CREAM;
            ctx.fill();

            // Garis frame dalam
            ctx.strokeStyle = INK;
            ctx.lineWidth = 3.5;
            roundedRect(fx, frameY, frameW, frameH, 16);
            ctx.stroke();

            ctx.lineWidth = 3;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = INK;

            // Judul
            fitFont("Birthday Girl", s => `italic ${s}px ${SERIF}`, frameW - 60, 100);
            ctx.fillText("Birthday Girl", cx, frameY + titleH / 2 + 4);

            // Baris info
            hLine(fx, fx + frameW, infoTop);
            hLine(fx, fx + frameW, infoBottom);
            const c1 = frameW * 0.24;
            const c2 = frameW * 0.24;
            const c3 = frameW - c1 - c2;
            const x1 = fx + c1;
            const x2 = x1 + c2;
            vLine(x1, infoTop, infoBottom);
            vLine(x2, infoTop, infoBottom);
            hLine(x2, fx + frameW, infoTop + infoH / 2);

            ctx.font = `30px ${SERIF}`;
            ctx.fillText("Row", fx + c1 / 2, infoTop + 38);
            ctx.fillText("Show", x1 + c2 / 2, infoTop + 38);
            ctx.font = `74px ${SERIF}`;
            ctx.fillText("02", fx + c1 / 2, infoTop + 106);
            ctx.fillText("12", x1 + c2 / 2, infoTop + 106);

            const c3x = x2 + c3 / 2;
            fitFont(dateText, s => `${s}px ${SERIF}`, c3 - 24, 34);
            ctx.fillText(dateText, c3x, infoTop + infoH / 4 + 2);
            ctx.font = `bold 44px ${SERIF}`;
            ctx.fillText("25th", c3x, infoTop + (infoH * 3) / 4 + 2);

            // Strip "SAVE THE BEST MOMENT"
            hLine(fx, fx + frameW, saveTop);
            hLine(fx, fx + frameW, saveBottom);
            const saveText = "May your new age bring you happiness.";
            fitFont(saveText, s => `${s}px ${SERIF}`, frameW - 30, 26);
            ctx.fillText(saveText, cx, saveTop + saveH / 2 + 2);

            // Brand: "with love."
                        let size = 90;
            let w1, w2;
            const gapW = 24;   // jarak antara "Gaby's" dan "Day." (ubah sesuai selera)
            do {
                ctx.font = `italic ${size}px ${SERIF}`;
                w1 = ctx.measureText("Gaby's").width;
                ctx.font = `bold ${size}px Poppins, Arial, sans-serif`;
                w2 = ctx.measureText("Day.").width;
                if (w1 + gapW + w2 <= frameW - 50) break;
                size -= 2;
            } while (size > 20);
            const startX = cx - (w1 + gapW + w2) / 2;
            const brandY = saveBottom + brandH / 2 + 4;
            ctx.textAlign = "left";
            ctx.font = `italic ${size}px ${SERIF}`;
            ctx.fillText("Gaby's", startX, brandY);
            ctx.font = `bold ${size}px Poppins, Arial, sans-serif`;
            ctx.fillText("Day.", startX + w1 + gapW, brandY);
            ctx.textAlign = "center";
        }

        // ---------- Gambar ----------
        ctx.fillStyle = MAROON;
        ctx.fillRect(0, 0, W, H);

        drawTicket(outer);
        drawTicket(outer + tW + gap);

        // Foto: slotIndex 0-7 -> baris = slot/2, kolom (tiket) = slot%2
        const images = await Promise.all(photos.map(loadImage));

        for (let slotIndex = 0; slotIndex < TOTAL_PHOTOS * 2; slotIndex++) {
            const row = Math.floor(slotIndex / 2);
            const col = slotIndex % 2;
            const img = images[layout[slotIndex]];

            const x = outer + col * (tW + gap) + f + pad;
            const y = photosTop + row * (pH + pGap);

            // Crop tengah agar memenuhi area
            const scale = Math.max(pW / img.width, pH / img.height);
            const sw = pW / scale;
            const sh = pH / scale;
            const sx = (img.width - sw) / 2;
            const sy = (img.height - sh) / 2;

            ctx.drawImage(img, sx, sy, sw, sh, x, y, pW, pH);

            ctx.strokeStyle = INK;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, pW, pH);
        }

        return canvas;
    }

    async function downloadPhoto() {
        if (photos.length !== TOTAL_PHOTOS) return;

        downloadButton.disabled = true;
        setStatus("Preparing your photo strip...");

        try {
            const canvas = await makePhotoStrip();

            // 1. Upload ke Google Drive
            if (GOOGLE_DRIVE_WEB_APP_URL) {
                setDriveStatus("Processing photo...");
                try {
                    await uploadCanvasToDrive(canvas);
                    setDriveStatus("Upload request completed. Please check your devices.");
                } catch (uploadError) {
                    console.error("Google Drive upload error:", uploadError);
                    setDriveStatus("Process failed. Please try again.");
                }
            }

            // 2. Download ke perangkat (1080x1920)
            const link = document.createElement("a");
            link.download = `birthday-photobooth-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus("Your photo strip download has started. ♡");
        } catch (error) {
            console.error(error);
            setStatus("Tidak bisa membuat hasil foto. Silakan coba lagi.");
        } finally {
            downloadButton.disabled = photos.length !== TOTAL_PHOTOS;
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
        setStatus("Ready for another round! Take your four photos when you're ready.");
        startSession();
    });
    downloadButton.addEventListener("click", downloadPhoto);

    renderSlots();
    window.addEventListener("beforeunload", () => {
        if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    });
})();
