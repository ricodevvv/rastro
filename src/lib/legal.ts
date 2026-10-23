import type { Locale } from "./i18n";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const CONTACT = "contact@ricodevvv.com";
const OWNER = "Ricardo Antonio";

const privacyEs: LegalDocument = {
  title: "Aviso de privacidad",
  updated: "Última actualización: 23 de octubre de 2026",
  intro: `Este aviso explica qué datos personales se tratan cuando usas Rastro (metadata.ricodevvv.com), para qué y cómo puedes ejercer tus derechos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el Diario Oficial de la Federación el 20 de marzo de 2025.`,
  sections: [
    {
      heading: "Responsable",
      paragraphs: [
        `El responsable del tratamiento de tus datos personales es ${OWNER} ("ricodevvv"), quien recibe solicitudes y notificaciones en el correo ${CONTACT}.`,
      ],
    },
    {
      heading: "Tus archivos no se envían a ningún lado",
      paragraphs: [
        "Rastro lee y limpia los archivos dentro de tu navegador. Las fotos, documentos, audios y videos que revisas, y los metadatos que contienen, nunca se suben a nuestros servidores ni a los de terceros. No los vemos, no los guardamos y no podemos recuperarlos.",
        "Por eso, el contenido de tus archivos y los datos que hay en ellos (como ubicación, nombres o números de serie) no forman parte de ninguna base de datos del responsable.",
      ],
    },
    {
      heading: "Datos que sí se tratan",
      paragraphs: [
        "Datos técnicos de navegación: cuando visitas el sitio, el proveedor de hospedaje registra de forma automática tu dirección IP, el tipo de navegador y sistema operativo, la página solicitada, la fecha y la hora. Esto es necesario para entregar el sitio y protegerlo contra abusos.",
        "Coordenadas que tú decides abrir en un mapa: si una foto o video tiene ubicación y presionas \"Ver en el mapa\", tu navegador pide el mapa a OpenStreetMap, que recibe tu dirección IP y esas coordenadas. Si presionas \"Abrir en Apple Maps\", las coordenadas se envían a Apple. Esto solo ocurre cuando tú lo eliges.",
        "Mensajes que nos envíes: si nos escribes por correo, tratamos tu dirección de correo y lo que nos cuentes solo para responderte.",
        "No recabamos datos personales sensibles.",
      ],
    },
    {
      heading: "Finalidades",
      paragraphs: [
        "Los datos técnicos se usan únicamente para operar el sitio, mantenerlo disponible y seguro, y diagnosticar errores. Los mensajes se usan únicamente para atender tu solicitud.",
        "No usamos tus datos para publicidad, perfiles, mercadotecnia ni ninguna finalidad secundaria. No vendemos datos personales.",
      ],
    },
    {
      heading: "Cookies y almacenamiento local",
      paragraphs: [
        "Rastro no usa cookies, herramientas de analítica ni rastreadores publicitarios. Solo guarda en tu navegador (almacenamiento local) si prefieres el tema claro u oscuro. Puedes borrarlo cuando quieras desde la configuración de tu navegador.",
      ],
    },
    {
      heading: "Encargados y transferencias",
      paragraphs: [
        "El sitio se hospeda en Vercel Inc., en Estados Unidos, que trata los datos técnicos de navegación por cuenta del responsable. Al usar el sitio, esos datos se procesan fuera de México bajo las condiciones de privacidad de Vercel.",
        "OpenStreetMap Foundation (Reino Unido) y Apple Inc. (Estados Unidos) solo reciben datos si eliges abrir un mapa, y los tratan bajo sus propios avisos de privacidad.",
        "No realizamos otras transferencias de datos personales.",
      ],
    },
    {
      heading: "Derechos ARCO y revocación del consentimiento",
      paragraphs: [
        `Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su tratamiento, así como revocar tu consentimiento o limitar su uso, escribiendo a ${CONTACT}. Indica tu nombre, el derecho que quieres ejercer, una descripción clara de los datos y un medio para responderte.`,
        "Responderemos en un plazo máximo de 20 días hábiles y, si procede, haremos efectiva la solicitud dentro de los 15 días hábiles siguientes. Ten en cuenta que, como no guardamos tus archivos ni registros asociados a tu identidad, es posible que no tengamos datos tuyos que entregar o borrar.",
      ],
    },
    {
      heading: "Conservación",
      paragraphs: [
        "Los registros técnicos se conservan el tiempo que el proveedor de hospedaje los mantiene para operar el servicio. Los correos se conservan mientras sean necesarios para atenderte.",
      ],
    },
    {
      heading: "Menores de edad",
      paragraphs: ["El sitio no está dirigido a menores de edad y no recabamos a sabiendas datos de menores."],
    },
    {
      heading: "Cambios a este aviso",
      paragraphs: ["Cualquier cambio se publicará en esta misma página, con su fecha de actualización."],
    },
    {
      heading: "Autoridad",
      paragraphs: [
        "Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir ante la Secretaría Anticorrupción y Buen Gobierno, autoridad competente en la materia.",
      ],
    },
  ],
};

