// ============= SOUND EFFECTS =============

// A cinematic "fairy-tale magic" moment — original composition built entirely
// from oscillators (no samples, nothing copied from any film's actual score):
// a harp-like glissando, scattered twinkling sparkles, a warm sustained chord,
// and simple algorithmic reverb so it feels spacious rather than dry/flat.
function playMagicSparkle(){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1;

    // ---- simple reverb (feedback delay network) ----
    const reverbBus = ctx.createGain();
    reverbBus.gain.value = 0.35;
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.22;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 3500;
    reverbBus.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);
    masterGain.connect(ctx.destination);
    reverbBus.connect(masterGain);

    function pluck(freq, startTime, dur, vol, type){
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
        osc.connect(gain);
        gain.connect(masterGain);
        gain.connect(reverbBus);
        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
    }

    // ---- harp-like glissando run, climbing quickly (major scale) ----
    const glissando = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50, 1174.66, 1318.51];
    glissando.forEach((freq, i) => {
        pluck(freq, ctx.currentTime + i * 0.045, 0.9, 0.09, "triangle");
        pluck(freq * 2, ctx.currentTime + i * 0.045, 0.5, 0.02, "sine"); // octave shimmer
    });

    // ---- warm sustained chord underneath (like a magic "glow") ----
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C major-ish, bright
    chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = ctx.currentTime + 0.1;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.05, start + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.6);
        osc.connect(gain);
        gain.connect(masterGain);
        gain.connect(reverbBus);
        osc.start(start);
        osc.stop(start + 2.7);
    });

    // ---- scattered twinkling sparkles (randomized high pentatonic notes) ----
    const sparkleNotes = [1046.50, 1174.66, 1318.51, 1568.00, 1760.00, 2093.00];
    for (let i = 0; i < 14; i++){
        const freq = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
        const start = ctx.currentTime + 0.4 + Math.random() * 1.4;
        pluck(freq, start, 0.35, 0.045, "sine");
    }

    // ---- soft rising "wand whoosh" ----
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++){
        data[i] = (Math.random() * 2 - 1) * (i / bufferSize) * (1 - i / bufferSize) * 2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.8);
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
}

// A soft paper-rustle burst, also synthesized (filtered noise) — plays alongside the chime.
function playRustle(){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++){
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.value = 0.08;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
}

// ---- OPTIONAL: your own background music file ----
// 1. Put an mp3/ogg file (e.g. "music.mp3") in the same folder as index.html
// 2. Uncomment the line below
// const bgMusic = new Audio("music.mp3");
// bgMusic.loop = true;
// bgMusic.volume = 0.35;

let soundOn = true;

function toggleSound(btn){
    soundOn = !soundOn;
    btn.textContent = soundOn ? "🔊" : "🔇";
    // if (typeof bgMusic !== "undefined") soundOn ? bgMusic.play() : bgMusic.pause();
}

function openInvite(){
    document.getElementById("container").classList.add("open");
    if (soundOn){
        playRustle();
        setTimeout(playMagicSparkle, 200);
        // Uncomment if you added a bgMusic file above:
        // bgMusic.play();
    }
}
function createPetals(){
    for(let i=0;i<40;i++){
        let petal = document.createElement("div");
        petal.classList.add("petal");
        petal.style.left = Math.random()*100 + "vw";
        petal.style.animationDuration = (5 + Math.random()*7) + "s";
        petal.style.animationDelay = (Math.random()*6) + "s";
        petal.style.opacity = 0.3 + Math.random()*0.45;
        petal.style.transform = `scale(${0.5 + Math.random()*0.8})`;
        document.body.appendChild(petal);
    }
}
createPetals();
