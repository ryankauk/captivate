import React, { useEffect, useState, useRef } from 'react'
import throttle from 'lodash.throttle'

type Props = {
  type: 'vertical' | 'horizontal'
  thickness: number

  style: React.CSSProperties
  children: React.ReactElement[]
}

export default function SplitPane({type, thickness, style, children}: Props) {
  const v = type === 'vertical'

  const [split, setSplit] = useState(0.5)

  const container = useRef()

  const onMouseMove = (e:React.MouseEvent) => {
    update(e)
  }

  const onMouseUp = (e:React.MouseEvent) => {
    stopListening()
  }

  const onMouseLeave = (e:React.MouseEvent) => {
    stopListening()
  }

  const startListening = () => {
    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('mouseleave', onMouseLeave)
  }

  const stopListening = () => {
    document.body.removeEventListener('mousemove', onMouseMove)
    document.body.removeEventListener('mouseup', onMouseUp)
    document.body.removeEventListener('mouseleave', onMouseLeave)
  }

  const onMouseDown = (e:React.MouseEvent) => {
    e.preventDefault()
    startListening()
  }

  const update = (e:React.MouseEvent) => {
    const {x, y} = getRelativePosition(e, container.current)

    setSplit(v ? x : y)
  }

  function clamp(val: number, min: number, max: number) {
    if (val < min) return min
    if (val > max) return max
    return val
  }

  function getRatio(val: number, min: number, max: number, range: number) {
    return (clamp(val, min, max) - min) / range
  }

  function getRelativePosition(e:React.MouseEvent, elem: Element){
    const {width, height, left, top, right, bottom} =  elem.getBoundingClientRect()
    return {
      x: getRatio(e.clientX, left, right, width),
      y: getRatio(e.clientY, top, bottom, height)
    }
  }

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  const styles: {[key: string]: React.CSSProperties} = {
    root: {
      display: 'flex',
      flexDirection: v ? 'row' : 'column',
      height: '100%',
      width: '100%'
    },
    child1: {
      flex: `${split} 0 0`,
      height: v ? '100%' : undefined,
      width: v ? undefined : '100%'
    },
    child2: {
      flex: `${1 - split} 0 0`,
      height: v ? '100%' : undefined,
      width: v ? undefined : '100%'
    },
    divider: {
      width: v ? '10px' : '100%',
      height: v ? '100%' : '10px',
      // flex: '0 0 10px',
      cursor: v ? 'ew-resize' : 'ns-resize'
    }
  }

  return (
    <div style={style} ref={container}>
      <div style={styles.root}>
        <div style={styles.child1}>{children[0]}</div>
        <div style={styles.divider} onMouseDown={onMouseDown}></div>
        <div style={styles.child2}>{children[1]}</div>
      </div>
    </div>
  )
}
