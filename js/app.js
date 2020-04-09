let DB

const form = document.querySelector('#form'),
        namePet = document.querySelector('#mascota'),
        nameClient = document.querySelector('#cliente'),
        phone = document.querySelector('#telefono'),
        date = document.querySelector('#fecha'),
        hour = document.querySelector('#hora'),
        symptom = document.querySelector('#sintomas'),
        quotes = document.querySelector('#citas'),
        heading = document.querySelector('#administra')

document.addEventListener('DOMContentLoaded', () => {
    let createDB = window.indexedDB.open('quotes', 1)

    createDB.onerror = () => {
        console.log(`Hubo un error.`)
    }

    createDB.onsuccess = () => {
        console.log('Todo listo.')
        DB = createDB.result
        getQuotes()
    }

    createDB.onupgradeneeded = e => {
        let db = e.target.result
        let objectStore = db.createObjectStore('quotes', { keyPath: 'key', autoIncrement: true })
        objectStore.createIndex('pet', 'pet', { unique: false })
        objectStore.createIndex('client', 'client', { unique: false })
        objectStore.createIndex('phone', 'phone', { unique: false })
        objectStore.createIndex('date', 'date', { unique: false })
        objectStore.createIndex('hour', 'hour', { unique: false })
        objectStore.createIndex('symptom', 'symptom', { unique: false })

        console.log(`DB is ready...`)
    }
    form.addEventListener('submit', addData)

    function addData(e) {
        e.preventDefault()
        const newQuote = {
            pet: namePet.value,
            client: nameClient.value,
            phone: phone.value,
            date: date.value,
            hour: hour.value,
            symptom: symptom.value
        }

        let trans = DB.transaction(['quotes'], 'readwrite')
        let objectStore = trans.objectStore('quotes')
        let req = objectStore.add(newQuote)

        req.onsuccess = () => {
            form.reset()
        }

        trans.oncomplete = () => {
            console.log('Cita agregada')
            getQuotes()
        }

        trans.onerror = () => {
            console.log('Hubo un error')
        }
    }

    function getQuotes() {
        while (quotes.firstChild) {
            quotes.removeChild(quotes.firstChild)
        }

        let objectStore = DB.transaction(['quotes']).objectStore('quotes')

        objectStore.openCursor().onsuccess = e => {
            let cursor = e.target.result
            if (cursor) {
                let quoteHTML = document.createElement('li')

                quoteHTML.setAttribute('data-cita-id', cursor.value.key)
                quoteHTML.classList.add('list-group-item')

                quoteHTML.innerHTML = `
                    <p class="font-weight-bold">
                        Mascota:
                        <span class="font-weight-normal">
                            ${cursor.value.pet}
                        </span>
                    </p>
                    <p class="font-weight-bold">
                        Cliente:
                        <span class="font-weight-normal">
                            ${cursor.value.client}
                        </span>
                    </p>
                    <p class="font-weight-bold">
                        Teléfono:
                        <span class="font-weight-normal">
                            ${cursor.value.phone}
                        </span>
                    </p>
                    <p class="font-weight-bold">
                        Fecha:
                        <span class="font-weight-normal">
                            ${cursor.value.date}
                        </span>
                    </p>
                    <p class="font-weight-bold">
                        Hora:
                        <span class="font-weight-normal">
                            ${cursor.value.hour}
                        </span>
                    </p>
                    <p class="font-weight-bold">
                        Síntoma:
                        <span class="font-weight-normal">
                            ${cursor.value.symptom}
                        </span>
                    </p>
                `
                const btnDlt = document.createElement('button')
                btnDlt.classList.add('borrar', 'btn', 'btn-danger')
                btnDlt.innerHTML = `
                    <span aria-hidden="true">
                        X
                    </span> Borrar
                `
                btnDlt

                quotes.appendChild(quoteHTML)
                cursor.continue()
            } else {
                if (!quotes.firstChild) {
                    heading.textContent = 'Agrega citas para comenzar'
                    let list = document.createElement('p')
                    list.classList.add('text-center')
                    list.textContent = 'No hay registros'
                    quotes.appendChild(list)
                } else {
                    heading.textContent = 'Administra tus citas'
                }
            }
        }
    }

    function deleteQuote(e) {
        let quoteId = Number(e.target.parentElement.getAttribute('data-cita-id'))
        let trans = DB.transaction(['quotes'], 'readwrite')
        let objectStore = trans.objectStore('quotes')

        let req = objectStore.delete(quoteId)

        trans.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement)
            console.log(`Se ha eliminado la cita con id: ${quoteId}`)

            if (!quotes.firstChild) {
                heading.textContent = 'Agrega citas para comenzar'
                let list = document.createElement('p')
                list.classList.add('text-center')
                list.textContent = 'No hay registros'
                quotes.appendChild(list)
            } else {
                heading.textContent = 'Administra tus citas'
            }
        }
    }
 })