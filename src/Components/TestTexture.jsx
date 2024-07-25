import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import gsap from 'gsap'

import fragmentShader from '../shaders/testTextureShaders/fragment.glsl'
import vertexShader from '../shaders/testTextureShaders/vertex.glsl'

const uniforms = {
  uResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  uMousePos: {
    value: new THREE.Vector3(0, 0, 0.005),
  },
  uTime: {
    value: 2,
  },
  uScene: {
    value: null,
  },
  uScale: {
    value: 1,
  },
}

let count = 100
const dummyObj3D = new THREE.Object3D()

let timeout

let painnnnn = 1

const someArray = new Float32Array(count * 3)

const TestTexture = () => {
  const { viewport } = useThree()

  let sceneRef = useRef(null)
  let iMeshRef = useRef(null)

  let mousePosition = useRef(new THREE.Vector2(0, 0))
  let prevMousePosition = useRef(new THREE.Vector2(0, 0))
  let currentIndex = useRef(0)

  let bufferAtt = useRef(0)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    mousePosition.current.x = (x * viewport.width) / 2
    mousePosition.current.y = (y * viewport.height) / 2
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    const someArray = new Float32Array(count * 3)

    for (let i = 0; i <= count * 3; i = i + 3) {
      let x = (viewport.width / 2) * Math.random()
      let y = (viewport.height / 2) * Math.random()
      let z = 0

      someArray[i] = 0
      someArray[i + 1] = 0
      someArray[i + 2] = 0
    }

    bufferAtt.current = new THREE.InstancedBufferAttribute(someArray, 3, false)

    iMeshRef.current.geometry.setAttribute('pos', bufferAtt.current)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(() => {
    if (
      Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 0.005 &&
      Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.005
    ) {
      console.log()
    } else {
      updateInstances()

      currentIndex.current = (currentIndex.current + 1) % count
    }

    prevMousePosition.current.x = mousePosition.current.x
    prevMousePosition.current.y = mousePosition.current.y

    iMeshRef.current.instanceMatrix.needsUpdate = true
  })

  const updateInstances = () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    let x = mousePosition.current.x
    let y = mousePosition.current.y

    bufferAtt.current.setX(currentIndex.current, x)
    bufferAtt.current.setY(currentIndex.current, y)
    bufferAtt.current.needsUpdate = true

    timeout = setTimeout(() => {
      console.log('timeout called')

      scaleDown()
    }, 1000)
  }

  const scaleDown = () => {
    const obj = {
      scale: 1,
    }

    gsap.to(obj, {
      scale: 0,
      duration: 1,
      onUpdate: () => {
        iMeshRef.current.material.uniforms.uScale.value = obj.scale

        console.log()
      },
      onComplete: () => {
        console.log('this completed')
      },
    })
  }

  return (
    <scene ref={sceneRef}>
      <instancedMesh
        ref={iMeshRef}
        args={[null, null, count]}
      >
        <boxGeometry args={[0.05, 0.05, 0]} />
        <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </instancedMesh>
    </scene>
  )
}

export default TestTexture

// in my r3f application, i am using an instancedMesh and want to modify the scale of the objects while preserving their positions. I have this code: `for (let i = 0; i <= count; i++) {
//   dummyObj3D.scale.set(obj.scale, obj.scale, obj.scale)
//   dummyObj3D.updateMatrix()

//   iMeshRef.current.setMatrixAt(i, dummyObj3D.matrix)
// }
// iMeshRef.current.instanceMatrix.needsUpdate = true` however the problem with this is that the positions are overwritten. Is it possible to access the positions for the specific
