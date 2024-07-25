import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import gsap from 'gsap'

import fragmentScene from '../shaders/doubleBufferShaders/fragmentScene.glsl'
import fragmentFbo from '../shaders/doubleBufferShaders/fragmentFbo.glsl'
import vertexDoubleBuffer from '../shaders/doubleBufferShaders/vertexDoubleBuffer.glsl'

/////////////////////////////////

const DoubleBufferScene = ({
  mousePosition,
  setTexture,
  scale,
  portalRadius,
  thicknessScale,
  trailLengthScale = 0.92,
}) => {
  // For better performance, this should be as low as possible and should be a power of 2. Greatly improves the performance. Can increase it when shifting to dGPU
  const RENDER_TARGET_RESOLUTION = 64

  // USE THESE FOR BETTER PERFORMANCE
  let renderTargetSource = useMemo(
    () =>
      new THREE.WebGLRenderTarget(
        RENDER_TARGET_RESOLUTION,
        RENDER_TARGET_RESOLUTION,
        {
          depthBuffer: false,
          stencilBuffer: false,
          // format: THREE.LuminanceFormat,
          type: THREE.UnsignedByteType,
        }
      ),
    []
  )
  let renderTargetA = useMemo(
    () =>
      new THREE.WebGLRenderTarget(
        RENDER_TARGET_RESOLUTION,
        RENDER_TARGET_RESOLUTION,
        {
          depthBuffer: false,
          stencilBuffer: false,
          // format: THREE.LuminanceFormat,
          type: THREE.UnsignedByteType,
        }
      ),
    []
  )
  let renderTargetB = useMemo(
    () =>
      new THREE.WebGLRenderTarget(
        RENDER_TARGET_RESOLUTION,
        RENDER_TARGET_RESOLUTION,
        {
          depthBuffer: false,
          stencilBuffer: false,
          // format: THREE.LuminanceFormat,
          type: THREE.UnsignedByteType,
        }
      ),
    []
  )

  // USE THESE FOR HIGHER QUALITY, HOWEVER, QUALITY HARDLY CHANGES. PERFECTLY GOOD WITH THE BETTER PERFORMANCE CONFIG

  // let renderTargetSource = useMemo(
  //   () => new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
  //   []
  // )
  // let renderTargetA = useMemo(
  //   () => new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
  //   []
  // )
  // let renderTargetB = useMemo(
  //   () => new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
  //   []
  // )

  const sceneSource = useMemo(() => new THREE.Scene(), [])
  const sceneFbo = useMemo(() => new THREE.Scene(), [])

  const uniformsScene = useMemo(() => {
    return {
      uMousePos: {
        value: new THREE.Vector3(0, 0, 0),
      },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uPortalRadius: {
        value: 1,
      },
      uScale: {
        value: 1,
      },
      uThicknessScale: {
        value: 1,
      },
      uVelocityScale: {
        value: 1,
      },
    }
  }, [])

  const uniformsFbo = useMemo(() => {
    return {
      uScene: {
        value: null,
      },
      uPrev: {
        value: null,
      },
      uTrailLengthScale: {
        value: 1,
      },
    }
  }, [])

  const { viewport, gl, scene, camera } = useThree()

  let planeSource = useRef(null)
  let planeFbo = useRef(null)

  let helperVec3Ref = useRef(new THREE.Vector3())
  let dummyVec = useRef(new THREE.Vector3())
  let prevPosition = useRef(new THREE.Vector3())
  let velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    const planeGeometry = new THREE.PlaneGeometry(
      viewport.width,
      viewport.height,
      1,
      1
    )

    const sourceMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexDoubleBuffer,
      fragmentShader: fragmentScene,
      uniforms: uniformsScene,
      transparent: true,
    })

    const fboMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexDoubleBuffer,
      fragmentShader: fragmentFbo,
      uniforms: uniformsFbo,
      transparent: true,
    })

    planeSource.current = new THREE.Mesh(planeGeometry, sourceMaterial)
    planeFbo.current = new THREE.Mesh(planeGeometry, fboMaterial)

    sceneSource.add(planeSource.current)
    sceneFbo.add(planeFbo.current)

    return () => {
      sceneSource.remove(planeSource.current)
      sceneFbo.remove(planeFbo.current)

      planeGeometry.dispose()
      sourceMaterial.dispose()
      fboMaterial.dispose()
    }
  }, [viewport])

  useEffect(() => {
    planeSource.current.material.uniforms.uScale.value = scale ? scale : 1
    planeSource.current.material.uniforms.uThicknessScale.value = thicknessScale
      ? thicknessScale
      : 1
    planeSource.current.material.uniforms.uPortalRadius.value = portalRadius
      ? portalRadius
      : 1
    planeFbo.current.material.uniforms.uTrailLengthScale.value =
      trailLengthScale ? trailLengthScale : 0.92
  }, [scale, portalRadius, thicknessScale, trailLengthScale])

  let portalAnimationRef = useRef(null)

  const closePortal = () => {
    if (portalAnimationRef.current) {
      portalAnimationRef.current.kill()
    }
    portalAnimationRef.current = gsap.to(
      planeSource.current.material.uniforms.uPortalRadius,
      {
        value: 0,
        duration: 1,
        ease: 'power2.out',
      }
    )
  }

  const openPortal = () => {
    if (portalAnimationRef.current) {
      portalAnimationRef.current.kill()
    }

    portalAnimationRef.current = gsap.to(
      planeSource.current.material.uniforms.uPortalRadius,
      {
        value: portalRadius,
        duration: 1,
        ease: 'back',
      }
    )
  }

  useEffect(() => {
    setTexture(renderTargetA.texture)
  }, [])

  // useFrame mostly only for calculating and dealing with mouse position and uMousePos
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

    planeSource.current.material.uniforms.uMousePos.value = normalizedMouse

    velocity.current.x = helperVec3Ref.current.x - prevPosition.current.x
    velocity.current.y = helperVec3Ref.current.y - prevPosition.current.y
    velocity.current.z = helperVec3Ref.current.z - prevPosition.current.z

    prevPosition.current.copy(helperVec3Ref.current)

    // console.log(velocity.current.length())

    // if (velocity.current.length() < 0.15) {
    //   closePortal()
    // } else {
    //   openPortal()
    // }

    planeSource.current.material.uniforms.uVelocityScale.value =
      velocity.current.length() * 2
  })

  useFrame(() => {
    gl.setRenderTarget(renderTargetSource)
    gl.render(sceneSource, camera)

    gl.setRenderTarget(renderTargetA)
    gl.render(sceneFbo, camera)

    planeFbo.current.material.uniforms.uScene.value = renderTargetSource.texture
    planeFbo.current.material.uniforms.uPrev.value = renderTargetA.texture

    gl.setRenderTarget(null)
    gl.render(scene, camera)

    let temp = renderTargetA
    renderTargetA = renderTargetB
    renderTargetB = temp
  }, 1)

  return (
    <>
      {/* <mesh visible={false}>
        <primitive object={sceneSource.current}>
          <Plane
            ref={planeSource}
            args={[viewport.width, viewport.height, 1, 1]}
          >
            <shaderMaterial
              vertexShader={vertexDoubleBuffer}
              fragmentShader={fragmentScene}
              uniforms={uniformsScene}
              transparent
            />
          </Plane>
        </primitive>
      </mesh>

      <mesh visible={false}>
        <primitive object={sceneFbo.current}>
          <Plane
            ref={planeFbo}
            args={[viewport.width, viewport.height, 1, 1]}
          >
            <shaderMaterial
              vertexShader={vertexDoubleBuffer}
              fragmentShader={fragmentFbo}
              uniforms={uniformsFbo}
              transparent
            />
          </Plane>
        </primitive>
      </mesh> */}
    </>
  )
}

export default DoubleBufferScene
