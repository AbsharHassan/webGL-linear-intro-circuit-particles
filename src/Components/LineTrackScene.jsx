import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Plane, Sphere } from '@react-three/drei'

import fragmentLine from '../shaders/lineShaders/fragmentLine.glsl'
import vertexLine from '../shaders/lineShaders/vertexLine.glsl'

const lineScene = new THREE.Scene()
const lineRT = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
)

let dummyVec = new THREE.Vector3()

const LineTrackScene = () => {
  let planeRef = useRef(null)

  const { viewport, scene, camera, gl } = useThree()

  const uniformsLine = useMemo(() => {
    return {
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uLineScene: {
        value: null,
      },
      uMousePos: {
        value: new THREE.Vector3(0, 0, 0),
      },
    }
  }, [])

  useEffect(() => {
    let linePoints = [
      new THREE.Vector3(-10, 5, 0),
      new THREE.Vector3(-5, 5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, -5, 0),
      new THREE.Vector3(10, 0, 0),
    ]

    const count = linePoints.length * 3

    const curve = new THREE.CatmullRomCurve3(linePoints)

    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material)

    // lineScene.add(curveObject)

    const linePointsArray = new Float32Array(count)

    let j = 0
    for (let i = 0; i < count; i = i + 3) {
      linePointsArray[i] = linePoints[j].clone().normalize().x * 0.5
      linePointsArray[i + 1] = linePoints[j].clone().normalize().y * 0.5
      linePointsArray[i + 2] = linePoints[j].clone().normalize().z * 0.5

      j++
    }

    planeRef.current.geometry.setAttribute(
      'aLinePosition',
      new THREE.BufferAttribute(linePointsArray, 3, false)
    )

    const sphereGeo = new THREE.SphereGeometry(1, 10, 10)
    const sphereMat = new THREE.MeshBasicMaterial({ color: 'red' })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)

    lineScene.add(sphere)

    console.log(planeRef.current)

    return () => {
      // lineScene.remove(curveObject)
      lineScene.remove(sphere)
    }
  }, [])

  useFrame(() => {
    gl.setRenderTarget(lineRT)
    gl.render(lineScene, camera)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    planeRef.current.material.uniforms.uLineScene.value = lineRT.texture
  }, 1)

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

  useFrame(() => {
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
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5

    // wavePlaneRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
    planeRef.current.material.uniforms.uMousePos.value = normalizedMouse
  })

  return (
    <>
      <Sphere
        visible={false}
        args={[0.2]}
        position={[0, 0, 0]}
        ref={helperRef}
      />
      <axesHelper />
      <OrbitControls />
      <Plane
        args={[viewport.width, viewport.height, 20, 20]}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.2}
        />
      </Plane>
      <Plane
        ref={planeRef}
        args={[viewport.width, viewport.height]}
        // visible={false}
      >
        <shaderMaterial
          uniforms={uniformsLine}
          fragmentShader={fragmentLine}
          vertexShader={vertexLine}
          transparent
        />
      </Plane>
    </>
  )
}

export default LineTrackScene
