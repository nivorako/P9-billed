/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import {bills} from "../fixtures/bills.js"
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        await waitFor(() => screen.getByTestId('icon-window'))
        const windowIcon = screen.getByTestId('icon-window')
        //to-do write expect expression
        // windowIcon contains active-icon which highlight icon
        expect(windowIcon.classList.contains("active-icon")).toBe(true)
        })
        
        test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        // const antiChrono = (a, b) => ((a < b) ? -1 : 1)
        // 
        const antiChrono = (a, b) => (b - a)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
        })
    })

    describe("when i click on 'nouvelle note de frais' ", () => {
        test("then newBill page appears", () => {
            // simuler les données local storage
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            const billsPage = new Bills({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage
            })
            // la fonction à tester est handleClick...
            const openNewBill = jest.fn(billsPage.handleClickNewBill)
            // 
            const btnNewBill = screen.getByTestId("btn-new-bill")
            // ecouter evt
            btnNewBill.addEventListener('click', openNewBill)
            // simuler evt
            fireEvent.click(btnNewBill)
            // expect 
            expect(openNewBill).toHaveBeenCalled()
            expect(screen.findByText(" Envoyer une note de frais ")).toBeTruthy()
        })
    })
   
})

