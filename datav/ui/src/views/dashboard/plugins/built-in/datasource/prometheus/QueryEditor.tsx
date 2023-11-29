// Copyright 2023 xObserve.io Team

import {
  Box,
  HStack,
  Input,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { PanelQuery } from 'types/dashboard'
import React from 'react'
import { Variant } from 'chakra-react-select/dist/types/types'
import { DatasourceEditorProps } from 'types/datasource'
import {
  queryPrometheusAllMetrics,
  queryPrometheusLabels,
} from './query_runner'
import ChakraSelect from 'src/components/select/ChakraSelect'
import FormItem from 'src/components/form/Item'
import { Form } from 'src/components/form/Form'
import InputSelect from 'src/components/select/InputSelect'
import { prometheusDsMsg } from 'src/i18n/locales/en'
import { useStore } from '@nanostores/react'
import CodeEditor, { LogqlLang } from 'src/components/CodeEditor/CodeEditor'
import { IsSmallScreen } from 'src/data/constants'
import Loading from 'components/loading/Loading'
import ExpandTimeline from '../../../components/query-edtitor/ExpandTimeline'

const PrometheusQueryEditor = ({
  datasource,
  query,
  onChange,
}: DatasourceEditorProps) => {
  const t1 = useStore(prometheusDsMsg)
  const [tempQuery, setTempQuery] = useState<PanelQuery>(cloneDeep(query))
  const [isSmallScreen] = useMediaQuery(IsSmallScreen)
  const isLargeScreen = !isSmallScreen
  return (
    <Form spacing={1}>
      <FormItem
        size='sm'
        title={
          <PromMetricSelect
            enableInput={false}
            width={isLargeScreen ? '300px' : '150px'}
            dsId={datasource.id}
            value={tempQuery.metrics}
            onChange={(v) => {
              setTempQuery({ ...tempQuery, metrics: v })
              onChange({ ...tempQuery, metrics: v })
            }}
          />
        }
      >
        <Box
          minWidth={isLargeScreen ? 'calc(100% - 330px)' : 'calc(100% - 180px)'}
        >
          <CodeEditor
            language={LogqlLang}
            value={tempQuery.metrics}
            onChange={(v) => {
              setTempQuery({ ...tempQuery, metrics: v })
            }}
            onBlur={() => {
              onChange(tempQuery)
            }}
            isSingleLine
            placeholder={t1.enterPromQL}
            height='31px'
          />
        </Box>
        {/* <Input
                    value={tempQuery.metrics}
                    onChange={(e) => {
                        setTempQuery({ ...tempQuery, metrics: e.currentTarget.value })
                    }}
                    onBlur={() => onChange(tempQuery)}
                    width="100%"
                    placeholder={t1.enterPromQL}
                    size="sm"
                /> */}
      </FormItem>
      <HStack>
        <FormItem labelWidth={'150px'} size='sm' title='Legend'>
          <Input
            value={tempQuery.legend}
            onChange={(e) => {
              setTempQuery({ ...tempQuery, legend: e.currentTarget.value })
            }}
            onBlur={() => onChange(tempQuery)}
            width='150px'
            placeholder={t1.legendFormat}
            size='sm'
          />
        </FormItem>
        {isLargeScreen && (
          <ExpandTimeline
            t1={t1}
            tempQuery={tempQuery}
            setTempQuery={setTempQuery}
            onChange={onChange}
          />
        )}
      </HStack>
      {!isLargeScreen && (
        <ExpandTimeline
          t1={t1}
          tempQuery={tempQuery}
          setTempQuery={setTempQuery}
          onChange={onChange}
        />
      )}
    </Form>
  )
}

export default PrometheusQueryEditor

interface MetricSelectProps {
  dsId: number
  value: string
  onChange: any
  width?: string
  variant?: Variant
  useCurrentTimerange?: boolean
  enableInput?: boolean
}

export const PromMetricSelect = ({
  dsId,
  value,
  onChange,
  width = '200px',
  variant = 'unstyled',
  useCurrentTimerange = true,
  enableInput = true,
}: MetricSelectProps) => {
  const t1 = useStore(prometheusDsMsg)
  const toast = useToast()
  const [metricsList, setMetricsList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const loadMetrics = async () => {
    if (metricsList.length > 0) {
      return
    }
    setLoading(true)
    const res = await queryPrometheusAllMetrics(dsId)
    setLoading(false)
    if (res.error) {
      toast({
        title: 'Error',
        description: res.error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }
    setMetricsList(res.data ?? [])
  }

  return (
    <Box onClick={loadMetrics} position='relative' width={width}>
      <InputSelect
        width={width}
        isClearable
        value={value}
        placeholder={t1.selecMetrics}
        variant={variant}
        size='md'
        options={metricsList.map((m) => {
          return { label: m, value: m }
        })}
        onChange={(v) => onChange(v)}
        enableInput={enableInput}
      />
      {loading && (
        <Box position='absolute' right='50%' top='6px  '>
          <Loading size='sm' />
        </Box>
      )}
    </Box>
  )
}

interface LabelSelectProps {
  dsId: number
  metric?: string
  value: string
  onChange: any
  width?: string
  variant?: Variant
  useCurrentTimerange?: boolean
}

export const PromLabelSelect = ({
  dsId,
  metric,
  value,
  onChange,
  width = '220px',
  variant = 'unstyled',
  useCurrentTimerange = true,
}: LabelSelectProps) => {
  const [labels, setLabels] = useState<string[]>([])
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLabels(true)
  }, [metric])

  const loadLabels = async (force?) => {
    if (!force && labels.length > 0) {
      return
    }
    setLoading(true)
    const res = await queryPrometheusLabels(dsId, metric)
    setLoading(false)
    if (res.error || !res.data) {
      setLabels([])
      return
    }

    setLabels(res.data)
  }

  return (
    <Box width={width} position='relative'>
      <ChakraSelect
        value={{ value: value, label: value }}
        placeholder='Metrics'
        variant={variant}
        size='md'
        options={labels.map((m) => {
          return { label: m, value: m }
        })}
        onChange={(v) => onChange(v)}
      />
      {loading && (
        <Box position='absolute' right='55%' top='6px  '>
          <Loading size='sm' />
        </Box>
      )}
    </Box>
  )
}
