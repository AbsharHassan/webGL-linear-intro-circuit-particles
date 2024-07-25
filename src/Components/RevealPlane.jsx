import React, { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Plane, RenderTexture } from '@react-three/drei'
import CurveTexture from './CurveTexture'
import { useThree } from '@react-three/fiber'
import fragmentShader from '../shaders/revealPlane/fragment.glsl'
import vertexShader from '../shaders/revealPlane/vertex.glsl'

const RevealPlane = () => {
  const { viewport } = useThree()

  const [revealTexture, setRevealTexture] = useState(null)

  const uniforms = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uScene: {
        value: null,
      },
      uTime: {
        value: 2,
      },
    }
  }, [])

  return (
    <>
      <CurveTexture />

      <Plane
        args={[viewport.width, viewport.height]}
        position={[0, 0, -0.1]}
      >
        <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </Plane>
    </>
  )
}

export default RevealPlane
