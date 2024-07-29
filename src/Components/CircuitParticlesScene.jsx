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

const POINTS_PER_PATH = 100

const heightSegments = 64
const widthSegments = 64
const gridWidth = 2
const gridHeight = 1.5

const xGap = gridWidth / widthSegments
const yGap = gridHeight / heightSegments

let vec = new THREE.Vector3()
const dummyObj3D = new THREE.Object3D()

const meshLineMat = new MeshLineMaterial({
  lineWidth: 0.0125,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  fragmentShader: circuitLinesFragment,
})

const CircuitParticlesScene = () => {
  const { scene, viewport } = useThree()

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

    let paths = []

    paths = circuitVertices.map((pointsArray, index) => {
      let vec2Array = pointsArray.map((point) => {
        return new THREE.Vector2(point.x, point.y)
      })

      const path = new THREE.Path(vec2Array)

      return path
    })

    let iMeshIndex = 0

    // const pos = new Float32Array(467 * (POINTS_PER_PATH + 1) * 3)
    const pos = new Float32Array(467 * 3)

    paths.map((path) => {
      // const points = path.getSpacedPoints(POINTS_PER_PATH)
      const singlePoint = path.getPointAt(0.5)

      pos.set([singlePoint.x, singlePoint.y, 0], iMeshIndex * 3)

      iMeshIndex++

      // points.forEach((point) => {
      //   const { x, y } = point

      //   pos.set([x, y, 0], iMeshIndex * 3)

      //   iMeshIndex++
      // })
    })

    console.log(iMeshIndex)

    iMeshRef.current.geometry.setAttribute(
      'pos',
      new THREE.InstancedBufferAttribute(pos, 3, false)
    )

    const obj = {
      t: 0,
    }

    gsap.to(obj, {
      t: 1,
      duration: 2,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        let i = 0

        paths.map((path) => {
          const singlePoint = path.getPointAt(obj.t)

          pos.set([singlePoint.x, singlePoint.y, 0], i * 3)

          i++
        })

        iMeshRef.current.geometry.attributes.pos.array = pos
        iMeshRef.current.geometry.attributes.pos.needsUpdate = true
      },
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

      <instancedMesh
        ref={iMeshRef}
        args={[null, null, 467 * (POINTS_PER_PATH + 1)]}
        // args={[null, null, 467]}
      >
        <boxGeometry args={[0.05 * 0.05, 0.05 * 0.05, 0]} />
        {/* <meshBasicMaterial /> */}
        <shaderMaterial
          vertexShader={circuitParticlesVertex}
          fragmentShader={circuitParticlesFragment}
        />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesScene
