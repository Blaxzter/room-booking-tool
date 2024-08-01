// Define an async function to process the image
// Define an async function to process the image
async function processImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // Ensure cross-origin access is allowed
    img.src = url

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject('Failed to get canvas context')
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      // Find the boundaries of the actual image inside the possible transparent border
      let minX = img.width,
        maxX = 0,
        minY = img.height,
        maxY = 0

      for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
          const index = (y * img.width + x) * 4
          const alpha = data[index + 3] // Get alpha channel value
          if (alpha > 0) {
            // Check if pixel is not transparent
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
        }
      }

      // Check if the found boundaries form a valid rectangle
      if (minX < maxX && minY < maxY) {
        // check if the found rectangle has 3:4 aspect ratio
        const width = maxX - minX + 1
        const height = maxY - minY + 1
        const aspectRatio = width / height
        if (aspectRatio == 3 / 4) {
          // resolve with white
          resolve('rgb(255, 255, 255)')
          return
        }

        // Analyze pixels along the determined non-transparent border
        const thickness = 1 // Define border thickness
        let totalR = 0,
          totalG = 0,
          totalB = 0,
          count = 0

        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            if (x < minX + thickness || x > maxX - thickness || y < minY + thickness || y > maxY - thickness) {
              const index = (y * img.width + x) * 4
              if (data[index + 3] > 0) {
                // Ensure the pixel is not transparent
                totalR += data[index]
                totalG += data[index + 1]
                totalB += data[index + 2]
                count++
              }
            }
          }
        }

        // Calculate average color and return as string
        const averageR = totalR / count
        const averageG = totalG / count
        const averageB = totalB / count

        resolve(`rgb(${averageR.toFixed(0)}, ${averageG.toFixed(0)}, ${averageB.toFixed(0)})`)
      } else {
        reject('No visible content found within the image.')
      }
    }

    img.onerror = (err: string | Event) => reject('Failed to load image: ' + err)
  })
}

// Example usage
export default processImage
