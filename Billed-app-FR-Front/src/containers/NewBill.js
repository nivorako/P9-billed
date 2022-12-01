import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        new Logout({ document, localStorage, onNavigate })
    }
    handleChangeFile = e => {
        e.preventDefault()
        const fileAlert = this.document.querySelector('.fileAlert')
        const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
        // tableau contenant les types autorisés
        const authorizedFile = ["image/jpg", "image/png", "image/jpeg"]
        // si file type correspond à un elt de type autorisé 
        console.log('file type: ', file.type)
        if (authorizedFile.includes(file.type)) {
            if(!fileAlert.classList.contains('hidden')) fileAlert.classList.add('hidden')
            const filePath = e.target.value.split(/\\/g)
            const fileName = filePath[filePath.length - 1]
            const formData = new FormData()
            const email = JSON.parse(localStorage.getItem("user")).email
            formData.append('file', file)
            formData.append('email', email)
            console.log("target: ", e.target.value)
            this.store
                .bills()
                .create({
                    data: formData,
                    headers: {
                        noContentType: true
                    }
                })
                .then(({ fileUrl, key }) => {
                    console.log('fileurl: ', fileUrl)
                    console.log('filename: ', fileName)
                    this.billId = key
                    this.fileUrl = fileUrl
                    this.fileName = fileName
                }).catch(error => console.error(error))
        }
        // sinon
        else{
           fileAlert.classList.remove("hidden")
            
        }
    }
    handleSubmit = e => {
        e.preventDefault()
        console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
        const email = JSON.parse(localStorage.getItem("user")).email
        const bill = {
            email,
            type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
            name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
            amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
            date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
            vat: e.target.querySelector(`input[data-testid="vat"]`).value,
            pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
            commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
            fileUrl: this.fileUrl,
            fileName: this.fileName,
            status: 'pending'
        }
        this.updateBill(bill)
        this.onNavigate(ROUTES_PATH['Bills'])
    }

    // not need to cover this function by tests
    updateBill = (bill) => {
        if (this.store) {
            this.store
                .bills()
                .update({ data: JSON.stringify(bill), selector: this.billId })
                .then(() => {
                    this.onNavigate(ROUTES_PATH['Bills'])
                })
                .catch(error => console.error(error))
        }
    }
}