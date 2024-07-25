import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Plane, Sphere } from '@react-three/drei'
import fragmentWave from '../shaders/waveShaders/fragmentWave.glsl'
import vertexWave from '../shaders/waveShaders/vertexWave.glsl'
import GridTextures from './GridTextures'
import CurveTextureOnlyCurve from './CurveTextureOnlyCurve'
import CircuitMesh from './CircuitMesh'
import CurveTexture from './CurveTexture'

let dummyVec = new THREE.Vector3()

let circuitRT = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight
)

const WaveScene = () => {
  const { viewport, gl, scene, camera } = useThree()

  const [someTexture, setSomeTexture] = useState(null)

  let circuitScene = useRef(new THREE.Scene())

  const waveUniforms = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: {
        value: 0,
      },
      uMousePos: {
        value: new THREE.Vector3(),
      },
      uGridSimple: {
        value: null,
      },
      uGridComplex: {
        value: null,
      },
      uCurveTexture: {
        value: null,
      },
      uCircuitTexture: {
        value: null,
      },
    }
  }, [])

  let wavePlaneRef = useRef(null)

  let mousePosition = useRef({ x: 0, y: 0 })

  let helperRef = useRef(null)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    // mousePosition.current = {
    //   x: (x * viewport.width) / 2,
    //   y: (y * viewport.height) / 2,
    // }

    mousePosition.current = { x, y }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(({ clock }) => {
    const intermediateVec3 = helperRef.current.position.clone()
    intermediateVec3.lerp(
      dummyVec.set(
        (mousePosition.current.x * viewport.width) / 2,
        (mousePosition.current.y * viewport.height) / 2,
        0
      ),
      1
    )

    helperRef.current.position.x = intermediateVec3.x
    helperRef.current.position.y = intermediateVec3.y

    const normalizedMouse = intermediateVec3.clone()

    wavePlaneRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
    wavePlaneRef.current.material.uniforms.uMousePos.value = normalizedMouse
    wavePlaneRef.current.material.uniforms.uCurveTexture.value = someTexture
  })

  useFrame(() => {
    gl.setRenderTarget(circuitRT)
    gl.render(circuitScene.current, camera)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    wavePlaneRef.current.material.uniforms.uCircuitTexture.value =
      circuitRT.texture
  }, 1)

  return (
    <>
      <CurveTextureOnlyCurve
        setTexture={(rt) => {
          console.log(rt.texture)
          setSomeTexture(rt.texture)
        }}
      />
      {/* <CurveTexture
        setTexture={(rt) => {
          console.log(rt.texture)
          setSomeTexture(rt.texture)
        }}
      /> */}
      <Sphere
        visible={false}
        args={[0.2]}
        position={[0, 0, 0]}
        ref={helperRef}
      />
      <OrbitControls />
      {/* <axesHelper /> */}
      <Plane
        // visible={false}
        ref={wavePlaneRef}
        args={[viewport.width * 1, viewport.height * 1, 100, 100]}
      >
        <shaderMaterial
          uniforms={waveUniforms}
          fragmentShader={fragmentWave}
          vertexShader={vertexWave}
          side={THREE.DoubleSide}
          transparent
        />
      </Plane>
      <mesh
        //
        visible={false}
      >
        <primitive object={circuitScene.current}>
          <CircuitMesh color={'#889999'} />
        </primitive>
      </mesh>
    </>
  )
}

export default WaveScene
