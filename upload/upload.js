function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (teg, classes = [], content) => {
    const node = document.createElement(teg)
    if (classes.length) {
        node.classList.add(...classes)
    }
    if (content) {
        node.textContent = content
    }
    return node
}

function non () {}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? non
    const input = document.querySelector(selector)
    const open = element('button', ['btn'], 'Open')
    const preview = element('div', ['preview'])
    const upload = element('button', ['btn', 'primary'], 'Upload')
    upload.style.display = 'none'

    if (options.multi) {
        input.setAttribute('multiple', true)
    }
    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)

    const openInput = () => input.click()
    const changeHandler = event => {
        if (event.target.files.length === 0) {
            return
        }
        files = Array.from(event.target.files)

        preview.innerHTML = ''
        upload.style.display = 'inline'
        files.forEach(f => {
            if (!f.type.match('image')) {
                return
            }
            const reader = new FileReader()

            reader.onload = event => {
                preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">  
                    <div class="preview-remove" data-name="${f.name}">&times</div>              
                    <img src="${event.target.result}" alt="${f.name}"/>
                    <div class="preview-info">
                        <span>${f.name}</span>
                        <span>${bytesToSize(f.size)}</span>
                    </div>
                </div>
                `)
            }

            reader.readAsDataURL(f)
        })


    }

    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        }
        const {name} = event.target.dataset
        files=files.filter(f => f.name !== name)
        console.log(files.length)
        if (files.length === 0) {
            upload.style.display = 'none'
        }
        const remove = preview.querySelector(`[data-name="${name}"]`)
            .closest('.preview-image ')
        remove.classList.add('removing')
        setTimeout(() => {

            remove.remove()

        }, 250)

    }
    const clearPreview =element =>{
        element.style.bottom='4px'
        element.innerHTML =`<div class="preview-info-progress"></div>`
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e=>e.remove())
        const previewInfo = preview.querySelectorAll(".preview-info")
        previewInfo.forEach(clearPreview)
        onUpload(files,previewInfo)
    }

    open.addEventListener('click', openInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)

}