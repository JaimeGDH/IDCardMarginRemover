# IDCardMarginRemover
Elimina los márgenes oscuros capturados en un escáner de identificación.

A partir de una imagen en base64 se puede decidir el umbral de oscuridad del margen a recortar.

También se puede customizar los márgenes de lectura del escánder de identificación (pasaporte, carnet, etc).

Si cumple con las proporciones de una tarjeta de identificación se recorta, si no se devuelve la imagen original.

No se necesitan librerías de manipulación de imágenes.

Sólo se debe hacer un import con el nombre de la clase { cropIdCardImage }
