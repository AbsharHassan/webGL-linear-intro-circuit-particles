import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import { Plane } from '@react-three/drei'

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
}

let someVec3 = new THREE.Vector3()

const MouseReveal = () => {
  const { viewport } = useThree()

  let revealPlaneRef = useRef(null)
  let rectangleRef = useRef(null)

  let mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    mousePosition.current = { x, y }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(({ viewport, clock }) => {
    const intermediateVec3 = rectangleRef.current.position.clone()
    intermediateVec3.lerp(
      someVec3.set(
        (mousePosition.current.x * viewport.width) / 2,
        (mousePosition.current.y * viewport.height) / 2,
        0
      ),
      1
    )

    const normalizedMouse = intermediateVec3.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5
    normalizedMouse.z = 0.005

    revealPlaneRef.current.material.uniforms.uMousePos.value = normalizedMouse

    rectangleRef.current.position.x = intermediateVec3.x
    rectangleRef.current.position.y = intermediateVec3.y
  })

  return (
    <>
      <Plane ref={rectangleRef} />

      <mesh
        ref={revealPlaneRef}
        position={[0, 0, 0.005]}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          transparent
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>
    </>
  )
}

export default MouseReveal
