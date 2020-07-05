import React from "react"
import { AddDataButtonFactory } from "kepler.gl/components"

// TODO: Use the normal "Add data" button again when loading modal fixed.
const CustomAddDataBtn = () => (<></>)
const customAddDataBtnFactory = () => CustomAddDataBtn

export function replaceAddDataBtn() {
    return [AddDataButtonFactory, customAddDataBtnFactory];
}
