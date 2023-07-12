const cropIdCardImage = (src, marginThreshold = 0.55, horizontalMarginPixels = 200, verticalMarginPixels = 60) => {
  const img = new Image();
  img.src = src;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Crear un lienzo y contexto temporal
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Dibujar la imagen en el lienzo temporal
      tempCtx.drawImage(img, 0, 0);

      // Aplicar filtro de escala de grises al lienzo temporal
      tempCtx.filter = 'grayscale(100%)';
      tempCtx.drawImage(tempCanvas, 0, 0);

      // Crear un lienzo y contexto para el procesamiento final de la imagen
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempCanvas, 0, 0);

      // Obtener los datos de imagen y píxeles del contexto
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let left = horizontalMarginPixels;
      let top = verticalMarginPixels;
      let right = canvas.width - horizontalMarginPixels;
      let bottom = canvas.height - verticalMarginPixels;

      // Iterar sobre los píxeles dentro de los márgenes definidos
      for (let y = verticalMarginPixels; y < canvas.height - verticalMarginPixels; y++) {
        for (let x = horizontalMarginPixels; x < canvas.width - horizontalMarginPixels; x++) {
          const index = (y * canvas.width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

          // Verificar si el valor de luminancia supera el umbral definido
          if (luminance >= marginThreshold) {
            left = Math.max(left, x);
            top = Math.max(top, y);
            right = Math.min(right, x);
            bottom = Math.min(bottom, y);
          }
        }
      }

      // Calcular el ancho y alto recortados de la imagen
      const croppedWidth = left - right + 1;
      const croppedHeight = top - bottom + 1;

      const desiredAspectRatio = 630 / 400;
      const actualAspectRatio = croppedWidth / croppedHeight;

      // Verificar si el aspecto recortado es cercano al aspecto deseado
      if (Math.abs(actualAspectRatio - desiredAspectRatio) <= 0.1) {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = croppedWidth;
        newCanvas.height = croppedHeight;

        const newCtx = newCanvas.getContext('2d');
        // Dibujar la porción recortada de la imagen en el nuevo lienzo
        newCtx.drawImage(img, right, bottom, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

        // Obtener la fuente de datos (base64) de la imagen recortada
        const croppedSrc = newCanvas.toDataURL();
        resolve(croppedSrc);
      } else {
        // Si el aspecto no es adecuado, devolver la fuente original sin recortar
        resolve(src);
      }
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
};

export default cropIdCardImage;
