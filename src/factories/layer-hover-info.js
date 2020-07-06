import AuxLayerHoverInfo from "../components/LayerHoverInfo/AuxLayerHoverInfo"
import {LayerHoverInfoFactory} from "kepler.gl/components"

const CustomLayerHoverInfoFactory = () => AuxLayerHoverInfo

export function replaceLayerHoverInfo() {
    return [LayerHoverInfoFactory, CustomLayerHoverInfoFactory]
}
