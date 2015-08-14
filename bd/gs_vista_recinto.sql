--
-- Vista simplificada en GeoServer para mostrar Municipio
-- Nombre en Geoserver: geoelectoral-recinto
SELECT
  dpa.id_dpa,
  dpa.id_tipo_dpa,
  dpa.nombre,
  dpa.id_dpa_superior,
  ST_Simplify(dpa.the_geom, 0.0375) as the_geom,
  dpa.extent,
  dpa.area_km2,
  dpa.id_dpa_madre,
  dpa.fecha_creacion_oficial,
  dpa.fecha_supresion_oficial,
  dpa.fecha_creacion_corte,
  dpa.fecha_supresion_corte,
  dpa.codigo,
  dpa.codigo_parcial,
  dpa.codigo_ine,
  dpa.seccion,
  jerarquia_dpa.id_dpa_antecesor,
  jerarquia_dpa.distancia,
  jerarquia_dpa.id_tipo_dpa_antecesor
FROM
  public.jerarquia_dpa,
  public.dpa
WHERE
  jerarquia_dpa.id_dpa_descendiente = dpa.id_dpa AND
  jerarquia_dpa.id_tipo_dpa_descendiente = dpa.id_tipo_dpa
ORDER BY dpa.id_tipo_dpa ASC
