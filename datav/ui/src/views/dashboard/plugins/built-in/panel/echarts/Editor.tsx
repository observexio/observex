// Copyright 2023 xObserve.io Team

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import CodeEditor from 'src/components/CodeEditor/CodeEditor'
import { cloneDeep, isFunction } from 'lodash'
import { memo, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import PanelAccordion from 'src/views/dashboard/edit-panel/Accordion'
import PanelEditItem from 'src/views/dashboard/edit-panel/PanelEditItem'
import { genDynamicFunction } from 'utils/dashboard/dynamicCall'
import { EchartsComponent } from './Echarts'
import { ColorModeSwitcher } from 'src/components/ColorModeSwitcher'
import React from 'react'
import { useStore } from '@nanostores/react'
import { commonMsg, echartsPanelMsg } from 'src/i18n/locales/en'
import { colors } from 'utils/colors'
import moment from 'moment'
import lodash from 'lodash'
import ThresholdEditor from 'src/views/dashboard/plugins/components/Threshold/ThresholdEditor'
import * as echarts from 'echarts'
import { dispatch } from 'use-bus'
import { PanelForceRebuildEvent } from 'src/data/bus-events'
import {
  UnitPicker,
  formatUnit,
} from 'src/views/dashboard/plugins/components/UnitPicker'
import { Units } from 'types/panel/plugins'
import { EditorNumberItem } from 'components/editor/EditorItem'
import { EchartsEditorProps, EchartsPanel as Panel } from './types'

const EchartsPanelEditor = memo(
  ({ panel, onChange, data }: EchartsEditorProps) => {
    const t = useStore(commonMsg)
    const t1 = useStore(echartsPanelMsg)
    return (
      <>
        <PanelAccordion title={t1.about}>
          <Text fontSize='sm'>{t1.aboutContent1} </Text>
          <Text mt='2' fontSize='sm'>
            {t1.officialSite}: https://echarts.apache.org/en/index.html
          </Text>
        </PanelAccordion>
        <PanelAccordion title={t1.settings}>
          <PanelEditItem title={t.animation} desc={t.animationTips}>
            <Switch
              defaultChecked={panel.plugins.echarts.animation}
              onChange={(e) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.animation = e.currentTarget.checked
                })
              }
            />
          </PanelEditItem>

          <PanelEditItem title={t1.allowEmptyData} desc={t1.allowEmptyDataTips}>
            <Switch
              isChecked={panel.plugins.echarts.allowEmptyData}
              onChange={(e) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.allowEmptyData = e.target.checked
                })
              }
            />
          </PanelEditItem>

          <SetOptions
            panel={panel}
            onChange={(v) => {
              onChange((panel: Panel) => {
                panel.plugins.echarts.setOptionsFunc = v
              })
            }}
            data={data}
          />
        </PanelAccordion>
        <PanelAccordion title={t.valueSettings}>
          <PanelEditItem title={t.unit}>
            <UnitPicker
              value={panel.plugins.echarts.value}
              onChange={(v: Units) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.value.units = v.units
                  panel.plugins.echarts.value.unitsType = v.unitsType
                })
              }
            />
          </PanelEditItem>

          <PanelEditItem title={t.decimal}>
            <EditorNumberItem
              value={panel.plugins.echarts.value.decimal}
              min={0}
              max={5}
              step={1}
              onChange={(v) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.value.decimal = v
                })
              }
            />
          </PanelEditItem>
        </PanelAccordion>
        <PanelAccordion title={t.interaction}>
          <PanelEditItem title={t.enable}>
            <Switch
              defaultChecked={panel.plugins.echarts.enableClick}
              onChange={(e) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.enableClick = e.currentTarget.checked
                  dispatch(PanelForceRebuildEvent + panel.id)
                })
              }
            />
          </PanelEditItem>

          <RegisterEvents
            panel={panel}
            onChange={(v) => {
              onChange((panel: Panel) => {
                panel.plugins.echarts.registerEventsFunc = v
              })
            }}
          />
        </PanelAccordion>
        <PanelAccordion title='Thresholds'>
          <ThresholdEditor
            value={panel.plugins.echarts.thresholds}
            onChange={(v) =>
              onChange((panel: Panel) => {
                panel.plugins.echarts.thresholds = v
              })
            }
          />

          <PanelEditItem title={t.enable}>
            <Switch
              defaultChecked={panel.plugins.echarts.enableThresholds}
              onChange={(e) =>
                onChange((panel: Panel) => {
                  panel.plugins.echarts.enableThresholds =
                    e.currentTarget.checked
                })
              }
            />
          </PanelEditItem>
        </PanelAccordion>
      </>
    )
  },
)

