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

let vec = new THREE.Vector3()
const dummyObj3D = new THREE.Object3D()
const lineMaterialNew = new THREE.LineBasicMaterial({
  color: 0xff0000,
})
const lineMaterialOld = new THREE.LineBasicMaterial({
  color: 0x00ffff,
})

console.log(lineMaterialNew.color)

const CircuitParticlesInstancedMeshes = () => {
  const { scene, viewport, gl } = useThree()

  let iMeshRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now() // Start timing

    console.log(circuitVertices)

    let separatedArray = []

    // const singleLine = addLines(circuitVertices[0])

    let trueLinePointsArray = []

    let oldLines = []

    let newLines = []

    let numOfTrueLines = 0
    let currentOrientation = 'vertical'
    let prevOrientation = 'vertical'

    circuitVertices.forEach((pathArray, index) => {
      // if (index !== 4) {
      //   return
      // }

      // console.log(pathArray)

      oldLines.push(addLines(pathArray, lineMaterialOld))

      const p1 = pathArray[0]
      const p2 = pathArray[1]

      if (p1.x === p2.x) {
        prevOrientation = 'vertical'
      } else if (p1.y === p2.y) {
        prevOrientation = 'horizontal'
      } else {
        console.log('something weird happened')
      }

      let pivotIndex = 0
      for (let i = 2; i < pathArray.length; i++) {
        const p1 = pathArray[i - 1]
        const p2 = pathArray[i]

        if (p1.x === p2.x) {
          currentOrientation = 'vertical'
        } else if (p1.y === p2.y) {
          currentOrientation = 'horizontal'
        } else {
          console.log('something weird happened')
        }

        // console.log(currentOrientation, i)

        if (currentOrientation !== prevOrientation) {
          numOfTrueLines++

          // console.log('direction changed', i)

          let subArray = pathArray.slice(pivotIndex, i)
          // if (subArray.length === 1) {
          //   subArray.unshift(pathArray[i - 2])
          // }

          trueLinePointsArray.push(subArray)

          pivotIndex = i
        }

        if (i === pathArray.length - 1) {
          let subArray = pathArray.slice(pivotIndex)
          // if (subArray.length === 1) {
          //   subArray.unshift(pathArray[i - 2])
          // }
          trueLinePointsArray.push(subArray)
          numOfTrueLines++
        }

        prevOrientation = currentOrientation
      }
    })

    console.log(trueLinePointsArray)

    console.log(numOfTrueLines)

    newLines = trueLinePointsArray.map((pointsArray) => {
      return addLines(pointsArray, lineMaterialNew)
    })

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      // scene.remove(singleLine)
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

  useFrame(({ clock }) => {})

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
    </>
  )
}

export default CircuitParticlesInstancedMeshes
