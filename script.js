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