import { Textarea } from "@chakra-ui/react"
import { EditorInputItem } from "components/editor/EditorItem"
import RadionButtons from "components/RadioButtons"
import PanelAccordion from "src/views/dashboard/edit-panel/Accordion"
import PanelEditItem from "src/views/dashboard/edit-panel/PanelEditItem"
import {  PanelEditorProps } from "types/dashboard"


const TextPanelEditor = ({panel,onChange}:PanelEditorProps) => {
    return (   <PanelAccordion title="Text setting">
        <PanelEditItem title="Content">
            <Textarea value={panel.plugins.text.md} onChange={(e) => {
                const v = e.currentTarget.value 
                onChange(panel => {
                    panel.plugins.text.md = v
                })
            }} />
        </PanelEditItem>

        <PanelEditItem title="Horizontal position">
            <RadionButtons options={[{ label: "Left", value: "left" }, { label: "Center", value: "center" },{ label: "Right", value: "right" }]} value={panel.plugins.text.justifyContent} onChange={v => onChange(panel => {
                    panel.plugins.text.justifyContent = v
                })} />

        </PanelEditItem>

        <PanelEditItem title="Vertical position">
            <RadionButtons options={[{ label: "Top", value: "top" }, { label: "Center", value: "center" },{ label: "Bottom", value: "bottom" }]} value={panel.plugins.text.alignItems} onChange={v => onChange(panel => {
                    panel.plugins.text.alignItems = v
                })} />

        </PanelEditItem>

        <PanelEditItem title="Font size">
            <EditorInputItem value={panel.plugins.text.fontSize} onChange={v => onChange(panel => {
                    panel.plugins.text.fontSize = v
                })} />
        </PanelEditItem>

        <PanelEditItem title="Font weight">
            <EditorInputItem value={panel.plugins.text.fontWeight} onChange={v => onChange(panel => {
                    panel.plugins.text.fontWeight = v
                })} />
        </PanelEditItem>
</PanelAccordion>
)
}

export default TextPanelEditor