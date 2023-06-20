import { DatasourceType, Panel, PanelType } from "types/dashboard";
import { initPanelPlugins } from "./initPlugins";
import { initPanelStyles } from "./initStyles";

export const initPanel = (id?) =>  {
    const type = PanelType.Text
    const p: Panel = {
        desc: "",
        collapsed: false,
        type: type,
        gridPos: { x: 0, y: 0, w: 12, h: 8 },
        plugins:  {
            [type]:initPanelPlugins[type]
        },
        datasource:initDatasource,
        styles: initPanelStyles
    }

    if (id) {
        p.id = id,
        p.title = `New panel ${id}`
    }

    return p
} 


export const initDatasource = {
    type: DatasourceType.TestData,
    queryOptions: {
        interval: '15s'
    },
    queries: [
        {
            id: 65,
            metrics: "",
            legend: "" ,
            visible: true
        }
    ]
}