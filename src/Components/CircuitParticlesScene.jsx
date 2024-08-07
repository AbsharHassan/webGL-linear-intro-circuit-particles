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

let someRandomCount = 0

const CircuitParticlesScene = () => {
  const { scene, viewport, gl } = useThree()

  let iMeshRef = useRef(null)
  let testPlaneRef = useRef(null)

  const [paths, setPaths] = useState(null)

  const posFloat32 = useMemo(
    () => new Float32Array(467 * (POINTS_PER_PATH + 1) * 3),
    []
  )

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

    tempPaths = circuitVertices.map((vertices, index) => {
      vertices.reverse()
      let vec2Array = vertices.map((point) => {
        return new THREE.Vector2(
          point.x + (Math.random() - 0.5) * 0.0,
          point.y + (Math.random() - 0.5) * 0.0
        )
      })

      const path = new THREE.Path(vec2Array)

      const pointsArray = path.getSpacedPoints(POINTS_PER_PATH)

      return {
        pointsArray,
        currentIndex: 0,
      }
    })

    setPaths({ paths: tempPaths, count: 1 })

    iMeshRef.current.geometry.setAttribute(
      'pos',
      new THREE.InstancedBufferAttribute(posFloat32, 3, false)
    )

    let count = 467 * (POINTS_PER_PATH + 1)

    let opacityArray = new Float32Array(count)

    for (let i = 0; i < opacityArray.length; i++) {
      opacityArray[i] = (Math.random() + 0.2) / 20
    }

    iMeshRef.current.geometry.setAttribute(
      'aOpacity',
      new THREE.InstancedBufferAttribute(opacityArray, 1, false)
    )

    const obj = {
      t: 0,
    }

    // gsap.to(obj, {
    //   t: 1,
    //   duration: 2,
    //   ease: 'none',
    //   repeat: -1,
    //   yoyo: true,
    //   onUpdate: () => {
    //     let i = 0

    //     paths.map((path) => {
    //       const singlePoint = path.getPointAt(obj.t)

    //       pos.set([singlePoint.x, singlePoint.y, 0], i * 3)

    //       i++
    //     })

    //     iMeshRef.current.geometry.attributes.pos.array = pos
    //     iMeshRef.current.geometry.attributes.pos.needsUpdate = true
    //   },
    // })

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
    if (!paths) {
      return
    }

    const newAttempt = {
      val: 0,
    }

    let oldValue = 0

    gsap.to(newAttempt, {
      val: POINTS_PER_PATH,
      duration: 2,
      // ease: 'steps(100)',
      ease: 'power1.in',
      // ease: 'none',
      onUpdate: () => {
        // if (obj.t === 2) {
        //   console.log('yea')
        // }
        // console.log(Math.floor(newAttempt.val))
        // console.log(obj.t * 10)

        const progress = Math.floor(newAttempt.val)

        console.log(Math.floor(progress))

        if (progress !== oldValue) {
          let j = 0

          paths.paths.forEach((path) => {
            path.currentIndex += 1

            path.currentIndex = path.currentIndex % path.pointsArray.length

            for (let i = 0; i < Math.min(progress, POINTS_PER_PATH); i++) {
              let index = (path.currentIndex + i) % path.pointsArray.length

              let point = path.pointsArray[index]

              posFloat32.set([point.x, point.y, 0], j * 3)

              j++
            }
          })

          // console.log(j)

          iMeshRef.current.geometry.attributes.pos.array = posFloat32
          iMeshRef.current.geometry.attributes.pos.needsUpdate = true

          oldValue = progress
        }
      },
    })

    let count = 467 * (POINTS_PER_PATH + 1)

    let opacityArray = new Float32Array(count)

    let someRandomThing = {
      thing: 0,
    }

    // gsap.to(someRandomThing, {
    //   thing: 1,
    //   duration: 5,
    //   yoyo: true,
    //   repeat: -1,
    //   onUpdate: () => {
    //     for (let i = 0; i < opacityArray.length; i++) {
    //       opacityArray[i] = Math.random() / 20
    //     }

    //     iMeshRef.current.geometry.attributes.aOpacity.array = opacityArray
    //     iMeshRef.current.geometry.attributes.aOpacity.needsUpdate = true
    //   },
    // })

    // setTimeout(() => {
    //   gl.preserveDrawingBuffer = false
    //   gl.autoClear = true

    //   console.log(gl)
    // }, 10000)
  }, [paths])

  // useFrame(() => {
  //   if (!paths?.paths.length) {
  //     return
  //   }

  //   someRandomCount++

  //   if (someRandomCount % 3 === 0) {
  //     let j = 0

  //     paths.count += 1

  //     paths.count = (paths.count % POINTS_PER_PATH) + 1

  //     paths.paths.forEach((path) => {
  //       path.currentIndex += 1

  //       path.currentIndex = path.currentIndex % path.pointsArray.length

  //       for (let i = 0; i < 20; i++) {
  //         let index = (path.currentIndex + i) % path.pointsArray.length

  //         let point = path.pointsArray[index]

  //         posFloat32.set([point.x, point.y, 0], j * 3)

  //         j++
  //       }
  //     })

  //     // console.log(j)

  //     iMeshRef.current.geometry.attributes.pos.array = posFloat32
  //     iMeshRef.current.geometry.attributes.pos.needsUpdate = true
  //   }
  // })

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
          transparent
          depthTest={false}
          depthWrite={false}
          // blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  )
}

export default CircuitParticlesScene
