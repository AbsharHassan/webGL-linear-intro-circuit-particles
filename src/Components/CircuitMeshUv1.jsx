/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 ./public/models/circuitMesh.gltf 
*/

import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

import fragmentShader from '../shaders/testFrag.glsl'
import vertexShader from '../shaders/testVert.glsl'

const CircuitMeshUv1 = ({ color, position = [0, 0, -2.5] }) => {
  const { nodes, materials } = useGLTF(
    '/models/v3_smart_uv_project_attempt.gltf'
  )

  let meshRef = useRef(null)

  useEffect(() => {
    console.log(meshRef.current)
  }, [meshRef])

  return (
    <group
      // {...props}
      dispose={null}
      scale={3}
      //   position={position}
      position={[0, 0, 0]}
    >
      <mesh
        ref={meshRef}
        geometry={nodes.Plane.geometry}
      >
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          depthTest={false}
          depthWrite={false}
        />
        {/* <meshBasicMaterial
          //   wireframe
          // color={'#556666'}
          color={color}
        /> */}
      </mesh>
    </group>
  )
}

export default CircuitMeshUv1

useGLTF.preload('/models/v3_smart_uv_project_attempt.gltf')
