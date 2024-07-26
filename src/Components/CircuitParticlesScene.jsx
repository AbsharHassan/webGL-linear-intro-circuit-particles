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

const heightSegments = 64
const widthSegments = 64
const gridWidth = 2
const gridHeight = 1.5

const xGap = gridWidth / widthSegments
const yGap = gridHeight / heightSegments

let vec = new THREE.Vector3()
const dummyObj3D = new THREE.Object3D()

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

const CircuitParticlesScene = () => {
  const { scene, viewport } = useThree()

  let iMeshRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now() // Start timing

    const circuitLines = []

    // circuitVertices.forEach((innerArray) => {
    //   innerArray.forEach((obj) => {
    //     obj.x *= 2
    //   })
    // })

    circuitVertices.map((linePoints, index) => {
      circuitLines.push(addLines(linePoints))

      // const { x, y, z } = linePoints[linePoints.length - 1]
      const { x, y, z } = linePoints[0]

      dummyObj3D.position.set(x, y, z)
      dummyObj3D.updateMatrix()
      iMeshRef.current.setMatrixAt(index, dummyObj3D.matrix)
    })

    iMeshRef.current.instanceMatrix.needsUpdate = true

    console.log(iMeshRef.current)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      if (circuitLines) {
        circuitLines.forEach((line) => {
          scene.remove(line)
        })
      }
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

  return (
    <>
      <OrbitControls />
      <axesHelper />

      <Plane args={[gridWidth, gridHeight, widthSegments, heightSegments]}>
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.1}
        />
      </Plane>

      <instancedMesh
        ref={iMeshRef}
        args={[null, null, 467]}
      >
        <boxGeometry args={[0.05 * 0.2, 0.05 * 0.2, 0]} />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesScene
