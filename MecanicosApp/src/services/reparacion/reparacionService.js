import {FetchService} from '../FetchServcice';

export class reparacionService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async getAllReparaciones() {
    try {
      const response = await this.Servicio.get('reparaciones');
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getVehiculoReparado(id) {
    try {
      const response = await this.Servicio.get(`reparaciones/vehiculo/${id}`);
      return response.message || null;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      return null;
    }
  }

  async putReparacion(id, body) {
    try {
      await this.Servicio.put('reparaciones', body, id);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Completa una reparación con todos sus datos relacionados
   * @param {Object} reparacionData - Datos completos de la reparación
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  async completarReparacion(reparacionData) {
    try {
      // Preparar los datos para el backend
      const payload = this.prepararDatosParaBD(reparacionData);

      console.log('Enviando datos a BD:', payload);

      // Usar el FetchService para hacer la llamada
      const response = await this.Servicio.post(
        'reparaciones/completar',
        payload,
      );

      console.log('Reparación completada exitosamente:', response);
      return response;
    } catch (error) {
      console.error('Error al completar reparación:', error);
      throw new Error(`Error al completar la reparación: ${error.message}`);
    }
  }

  /**
   * Prepara los datos del formulario para el formato esperado por la BD
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Datos formateados para la BD
   */
  prepararDatosParaBD(formData) {
    const {
      reparacionId,
      repuestos,
      tiempoReparacion,
      mecanicos,
      descripcion,
      vehiculo,
    } = formData;

    return {
      // Datos para UPDATE en tabla Reparacion
      reparacion: {
        id_reparacion: reparacionId,
        descripcion: descripcion?.substring(0, 256) || '',
        tiempo: parseInt(tiempoReparacion) || 0,
        id_vehiculo: vehiculo?.id || vehiculo?.ID_Vehiculo,
        estado: true, // Marcar como completada
      },

      // Datos para INSERT en tabla RepuestosReparacion
      repuestos: repuestos.map(repuesto => ({
        id_repuesto: repuesto.id_repuesto,
        id_reparacion: reparacionId,
        cantidad_usada: repuesto.cantidad,
      })),

      // Datos para INSERT en tabla MecanicoRealizaReparacion
      mecanicos: mecanicos.map(mecanico => ({
        id_mecanico: mecanico.id,
        id_reparacion: reparacionId,
      })),
    };
  }

  /**
   * Validar datos antes de enviar a BD
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Resultado de validación
   */
  validarDatos(formData) {
    const errores = [];

    // Validaciones básicas
    if (!formData.reparacionId) {
      errores.push('ID de reparación es requerido');
    }

    if (!formData.descripcion || formData.descripcion.trim().length === 0) {
      errores.push('Descripción es requerida');
    }

    if (formData.descripcion && formData.descripcion.length > 256) {
      errores.push('Descripción no puede exceder 256 caracteres');
    }

    if (
      !formData.tiempoReparacion ||
      parseInt(formData.tiempoReparacion) <= 0
    ) {
      errores.push('Tiempo de reparación debe ser mayor a 0');
    }

    if (!formData.repuestos || formData.repuestos.length === 0) {
      errores.push('Debe agregar al menos un repuesto');
    }

    if (!formData.mecanicos || formData.mecanicos.length === 0) {
      errores.push('Debe asignar al menos un mecánico');
    }

    // Validar cada repuesto
    formData.repuestos?.forEach((repuesto, index) => {
      if (!repuesto.id_repuesto) {
        errores.push(`Repuesto ${index + 1}: ID es requerido`);
      }
      if (!repuesto.cantidad || repuesto.cantidad <= 0) {
        errores.push(`Repuesto ${index + 1}: Cantidad debe ser mayor a 0`);
      }
    });

    // Validar cada mecánico
    formData.mecanicos?.forEach((mecanico, index) => {
      if (!mecanico.id) {
        errores.push(`Mecánico ${index + 1}: ID es requerido`);
      }
    });

    return {
      esValido: errores.length === 0,
      errores,
    };
  }

  /**
   * Obtener una reparación específica por ID
   * @param {number} id - ID de la reparación
   * @returns {Promise<Object>} - Datos de la reparación
   */
  async getReparacionById(id) {
    try {
      const response = await this.Servicio.getByID('reparaciones', id);
      return response.message || response;
    } catch (error) {
      console.error('Error al obtener reparación:', error);
      return null;
    }
  }

  async getCompletedReparacionById(id) {
    try {
      const response = await this.Servicio.get(`reparaciones/${id}/completa`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Obtener el estado de una reparación
   * @param {number} id - ID de la reparación
   * @returns {Promise<boolean>} - Estado de la reparación
   */
  async getEstadoReparacion(id) {
    try {
      const reparacion = await this.getReparacionById(id);
      return reparacion?.estado || false;
    } catch (error) {
      console.error('Error al obtener estado de reparación:', error);
      return false;
    }
  }
}
