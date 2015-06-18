---
-- Función: ws_anios_elecciones
--   * Lista de todos los años con elecciones generales.
-- Parámetros:
--   * ninguno
--
-- Ejemplo:
--   SELECT * FROM ws_anios_elecciones()
--
-- Eliminar función:
--   DROP FUNCTION ws_anios_elecciones()
--
CREATE OR REPLACE FUNCTION ws_anios_elecciones()
  RETURNS
  TABLE(id_eleccion INT, id_tipo_dpa INT, id_tipo_eleccion INT, anio INT, descripcion TEXT) AS
$func$
BEGIN
  RETURN QUERY EXECUTE format('
    SELECT e.id_eleccion, r.id_tipo_dpa, e.id_tipo_eleccion, e.ano, e.fecha::TEXT descripcion
    FROM elecciones e INNER JOIN (SELECT id_eleccion, id_tipo_dpa, COUNT(*) c
                                  FROM resultados
                                  WHERE id_tipo_resultado=$1 -- votos
                                  GROUP BY id_eleccion, id_tipo_dpa
                                  ORDER BY c DESC) r
    ON e.id_eleccion=r.id_eleccion
    WHERE e.id_tipo_eleccion IN (1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14)
    ORDER BY e.ano, e.fecha DESC, e.id_eleccion, r.id_tipo_dpa;'
  ) USING 1;

END
$func$ LANGUAGE plpgsql;