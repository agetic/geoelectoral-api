﻿---
-- Función: ws_elecciones
--   * Resultados de las elecciones de un determinado año.
--   * Los resultados son a nivel Bolivia por defecto
-- Parámetros:
--   * _anio: Es el año de la elección
--   * _nombre_tipo_resultado:  Tipo de resultado votos, diputados, senadores,...
--   * _id_dpa: Id de la división político administrativa
--   * _id_tipo_dpa: Id del tipo de división político administrativa, país, departamento,...
--   * _id_eleccion: Id de la elección plurinominal, uninominal, ...
--   * _id_partido_antecesor: Id del partido político grupo como INSCRITOS, EMITIDOS, VALIDOS
--   * _id_partido: Id del partido político normal
--
-- Ejemplo:
--   SELECT * FROM ws_elecciones(2009, 'votos', 1, 2, null, 1, 83, 83)
--
-- Eliminar función:
DROP FUNCTION IF EXISTS ws_elecciones(_anio INT, _nombre_tipo_resultado VARCHAR,_id_dpa INT, _id_tipo_dpa INT, _id_eleccion INT, _id_tipo_eleccion INT, _id_partido_antecesor INT,_id_partido INT);
--
CREATE OR REPLACE FUNCTION ws_elecciones(
    _anio INT                      DEFAULT 2009,    -- Desde 1979 hasta 2009
    _nombre_tipo_resultado VARCHAR DEFAULT 'votos', -- votos, diputados, senadores, constituyentes
    _id_dpa INT                    DEFAULT 1,       -- Bolivia
    _id_tipo_dpa INT               DEFAULT 1,       -- pais
    _id_eleccion INT               DEFAULT NULL,    -- Depende del parámetro 'anio'
    _id_tipo_eleccion INT          DEFAULT 1,       -- Depende del parámetro 'anio'
    _id_partido_antecesor INT      DEFAULT 83,      -- VALIDOS
    _id_partido INT                DEFAULT 83       -- VALIDOS
  )
  RETURNS
  TABLE(id_dpa INT, dpa_codigo VARCHAR, dpa_nombre VARCHAR, id_dpa_superior INT, anio INT, nombre_tipo_resultado VARCHAR, id_partido INT, id_tipo_partido INT,
        sigla VARCHAR, color CHAR(6), partido_nombre VARCHAR, codigo_sigla VARCHAR, resultado INT, observacion TEXT, id_eleccion INT, id_tipo_eleccion INT,
        fecha DATE, descripcion TEXT, porcentaje REAL) AS
$func$
BEGIN

  IF _id_eleccion IS NULL THEN
    EXECUTE 'SELECT id_eleccion FROM elecciones WHERE ano=$1 AND id_tipo_eleccion=$2 ORDER BY id_eleccion LIMIT 1'
    USING _anio, _id_tipo_eleccion INTO _id_eleccion;
  END IF;

  RETURN QUERY EXECUTE format('
    SELECT
      resultados.id_dpa,
      dpa.codigo,
      dpa.nombre,
      dpa.id_dpa_superior,
      elecciones.ano,
      tipos_resultado_eleccion_dpa.nombre_tipo_resultado,
      resultados.id_partido,
      resultados.id_tipo_partido,
      partidos.sigla,
      partidos.color1,
      partidos.nombre AS partido_nombre,
      (dpa.codigo || '' '' || partidos.sigla)::VARCHAR AS codigo_sigla,
      resultados.resultado,
      resultados.observacion,
      resultados.id_eleccion,
      elecciones.id_tipo_eleccion,
      elecciones.fecha,
      elecciones.descripcion,
      (CASE WHEN (SUM(resultado) OVER (PARTITION BY resultados.id_dpa, jerarquia_partidos.distancia)) <> 0 THEN
        ROUND(100.0 * resultado/(SUM(resultado) OVER (PARTITION BY resultados.id_dpa, jerarquia_partidos.distancia)), 2)
      ELSE
        0.0
      END)::REAL AS porcentaje
    FROM
      public.resultados,
      public.elecciones,
      public.tipos_resultado_eleccion_dpa,
      public.jerarquia_partidos,
      public.partidos,
      public.dpa,
      public.jerarquia_dpa
    WHERE
      resultados.id_eleccion = elecciones.id_eleccion AND
      tipos_resultado_eleccion_dpa.id_tipo_resultado = resultados.id_tipo_resultado AND
      tipos_resultado_eleccion_dpa.id_tipo_dpa = resultados.id_tipo_dpa AND
      tipos_resultado_eleccion_dpa.id_tipo_eleccion = elecciones.id_tipo_eleccion AND
      jerarquia_partidos.id_partido_descendiente = resultados.id_partido AND
      partidos.id_partido = resultados.id_partido AND
      partidos.id_tipo_partido = resultados.id_tipo_partido AND
      dpa.id_dpa = resultados.id_dpa AND
      jerarquia_dpa.id_dpa_descendiente = resultados.id_dpa AND
      tipos_resultado_eleccion_dpa.nombre_tipo_resultado = %s AND
      elecciones.ano = $1 AND
      tipos_resultado_eleccion_dpa.id_tipo_dpa = $2 AND
      elecciones.id_eleccion = $3 AND
      jerarquia_partidos.id_partido_antecesor = $4 AND
      jerarquia_dpa.id_dpa_antecesor = $5 AND
      partidos.id_tipo_partido IN (1,4)
    ORDER BY
      codigo ASC,
      nombre ASC,
      jerarquia_partidos.distancia DESC,
      partidos.sigla ASC;'
      , quote_literal(_nombre_tipo_resultado))
  USING _anio, _id_tipo_dpa, _id_eleccion, _id_partido_antecesor, _id_dpa;

END
$func$ LANGUAGE plpgsql;



DROP FUNCTION IF EXISTS ws_elecciones2(_anio INT, _nombre_tipo_resultado VARCHAR,_id_dpa INT, _id_tipo_dpa INT, _id_eleccion INT, _id_tipo_eleccion INT, _id_partido_antecesor INT,_id_partido INT);
--
CREATE OR REPLACE FUNCTION ws_elecciones2(
    _anio INT                      DEFAULT 2009,    -- Desde 1979 hasta 2009
    _nombre_tipo_resultado VARCHAR DEFAULT 'votos', -- votos, diputados, senadores, constituyentes
    _id_dpa INT                    DEFAULT 1,       -- Bolivia
    _id_tipo_dpa INT               DEFAULT 1,       -- pais
    _id_eleccion INT               DEFAULT NULL,    -- Depende del parámetro 'anio'
    _id_tipo_eleccion INT          DEFAULT 1,       -- Depende del parámetro 'anio'
    _id_partido_antecesor INT      DEFAULT 83,      -- VALIDOS
    _id_partido INT                DEFAULT 83       -- VALIDOS
  )
  RETURNS
  TABLE(id_dpa INT, dpa_codigo VARCHAR, dpa_nombre VARCHAR, id_dpa_superior INT, anio INT, nombre_tipo_resultado VARCHAR, id_partido INT, id_tipo_partido INT,
        sigla VARCHAR, color CHAR(6), partido_nombre VARCHAR, codigo_sigla VARCHAR, resultado INT, observacion TEXT, id_eleccion INT, id_tipo_eleccion INT,
        fecha DATE, descripcion TEXT, porcentaje REAL) AS
$func$
BEGIN

  IF _id_eleccion IS NULL THEN
    EXECUTE 'SELECT id_eleccion FROM elecciones WHERE ano=$1 AND id_tipo_eleccion=$2 ORDER BY id_eleccion LIMIT 1'
    USING _anio, _id_tipo_eleccion INTO _id_eleccion;
  END IF;

  RETURN QUERY EXECUTE format('
    SELECT
      resultados.id_dpa,
      dpa.codigo,
      dpa.nombre,
      dpa.id_dpa_superior,
      elecciones.ano,
      tipos_resultado_eleccion_dpa.nombre_tipo_resultado,
      resultados.id_partido,
      resultados.id_tipo_partido,
      partidos.sigla,
      partidos.color1,
      partidos.nombre AS partido_nombre,
      (dpa.codigo || '' '' || partidos.sigla)::VARCHAR AS codigo_sigla,
      resultados.resultado,
      resultados.observacion,
      resultados.id_eleccion,
      elecciones.id_tipo_eleccion,
      elecciones.fecha,
      elecciones.descripcion,
      (CASE WHEN (SUM(resultado) OVER (PARTITION BY resultados.id_dpa, jerarquia_partidos.distancia)) <> 0 THEN
        ROUND(100.0 * resultado/(SUM(resultado) OVER (PARTITION BY resultados.id_dpa, jerarquia_partidos.distancia)), 2)
      ELSE
        0.0
      END)::REAL AS porcentaje
    FROM
      public.resultados,
      public.elecciones,
      public.tipos_resultado_eleccion_dpa,
      public.jerarquia_partidos,
      public.partidos,
      public.dpa,
      public.jerarquia_dpa
    WHERE
      resultados.id_eleccion = elecciones.id_eleccion AND
      tipos_resultado_eleccion_dpa.id_tipo_resultado = resultados.id_tipo_resultado AND
      tipos_resultado_eleccion_dpa.id_tipo_dpa = resultados.id_tipo_dpa AND
      tipos_resultado_eleccion_dpa.id_tipo_eleccion = elecciones.id_tipo_eleccion AND
      jerarquia_partidos.id_partido_descendiente = resultados.id_partido AND
      partidos.id_partido = resultados.id_partido AND
      partidos.id_tipo_partido = resultados.id_tipo_partido AND
      dpa.id_dpa = resultados.id_dpa AND
      jerarquia_dpa.id_dpa_descendiente = resultados.id_dpa AND
      tipos_resultado_eleccion_dpa.nombre_tipo_resultado = %s AND
      elecciones.ano = $1 AND
      tipos_resultado_eleccion_dpa.id_tipo_dpa = $2 AND
      elecciones.id_eleccion = $3 AND
      jerarquia_partidos.id_partido_antecesor = $4 AND
      jerarquia_dpa.id_dpa_antecesor = $5 AND
      partidos.id_tipo_partido IN (2,3,5)
    ORDER BY
      codigo ASC,
      nombre ASC,
      jerarquia_partidos.distancia DESC,
      partidos.sigla ASC;'
      , quote_literal(_nombre_tipo_resultado))
  USING _anio, _id_tipo_dpa, _id_eleccion, _id_partido_antecesor, _id_dpa;

END
$func$ LANGUAGE plpgsql;
