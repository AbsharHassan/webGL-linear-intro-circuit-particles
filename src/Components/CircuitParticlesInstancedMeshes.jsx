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

// console.log({xGap});
// console.log({yGap});

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
  let trueLinePointsArray = useRef([])

  let iMeshRef = useRef(null)

  let arrayForPython = useMemo(() => {
    return []
  }, [])

  useEffect(() => {
    const startTime = performance.now() // Start timing

    // console.log(experiment)

    // setTimeout(() => {
    //   console.log('start')
    //   iterateNoiseLines()
    // }, 5000)

    let lineMeshs = []

    let oldLines = []

    // optimizedVertices.forEach((pathArray) => {
    //   oldLines.push(addLines(pathArray, lineMaterialOld))
    // })

    optimizedVerticesV3.map((pathArray, index) => {
      // if (index !== 0) {
      //   return
      // }

      const meshLineGeo = new MeshLineGeometry()
      // const linePoints = vertices.map(({ x, y }) => [x, y])
      meshLineGeo.setPoints(pathArray)
      const meshLineMesh = new THREE.Mesh(meshLineGeo, meshLineMat)

      scene.add(meshLineMesh)

      lineMeshs.push(meshLineMesh)
    })

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

  // const iterateNoiseLines = () => {
  //   const progress = {
  //     i: 1,
  //   }

  //   let lines = []

  //   gsap.to(progress, {
  //     i: 400,
  //     duration: 20,
  //     ease: 'linear',
  //     onUpdate: () => {
  //       if (lines.length) {
  //         lines.forEach((line) => {
  //           scene.remove(line)
  //         })
  //       }

  //       let index = Math.floor(progress.i)
  //       console.log(index)
  //       let vertices = experiment[index - 1]

  //       vertices.forEach((pathArray) => {
  //         lines.push(addLines(pathArray, lineMaterialOld))
  //       })
  //     },
  //   })
  // }

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
