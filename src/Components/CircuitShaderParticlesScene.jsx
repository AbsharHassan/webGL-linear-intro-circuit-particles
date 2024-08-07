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

  useEffect(() => {
    const startTime = performance.now() // Start timing

    const circuitLinesGeos = []
    const circuitLinesMats = []
    const circuitLinesMeshes = []

    let tempPaths = []

    circuitVertices.map((vertices, index) => {
      vertices.reverse()

      const meshLineGeo = new MeshLineGeometry()
      const points = vertices.map((obj) => [obj.x, obj.y, obj.z])
      meshLineGeo.setPoints(points)
      circuitLinesGeos.push(meshLineGeo)

      const mesh = new THREE.Mesh(meshLineGeo, meshLineMat)

      scene.add(mesh)
      circuitLinesMeshes.push(mesh)
    })

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
        />
      </Plane>

      {/* <instancedMesh
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
          // blending={THREE.AdditiveBlending}
        />
      </instancedMesh> */}
    </>
  )
}

export default CircuitShaderParticlesScene
