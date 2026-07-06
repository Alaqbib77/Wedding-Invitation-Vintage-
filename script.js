function openInvite(){
    document.getElementById("container").classList.add("open");
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
