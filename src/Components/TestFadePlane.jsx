import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Plane, useAspect } from '@react-three/drei'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

// shaders
import noiseFadeFragment from '../shaders/noiseFadeShaders/noiseFadeFragment.glsl'
import noiseFadeVertex from '../shaders/noiseFadeShaders/noiseFadeVertex.glsl'
// shaders

const TestFadePlane = () => {
  let testPlaneRef = useRef(null)
  const { viewport } = useThree()

  const uniforms = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: {
        value: 0,
      },
      uProgress: {
        value: 0.0,
      },
    }
  }, [])

  useEffect(() => {
    const gui = new GUI()

    const shaderParams = {
      progress: 0,
    }

    // gui.add(shaderParams, 'progress', 0.0, 1.0).onChange((val) => {
    //   testPlaneRef.current.material.uniforms.uProgress.value = val
    //   console.log(testPlaneRef.current.material.uniforms.uProgress.value)
    // })

    gsap.to(testPlaneRef.current.material.uniforms.uProgress, {
      value: 1.5,
      repeat: -1,
      yoyo: true,
      duration: 10,
      ease: 'sine.inOut',
      // ease: 'power2.out ',
    })

    return () => {
      gui.destroy()
    }
  }, [])

  useFrame(({ clock }) => {
    testPlaneRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <>
      <OrbitControls />
      <axesHelper />
      <Plane
        ref={testPlaneRef}
        args={[viewport.width, viewport.height]}
      >
        <shaderMaterial
          transparent
          depthTest={false}
          depthWrite={false}
          uniforms={uniforms}
          fragmentShader={noiseFadeFragment}
          vertexShader={noiseFadeVertex}
        />
      </Plane>
    </>
  )
}

export default TestFadePlane
