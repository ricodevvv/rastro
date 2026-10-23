export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const en = {
  site: {
    name: "Rastro",
    title: "Rastro: see and remove the metadata in your files",
    description:
      "See the location, device, author and dates hidden in your photos, PDFs, documents and videos, and remove them before sharing. Everything happens in your browser.",
  },
  nav: { language: "Español", theme: "Toggle theme" },
  hero: {
    eyebrow: "Metadata viewer and cleaner",
    title: "Your files say more than you think.",
    subtitle:
      "See the location, device, author and dates hidden in photos, PDFs, documents and videos. Remove them before you share. Everything happens in your browser, nothing is uploaded.",
  },
  drop: {
    title: "Drop files to inspect",
    or: "or",
    choose: "Choose files",
    formats: "Photos, PDF, Word, Excel, PowerPoint, audio and video",
    local: "Read on your device. Nothing leaves it.",
  },
  report: {
    reading: "Reading",
    clean: "Remove metadata",
    cleaning: "Cleaning",
    download: "Download clean file",
    downloadAll: "Clean all and download (.zip)",
    json: "JSON",
    remove: "Remove",
    removed: "fields removed",
    nothingLeft: "No personal metadata left.",
    leftover: "Still in the file",
    noClean: "Removing metadata isn't supported for this format yet. You can still see everything it contains.",
    filter: "Filter fields...",
    fields: "fields",
    noFindings: "Nothing personal found. Only technical details.",
    empty: "This file has no metadata we can read.",
    map: "Show on map",
    openMap: "Open in Apple Maps",
    findingsTitle: "What it gives away",
    mapNote: "The map loads from OpenStreetMap when you open it.",
    clear: "Clear all",
    error: "Couldn't read this file.",
    encrypted: "This PDF is password protected, so its metadata can't be read or removed.",
  },
  levels: { high: "high", medium: "medium", low: "low" },
  findings: {
    location: "Reveals where it was taken",
    author: "Contains a name",
    serial: "Contains a device serial number",
    device: "Identifies the device",
    company: "Names a company or organization",
    date: "Records when it was made",
    software: "Shows the software used",
    history: "Keeps editing history",
    comments: "Has hidden comments or descriptions",
  },
  groups: {
    file: "File",
    camera: "Camera and device",
    location: "Location",
    dates: "Dates",
    image: "Image",
    exif: "EXIF",
    gps: "GPS",
    xmp: "XMP",
    iptc: "IPTC",
    icc: "Color profile",
    document: "Document",
    custom: "Custom properties",
    general: "General",
    video: "Video",
    audio: "Audio",
    other: "Other",
  },
  file: { name: "Name", type: "Type", size: "Size", modified: "Last modified" },
  learn: {
    title: "What is metadata?",
    text: "Information your camera, phone or software adds to a file automatically. You don't see it when you open the file, but anyone who gets a copy can read it.",
    items: [
      { title: "Photos", text: "GPS coordinates, the exact time, phone model, lens and sometimes its serial number." },
      { title: "Documents", text: "The author's name, the company, who edited it last, how long it was edited and with which program." },
      { title: "Videos and audio", text: "Recording device, place, date and the app that exported it." },
    ],
    cleanTitle: "How cleaning works",
    cleanText:
      "Photos are cleaned without re-compressing them, so they don't lose quality, and they keep their orientation. PDFs lose their author, title and editing data. Office files lose their author, company and revision details.",
  },
  footer: { made: "Made by", source: "Source code" },
};

export type Dictionary = typeof en;

