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

    // circuitVertices.forEach((innerArray) => {
    //   innerArray.forEach((obj) => {
    //     obj.x *= 2
    //   })
    // })

    const circuitLinesGeos = []
    const circuitLinesMats = []
    const circuitLinesMeshes = []

    circuitVertices.map((linePoints, index) => {
      // const meshLineMat = new MeshLineMaterial({
      //   lineWidth: 0.0125,
      //   transparent: true,
      //   depthTest: false,
      //   depthWrite: false,
      //   fragmentShader: circuitLinesFragment,
      // })
      // circuitLinesMats.push(meshLineMat)

      const meshLineGeo = new MeshLineGeometry()
      const points = linePoints.map((obj) => [obj.x, obj.y, obj.z])
      meshLineGeo.setPoints(points)
      circuitLinesGeos.push(meshLineGeo)

      const mesh = new THREE.Mesh(meshLineGeo, meshLineMat)
      scene.add(mesh)
      circuitLinesMeshes.push(mesh)
    })

    console.log(viewport.width - 0.2)

    gsap.to(testPlaneRef.current.material.uniforms.uProgression, {
      value: 1.0,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        // console.log(testPlaneRef.current.material.uniforms.uProgression)
      },
    })

    meshLineMat.uniforms.uProgression = { value: 0 }

    gsap.to(meshLineMat.uniforms.uProgression, {
      value: 1.0,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      // yoyo: true,
      onUpdate: () => {
        // console.log(testPlaneRef.current.material.uniforms.uProgression)
      },
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

      {/* <Plane args={[gridWidth, gridHeight, widthSegments, heightSegments]}>
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.1}
        />
      </Plane> */}

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
        args={[null, null, 467]}
      >
        <boxGeometry args={[0.05 * 0.2, 0.05 * 0.2, 0]} />
        <meshBasicMaterial />
      </instancedMesh> */}
    </>
  )
}

export default CircuitParticlesScene
