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

import { degToRad } from 'three/src/math/MathUtils.js'

const POINTS_PER_PATH = 40

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

    console.log(circuitVertices)

    paths = circuitVertices.map((pointsArray, index) => {
      let vec2Array = pointsArray.map((point) => {
        return new THREE.Vector2(point.x, point.y)
      })

      const path = new THREE.Path(vec2Array)

      return path
    })

    let iMeshIndex = 0

    paths.map((path) => {
      const points = path.getSpacedPoints()

      points.forEach((point) => {
        const { x, y } = point

        dummyObj3D.position.set(x, y, 0)
        dummyObj3D.updateMatrix()
        iMeshRef.current.setMatrixAt(iMeshIndex, dummyObj3D.matrix)
        iMeshIndex++
      })

      iMeshRef.current.instanceMatrix.needsUpdate = true
    })

    // let pointArray = circuitVertices[0]

    // let vec2Array = pointArray.map((point) => {
    //   return new THREE.Vector2(point.x, point.y)
    // })

    // console.log(vec2Array)

    // const path = new THREE.Path(vec2Array)

    // const points = path.getSpacedPoints()

    // console.log(points)

    // let someIndex = 0

    // circuitVertices.map((linePoints, index) => {
    //   const path = new THREE.Path()

    //   circuitLinesMats.push(meshLineMat)

    //   linePoints.forEach((point) => {
    //     const { x, y, z } = point

    //     dummyObj3D.position.set(x, y, z)
    //     dummyObj3D.updateMatrix()
    //     iMeshRef.current.setMatrixAt(someIndex, dummyObj3D.matrix)
    //     someIndex++
    //   })

    //   iMeshRef.current.instanceMatrix.needsUpdate = true

    //   const meshLineGeo = new MeshLineGeometry()
    //   const points = linePoints.map((obj) => [obj.x, obj.y, obj.z])
    //   meshLineGeo.setPoints(points)
    //   circuitLinesGeos.push(meshLineGeo)

    //   const mesh = new THREE.Mesh(meshLineGeo, meshLineMat)
    //   // scene.add(mesh)

    //   circuitLinesMeshes.push(mesh)
    // })

    iMeshRef.current.instanceMatrix.needsUpdate = true

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
        args={[null, null, 467 * POINTS_PER_PATH]}
      >
        <boxGeometry args={[0.05 * 0.05, 0.05 * 0.05, 0]} />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesScene
