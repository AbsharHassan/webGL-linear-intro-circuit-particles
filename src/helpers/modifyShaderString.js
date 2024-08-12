const modifyShaderString = (shader, patch, offset) => {
  let lines = shader.split('\n')
  let index = lines.findIndex((line) => line.includes('void main()'))

  if (index !== -1) {
    lines.splice(index + offset, 0, patch)
  }

  return lines.join('\n')
}

export default modifyShaderString
