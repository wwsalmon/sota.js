export default function(colorsArray){
    let colorStyle = "";

    for (const section in colorsArray){
        colorStyle += `#sota-section-${section}{
            background-color: ${colorsArray[section][0]};
            color: ${colorsArray[section][0]};
        }
        #sota-section-${section} .sota-gen-bar, .sota-section-${section} .sota-gen-bar{
            fill: ${colorsArray[section][3]};
        }
        `

        for (const i in colorsArray[section]){
        colorStyle+= `
        #sota-section-${section} .sota-fill-${+i+1}, .sota-section-${section} .sota-fill-${+i+1}{
            fill: ${colorsArray[section][i]};
        }
        #sota-section-${section} .sota-stroke-${+i+1}, .sota-section-${section} .sota-stroke-${+i+1}{
            stroke: ${colorsArray[section][i]};
        }
        `
        }
    }

    document.head.appendChild(document.createElement('style')).textContent = colorStyle;
}