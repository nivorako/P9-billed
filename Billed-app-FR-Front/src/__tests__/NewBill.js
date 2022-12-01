/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, and try to download a file with extension different from jpeg, jpg or png", () => {
    test("Then an error message appear, you cannot download", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const newbill = new NewBill()
      expect().toBe('')
    })
  })
})
