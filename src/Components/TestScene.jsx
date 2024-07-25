import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import { OrbitControls, Plane, RenderTexture } from '@react-three/drei'
import TestTexture from './TestTexture'

import { useShaderPass } from 'react-r3f-shader-hook'
import CurveTexture from './CurveTexture'
import NoisePlane from './NoisePlane'
import CircuitMesh from './CircuitMesh'

import fragmentNoise from '../shaders/noisePlaneShaders/fragmentNoise.glsl'
import vertexNoise from '../shaders/noisePlaneShaders/vertexNoise.glsl'

const uniforms = {
  uResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  uMousePos: {
    value: new THREE.Vector3(0, 0, 0),
  },
  uTime: {
    value: 2,
  },
  uScene: {
    value: null,
  },
  uScene2: {
    value: null,
  },
}

let someVec3 = new THREE.Vector3()
const extraScene = new THREE.Scene()
const dummyCamera = new THREE.OrthographicCamera()
const resolutionVec = new THREE.Vector2(window.innerWidth, window.innerHeight)
const someTarget = new THREE.WebGL3DRenderTarget(
  resolutionVec.x,
  resolutionVec.y,
  {
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    depthBuffer: true,
  }
)

let count = 100

const TestScene = () => {
  const { gl, scene, camera, viewport } = useThree()

  const [disturbanceTexture, setDisturbanceTexture] = useState(null)
  const [revealTexture, setRevealTexture] = useState(null)

  const [checkTexture, setCheckTexture] = useState(null)

  const setTexture = (texture) => {
    setCheckTexture(texture)
  }

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

    revealPlaneRef.current.material.uniforms.uMousePos.value = normalizedMouse

    rectangleRef.current.position.x = intermediateVec3.x
    rectangleRef.current.position.y = intermediateVec3.y

    // revealPlaneRef.current.material.uniforms.uMousePos.value.x =
    //   intermediateVec3.x
    // revealPlaneRef.current.material.uniforms.uMousePos.value.y =
    //   intermediateVec3.y

    if (checkTexture) {
      revealPlaneRef.current.material.uniforms.uScene2.value = checkTexture
    }
  })

  useEffect(() => {
    // if (!checkTexture) {
    //   return
    // }
    console.log(checkTexture)
  }, [checkTexture])

  return (
    <>
      <Plane
        visible={false}
        args={[0.1, 0.1]}
        ref={rectangleRef}
      />
      <OrbitControls />
      <axesHelper />

      {/* <RenderTexture ref={setRevealTexture}> */}
      <CurveTexture setTexture={setTexture} />
      {/* </RenderTexture> */}

      {/* <NoisePlane /> */}

      {/* 
      <RenderTexture ref={setDisturbanceTexture}>
        <TestTexture />
        <CurveTexture />
      </RenderTexture> */}

      {/* <mesh
        visible={false}
        ref={revealPlaneRef}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          // remove double side later
          side={THREE.DoubleSide}
          transparent
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh> */}

      {/* <CircuitMesh color={'red'} /> */}

      <mesh
        ref={revealPlaneRef}
        position={[0, 0, 0]}
        // visible={false}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <shaderMaterial
          // remove double side later
          side={THREE.DoubleSide}
          transparent
          uniforms={uniforms}
          fragmentShader={fragmentNoise}
          vertexShader={vertexNoise}
        />
      </mesh>
    </>
  )
}

export default TestScene
