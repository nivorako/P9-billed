/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { screen, fireEvent } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES, ROUTES_PATH} from '../constants/routes.js'
import mockStore from '../__mocks__/store.js'
import {localStorageMock} from '../__mocks__/localStorage.js'
import BillsUI from "../views/BillsUI.js"
import router from "../app/Router.js"

jest.mock('../app/store', () => mockStore)
// scénario 9
describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page, and try to download a file with extension different from jpeg, jpg or png", () => {
        test("Then an error message appear, you cannot download", () => {
           
            const html = NewBillUI()
            document.body.innerHTML = html
            //to-do write assertion
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname})
            }
            const newBill = new NewBill({ 
                document,
                onNavigate,
                store: mockStore,
                localStorage: window, localStorage,
            })
            const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
            const fichier = screen.getByTestId("file")
            // le format n'est pas valide
            const file = new File(["c'est un test"],"document.txt", {
            type: "document/txt"
            })
            fichier.addEventListener("change", LoadFile)
            fireEvent.change(fichier, {target: {files: [file]}})
            
            expect(LoadFile).toHaveBeenCalled()

            expect(screen.getByText("Choisissez un format jpeg, png ou jpg")).toBeTruthy()
        })
    })

    // scénario 10
    describe("When i download the attached file in the correct format", () => {
        test("the new bill is sent", () => {
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const html = NewBillUI()
            document.body.innerHTML = html
            //to-do write assertion
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname})
            }
            const newBill = new NewBill({ 
                document,
                onNavigate,
                store: mockStore,
                localStorage: window, localStorage,
            })
            const LoadFile = jest.fn((e) => newBill.handleChangeFile(e))
            const fichier = screen.getByTestId("file")
            // le format est valide
            const file = new File(["c'est un test"],"image.jpg", {
            type: "image/jpg"
            })
            fichier.addEventListener("change", LoadFile)
            fireEvent.change(fichier, {target: {files: [file]}})
            // le fichier est bien telechargé
            expect(LoadFile).toHaveBeenCalled()
            // le fichier téléchargé est conforme à la condition du test
            expect(fichier.files[0]).toStrictEqual(file)

            const formNewBill = screen.getByTestId('form-new-bill')
            // simuler handleSubmit
            const sendNewBill = jest.fn((e) => newBill.handleSubmit(e))
            // ecouter evt submit
            formNewBill.addEventListener('submit', sendNewBill)
            // simuler evt
            fireEvent.submit(formNewBill)
            // expect la page d'acceuil "mes notes de frais" apparait
            expect(sendNewBill).toHaveBeenCalled()
            expect(screen.getByText('Mes notes de frais')).toBeTruthy()
        })
    })
})

describe('Given I am connected as an employéé and on NewBill page', () => {
    beforeEach(() => {
        const html = NewBillUI()
        document.body.innerHTML = html
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock
        })
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
                email: "email@email.com",
            })
        )
        
    })
    afterEach(() => {
        localStorage.clear()
    })
   
    // describe('When I submit a valid form', () => {
    //     it('Then a new bill should have been added', () => {
    //         // AS WE CALL A CLASS WITH PARAMETERS WE CALL THIS CLASS
    //         const onNavigate = (pathname) => {
    //             document.body.innerHTML = ROUTES({ pathname })
    //         }
    //         const newBill = new NewBill({
    //           document,
    //           onNavigate,
    //           store: mockStore,
    //           localStorage: window.localStorage,
    //         })
      
    //         // THE DOM'S ELEMENTS
    //         const formulaire = screen.getByTestId('form-new-bill')
    //         const inputSelect = screen.getByTestId('expense-type')
    //         const inputName = screen.getByTestId('expense-name')
    //         const inputDate = screen.getByTestId('datepicker')
    //         const inputAmount = screen.getByTestId('amount')
    //         const inputVAT = screen.getByTestId('vat')
    //         const inputPCT = screen.getByTestId('pct')
    //         const inputCom = screen.getByTestId('commentary')
    //         const inputFile = screen.getByTestId('file')
      
    //         const file = new File(['img'], 'bill.jpg', { type: 'image/jpg' })
      
    //         // THE EXPECTED FORMAT OF THE FORM
    //         const formValues = {
    //           type: 'Fornitures de bureau',
    //           name: 'Bureau en bois de teck',
    //           date: '2022-10-01',
    //           amount: '150',
    //           vat: 20,
    //           pct: 10,
    //           commentary: 'Bureau du chef de projet',
    //           file: file,
    //         }
      
    //         // https://testing-library.com/docs/dom-testing-library/api-events/#fireeventeventname
    //         // fireEvent.change(inputSelect, { target: { value: formValues.type } })
    //         // fireEvent.change(inputName, { target: { value: formValues.name } })
    //         // fireEvent.change(inputDate, { target: { value: formValues.date } })
    //         // fireEvent.change(inputAmount, { target: { value: formValues.amount } })
    //         // fireEvent.change(inputVAT, { target: { value: formValues.vat } })
    //         // fireEvent.change(inputPCT, { target: { value: formValues.pct } })
    //         // fireEvent.change(inputCom, { target: { value: formValues.commentary } })
    //         // userEvent.upload(inputFile, formValues.file)
      
    //         // SIMULATION OF FUNCTION + LISTENER + SUBMIT
    //         // const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
    //         // formulaire.addEventListener('submit', handleSubmit)
    //         // fireEvent.submit(formulaire)
      
    //         //expect(handleSubmit).toHaveBeenCalled()
    //         //expect(inputSelect.validity.valid).not.toBeTruthy()
    //         // expect(inputName.validity.valid).toBeTruthy()
    //         // expect(inputDate.validity.valid).toBeTruthy()
    //         // expect(inputVAT.validity.valid).toBeTruthy()
    //         // expect(inputPCT.validity.valid).toBeTruthy()
    //         // expect(inputCom.validity.valid).toBeTruthy()
    //         // expect(inputFile.files[0]).toBeDefined()      
    //       })
    // })

    describe("When an error 404 occurres on submit", () => {
        it("Then a warning should be displayed on console", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            })
        
                // ERROR SIMULATION
                jest.spyOn(mockStore, 'bills')
                console.error = jest.fn()
            
                // mockImplementationOnce : Accepts a function that will be used as an implementation of the mock for one call to the mocked function. 
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                    update: () => {
                        return Promise.reject(new Error('Erreur 404'))
                    },
                }
            })
        
                const formulaire = screen.getByTestId('form-new-bill')
                const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
                formulaire.addEventListener('submit', handleSubmit)
                fireEvent.submit(formulaire)
            
                await new Promise(process.nextTick)
                expect(console.error).toBeCalled()
        })
    })
})
