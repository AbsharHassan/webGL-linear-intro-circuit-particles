import * as THREE from 'three'

const addSphere = (position, color, radius, scene) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 16)
  const material = new THREE.MeshBasicMaterial({ color })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.x = position.x
  sphere.position.y = position.y
  sphere.position.z = 0
  scene.add(sphere)
  return sphere
}

export default addSphere
