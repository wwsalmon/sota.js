import * as d3 from "d3";
// import * as Masonry from "masonry-layout";

/**
 * Function to generate masonry layout on sota containers and modules
 */
function sotaMasonry(){
    const sections = document.querySelectorAll(".sota-section-inner");

    sections.forEach((e) => {
        if (e.classList.contains("sota-content-section")) return;

        let count = 0;
        const total = e.querySelectorAll(".sota-module svg").length;

        if (total === 0){
            const msnry = new Masonry(e, {
                itemSelector: ".sota-module",
                columnWidth: ".sota-module",
                gutter: 48
            })
            return;
        }

        const loading = document.createElement("p");
        loading.innerHTML = "Loading...";
        loading.classList.add("sota-loading");

        e.prepend(loading);

        e.addEventListener("sotaChartRendered", () => {
            count++;

            if (count === total) {
                e.classList.remove("sota-hide");

                const msnry = new Masonry(e, {
                    itemSelector: ".sota-module",
                    columnWidth: ".sota-module",
                    gutter: 48
                })
            }
        })
    })
}

/**
 * Function to render navbar. *Run after createSections*
 * @param sotaConfig - sotaConfig object
 * @param {string|boolean} [text=false] - Text to display in navbar
 * @param {string|boolean} [logo=false] - Relative path to logo to display in navbar
 * @param {string|boolean} [textLink=false] - Link for navbar text
 * @param {string|boolean} [logoLink=false] - Link for navbar logo
 */
function sotaNavbar(sotaConfig, text="", logo=false, textLink=false, logoLink = false){
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

/**
 * Function to render sections. *Run before sotaNavbar*
 * @param sotaConfig - sotaConfig object
 */
function createSections(sotaConfig){
    for (const section of sotaConfig.sections){
        const sectionSlug = section.slug;

        if (d3.select("body").select(`#sota-section-${sectionSlug}`).size() > 0){
            continue;
        }

        const container = d3.select("body")
            .append("div")
            .attr("id", `sota-section-${sectionSlug}`)
            .attr("class", "sota-section")

        container.append("h1").text(section.name);

        if (section.blurb !== undefined) container.append("p").text(section.blurb);

        const sectionClass = `sota-section-inner ${section.content ? "sota-content-section" : "sota-hide"}`;

        const sectionInner = container.append("div").attr("class", sectionClass);

        if (section.content) sectionInner.node().innerHTML = section.content;
    }
}

export {sotaMasonry, sotaNavbar, createSections}