import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Tipos para las respuestas de la API
export interface UploadResponse {
  message: string;
  data: {
    url: string;
  };
}

/**
 * Servicio para manejar la subida de archivos
 */
export class FileUploadService {
  /**
   * Sube una imagen de perfil para el usuario actual
   * @param file - Archivo a subir
   * @returns Respuesta con la URL de la imagen subida
   * @throws ApiError
   */
  public static uploadProfilePicture(
    file: File,
  ): CancelablePromise<UploadResponse> {
    // Crear FormData para la subida del archivo
    const formData = new FormData();
    formData.append('file', file);

    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/file-upload/profile-picture',
      formData: {
        file: file,
      },
      mediaType: 'multipart/form-data',
      errors: {
        400: 'Bad Request',
        401: 'Unauthorized',
        413: 'Content Too Large',
        415: 'Unsupported Media Type',
        422: 'Validation Error',
      },
    });
  }
}
