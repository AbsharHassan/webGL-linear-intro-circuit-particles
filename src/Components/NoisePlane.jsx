import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

import fragmentNoise from '../shaders/noisePlaneShaders/fragmentNoise.glsl'
import fragmentMouse from '../shaders/noisePlaneShaders/fragmentMouse.glsl'
import vertexNoise from '../shaders/noisePlaneShaders/vertexNoise.glsl'

const NoisePlane = () => {
  const { gl, scene, camera, viewport } = useThree()

  let noisePlaneRef = useRef(null)

  let mousePosition = useRef({ x: 0, y: 0 })

  const uniforms = useMemo(() => {
    return {
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
      uEdge1: {
        value: 0,
      },
    }
  }, [])

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    mousePosition.current = { x, y }
  }

  useFrame(({ clock }) => {
    // noisePlaneRef.current.material.uniforms.uTime.value =
    //   clock.getElapsedTime() * 0.1
    // noisePlaneRef.current.material.uniforms.uResolution.value.x =
    //   window.innerWidth
    // noisePlaneRef.current.material.uniforms.uResolution.value.y =
    //   window.innerHeight
  })

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    const obj = {
      edge1: 0.2,
      edge2: 1,
    }

    // gsap.to(obj, {
    //   edge1: 0.7,
    //   duration: 3,
    //   onUpdate: () => {
    //     noisePlaneRef.current.material.uniforms.uEdge1.value = obj.edge1
    //   },
    //   repeat: -1,
    //   yoyo: true,
    // })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      {/* <mesh
      ref={noisePlaneRef}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        // remove double side later
        side={THREE.DoubleSide}
        transparent
        uniforms={uniforms}
        // fragmentShader={fragmentNoise}
        fragmentShader={fragmentMouse}
        vertexShader={vertexNoise}
      />
    </mesh> */}
    </>
  )
}

export default NoisePlane
