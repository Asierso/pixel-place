let gradLoop = 0;
var gradColor = setInterval(() => {
    const gradColors = ["#f67171", "#fcb369", "#fdeb70", "#c1f87e", "#67f697", "#6ce8f7", "#6493f6", "#bb68f6"];
    const loaders = document.getElementsByClassName('loader');
    for (let i = 0; i < loaders.length; i++) {
        loaders[i].style.borderTopColor = gradColors[gradLoop];
    }
    gradLoop++;
    if (gradLoop >= gradColors.length)
        gradLoop = 0;
}, 1200);

window.onload = () => {
    var opacity = 1.0;
    var delay = 1;
    if (document.getElementById("overview").getAttribute("delay") != undefined)
        delay = parseInt(document.getElementById("overview").getAttribute("delay"));
    setTimeout(() => {
        const dissapearInterval = setInterval(() => {
            document.getElementById("overview").style.opacity = opacity;
            if (opacity > 0)
                opacity -= 0.1;
            else {
                document.getElementById("overview").remove();
                clearInterval(dissapearInterval);
            }
        }, 35);
    }, delay);
};