const es: Dictionary = {
  site: {
    name: "Rastro",
    title: "Rastro: mira y borra los metadatos de tus archivos",
    description:
      "Mira la ubicación, el dispositivo, el autor y las fechas escondidas en tus fotos, PDFs, documentos y videos, y bórralos antes de compartir. Todo pasa en tu navegador.",
  },
  nav: { language: "English", theme: "Cambiar tema" },
  hero: {
    eyebrow: "Visor y limpiador de metadatos",
    title: "Tus archivos dicen más de lo que crees.",
    subtitle:
      "Mira la ubicación, el dispositivo, el autor y las fechas escondidas en fotos, PDFs, documentos y videos. Bórralos antes de compartir. Todo pasa en tu navegador, no se sube nada.",
  },
  drop: {
    title: "Suelta archivos para revisarlos",
    or: "o",
    choose: "Elegir archivos",
    formats: "Fotos, PDF, Word, Excel, PowerPoint, audio y video",
    local: "Se leen en tu dispositivo. No salen de él.",
  },
  report: {
    reading: "Leyendo",
    clean: "Borrar metadatos",
    cleaning: "Limpiando",
    download: "Descargar archivo limpio",
    downloadAll: "Limpiar todo y descargar (.zip)",
    json: "JSON",
    remove: "Quitar",
    removed: "campos borrados",
    nothingLeft: "Ya no quedan metadatos personales.",
    leftover: "Sigue en el archivo",
    noClean: "Todavía no se pueden borrar los metadatos de este formato. Aun así puedes ver todo lo que contiene.",
    filter: "Filtrar campos...",
    fields: "campos",
    noFindings: "No hay nada personal. Solo detalles técnicos.",
    empty: "Este archivo no tiene metadatos que se puedan leer.",
    map: "Ver en el mapa",
    openMap: "Abrir en Apple Maps",
    findingsTitle: "Lo que revela",
    mapNote: "El mapa se carga desde OpenStreetMap cuando lo abres.",
    clear: "Quitar todo",
    error: "No se pudo leer este archivo.",
    encrypted: "Este PDF tiene contraseña, así que no se pueden leer ni borrar sus metadatos.",
  },
  levels: { high: "alto", medium: "medio", low: "bajo" },
  findings: {
    location: "Revela dónde se tomó",
    author: "Tiene un nombre",
    serial: "Tiene el número de serie del dispositivo",
    device: "Identifica el dispositivo",
    company: "Menciona una empresa u organización",
    date: "Guarda cuándo se hizo",
    software: "Muestra el programa que se usó",
    history: "Guarda historial de edición",
    comments: "Tiene comentarios o descripciones ocultas",
  },
  groups: {
    file: "Archivo",
    camera: "Cámara y dispositivo",
    location: "Ubicación",
    dates: "Fechas",
    image: "Imagen",
    exif: "EXIF",
    gps: "GPS",
    xmp: "XMP",
    iptc: "IPTC",
    icc: "Perfil de color",
    document: "Documento",
    custom: "Propiedades personalizadas",
    general: "General",
    video: "Video",
    audio: "Audio",
    other: "Otros",
  },
  file: { name: "Nombre", type: "Tipo", size: "Tamaño", modified: "Última modificación" },
  learn: {
    title: "¿Qué son los metadatos?",
    text: "Información que tu cámara, tu celular o tus programas le agregan solos a un archivo. No la ves al abrirlo, pero cualquiera que reciba una copia la puede leer.",
    items: [
      { title: "Fotos", text: "Coordenadas GPS, la hora exacta, el modelo del celular, el lente y a veces su número de serie." },
      { title: "Documentos", text: "El nombre del autor, la empresa, quién lo editó al último, cuánto tiempo se editó y con qué programa." },
      { title: "Videos y audio", text: "El dispositivo que grabó, el lugar, la fecha y la app con la que se exportó." },
    ],
    cleanTitle: "Cómo funciona la limpieza",
    cleanText:
      "Las fotos se limpian sin volver a comprimirlas, así que no pierden calidad, y conservan su orientación. Los PDFs pierden su autor, título y datos de edición. Los archivos de Office pierden su autor, empresa y datos de revisión.",
  },
  footer: { made: "Hecho por", source: "Código fuente" },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale) {
  return DICTIONARIES[locale];
}

export const GITHUB_URL = "https://github.com/ricodevvv/rastro";
export const AUTHOR_URL = "https://github.com/ricodevvv";
