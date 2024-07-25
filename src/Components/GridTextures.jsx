import React, { useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

let simpleGridScene = new THREE.Scene()
let simpleGridRT = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
)

let complexGridScene = new THREE.Scene()
let complexGridRT = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter }
)

const NUM_DIVISIONS = 20

const GridTextures = ({ handleTargets }) => {
  const { viewport, scene, gl, camera } = useThree()

  useEffect(() => {
    handleTargets([simpleGridRT, complexGridRT])

    const gridHelper = new THREE.GridHelper(
      viewport.width,
      NUM_DIVISIONS,
      0xffffff,
      0xffffff
    )

    gridHelper.rotation.x = Math.PI / 2

    simpleGridScene.add(gridHelper)

    const planeGeo = new THREE.PlaneGeometry(
      viewport.width,
      viewport.width,
      NUM_DIVISIONS,
      NUM_DIVISIONS
    )
    const planeMat = new THREE.MeshBasicMaterial({ wireframe: true })

    const plane1 = new THREE.Mesh(planeGeo, planeMat)
    const plane2 = new THREE.Mesh(planeGeo, planeMat)

    plane2.rotation.y = Math.PI

    complexGridScene.add(plane1)
    complexGridScene.add(plane2)

    return () => {
      simpleGridScene.remove(gridHelper)
      complexGridScene.remove(plane1)
      complexGridScene.remove(plane2)
    }
  }, [])

  useFrame(() => {
    gl.setRenderTarget(simpleGridRT)
    gl.render(simpleGridScene, camera)

    gl.setRenderTarget(complexGridRT)
    gl.render(complexGridScene, camera)

    gl.setRenderTarget(null)
    gl.render(scene, camera)
  }, 1)

  return (
    <>
      {/* <Plane
        rotation={[0, degToRad(180), 0]}
        args={[viewport.width, viewport.width, 10, 10]}
      >
        <meshBasicMaterial wireframe />
      </Plane>
      <Plane
        rotation={[0, degToRad(0), 0]}
        args={[viewport.width, viewport.width, 10, 10]}
      >
        <meshBasicMaterial wireframe />
      </Plane> */}
    </>
  )
}

export default GridTextures
