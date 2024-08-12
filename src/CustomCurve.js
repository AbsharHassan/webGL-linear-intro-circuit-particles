import * as THREE from 'three'

class CustomCurve extends THREE.Curve {
  constructor(path) {
    super()
    this.path = path
  }

  getPoint(t) {
    // Get the point at 't' (0 <= t <= 1) from the path
    return this.path.getPoint(t)
  }
}

export default CustomCurve
