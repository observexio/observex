// Copyright (c) 2019 Uber Technologies, Inc.
//

import * as React from 'react'
import SvgEdge from './SvgEdge'
import { isSamePropSetter } from './utils'
export default class SvgEdges extends React.Component {
  shouldComponentUpdate(np) {
    const p = this.props
    return (
      p.getClassName !== np.getClassName ||
      p.layoutEdges !== np.layoutEdges ||
      p.markerEndId !== np.markerEndId ||
      p.markerStartId !== np.markerStartId ||
      p.renderUtils !== np.renderUtils ||
      !isSamePropSetter(p.setOnEdge, np.setOnEdge)
    )
  }
  render() {
    const {
      getClassName,
      layoutEdges,
      markerEndId,
      markerStartId,
      renderUtils,
      setOnEdge,
    } = this.props
    return layoutEdges.map((edge) =>
      /*#__PURE__*/ React.createElement(SvgEdge, {
        key: `${edge.edge.from}\v${edge.edge.to}`,
        getClassName: getClassName,
        layoutEdge: edge,
        markerEndId: markerEndId,
        markerStartId: markerStartId,
        renderUtils: renderUtils,
        setOnEdge: setOnEdge,
      }),
    )
  }
}
