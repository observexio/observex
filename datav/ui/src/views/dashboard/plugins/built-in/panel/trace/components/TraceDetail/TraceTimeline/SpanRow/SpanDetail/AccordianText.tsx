// Copyright (c) 2019 Uber Technologies, Inc.
//

import * as React from 'react'
import cx from 'classnames'
import TextList from './TextList'
import { TNil } from 'types/misc'
import { AiOutlineArrowDown, AiOutlineArrowRight } from 'react-icons/ai'
import { Box } from '@chakra-ui/react'

type AccordianTextProps = {
  className?: string | TNil
  data: string[]
  headerClassName?: string | TNil
  highContrast?: boolean
  interactive?: boolean
  isOpen: boolean
  label: React.ReactNode
  onToggle?: null | (() => void)
}

export default function AccordianText(props: AccordianTextProps) {
  const {
    className,
    data,
    headerClassName,
    highContrast,
    interactive,
    isOpen,
    label,
    onToggle,
  } = props
  const isEmpty = !Array.isArray(data) || !data.length
  const iconCls = cx('u-align-icon', {
    'AccordianKeyValues--emptyIcon': isEmpty,
  })
  let arrow: React.ReactNode | null = null
  let headerProps: Object | null = null
  if (interactive) {
    arrow = isOpen ? (
      <AiOutlineArrowDown className={iconCls} />
    ) : (
      <AiOutlineArrowRight className={iconCls} />
    )
    headerProps = {
      'aria-checked': isOpen,
      onClick: isEmpty ? null : onToggle,
      role: 'switch',
    }
  }
  return (
    <div className={className || ''}>
      <Box
        className={cx('AccordianText--header', headerClassName, {
          'is-empty': isEmpty,
          'is-high-contrast': highContrast,
          'is-open': isOpen,
        })}
        style={{
          cursor: 'pointer',
          overflow: 'hidden',
          padding: '0.25em 0.1em',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        _hover={{
          background: '#e8e8e8',
        }}
        {...headerProps}
      >
        {arrow} <strong>{label}</strong> ({data.length})
      </Box>
      {isOpen && <TextList data={data} />}
    </div>
  )
}

AccordianText.defaultProps = {
  className: null,
  highContrast: false,
  interactive: true,
  onToggle: null,
}
