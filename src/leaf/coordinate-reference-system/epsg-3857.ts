const { EPSG3857: epsg3857 } = (await import('leaflet')).CRS

export { epsg3857 }
