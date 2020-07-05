import React from "react"
import LoadingDialog from "../components/LoadingDialog"
import { LoadDataModalFactory } from "kepler.gl/components"


const CustomLoadDataModal = () => (<LoadingDialog />)
const customLoadDataModalFactory = () => CustomLoadDataModal;

export function replaceLoadDataModal() {
    return [LoadDataModalFactory, customLoadDataModalFactory];
}
