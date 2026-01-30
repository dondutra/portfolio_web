# Informe de Investigación: Sherlock Tracer

## Introducción
En este caso, analizamos una imagen de disco de una estación de trabajo que presentaba conexiones sospechosas a una IP externa.

## Artefactos Analizados
* **Prefetch**: Se detectó la ejecución de `unusual_binary.exe`.
* **MFT**: Creación del archivo el día 12/03/2024.

## Procedimiento
Primero usamos `fls` de Sleuth Kit para listar archivos borrados:
```bash
fls -r -o 2048 image.ad1