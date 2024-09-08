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
import { degToRad } from 'three/src/math/MathUtils.js'

import iMeshCircuitLinesFrag from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesFragment.glsl'
import iMeshCircuitLinesVert from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesVertex.glsl'

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

  const iMeshUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
    }
  }, [])

  // shift this to blender maybe
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

    circuitVertices.forEach((pathArray) => {
      let lines = consolidateLines(pathArray)
      trueLinesCount += lines.length
      trueLinePointsArray.current.push(lines)
    })

    setIMeshCount(trueLinesCount)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {}
  }, [])

  useEffect(() => {
    if (!iMeshCount) return

    let posFloat32Array = new Float32Array(iMeshCount * 3)

    for (let i = 0; i < iMeshCount; i++) {
      posFloat32Array.set(
        [Math.random() * 2 - 1, Math.random() - 0.5, 0],
        i * 3
      )
    }

    iMeshRef.current.geometry.setAttribute(
      'pos',
      new THREE.InstancedBufferAttribute(posFloat32Array, 3)
    )

    let pulseOnArray = new Uint8Array(iMeshCount)

    let iMeshIndex = 0

    trueLinePointsArray.current.map((lines) => {
      lines.forEach((line) => {
        let start = line.start
        let end = line.end

        if (start.y === end.y) {
          let scaleFactor = (end.x - start.x) / xGap

          if (Math.random() * Math.abs(scaleFactor) > 0) {
            pulseOnArray[iMeshIndex] = 1
          } else {
            pulseOnArray[iMeshIndex] = 0
          }

          dummyObj3D.position.set(
            start.x +
              (xGap * scaleFactor) / 2 +
              Math.sign(scaleFactor) * (LINE_WIDTH / 2),
            start.y,
            0
          )
          dummyObj3D.rotation.set(0, 0, degToRad(0))
          dummyObj3D.scale.set(scaleFactor, 1, 1)
          dummyObj3D.updateMatrix()

          iMeshRef.current.setMatrixAt(iMeshIndex, dummyObj3D.matrix)
        } else if (start.x === end.x) {
          let scaleFactor = (end.y - start.y) / xGap

          if (Math.random() * Math.abs(scaleFactor) > 0) {
            pulseOnArray[iMeshIndex] = 1
          } else {
            pulseOnArray[iMeshIndex] = 0
          }

          dummyObj3D.position.set(
            start.x,
            start.y +
              (xGap * scaleFactor) / 2 +
              Math.sign(scaleFactor) * (LINE_WIDTH / 2),
            0
          )
          dummyObj3D.scale.set(scaleFactor, 1, 1)
          dummyObj3D.rotation.set(0, 0, degToRad(90))
          dummyObj3D.updateMatrix()

          iMeshRef.current.setMatrixAt(iMeshIndex, dummyObj3D.matrix)
        }
        iMeshIndex++
      })
    })

    iMeshRef.current.instanceMatrix.needsUpdate = true

    iMeshRef.current.geometry.setAttribute(
      'aIsPulseOn',
      new THREE.InstancedBufferAttribute(pulseOnArray, 1)
    )

    let offsetFloat32Array = new Float32Array(iMeshCount * 3)
    for (let i = 0; i < iMeshCount; i++) {
      offsetFloat32Array[i] = Math.random()
    }
    iMeshRef.current.geometry.setAttribute(
      'aPulseOffset',
      new THREE.InstancedBufferAttribute(offsetFloat32Array, 1)
    )

    let pulseDirection = new Uint8Array(iMeshCount)
    for (let i = 0; i < iMeshCount; i++) {
      pulseDirection[i] = Math.random() > 0.5 ? 1 : 0
    }
    iMeshRef.current.geometry.setAttribute(
      'aPulseDirection',
      new THREE.InstancedBufferAttribute(pulseDirection, 1)
    )

    console.log(iMeshRef.current.geometry.attributes)
  }, [iMeshCount])

  useFrame(({ clock }) => {
    iMeshRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

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
        {/* <meshBasicMaterial
          transparent
          opacity={0.4}
        /> */}

        <shaderMaterial
          vertexShader={iMeshCircuitLinesVert}
          fragmentShader={iMeshCircuitLinesFrag}
          uniforms={iMeshUniforms}
          depthTest={false}
          depthWrite={false}
        />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesInstancedMeshes
