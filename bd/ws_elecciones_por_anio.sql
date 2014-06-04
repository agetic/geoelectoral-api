---
-- Función: ws_elecciones_por_anio
--   * Resultados de las elecciones de un determinado año.
--   * Los resultados son a nivel Bolivia por defecto
-- Parámetros:
--   * _anio: Es el año de la elección
--
-- Ejemplo:
--   SELECT * FROM ws_elecciones_por_anio(2009)
--
CREATE OR REPLACE FUNCTION ws_elecciones_por_anio(_anio INT)
  RETURNS
  TABLE(id_dpa INT, dpa_codigo VARCHAR,  dpa_nombre VARCHAR, anio INT, nombre_tipo_resultado VARCHAR, id_partido INT, id_tipo_partido INT,
        sigla VARCHAR, codigo_sigla VARCHAR, resultado INT, id_eleccion INT, porcentaje REAL) AS
$func$
DECLARE
  _nombre_tipo_resultado VARCHAR;
  _id_dpa INT;
  _id_tipo_dpa INT;
  _id_eleccion INT;
  _id_partido_antecesor INT;
  _id_partido INT;

BEGIN
  -- TODO Tiene que ser dinámica de acuerdo al año de elección
  _nombre_tipo_resultado := 'votos';
  _id_dpa := 1;
  _id_tipo_dpa := 1;
  _id_partido_antecesor := 83;
  _id_partido := 83;

  EXECUTE 'SELECT elecciones.id_eleccion FROM elecciones WHERE ano=$1 ORDER BY id_eleccion LIMIT 1'
  USING _anio INTO _id_eleccion ;

  RAISE NOTICE 'Valor de _id_eleccion := %', _id_eleccion;

  RETURN QUERY EXECUTE format('SELECT * FROM ws_elecciones($1, %s, $2, $3, $4, $5, $6)', quote_literal(_nombre_tipo_resultado))
  USING _anio, _id_dpa, _id_tipo_dpa, _id_eleccion, _id_partido_antecesor, _id_partido;

END
$func$ LANGUAGE plpgsql;