const privacyEn: LegalDocument = {
  title: "Privacy notice",
  updated: "Last updated: October 23, 2026",
  intro:
    "This notice explains what personal data is processed when you use Rastro (metadata.ricodevvv.com), why, and how to exercise your rights, under Mexico's Federal Law on the Protection of Personal Data Held by Private Parties published on March 20, 2025. The Spanish version prevails.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [`The party responsible for your personal data is ${OWNER} ("ricodevvv"), reachable at ${CONTACT}.`],
    },
    {
      heading: "Your files never leave your browser",
      paragraphs: [
        "Rastro reads and cleans files inside your browser. The photos, documents, audio and video you inspect, and the metadata in them, are never uploaded to our servers or anyone else's. We don't see them, keep them or have any way to get them back.",
      ],
    },
    {
      heading: "Data that is processed",
      paragraphs: [
        "Technical data: when you visit the site, the hosting provider automatically logs your IP address, browser and operating system, the page requested, and the date and time. This is needed to serve the site and protect it from abuse.",
        "Coordinates you choose to map: if a photo or video has a location and you press \"Show on map\", your browser loads the map from OpenStreetMap, which receives your IP address and those coordinates. \"Open in Apple Maps\" sends the coordinates to Apple. This only happens when you choose it.",
        "Messages you send: if you email us, we use your address and what you write only to reply.",
        "We don't collect sensitive personal data.",
      ],
    },
    {
      heading: "Purposes",
      paragraphs: [
        "Technical data is used only to run the site, keep it available and secure, and fix errors. Messages are used only to answer you. Nothing is used for advertising, profiling or marketing, and no personal data is sold.",
      ],
    },
    {
      heading: "Cookies and local storage",
      paragraphs: [
        "Rastro uses no cookies, analytics or ad trackers. It only stores your light or dark theme preference in your browser's local storage, which you can clear at any time.",
      ],
    },
    {
      heading: "Processors and transfers",
      paragraphs: [
        "The site is hosted by Vercel Inc. in the United States, which processes technical data on our behalf. OpenStreetMap Foundation (United Kingdom) and Apple Inc. (United States) only receive data if you choose to open a map, under their own privacy policies. There are no other transfers.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `You can access, correct, delete or object to the processing of your data, withdraw consent or limit its use by writing to ${CONTACT}. We answer within 20 business days and, if it applies, act on the request within the following 15. Since we don't keep your files or records tied to your identity, we may have no data of yours to hand over or delete.`,
      ],
    },
    {
      heading: "Retention",
      paragraphs: ["Technical logs are kept as long as the hosting provider keeps them to run the service. Emails are kept as long as needed to help you."],
    },
    {
      heading: "Minors",
      paragraphs: ["The site isn't aimed at minors and we don't knowingly collect their data."],
    },
    {
      heading: "Changes",
      paragraphs: ["Any change will be posted on this page with its update date."],
    },
    {
      heading: "Authority",
      paragraphs: ["If you believe your data protection rights were violated, you can go to Mexico's Secretaría Anticorrupción y Buen Gobierno."],
    },
  ],
};

