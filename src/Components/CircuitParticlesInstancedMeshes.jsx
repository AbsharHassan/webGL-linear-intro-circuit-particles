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
// import { experiment } from '../experiment'
import { optimizedVerticesV1 } from '../optimizedCircuitVerticesV1'
import { optimizedVerticesV2 } from '../optimizedCircuitVerticesV2'
import { optimizedVerticesV3 } from '../optimizedCircuitVerticesV3'
import { degToRad } from 'three/src/math/MathUtils.js'

import { noiseVerticesV1 } from '../noiseVertices80v1'

import iMeshCircuitLinesFragShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesFragment.glsl'
import iMeshCircuitLinesVertShader from '../shaders/iMeshCircuitLineShaders/iMeshCircuitLinesVertex.glsl'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

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

  let lineMeshs = useMemo(() => [], [])

  let iMeshRef = useRef(null)

  let arrayForPython = useMemo(() => {
    return []
  }, [])

  useEffect(() => {
    const startTime = performance.now() // Start timing

    console.log(noiseVerticesV1)

    setTimeout(() => {
      console.log('start')
      iterateNoiseLines(noiseVerticesV1)
    }, 5000)

    let oldLines = []

    // optimizedVertices.forEach((pathArray) => {
    //   oldLines.push(addLines(pathArray, lineMaterialOld))
    // })

    // optimizedVerticesV3.map((pathArray, index) => {
    //   // if (index !== 0) {
    //   //   return
    //   // }

    //   const meshLineGeo = new MeshLineGeometry()
    //   // const linePoints = vertices.map(({ x, y }) => [x, y])
    //   meshLineGeo.setPoints(pathArray)
    //   const meshLineMesh = new THREE.Mesh(meshLineGeo, meshLineMat)

    //   scene.add(meshLineMesh)

    //   lineMeshs.push(meshLineMesh)
    // })

    const endTime = performance.now() // End timing
    console.log(`useEffect took ${endTime - startTime} milliseconds`)

    return () => {
      if (oldLines.length) {
        oldLines.forEach((line) => {
          scene.remove(line)
        })
      }
      if (lineMeshs.length) {
        lineMeshs.forEach((line) => {
          scene.remove(line)
        })
      }
    }
  }, [])

  const iterateNoiseLines = (framesArray) => {
    const progress = {
      i: 1,
    }

    const endIndex = framesArray.length - 1

    let meshLines = []

    let prevIndex = -1

    gsap.to(progress, {
      i: endIndex,
      duration: 1,
      ease: 'linear',
      onUpdate: () => {
        let index = Math.floor(progress.i)

        if (index === prevIndex) {
          return
        }

        if (meshLines.length) {
          meshLines.forEach((line) => {
            scene.remove(line)
          })
        }

        console.log(index)

        let vertices = framesArray[index]

        vertices.forEach((pathArray) => {
          const meshLineGeo = new MeshLineGeometry()
          meshLineGeo.setPoints(pathArray)

          const meshLineMesh = new THREE.Mesh(meshLineGeo, meshLineMat)
          scene.add(meshLineMesh)

          meshLines.push(meshLineMesh)
        })

        prevIndex = index
      },
    })
  }

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
