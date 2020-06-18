export default function(sotaConfig){
    let colorStyle = "";

    for (const section of sotaConfig.sections){
        const sectionSlug = section.slug;
        colorStyle += `
        #sota-section-${sectionSlug}{
            background-color: ${section.colors[0]};
            color: ${section.colors[0]};
        }
        #sota-section-${sectionSlug} .sota-gen-bar, .sota-section-${sectionSlug} .sota-gen-bar{
            fill: ${section.colors[3]};
        }      
        #sota-navbar #sota-navbar-item-${sectionSlug}:hover, #sota-navbar #sota-navbar-item-${sectionSlug}.selected{
            background-color: ${section.colors[0]};            
        }
        @media (max-width: 1400px){
            #sota-navbar #sota-navbar-item-${sectionSlug}{
                background-color: ${section.colors[0]};            
            }        
        }
        `

        for (const i in section.colors){
        colorStyle+= `
        #sota-section-${sectionSlug} .sota-fill-${+i+1}, .sota-section-${sectionSlug} .sota-fill-${+i+1}{
            fill: ${section.colors[i]};
        }
        #sota-section-${sectionSlug} .sota-stroke-${+i+1}, .sota-section-${sectionSlug} .sota-stroke-${+i+1}{
            stroke: ${section.colors[i]};
        }
        `
        }
    }

    document.head.appendChild(document.createElement('style')).textContent = colorStyle;
}