const termsEs: LegalDocument = {
  title: "Términos y condiciones de uso",
  updated: "Última actualización: 23 de octubre de 2026",
  intro: `Estos términos regulan el uso de Rastro (metadata.ricodevvv.com), un servicio gratuito operado por ${OWNER} ("ricodevvv"). Al usar el sitio aceptas estos términos. Si no estás de acuerdo, no lo uses.`,
  sections: [
    {
      heading: "Qué es Rastro",
      paragraphs: [
        "Rastro es una herramienta gratuita que muestra los metadatos de tus archivos y permite borrar algunos de ellos. Todo el procesamiento ocurre en tu navegador; los archivos no se envían a ningún servidor.",
        "El servicio se ofrece sin costo, sin registro y sin garantía de disponibilidad continua. Podemos modificarlo, suspenderlo o retirarlo en cualquier momento.",
      ],
    },
    {
      heading: "Uso permitido",
      paragraphs: [
        "Solo debes usar Rastro con archivos que tengas derecho a revisar o modificar, y para fines lícitos. Eres el único responsable del contenido de tus archivos y del uso que des a la información que muestra la herramienta.",
        "No está permitido usar el sitio para violar derechos de terceros, alterar evidencia, ocultar el origen de material ilícito, ni intentar dañar, sobrecargar o vulnerar el sitio o la infraestructura que lo hospeda.",
      ],
    },
    {
      heading: "Alcance de la limpieza",
      paragraphs: [
        "Rastro borra los metadatos más comunes de los formatos que soporta, pero no puede garantizar que un archivo quede libre de toda información identificable. Algunos datos pueden permanecer, por ejemplo: lo que se ve en la imagen o el documento, imágenes incrustadas dentro de un documento, metadatos en formatos que no soportamos, o marcas propias de cada programa o dispositivo.",
        "Revisa el resultado antes de compartir un archivo. No uses Rastro como única medida de protección en situaciones donde tu seguridad dependa de ello.",
      ],
    },
    {
      heading: "Sin garantías",
      paragraphs: [
        "El sitio y la herramienta se proporcionan \"tal cual\" y \"según disponibilidad\", sin garantías de ningún tipo, expresas o implícitas, incluidas las de exactitud, funcionamiento sin errores o idoneidad para un propósito específico. Conserva siempre una copia de tus archivos originales.",
      ],
    },
    {
      heading: "Limitación de responsabilidad",
      paragraphs: [
        "En la medida máxima permitida por la ley, el responsable no será responsable de daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar el sitio, incluidos la pérdida o corrupción de archivos o la divulgación de información que permanezca en ellos.",
      ],
    },
    {
      heading: "Servicios de terceros",
      paragraphs: [
        "Los mapas se muestran con OpenStreetMap y se pueden abrir en Apple Maps, solo cuando lo eliges. Esos servicios se rigen por sus propios términos y avisos de privacidad.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      paragraphs: [
        "El código de Rastro es software libre publicado bajo la licencia MIT en github.com/ricodevvv/rastro. Las marcas y nombres de terceros que aparecen en el sitio pertenecen a sus titulares y se mencionan solo con fines descriptivos.",
      ],
    },
    {
      heading: "Privacidad",
      paragraphs: ["El tratamiento de datos personales se describe en el Aviso de privacidad, que forma parte de estos términos."],
    },
    {
      heading: "Cambios",
      paragraphs: ["Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización."],
    },
    {
      heading: "Legislación aplicable",
      paragraphs: [
        "Estos términos se rigen por las leyes federales de los Estados Unidos Mexicanos. Cualquier controversia se resolverá ante los tribunales competentes de México, sin perjuicio de los derechos que la ley te reconozca como consumidor.",
      ],
    },
    {
      heading: "Contacto",
      paragraphs: [`Para cualquier duda sobre estos términos, escribe a ${CONTACT}.`],
    },
  ],
};

const termsEn: LegalDocument = {
  title: "Terms of use",
  updated: "Last updated: October 23, 2026",
  intro: `These terms govern your use of Rastro (metadata.ricodevvv.com), a free service run by ${OWNER} ("ricodevvv"). By using the site you accept them. The Spanish version prevails.`,
  sections: [
    {
      heading: "What Rastro is",
      paragraphs: [
        "A free tool that shows the metadata in your files and can remove some of it. All processing happens in your browser; files are never sent to a server. It's offered at no cost, without sign-up and without any guarantee of availability, and it can change or stop at any time.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "Only use Rastro with files you have the right to inspect or change, and for lawful purposes. You're solely responsible for your files and for how you use what the tool shows. Don't use it to violate others' rights, tamper with evidence, hide the origin of unlawful material, or attack the site or its hosting.",
      ],
    },
    {
      heading: "What cleaning covers",
      paragraphs: [
        "Rastro removes the most common metadata from the formats it supports, but it can't guarantee a file is free of all identifying information. What's visible in the image or document, images embedded in documents, unsupported formats and vendor-specific traces may remain. Check the result before sharing, and don't rely on Rastro alone when your safety depends on it.",
      ],
    },
    {
      heading: "No warranty",
      paragraphs: ["The site is provided \"as is\" and \"as available\", without warranties of any kind. Always keep a copy of your original files."],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the fullest extent allowed by law, we're not liable for any direct, indirect, incidental or consequential damages from using or not being able to use the site, including lost or corrupted files or information that remains in them.",
      ],
    },
    {
      heading: "Third-party services",
      paragraphs: ["Maps come from OpenStreetMap and can be opened in Apple Maps, only when you choose to. Those services have their own terms and privacy policies."],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "Rastro's code is free software under the MIT license at github.com/ricodevvv/rastro. Third-party names and trademarks belong to their owners and are mentioned only to describe things.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: ["How personal data is handled is described in the Privacy notice, which is part of these terms."],
    },
    {
      heading: "Changes",
      paragraphs: ["We may update these terms. The current version is the one on this page, with its update date."],
    },
    {
      heading: "Governing law",
      paragraphs: ["These terms are governed by the federal laws of Mexico, and any dispute goes to the competent courts of Mexico, without affecting your rights as a consumer."],
    },
    {
      heading: "Contact",
      paragraphs: [`Questions about these terms: ${CONTACT}.`],
    },
  ],
};

export const LEGAL: Record<"privacy" | "terms", Record<Locale, LegalDocument>> = {
  privacy: { es: privacyEs, en: privacyEn },
  terms: { es: termsEs, en: termsEn },
};

export const LEGAL_CONTACT = CONTACT;
