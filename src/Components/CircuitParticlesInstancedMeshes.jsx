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
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
})

const CircuitParticlesInstancedMeshes = () => {
  const { scene, viewport, gl } = useThree()

  let iMeshRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now() // Start timing

    // console.log(circuitVertices)

    let separatedArray = []

    // const singleLine = addLines(circuitVertices[0])

    let trueLinePointsArray = []

    let allLines = []

    let numOfTrueLines = 0
    let currentOrientation = 'vertical'
    let prevOrientation = 'vertical'

    circuitVertices.forEach((pathArray, index) => {
      if (index > 0) {
        return
      }
      console.log(pathArray)

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

          console.log(subArray)
          pivotIndex = i
        }

        if (i === pathArray.length - 1) {
          console.log(pivotIndex)

          console.log(i)

          let subArray = pathArray.slice(pivotIndex)
          console.log(subArray)
        }

        prevOrientation = currentOrientation
      }
    })

    // console.log(numOfTrueLines)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      // scene.remove(singleLine)
    }
  }, [])

  const addLines = (vertices) => {
    let points = []

    vertices.forEach((vertex) => {
      points.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z))
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
