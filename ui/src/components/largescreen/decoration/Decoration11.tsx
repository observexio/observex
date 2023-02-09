import React, { useMemo, forwardRef } from 'react'



import classnames from 'classnames'

import { deepMerge } from '@jiaminghi/charts/lib/util/index'
import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'
import { fade } from '@jiaminghi/color'

import useAutoResize from '../autoResize'

import { DecorationProps } from '../types'
import { Box } from '@chakra-ui/react'

const defaultColor = ['#1a98fc', '#2cf7fe']

const Decoration11 = forwardRef(({ children, className, style, color = [] }:DecorationProps, ref) => {
  const { width, height, domRef } = useAutoResize(ref)

  const mergedColor = useMemo(() => deepMerge(deepClone(defaultColor, true), color || []), [color])

  const classNames = useMemo(() => classnames('dv-decoration-11', className), [
    className
  ])

  return (
    <Box className={classNames} style={style} ref={domRef} sx={cssStyles}>
      <svg width={width} height={height}>
        <polygon
          fill={fade(mergedColor[1] || defaultColor[1], 10)}
          stroke={mergedColor[1]}
          points={`20 10, 25 4, 55 4 60 10`}
        />

        <polygon
          fill={fade(mergedColor[1] || defaultColor[1], 10)}
          stroke={mergedColor[1]}
          points={`20 ${height - 10}, 25 ${height - 4}, 55 ${height - 4} 60 ${height - 10}`}
        />

        <polygon
          fill={fade(mergedColor[1] || defaultColor[1], 10)}
          stroke={mergedColor[1]}
          points={`${width - 20} 10, ${width - 25} 4, ${width - 55} 4 ${width - 60} 10`}
        />

        <polygon
          fill={fade(mergedColor[1] || defaultColor[1], 10)}
          stroke={mergedColor[1]}
          points={`${width - 20} ${height - 10}, ${width - 25} ${height - 4}, ${width - 55} ${height - 4} ${width - 60} ${height - 10}`}
        />

        <polygon
          fill={fade(mergedColor[0] || defaultColor[0], 20)}
          stroke={mergedColor[0]}
          points={`
            20 10, 5 ${height / 2} 20 ${height - 10}
            ${width - 20} ${height - 10} ${width - 5} ${height / 2} ${width - 20} 10
          `}
        />

        <polyline
          fill='transparent'
          stroke={fade(mergedColor[0] || defaultColor[0], 70)}
          points={`25 18, 15 ${height / 2} 25 ${height - 18}`}
        />

        <polyline
          fill='transparent'
          stroke={fade(mergedColor[0] || defaultColor[0], 70)}
          points={`${width - 25} 18, ${width - 15} ${height / 2} ${width - 25} ${height - 18}`}
        />
      </svg>

      <div className='decoration-content'>
        {children}
      </div>
    </Box>
  )
})


export default Decoration11


const cssStyles = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    
    '.decoration-content': {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    }
  }