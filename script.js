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
   CLICK PHOTO EFFECT
========================================= */

const photos =
    document.querySelectorAll(".photo-card");


photos.forEach((photo) => {

    photo.addEventListener("click", () => {

        photo.classList.toggle("selected");

    });

});


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