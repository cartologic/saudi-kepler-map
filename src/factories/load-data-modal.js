import CustomLoadDataModal from "../components/CustomLoadDataModal"
import { LoadDataModalFactory } from "kepler.gl/components"


const customLoadDataModalFactory = () => CustomLoadDataModal;

export function replaceLoadDataModal() {
    return [LoadDataModalFactory, customLoadDataModalFactory];
}
