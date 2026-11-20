import type { Messages } from '../types'

const messages: Messages = {
  "meta": {
    "title": "Blindfold — la Agent Skill que oculta el contexto",
    "headline": "la Agent Skill que oculta el contexto",
    "description": "Una Agent Skill que le venda los ojos a tu agente de IA por un momento. Oculta el contexto existente para que subagentes independientes piensen desde cero y encuentren alternativas realmente nuevas. Compatible con Claude Code, Codex y cualquier cliente de Agent Skills.",
    "share": "Cuanto más sabe, menos imagina. Blindfold oculta lo que tu agente ya sabe para que subagentes nuevos piensen desde cero.",
    "imageAlt": "La mascota de Blindfold con los ojos vendados, rodeada de bombillas de ideas",
    "keywords": "Blindfold, agente de IA, Agent Skills, Claude Code, Codex, subagentes, lluvia de ideas, anclaje de contexto, plugin",
    "noscript": "Activa JavaScript para ver el contenido interactivo de esta página."
  },
  "nav": {
    "home": "Blindfold, volver al inicio",
    "sections": "Secciones",
    "language": "Idioma"
  },
  "story": {
    "aria": "Cuando el contexto se llena, el pensamiento se estrecha; al ocultarlo, vuelve a abrirse",
    "heroTag": [
      "Cuanto más sabe,",
      "menos imagina."
    ],
    "heroDesc": "Una skill que le venda los ojos a tu agente de IA por un momento. Oculta el contexto existente y deja que subagentes independientes piensen desde cero.",
    "cue": "Desplázate para llenar el contexto",
    "chapters": [
      "Un requisito. Las direcciones posibles son incontables.",
      "Lee el código, escucha los intentos anteriores y, cuanto más larga es la conversación, más se inclina su pensamiento hacia un lado.",
      "150k tokens. La ventana va apenas al 15%, pero preguntes lo que preguntes, todo fluye hacia la respuesta que ya existe.",
      "Deja solo el brief y el pensamiento inclinado vuelve a abrirse en todas direcciones."
    ],
    "lead": "Cuanto menos sabe,\nmás imagina."
  },
  "why": {
    "label": "Por qué importa",
    "manifesto": "Un agente se ancla en las pantallas y el código que ya ha visto. Cuanto más larga es la conversación, menos se aleja del punto de partida aunque le pidas un diseño nuevo. El mismo modelo, sin ver el trabajo existente, encuentra otro camino."
  },
  "how": {
    "label": "Cómo funciona",
    "blindzone": "Pasos que se ejecutan con los ojos vendados",
    "steps": [
      {
        "name": "Extraer",
        "desc": "Toma del trabajo existente solo los requisitos que deben cumplirse y los resume en un brief corto."
      },
      {
        "name": "Aislar",
        "desc": "Lanza varios subagentes que solo llevan el brief. La lectura de archivos está bloqueada."
      },
      {
        "name": "Divergir",
        "desc": "Cada agente diseña su propia alternativa sin conocer la solución actual."
      }
    ]
  },
  "compare": {
    "label": "Comparación · Ejemplo",
    "title": "La misma petición, otro punto de partida.",
    "ask": "Petición",
    "prompt": "Quiero rehacer el onboarding para que abandone menos gente",
    "withoutAria": "Sin Blindfold: las tres propuestas son variaciones del formulario actual de 3 pasos",
    "withAria": "Con Blindfold: tres direcciones distintas",
    "mainAgent": "Agente principal",
    "subagents": "Subagentes × 3 · cada uno por su cuenta",
    "loaded": [
      "Pantallas y código actuales",
      "7 maquetas anteriores",
      "96 turnos de conversación",
      "3 intentos descartados"
    ],
    "briefWhat": "Una página, solo requisitos",
    "goal": "Reducir el abandono durante el registro y subir la tasa de finalización al 55% o más.",
    "context": "Una pizarra colaborativa web que usan diseñadores, desarrolladores y PMs. Hoy el registro se completa en un 38% · color principal de marca #3B5BFD, texto #111318 · el logo es un wordmark de texto arriba a la izquierda · se piden email, contraseña y rol · debe caber en la primera pantalla de 360px.",
    "results": "Resultado · 3 propuestas",
    "sameForm": "Todas siguen siendo el formulario de 3 pasos",
    "blindResults": "Sin ver las respuestas de los demás",
    "verdictWithout": "Las tres son variaciones del formulario actual de 3 pasos.",
    "verdictWith": "Tres direcciones distintas.",
    "nudges": [
      "Cambiar solo el color del botón",
      "Pulir solo el texto de ayuda",
      "Añadir solo una barra de progreso"
    ],
    "alts": [
      {
        "title": "Onboarding conversacional",
        "desc": "Hace una pregunta a la vez y recoge los tres datos como en un chat. No parece un formulario."
      },
      {
        "title": "Pruébalo primero",
        "desc": "Deja usar el producto sin registrarse y pide el registro la primera vez que se guarda algo."
      },
      {
        "title": "Una sola tarjeta",
        "desc": "Reúne los tres campos en una tarjeta y el rol se elige con chips. El indicador de pasos desaparece."
      }
    ],
    "pickHint": "Las tres propuestas de la derecha no vieron las respuestas de las demás ni la existente. Elige una.",
    "pickThen": "Ahora el agente principal la aplica según el sistema de diseño y el código existentes.",
    "sketch": {
      "email": "Email",
      "password": "Contraseña",
      "role": "Rol",
      "hint": "¡Solo 30 segundos!",
      "next": "Siguiente",
      "askEmail": "¿Cuál es tu email?",
      "emailAnswer": "me@estudio.es",
      "askRole": "¿A qué te dedicas?",
      "roles": [
        "Diseño",
        "Dev",
        "Producto",
        "Otro"
      ],
      "saveToSignUp": "Regístrate para guardar",
      "quickSignUp": "Regístrate en 10 s",
      "start": "Empezar"
    }
  },
  "start": {
    "label": "Empezar",
    "copyFail": "Selecciona y copia",
    "when": "Cuando cada nueva versión solo cambia un poco en la misma dirección, o necesitas una dirección totalmente nueva.",
    "get": "Un brief de requisitos y varias alternativas independientes.",
    "then": "El agente principal integra la opción elegida en el proyecto existente."
  },
  "install": {
    "short": "Instalar",
    "title": "Instalar Blindfold",
    "options": "Opciones de instalación",
    "method": "Elige un método de instalación",
    "where": {
      "skills": "Ejecuta este comando en la terminal.",
      "claude": "Ejecuta estos comandos en orden dentro de Claude Code.",
      "codex": "Ejecuta estos comandos en orden en la terminal."
    },
    "invoke": "Úsalo en tu agente",
    "request": "solicitud",
    "copy": "Copiar",
    "copied": "Copiado"
  }
}

export default messages
