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
    }
})