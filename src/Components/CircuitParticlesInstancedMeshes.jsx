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
import { experiment } from '../experiment'
import { optimizedVerticesV1 } from '../optimizedCircuitVerticesV1'
import { optimizedVerticesV2 } from '../optimizedCircuitVerticesV2'
import { optimizedVerticesV3 } from '../optimizedCircuitVerticesV3'
import { degToRad } from 'three/src/math/MathUtils.js'

import { noiseVerticesV1 } from '../noiseVertices80v1'

import iMeshCircuitLinesFragShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesFragment.glsl'
import iMeshCircuitLinesVertShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesVertex.glsl'

import circuitParticlesFragment from '../shaders/circuitParticlesShaders/circuitParticlesFragment.glsl'
import circuitParticlesVertex from '../shaders/circuitParticlesShaders/circuitParticlesVertex.glsl'

import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

const POINTS_PER_PATH = 100

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

const meshLineMat = new MeshLineMaterial({
  lineWidth: 0.0125,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  opacity: 0.4,
  // fragmentShader: circuitLinesFragment,
})

const CircuitParticlesInstancedMeshes = () => {
  const { scene, viewport, gl } = useThree()

  const [iMeshCount, setIMeshCount] = useState(null)
  const [framePaths, setFramePaths] = useState(null)

  let lineMeshs = useMemo(() => [], [])

  let iMeshRef = useRef(null)

  const particleUniforms = useMemo(() => {
    return {
      uOpacity: {
        value: 1,
      },
    }
  }, [])

  useEffect(() => {
    const startTime = performance.now() // Start timing

    let arrayLengths = experiment.map((arr) => arr.length)
    const maxLength = Math.max(...arrayLengths)

    setIMeshCount(maxLength * (POINTS_PER_PATH + 1))

    let allPaths = experiment.map((frameArray) => {
      let paths = frameArray.map((vertices) => {
        let vec2Array = vertices.map(
          (coords) => new THREE.Vector2(coords[0], coords[1])
        )

        return new THREE.Path(vec2Array)
      })

      return paths
    })

    setFramePaths(allPaths)

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {}
  }, [])

  const updatePoints = (frame) => {
    let iMeshIndex = 0

    frame.map((path) => {
      const pointsArray = path.getSpacedPoints(POINTS_PER_PATH)

      pointsArray.map((point) => {
        dummyObj3D.position.set(point.x, point.y, 0)
        dummyObj3D.updateMatrix()
        iMeshRef.current.setMatrixAt(iMeshIndex, dummyObj3D.matrix)

        iMeshIndex++
      })

      iMeshRef.current.instanceMatrix.needsUpdate = true
    })
  }

  useEffect(() => {
    if (!iMeshCount || !framePaths) return

    let opacityArray = new Float32Array(iMeshCount)
    for (let i = 0; i < opacityArray.length; i++) {
      opacityArray[i] = (Math.random() + 0.2) / 20
    }
    iMeshRef.current.geometry.setAttribute(
      'aOpacity',
      new THREE.InstancedBufferAttribute(opacityArray, 1, false)
    )

    iterateNoiseLines(framePaths)
  }, [iMeshCount, framePaths])

  const iterateNoiseLines = (framePaths) => {
    const progress = {
      i: 1,
    }

    const endIndex = framePaths.length - 1

    let prevIndex = -1

    gsap.to(progress, {
      i: endIndex,
      delay: 3,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
      onUpdate: () => {
        let index = Math.floor(progress.i)
        if (index === prevIndex) return

        let frame = framePaths[index]
        updatePoints(frame)

        prevIndex = index
      },
    })
  }

  return (
    <>
      <OrbitControls />
      <axesHelper />

      <Plane
        args={[gridWidth, gridHeight, widthSegments, heightSegments]}
        visible={false}
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
        <boxGeometry args={[0.05 * 0.25, 0.05 * 0.25, 0]} />
        <shaderMaterial
          vertexShader={circuitParticlesVertex}
          fragmentShader={circuitParticlesFragment}
          uniforms={particleUniforms}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesInstancedMeshes
