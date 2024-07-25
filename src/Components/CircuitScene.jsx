import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import CircuitMesh from './CircuitMesh'
import { Plane, useFBO } from '@react-three/drei'
import fragmentShader from '../shaders/circuitSceneShaders/circuitSceneFragment.glsl'
import vertexShader from '../shaders/circuitSceneShaders/circuitSceneVertex.glsl'

// SWITCH TO THIS FOR PERFORMANCE BOOST:
// const renderTarget = new THREE.WebGLRenderTarget(512, 512)

const CircuitScene = ({ mousePosition, position = [0, 0, -2.5] }) => {
  const { gl, scene, camera, viewport } = useThree()

  // USE THIS FOR HIGHER QUALITY:
  const renderTarget = useFBO()
  const separateScene = useMemo(() => new THREE.Scene(), [])
  let renderPlaneRef = useRef(null)

  const uniforms = useMemo(() => {
    return {
      uScene: {
        value: null,
      },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uMousePos: {
        value: new THREE.Vector3(0, 0, 0),
      },
    }
  }, [])

  const dummyVec = useRef(new THREE.Vector3(0, 0, 0))

  let helperVec3Ref = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const intermediateVec3 = helperVec3Ref.current.clone()
    intermediateVec3.lerp(
      dummyVec.current.set(
        (mousePosition.current.x * viewport.width) / 2,
        (mousePosition.current.y * viewport.height) / 2,
        0
      ),
      0.1
    )

    helperVec3Ref.current.x = intermediateVec3.x
    helperVec3Ref.current.y = intermediateVec3.y

    const normalizedMouse = intermediateVec3.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5

    renderPlaneRef.current.material.uniforms.uMousePos.value = normalizedMouse
  })

  useFrame(() => {
    gl.setRenderTarget(renderTarget)
    gl.render(separateScene, camera)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    renderPlaneRef.current.material.uniforms.uScene.value = renderTarget.texture
  }, 1)

  return (
    <>
      <mesh
        //
        visible={false}
        //
      >
        <primitive object={separateScene}>
          <CircuitMesh
            position={[0, 0, 0]}
            color={'#888899'}
          />
        </primitive>
      </mesh>

      <Plane
        position={position}
        ref={renderPlaneRef}
        args={[viewport.width, viewport.height]}
      >
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </Plane>
    </>
  )
}

export default CircuitScene
