import { useEffect, useRef, useState } from 'react'
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
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import gsap from 'gsap'

import { circuitVertices } from '../circuitVertices'

import { degToRad } from 'three/src/math/MathUtils.js'

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
  // blending: THREE.AdditiveBlending,
})

const meshLineMat = new MeshLineMaterial({
  lineWidth: 0.0025,
  color: 'red',
  transparent: true,
  depthTest: false,
  depthWrite: false,
  // blending: THREE.,
  clipIntersection: true,
})

const CircuitParticlesScene = () => {
  const { scene, viewport } = useThree()

  let iMeshRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now() // Start timing

    // circuitVertices.forEach((innerArray) => {
    //   innerArray.forEach((obj) => {
    //     obj.x *= 2
    //   })
    // })

    const circuitLinesGeos = []
    const circuitLinesMeshes = []

    circuitVertices.map((linePoints, index) => {
      const meshLineGeo = new MeshLineGeometry()

      const points = linePoints.map((obj) => [obj.x, obj.y, obj.z])

      meshLineGeo.setPoints(points)

      circuitLinesGeos.push(meshLineGeo)

      const mesh = new THREE.Mesh(meshLineGeo, meshLineMat)
      scene.add(mesh)

      circuitLinesMeshes.push(mesh)
    })

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      // if (circuitLines) {
      //   circuitLines.forEach((line) => {
      //     scene.remove(line)
      //   })
      // }

      if (circuitLinesMeshes) {
        circuitLinesMeshes.forEach((line) => {
          scene.remove(line)
        })
      }

      if (circuitLinesGeos) {
        circuitLinesGeos.forEach((geometry) => {
          geometry.dispose()
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

      {/* <instancedMesh
        ref={iMeshRef}
        args={[null, null, 467]}
      >
        <boxGeometry args={[0.05 * 0.2, 0.05 * 0.2, 0]} />
        <meshBasicMaterial />
      </instancedMesh> */}
    </>
  )
}

export default CircuitParticlesScene
