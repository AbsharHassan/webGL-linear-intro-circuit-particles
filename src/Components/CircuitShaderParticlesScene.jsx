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
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import gsap from 'gsap'

import { circuitVertices } from '../circuitVertices'

import circuitLinesFragmentTest from '../shaders/circuitLinesShaders/circuitLinesFragmentTest.glsl'
import circuitLinesFragment from '../shaders/circuitLinesShaders/circuitLinesFragment.glsl'
import circuitLinesVertex from '../shaders/circuitLinesShaders/circuitLinesVertex.glsl'

import circuitPlaneParticlesFragment from '../shaders/circuitPlaneParticlesShaders/circuitPlaneParticlesFragment.glsl'
import circuitPlaneParticlesVertex from '../shaders/circuitPlaneParticlesShaders/circuitPlaneParticlesVertex.glsl'

import circuitParticlesFragment from '../shaders/circuitParticlesShaders/circuitParticlesFragment.glsl'
import circuitParticlesVertex from '../shaders/circuitParticlesShaders/circuitParticlesVertex.glsl'

import { degToRad } from 'three/src/math/MathUtils.js'

// const POINTS_PER_PATH = 100
const POINTS_PER_PATH = 100

const heightSegments = 64
const widthSegments = 64
const gridWidth = 2
const gridHeight = 1.5

let vec = new THREE.Vector3()
const dummyObj3D = new THREE.Object3D()

const meshLineMat = new MeshLineMaterial({
  lineWidth: 0.0125,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  fragmentShader: circuitLinesFragment,
})

const CircuitShaderParticlesScene = () => {
  const { scene, viewport, gl } = useThree()

  let iMeshRef = useRef(null)
  let testPlaneRef = useRef(null)

  const [linePaths, setLinePaths] = useState(null)

  const uniforms = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(viewport.width - 0.2, 0.25),
      },
      uProgression: {
        value: 0.0,
      },
    }
  }, [viewport])

  function getFractionalPart(num) {
    return num - Math.floor(num)
  }

  useEffect(() => {
    const startTime = performance.now() // Start timing

    const circuitLinesGeos = []
    const circuitLinesMats = []
    const circuitLinesMeshes = []

    let tempPaths = []
    tempPaths = circuitVertices.map((vertices) => {
      // vertices.reverse()

      let vec2Array = vertices.map(({ x, y }) => new THREE.Vector2(x, y))

      return new THREE.Path(vec2Array)
    })
    setLinePaths(tempPaths)

    let count = 467 * (POINTS_PER_PATH + 1)
    let opacityArray = new Float32Array(count)
    for (let i = 0; i < opacityArray.length; i++) {
      opacityArray[i] = (Math.random() + 0.2) / 20
    }
    iMeshRef.current.geometry.setAttribute(
      'aOpacity',
      new THREE.InstancedBufferAttribute(opacityArray, 1, false)
    )

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
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

  useEffect(() => {
    if (!linePaths) {
      return
    }

    const progression = {
      t: 0,
    }

    const count = 467 * (POINTS_PER_PATH + 1)
    const positionsFloat32 = new Float32Array(count * 3)

    iMeshRef.current.geometry.setAttribute(
      'pos',
      new THREE.InstancedBufferAttribute(positionsFloat32, 3, false)
    )

    gsap.to(progression, {
      t: 5,
      ease: 'sine.inOut',
      // ease: 'none',
      duration: 5,
      onUpdate: () => {
        let iMeshIndex = 0

        for (let i = 0; i < linePaths?.length; i++) {
          const path = linePaths[i]

          for (let j = 0; j <= POINTS_PER_PATH; j++) {
            const offset = j / POINTS_PER_PATH
            const u = Math.max(progression.t - offset, 0)

            const u2 = getFractionalPart(u)

            const point = path.getPointAt(u2)

            positionsFloat32.set([point.x, point.y, 0], iMeshIndex * 3)

            iMeshIndex++
          }
        }

        iMeshRef.current.geometry.attributes.pos.array = positionsFloat32
        iMeshRef.current.geometry.attributes.pos.needsUpdate = true
      },
    })

    console.log(linePaths)
  }, [linePaths])

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

      <Plane
        visible={false}
        ref={testPlaneRef}
        position={[0, 0, 0]}
        args={[viewport.width - 0.2, 0.25]}
      >
        <shaderMaterial
          vertexShader={circuitLinesVertex}
          fragmentShader={circuitLinesFragmentTest}
          uniforms={uniforms}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </Plane>

      <instancedMesh
        ref={iMeshRef}
        args={[null, null, 467 * (POINTS_PER_PATH + 1)]}
        // args={[null, null, 467]}
      >
        <boxGeometry args={[0.05 * 0.05, 0.05 * 0.05, 0]} />
        <shaderMaterial
          vertexShader={circuitParticlesVertex}
          fragmentShader={circuitParticlesFragment}
          transparent
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  )
}

export default CircuitShaderParticlesScene
