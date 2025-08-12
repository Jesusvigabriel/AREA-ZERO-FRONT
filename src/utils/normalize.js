/**
 * Normaliza una cadena de texto, eliminando espacios en blanco al inicio y final
 * y convirtiendo a string si es necesario.
 * @param {string} str - La cadena a normalizar
 * @returns {string} La cadena normalizada o string vacío si es null/undefined
 */
const normalizeString = (str) => {
  if (str === null || str === undefined) return '';
  return String(str).trim();
};

/**
 * Normaliza un objeto de ítem de orden, asegurando que los campos de texto
 * estén correctamente formateados y sin espacios innecesarios.
 * @param {Object} item - El ítem a normalizar
 * @returns {Object} El ítem con los campos normalizados
 */
export const normalizeOrderItem = (item) => {
  if (!item) return {};
  
  // Normalizar campos principales
  const normalizedItem = {
    ...item,
    Barcode: normalizeString(item.Barcode),
    CodeEmpresa: normalizeString(item.CodeEmpresa),
    Empresa: normalizeString(item.Empresa),
    Productos: normalizeString(item.Productos),
    NombreProducto: normalizeString(item.NombreProducto),
    Partida: normalizeString(item.Partida),
    DespachoPlaza: normalizeString(item.DespachoPlaza),
    Lote: normalizeString(item.Lote),
    // Si hay un objeto Producto, normalizar sus campos también
    ...(item.Producto && {
      Producto: {
        ...item.Producto,
        Nombre: normalizeString(item.Producto.Nombre)
      }
    })
  };

  // Normalizar array de posiciones si existe
  if (Array.isArray(item.posiciones)) {
    normalizedItem.posiciones = item.posiciones.map(pos => ({
      ...pos,
      descripcion: normalizeString(pos.descripcion)
    }));
  }

  // Normalizar array de partidas si existe
  if (Array.isArray(item.Partidas)) {
    normalizedItem.Partidas = item.Partidas.map(partida => ({
      ...partida,
      Barcode: normalizeString(partida.Barcode),
      CodeEmpresa: normalizeString(partida.CodeEmpresa),
      NumeroParte: normalizeString(partida.NumeroParte),
      Descripcion: normalizeString(partida.Descripcion)
    }));
  }

  return normalizedItem;
};

/**
 * Normaliza un valor de búsqueda para comparación, eliminando espacios
 * y convirtiendo a mayúsculas para búsquedas sin distinción de mayúsculas/minúsculas.
 * @param {string} value - El valor a normalizar para búsqueda
 * @returns {string} El valor normalizado para búsqueda
 */
export const normalizeSearchValue = (value) => {
  return value ? String(value).trim().toUpperCase() : '';
};

export default {
  normalizeString,
  normalizeOrderItem,
  normalizeSearchValue
};
