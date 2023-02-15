/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {ROUTES, ROUTES_PATH} from '../constants/routes.js'
import mockStore from '../__mocks__/store.js'
import {localStorageMock} from '../__mocks__/localStorage.js'


describe("Given I am connected as an employee", () => {
    // scénario 7
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

    // scénario 8
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
    // scenario 9
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
    // scenario 10
    describe("When an error 500 occurres on submit", () => {
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
                        return Promise.reject(new Error('Erreur 500'))
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
