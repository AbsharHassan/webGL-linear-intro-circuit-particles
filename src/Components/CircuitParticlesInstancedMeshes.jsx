import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import {
  Circle,
  Line,
  OrbitControls,
  Plane,
  RenderTexture,
  Sphere,
  shaderMaterial,
} from '@react-three/drei'
import gsap from 'gsap'

import { circuitVertices } from '../circuitVertices'

const heightSegments = 64
const widthSegments = 64
const gridWidth = 2
const gridHeight = 1.5
const xGap = gridWidth / widthSegments
const yGap = gridHeight / heightSegments
const LINE_WIDTH = 0.0125

let vec = new THREE.Vector3()
const dummyObj3D = new THREE.Object3D()

const lineMaterialNew = new THREE.LineBasicMaterial({
  color: 0xff0000,
})
const lineMaterialOld = new THREE.LineBasicMaterial({
  color: 0x00ffff,
})

const CircuitParticlesInstancedMeshes = () => {
  const { scene, viewport, gl } = useThree()

  const [iMeshCount, setIMeshCount] = useState(null)
  let trueLinePointsArray = useRef([])

  let iMeshRef = useRef(null)

  function consolidateLines(points) {
    const lines = []

    if (points.length < 2) {
      return lines
    }

    let startPoint = points[0]

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currPoint = points[i]

      if (
        (prevPoint.x === currPoint.x && startPoint.x === prevPoint.x) ||
        (prevPoint.y === currPoint.y && startPoint.y === prevPoint.y)
      ) {
        continue
      } else {
        lines.push({ start: startPoint, end: prevPoint })
        startPoint = prevPoint
      }
    }

    lines.push({ start: startPoint, end: points[points.length - 1] })

    return lines
  }

  useEffect(() => {
    const startTime = performance.now() // Start timing

    let trueLinesCount = 0

    let oldLines = []
    let newLines = []

    circuitVertices.forEach((pathArray) => {
      oldLines.push(addLines(pathArray, lineMaterialOld))

      let lines = consolidateLines(pathArray)

      trueLinesCount += lines.length

      trueLinePointsArray.current.push(lines)
    })

    newLines = trueLinePointsArray.current.map((linesArray) => {
      let lines = []
      linesArray.forEach((line) => {
        lines.push(addLinesNew(line, lineMaterialNew))
      })
      return lines
    })

    setIMeshCount(trueLinesCount)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      if (newLines.length) {
        newLines.forEach((line) => {
          scene.remove(line)
        })
      }
      if (oldLines.length) {
        oldLines.forEach((line) => {
          scene.remove(line)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (!iMeshCount) return

    let iMeshIndex = 0

    trueLinePointsArray.current.map((lines) => {
      lines.forEach((line) => {
        let start = line.start
        let end = line.end

        if (start.y === end.y) {
          let scaleFactor = (end.x - start.x) / xGap

          console.log(scaleFactor)

          dummyObj3D.position.set(
            start.x + (xGap * scaleFactor) / 2,
            start.y,
            0
          )
          dummyObj3D.scale.set(scaleFactor, 1, 1)

          dummyObj3D.updateMatrix()

          iMeshRef.current.setMatrixAt(iMeshIndex, dummyObj3D.matrix)
        } else if (start.x === end.x) {
          // console.log('vertical')
        }
        iMeshIndex++
        // console.log(line)
      })
    })
    iMeshRef.current.instanceMatrix.needsUpdate = true
  }, [iMeshCount])

  const addLines = (vertices, lineMaterial) => {
    let points = []

    vertices.forEach((vertex) => {
      let z = 0
      if (lineMaterial.color.r === 1) {
        z = 0.0006
      }
      points.push(new THREE.Vector3(vertex.x, vertex.y, z))
    })

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, lineMaterial)
    scene.add(line)

    return line
  }

  const addLinesNew = (linePoints, lineMaterial) => {
    let points = []

    points.push(
      new THREE.Vector3(linePoints.start.x, linePoints.start.y, 0.0006)
    )
    points.push(new THREE.Vector3(linePoints.end.x, linePoints.end.y, 0.0006))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, lineMaterial)
    scene.add(line)

    return line
  }

  return (
    <>
      <OrbitControls />
      <axesHelper />

      <Plane
        args={[gridWidth, gridHeight, widthSegments, heightSegments]}
        // visible={false}
      >
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.05}
        />
      </Plane>

      <instancedMesh
        ref={iMeshRef}
        args={[null, null, iMeshCount]}
      >
        <boxGeometry args={[xGap, LINE_WIDTH, 0]} />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesInstancedMeshes
