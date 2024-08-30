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
import { optimizedVerticesV1 as optimizedVertices } from '../optimizedCircuitVerticesV1'
import { degToRad } from 'three/src/math/MathUtils.js'

import iMeshCircuitLinesFragShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesFragment.glsl'
import iMeshCircuitLinesVertShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesVertex.glsl'

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
  color: 0xff0000,
})

const CircuitParticlesInstancedMeshes = () => {
  const { scene, viewport, gl } = useThree()

  const [iMeshCount, setIMeshCount] = useState(null)
  let trueLinePointsArray = useRef([])

  let iMeshRef = useRef(null)

  let arrayForPython = useMemo(() => {
    return []
  }, [])

  useEffect(() => {
    const startTime = performance.now() // Start timing

    let oldLines = []

    optimizedVertices.forEach((pathArray) => {
      oldLines.push(addLines(pathArray, lineMaterialOld))
    })

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
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
      points.push(new THREE.Vector3(vertex[0], vertex[1], 0))
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
