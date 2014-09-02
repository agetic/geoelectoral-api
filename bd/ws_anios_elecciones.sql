---
-- Función: ws_anios_elecciones
--   * Lista de todos los años con elecciones generales.
-- Parámetros:
--   * ninguno
--
-- Ejemplo:
--   SELECT * FROM ws_anios_elecciones()
--
CREATE OR REPLACE FUNCTION ws_anios_elecciones()
  RETURNS
  TABLE(anio INT) AS
$func$
BEGIN
  RETURN QUERY EXECUTE format('
    SELECT
      elecciones.ano
    FROM
      public.elecciones,
      public.tipos_eleccion
    WHERE
      tipos_eleccion.id_tipo_eleccion = elecciones.id_tipo_eleccion AND
      tipos_eleccion.id_tipo_eleccion = $1
    ORDER BY
      elecciones.ano ASC;')
  USING 1;

END
$func$ LANGUAGE plpgsql;