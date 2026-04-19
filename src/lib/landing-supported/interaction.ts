export type Supported = {
    label: string
    name: string
    color: string
    ext?: string
    future?: boolean
}

export default () => {
    const container = document.querySelector('.container') as HTMLDivElement
    const data = container.dataset
    const supported = JSON.parse(data.supported ?? '[]') as Supported[]
    const entries = container.children as Iterable<HTMLDivElement>
    const codes = supported.map(s => document.querySelector(`.code-${s.label}`)) as HTMLDivElement[]
    const translations = document.querySelector('.translations-container') as HTMLDivElement

    for (const [i, item] of Array.from(entries).entries()) {
        item.addEventListener('click', () => {
            for (const [j, itm] of Array.from(entries).entries()) {
                const imgContainer = itm.children[0] as HTMLDivElement
                const img = imgContainer.children[0] as HTMLImageElement
                const name = itm.children[1] as HTMLSpanElement
                if (i !== j) {
                    imgContainer.style = ''
                    name.style = ''
                    if (!supported[j].future) {
                        img.style = data.inactivesty!
                    }
                    codes[j]!.style.display = 'none'
                    continue
                }
                if (supported[i].future) {
                    img.style = data.futuresty!
                    translations.style = data.futuresty!
                } else {
                    img.style = ''
                    translations.style = ''
                }
                codes[i].style = ''
                imgContainer.style.borderColor = supported[i].color
                name.style.color = supported[i].color
            }
        })
    }
}
