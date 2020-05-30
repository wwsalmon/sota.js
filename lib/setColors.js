export default function(colorsArray){
    let colorStyle = "";

    for (const section in colorsArray){
        colorStyle += `#${section}{
            background-color: ${colorsArray[section][0]};
            color: ${colorsArray[section][0]};
            }
            #${section} .sota-gen-bar{
                fill: ${colorsArray[section][3]};
            }
            `

        for (const i in colorsArray[section]){
            colorStyle+= `
            #${section} .module-fill-${+i+1}{
                fill: ${colorsArray[section][i]};
            }
            `
        }
    }

    document.head.appendChild(document.createElement('style')).textContent = colorStyle;
}