export default EchartsPanelEditor

const SetOptions = ({ panel, onChange, data }: EchartsEditorProps) => {
  const t = useStore(commonMsg)
  const t1 = useStore(echartsPanelMsg)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [temp, setTemp] = useState(panel.plugins.echarts.setOptionsFunc)
  const onSubmit = () => {
    onChange(temp)
    onClose()
  }

  const { colorMode } = useColorMode()

  const setOptions = genDynamicFunction(temp)
  let options

  if (isFunction(setOptions)) {
    try {
      let o = setOptions(
        cloneDeep(data.flat()),
        panel.plugins.echarts.thresholds,
        colors,
        echarts,
        lodash,
        moment,
        colorMode,
        {
          units: panel.plugins.echarts.value.units,
          decimal: panel.plugins.echarts.value.decimal,
          formatUnit: formatUnit,
        },
      )
      o.animation = false
      options = o
    } catch (error) {
      console.log('call setOptions error', error)
    }
  }

  return (
    <>
      <PanelEditItem title={t1.setOption} desc={t1.setOptionTips}>
        <Button size='sm' onClick={onOpen}>
          {t.editFunc}
        </Button>
      </PanelEditItem>
      <Modal isOpen={isOpen} onClose={onClose} size='full'>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pt='2' pb='0' px='0'>
            <Flex
              alignItems='center'
              justifyContent='space-between'
              height='40px'
              pl='5'
            >
              <Text textStyle='subTitle'> </Text>
              <HStack>
                <ColorModeSwitcher miniMode />
                <Button size='sm' onClick={onSubmit}>
                  {t.submit}
                </Button>
                <Button size='sm' onClick={onClose} variant='outline'>
                  {t.cancel}
                </Button>
              </HStack>
            </Flex>
            <HStack alignItems='top' height='calc(100vh - 50px)'>
              <Box width='45%'>
                <CodeEditor value={temp} onChange={(v) => setTemp(v)} />
              </Box>
              <Box width='55%'>
                <Box height='50%'>
                  <CodeEditor
                    value={
                      '//options return from setOptions func\n' +
                      JSON.stringify(options, null, 2)
                    }
                    language='json'
                    readonly
                  />
                </Box>
                <Box key={colorMode} height='50%'>
                  {options && (
                    <AutoSizer>
                      {({ width, height }) => {
                        return (
                          <EchartsComponent
                            options={options}
                            theme={colorMode}
                            width={width}
                            height={height}
                            onChartCreated={() => null}
                          />
                        )
                      }}
                    </AutoSizer>
                  )}
                </Box>
              </Box>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const RegisterEvents = ({ panel, onChange }: EchartsEditorProps) => {
  const t = useStore(commonMsg)
  const t1 = useStore(echartsPanelMsg)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [temp, setTemp] = useState(panel.plugins.echarts.registerEventsFunc)

  const onSubmit = () => {
    onChange(temp)
    onClose()
  }

  return (
    <>
      <PanelEditItem title={t1.regEvents} desc={t1.regEventsTips}>
        <Button size='sm' onClick={onOpen}>
          {t.editFunc}
        </Button>
      </PanelEditItem>
      <Modal isOpen={isOpen} onClose={onClose} size='full'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py='2'>
            {t1.editRegFunc}
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody pt='2' pb='0' px='0'>
            <Box height='400px'>
              <CodeEditor value={temp} onChange={(v) => setTemp(v)} />
            </Box>
            <Button onClick={onSubmit} width='100%'>
              {t.submit}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
