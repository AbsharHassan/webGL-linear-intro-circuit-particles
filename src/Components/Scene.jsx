import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Circle,
  Line,
  OrbitControls,
  Plane,
  RenderTexture,
  Sphere,
  shaderMaterial,
} from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import alea from 'alea'
import { createNoise2D } from 'simplex-noise'
import { createNoise3D } from 'simplex-noise'

import { circuitVertices } from '../circuitVertices'

import addSphere from '../helpers/addSphere'

import { degToRad } from 'three/src/math/MathUtils.js'
import getRandomFloat from '../helpers/getRandomFloat'
import getRandomInt from '../helpers/getRandomInt'
import MouseReveal from './MouseReveal'
import CurveTexture from './CurveTexture'
import RevealPlane from './RevealPlane'

// can also decide to create a new vertex or not based on probability. If no new vertex, then should maintain gradient
// make a square around the cursor or maze type walls? and then cycle the light pulses in that square
// should loop over and run the randomwalk algorithim and store all 'state' of a path and then animate over them
// change the algorithm such that when you move your mouse initially, it selects some random points on the mesh and then when you move your mouse a little, it changes the endpoints and causes recalculation but based on how far away it is from the inital mouse position, it tends more towards the staircase until when staircase is no longer possible and then the connections break and the whole thing repeats for the new mouse position
// maybe make the linear logo slightly tilt towards the mouse before the revealing Sequence, during mouse revealing

const heightSegments = 64
const widthSegments = 64
const gridWidth = 2
const gridHeight = 1.5

const xGap = gridWidth / widthSegments
const yGap = gridHeight / heightSegments

let vec = new THREE.Vector3()

const snapMouseToGrid = (point) => {
  let Nx = Math.round(point.x / xGap)
  let Ny = Math.round(point.y / yGap)
  let snappedPoint = { x: Nx * xGap, y: Ny * yGap }

  // return { x: Nx * xGap, y: Ny * yGap }
  return vec.set(snappedPoint.x, snappedPoint.y, 0)
}

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000,
  // blending: THREE.AdditiveBlending,
})

let someVec3 = new THREE.Vector3()

let randomStartPoints = []

let lines = []

let circuitLines = []

const uniforms = {
  uResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  uMousePos: {
    value: new THREE.Vector3(0, 0, 0.005),
  },
  uTime: {
    value: 2,
  },
}

const Scene = () => {
  const { scene, viewport } = useThree()

  const [revealTexture, setRevealTexture] = useState(null)

  let mousePosition = useRef({ x: 0, y: 0 })
  let rectangleRef = useRef(null)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    mousePosition.current = { x, y }
  }

  // useFrame(({ viewport, clock }) => {
  //   const intermediateVec3 = rectangleRef.current.position.clone()
  //   intermediateVec3.lerp(
  //     someVec3.set(
  //       (mousePosition.current.x * viewport.width) / 2,
  //       (mousePosition.current.y * viewport.height) / 2,
  //       0
  //     ),
  //     1
  //   )

  //   const normalizedMouse = intermediateVec3.clone()
  //   normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
  //   normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5
  //   normalizedMouse.z = 0.005

  //   const snappedAndLerped = snapMouseToGrid(intermediateVec3)

  //   rectangleRef.current.position.x = snappedAndLerped.x
  //   rectangleRef.current.position.y = snappedAndLerped.y
  // })

  useEffect(() => {
    const startTime = performance.now() // Start timing

    circuitVertices.forEach((innerArray) => {
      innerArray.forEach((obj) => {
        obj.x *= 2
      })
    })

    circuitVertices.map((linePoints, index) => {
      circuitLines.push(addLines(linePoints))
    })

    console.log(circuitLines.length)

    window.addEventListener('mousemove', handleMouseMove)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      if (circuitLines) {
        circuitLines.forEach((line) => {
          scene.remove(line)
        })
      }

      window.removeEventListener('mousemove', handleMouseMove)
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

  useEffect(() => {
    console.log(revealTexture)
  }, [revealTexture])

  return (
    <>
      <OrbitControls />
      <axesHelper />

      {/* <Plane args={[gridWidth, gridHeight, widthSegments, heightSegments]}>
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.1}
        />
      </Plane> */}

      {/* <Plane
        visible={false}
        ref={rectangleRef}
      /> */}

      {/* <Plane args={[viewport.width, viewport.height]}>
        <shaderMaterial />
      </Plane> */}

      {/* <RevealPlane /> */}

      {/* <MouseReveal /> */}
    </>
  )
}

export default Scene
