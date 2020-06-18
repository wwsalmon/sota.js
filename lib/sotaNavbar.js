export default function (sotaConfig, text="", logo=false, textLink=false, logoLink = false){
    const container = document.getElementById("sota-navbar");
    container.classList.add("sz-navbar");

    let navbarHTML = `
    <div class="sz-navbar-left sz-navbar-inner">
      <input type="checkbox" id="sz-navbar-check">
      <label for="sz-navbar-check" class="sz-navbar-hamburger">☰</label>`

    if (logo) navbarHTML += logoLink ?
        `<div class="sota-navbar-logo"><a href="${logoLink}"><img src="${logo}" alt="Navbar logo"></a></div>` :
        `<div class="sota-navbar-logo"><img src="${logo}" alt="Navbar logo"></div>`;

    navbarHTML += textLink ?
        `<div class="sota-navbar-text"><span><a href="${textLink}"><${text}</a></span></div>` :
        `<div class="sota-navbar-text"><span>${text}</span></div>`;

    navbarHTML += "<div class=\"sz-navbar-items\">";

    navbarHTML += textLink ?
        `<div class="sota-navbar-text sz-navbar-item"><span><a href="${textLink}"><${text}</a></span></div>` :
        `<div class="sota-navbar-text sz-navbar-item"><span>${text}</span></div>`;

    for (const section of sotaConfig.sections){
        navbarHTML += `<div class="sz-navbar-item" id="sota-navbar-item-${section.slug}"><a href="#sota-section-${section.slug}">${section.name}</a></div>`;
    }

    navbarHTML += "</div>";

    container.innerHTML = navbarHTML;

    // color changing on scroll

    const sectionElems = [];

    for (const section of sotaConfig.sections){
        sectionElems.push(document.getElementById("sota-section-" + section.slug));
    }

    console.log(sectionElems);

    window.onload = () => {
        changeColors();
    }

    window.addEventListener("scroll", () => {
        changeColors();
    })

    function changeColors(){
        if (window.innerWidth > 600){
            for (const i in sectionElems){
                const sectionElem = sectionElems[i];
                const section = sotaConfig.sections[i];
                const navbarItem = document.getElementById("sota-navbar-item-" + section.slug);
                if (window.scrollY >= sectionElem.offsetTop && window.scrollY < sectionElem.offsetTop + sectionElem.offsetHeight){
                    navbarItem.classList.add("selected");
                } else{
                    navbarItem.classList.remove("selected");
                }
            }
        }
    }

    const navbarItems = document.querySelectorAll("#sota-navbar .sz-navbar-item");
    const navbarCheck = document.getElementById("sz-navbar-check");

    for (let i = 0; i < navbarItems.length; i++){
        navbarItems[i].addEventListener("click", () => {
            changeColors();
            navbarCheck.checked = false;
        })
    }
}