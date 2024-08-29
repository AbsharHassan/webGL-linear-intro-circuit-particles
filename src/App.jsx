import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Components/Scene'
import { OrbitControls, OrthographicCamera, Stats } from '@react-three/drei'
import TestScene from './Components/TestScene'
import WaveScene from './Components/WaveScene'
import LineTrackScene from './Components/LineTrackScene'
import DoubleBufferScene from './Components/DoubleBufferScene'
import WaveSceneDoubleBuffer from './Components/WaveSceneDoubleBuffer'
import CircuitScene from './Components/CircuitScene'
import TestFadePlane from './Components/TestFadePlane'
import CircuitParticlesScene from './Components/CircuitParticlesScene'
import CircuitShaderParticlesScene from './Components/CircuitShaderParticlesScene'
import CircuitParticlesInstancedMeshes from './Components/CircuitParticlesInstancedMeshes'
import CircuitMeshUv1 from './Components/CircuitMeshUv1'

function App() {
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

  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      camera={{
        //change for prod
        near: 0.0001,
        position: [0, 0, 1],
        // position: [0, 0, 10],
        // fov: 100,
        // fov: 20,
      }}
      gl={{
        alpha: true,
        // preserveDrawingBuffer: true,
        // alpha: true,
        // autoClear: false,
      }}
    >
      <Stats />
      {/* <Scene /> */}
      {/* <TestScene /> */}
      {/* <WaveScene /> */}
      {/* <LineTrackScene /> */}
      {/* <DoubleBufferScene
        setTexture={() => {
          console.log()
        }}
      /> */}
      {/* <OrthographicCamera makeDefault />
      <OrbitControls /> */}
      {/* <WaveSceneDoubleBuffer mousePosition={mousePosition} /> */}
      {/* <CircuitScene /> */}
      {/* <TestFadePlane /> */}
      {/* <CircuitParticlesScene /> */}
      {/* <CircuitShaderParticlesScene /> */}
      <CircuitParticlesInstancedMeshes />
      {/* <axesHelper /> */}
      {/* <OrbitControls /> */}
      {/* <CircuitMeshUv1 /> */}
    </Canvas>
  )
}

export default App
