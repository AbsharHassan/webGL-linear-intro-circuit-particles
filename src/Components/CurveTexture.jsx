import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Plane, Sphere } from '@react-three/drei'
import gsap from 'gsap'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import alea from 'alea'
import { createNoise2D } from 'simplex-noise'
import { createNoise3D } from 'simplex-noise'

import fragmentShader from '../shaders/curveShaders/fragmentCurve.glsl'

import fragmentPlaneShader from '../shaders/revealPlane/fragment.glsl'
import vertexPlaneShader from '../shaders/revealPlane/vertex.glsl'

import fragmentNoise from '../shaders/noisePlaneShaders/fragmentNoise.glsl'
import vertexNoise from '../shaders/noisePlaneShaders/vertexNoise.glsl'
import CircuitMesh from './CircuitMesh'

const prng = alea('seed')
const noise2D = createNoise2D(prng)
const noise3D = createNoise3D(prng)

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
}

const uniformsReveal = {
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
}

let count = 50

let curvePoints = []

const customMeshLineGeo = new MeshLineGeometry()
const customMeshLineMaterial = new MeshLineMaterial({
  lineWidth: 3,
  fragmentShader: fragmentShader,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  // blending: THREE.,
  clipIntersection: true,
})
let customMesh

const curveScene = new THREE.Scene()
const curveRenderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
)

// const revealScene = new THREE.Scene()
const revealRenderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
)

const CurveTexture = ({ setTexture }) => {
  const { viewport, scene, camera, gl } = useThree()

  let sceneRef = useRef(null)
  let revealScene = useRef(new THREE.Scene())
  let iMeshRef = useRef(null)
  let rectangleRef = useRef(null)

  let revealPlaneRef = useRef(null)

  let mousePosition = useRef(new THREE.Vector2(0, 0))
  let prevMousePosition = useRef(new THREE.Vector2(0, 0))
  let currentIndex = useRef(0)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const x = (clientX / window.innerWidth) * 2 - 1
    const y = -(clientY / window.innerHeight) * 2 + 1

    mousePosition.current.x = (x * viewport.width) / 2
    mousePosition.current.y = (y * viewport.height) / 2
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    setTexture(revealRenderTarget)

    customMeshLineMaterial.uniforms.uOpacityVal = { value: 1 }

    gsap.to(customMeshLineMaterial.uniforms.uOpacityVal, {
      value: 0,
      duration: 5,
      repeat: -1,
      yoyo: true,
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(({ clock }) => {
    if (customMesh) {
      curveScene.remove(customMesh)
    }

    if (
      Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 0.005 &&
      Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.005
    ) {
      console.log()
    } else {
      if (currentIndex.current >= count) {
        curvePoints.shift()
        curvePoints[count - 1] = new THREE.Vector3(
          mousePosition.current.x,
          mousePosition.current.y,
          0
        )
      } else {
        curvePoints[currentIndex.current] = new THREE.Vector3(
          mousePosition.current.x,
          mousePosition.current.y,
          0
        )
        currentIndex.current++
      }
    }

    if (curvePoints.length) {
      const curve = new THREE.CatmullRomCurve3(curvePoints)

      const points = curve.getPoints(1000)

      customMeshLineGeo.setPoints(curvePoints)
      customMesh = new THREE.Mesh(customMeshLineGeo, customMeshLineMaterial)
      curveScene.add(customMesh)
    }

    prevMousePosition.current.x = mousePosition.current.x
    prevMousePosition.current.y = mousePosition.current.y

    rectangleRef.current.position.x = mousePosition.current.x
    rectangleRef.current.position.y = mousePosition.current.y

    const normalizedMouse = rectangleRef.current.position.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5

    revealPlaneRef.current.material.uniforms.uMousePos.value = normalizedMouse
  })

  useFrame(({ clock }) => {
    gl.setRenderTarget(curveRenderTarget)
    gl.render(curveScene, camera)
    gl.setRenderTarget(revealRenderTarget)
    gl.render(revealScene.current, camera)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    revealPlaneRef.current.material.uniforms.uScene.value =
      curveRenderTarget.texture
    revealPlaneRef.current.material.uniforms.uTime.value =
      clock.getElapsedTime() * 0.1
  }, 1)

  return (
    <mesh visible={false}>
      <primitive object={revealScene.current}>
        <Plane
          visible={false}
          args={[0.1, 0.1]}
          ref={rectangleRef}
        />
        <Plane
          args={[viewport.width, viewport.height]}
          position={[0, 0, 0.1]}
          ref={revealPlaneRef}
        >
          <shaderMaterial
            uniforms={uniformsReveal}
            fragmentShader={fragmentPlaneShader}
            vertexShader={vertexPlaneShader}
            transparent
          />
        </Plane>
        <CircuitMesh
          color={'red'}
          // color={'#889999'}
        />
      </primitive>
    </mesh>
  )
}

export default CurveTexture
