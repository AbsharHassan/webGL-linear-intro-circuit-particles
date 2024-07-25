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
        // position: [0, 0, 1],
        position: [0, 0, 10],
        // fov: 100,
        // fov: 20,
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
      <WaveSceneDoubleBuffer mousePosition={mousePosition} />
      {/* <CircuitScene /> */}
      {/* <TestFadePlane /> */}
    </Canvas>
  )
}

export default App
