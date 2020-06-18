export default function(){
    const sections = document.querySelectorAll(".sota-section-inner");

    sections.forEach((e) => {
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
        loading.classList.add("loading");

        e.prepend(loading);

        e.addEventListener("sotaChartRendered", () => {
            count++;

            if (count === total) {
                e.classList.remove("hide");

                const msnry = new Masonry(e, {
                    itemSelector: ".sota-module",
                    columnWidth: ".sota-module",
                    gutter: 48
                })
            }
        })
    })
}