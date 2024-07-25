import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Plane, Sphere } from '@react-three/drei'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

import fragmentWave from '../shaders/waveShaders/fragmentWave.glsl'
import vertexWave from '../shaders/waveShaders/vertexWave.glsl'

import DoubleBufferScene from './DoubleBufferScene'
import CircuitScene from './CircuitScene'

const WaveSceneDoubleBuffer = ({ mousePosition }) => {
  const { viewport } = useThree()

  const [doubleBufferTexture, setDoubleBufferTexture] = useState(null)
  const [doubleBufferTexture2, setDoubleBufferTexture2] = useState(null)

  const waveUniforms = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: {
        value: 0,
      },
      uDoubleBufferTexture: {
        value: null,
      },
      uDoubleBufferTexture2: {
        value: null,
      },
      uProgress: {
        value: 0,
      },
      uOctaves: {
        value: 8,
      },
      uWidth: {
        value: viewport.width,
      },
      uHeight: {
        value: viewport.height,
      },
    }
  }, [])

  let wavePlaneRef = useRef(null)

  useEffect(() => {
    const gui = new GUI()

    const shaderParams = {
      progress: 0,
      octaves: 8,
    }

    // gui.add(shaderParams, 'progress', 0.0, 1.0).onChange((val) => {
    //   wavePlaneRef.current.material.uniforms.uProgress.value = val
    //   console.log(wavePlaneRef.current.material.uniforms.uProgress.value)
    // })

    gsap.to(wavePlaneRef.current.material.uniforms.uProgress, {
      value: 1.5,
      // value: 0.6,
      delay: 20,
      repeat: -1,
      yoyo: true,
      duration: 10,
      // duration: 5,
      ease: 'none',
      // ease: 'power2.in',
      // ease: 'sine.inOut',
      // ease: 'power2.out ',
      onUpdate: () => {
        // console.log(wavePlaneRef.current.material.uniforms.uProgress.value)
      },
    })

    return () => {
      gui.destroy()
    }
  }, [])

  useEffect(() => {
    // if (!wavePlaneRef.current.geometry.attributes.length) {
    //   return
    // }

    // setTimeout(() => {

    // }, 100)

    console.log(wavePlaneRef.current)

    let positions = []

    let count = wavePlaneRef.current.geometry.attributes.position.array.length

    let attributesPosition =
      wavePlaneRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i = i + 3) {
      positions.push(
        new THREE.Vector3(
          attributesPosition[i],
          attributesPosition[i + 1],
          attributesPosition[i + 2]
        )
      )
    }

    positions.forEach((point) => {
      // let z = Math.pow(point.length() * 0.15, 2)
      let radius = viewport.width * 1
      let z =
        Math.sqrt(radius) -
        Math.sqrt(radius - Math.pow(point.length() * 0.5, 2))
      point.z = z
    })

    let newPositionsArray = new Float32Array(count)

    let k = 0
    for (let j = 0; j < count; j = j + 3) {
      const point = positions[k]
      newPositionsArray[j] = point.x
      newPositionsArray[j + 1] = point.y
      newPositionsArray[j + 2] = point.z

      k++
    }

    wavePlaneRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(newPositionsArray, 3, false)
    )

    console.log(newPositionsArray)
  }, [wavePlaneRef])

  // useFrame mostly only for setting uniforms
  useFrame(({ clock }) => {
    wavePlaneRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
    wavePlaneRef.current.material.uniforms.uDoubleBufferTexture.value =
      doubleBufferTexture
    wavePlaneRef.current.material.uniforms.uDoubleBufferTexture2.value =
      doubleBufferTexture2
  })

  return (
    <>
      {/* <DoubleBufferScene
        setTexture={(texture) => {
          setDoubleBufferTexture(texture)
        }}
        mousePosition={mousePosition}
        scale={1}
        portalRadius={0.75}
        // thicknessScale={1}
        thicknessScale={0.75}
        // trailLengthScale={0.92}
        trailLengthScale={0.96}
      />
      <DoubleBufferScene
        setTexture={(texture) => {
          setDoubleBufferTexture2(texture)
        }}
        mousePosition={mousePosition}
        scale={1}
        portalRadius={1.5}
        thicknessScale={1.75}
        trailLengthScale={0.95}
      /> */}
      <OrbitControls />
      <axesHelper />
      <Plane
        // visible={false}
        ref={wavePlaneRef}
        args={[viewport.width * 1.2, viewport.height * 1.2, 60, 60]}
      >
        <shaderMaterial
          uniforms={waveUniforms}
          fragmentShader={fragmentWave}
          vertexShader={vertexWave}
          side={THREE.DoubleSide}
          transparent
        />

        {/* <meshBasicMaterial
          transparent
          opacity={0.2}
          wireframe
        /> */}
      </Plane>

      {/* <Sphere
        args={[0.1]}
        position={[0, 0, -2]}
      /> */}

      {/* <CircuitScene
        mousePosition={mousePosition}
        position={[0, 0, -3]}
      /> */}
    </>
  )
}

export default WaveSceneDoubleBuffer
