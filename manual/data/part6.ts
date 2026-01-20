
import { ManualPart } from '../types';

export const part6: ManualPart = {
  id: "part-6",
  title: "EXPORTACIÓN Y FLUJO FINAL",
  sections: [
    {
      id: "export-buttons-full",
      title: "26. BOTONES DE EXPORTACIÓN Y VISUALIZACIÓN",
      content: [
        "En la parte superior del Reporte Técnico, LiveSync Pro ofrece varios botones para exportar y visualizar los resultados.",
        "",
        "**26. BOTÓN '3D'**",
        "Activa/desactiva la visualización 3D geométrica interactiva. Muestra Main PA (Cyan), Subs (Púrpura), Torres (Naranja) y Escenario (Gris).",
        "• **Controles:** Click + Arrastrar para rotar la vista.",
        "• **Utilidad:** Validar geometría, comunicar diseño a riggers y stage managers.",
        "",
        "**27. BOTÓN 'COPY' (Copiar Reporte)**",
        "Copia el reporte técnico completo al portapapeles en formato texto plano.",
        "• **Incluye:** Specs del sistema, Condiciones ambientales, Tabla de alineación, Análisis eléctrico y logística.",
        "• **Confirmación:** El botón cambia temporalmente a ✅ \"Copiado\" (color verde).",
        "",
        "**28. BOTÓN 'PDF' (Descargar Reporte PDF)**",
        "Genera un reporte profesional visual con gráficas embebidas.",
        "• **Contenido:** Portada, Specs Técnicas, Tabla de Delays, Análisis Acústico, Diseño de Subs, Ingeniería Eléctrica, Logística/BOM, Gráficas y Disclaimer Legal.",
        "• **Tiempo:** 3-8 segundos. Nombre: LiveSync_Pro_Report_[Nombre]_[Fecha].pdf.",
        "",
        "**29. BOTÓN 'CAD' (Descargar DXF)**",
        "Genera un archivo DXF (Drawing Exchange Format) compatible con software CAD profesional (AutoCAD, QCAD, SketchUp, Vectorworks).",
        "• **Capas (Layers):** STAGE, MAIN_PA_L, MAIN_PA_R, SUBWOOFERS, DELAY_TOWER_[n], FOH_POSITION, DIMENSIONS.",
        "• **Unidades:** Metros. Escala 1:1 (tamaño real).",
        "",
        "**30. BOTÓN 'VOLVER A CONFIGURACIÓN'**",
        "Ubicado al final del reporte. Regresa a la vista Configuration View para ajustar parámetros o cambiar modelos. Los resultados previos se mantienen guardados."
      ]
    },
    {
      id: "workflow-summary-full",
      title: "31. FLUJO TÍPICO DE USO (RESUMEN)",
      content: [
        "LiveSync Pro está diseñado para iteración rápida:",
        "1. **Acceso:** Inicia sesión y ve al Hub.",
        "2. **Crear Proyecto:** Ingresa nombre, cliente y equipo.",
        "3. **Configuración:** Entorno, PA, Monitors, FOH Control y Objetivos.",
        "4. **Calcular:** Haz clic en \"CALCULAR SISTEMA\" (espera 1-3s).",
        "5. **Revisar Resultados:** Analiza Reporte, alertas y gráficas.",
        "6. **Exportar:** Copy para chat, PDF para producción, CAD para planos.",
        "7. **Iterar:** Si hay problemas (ej: damping bajo), ajusta parámetros y recalcula.",
        "8. **Implementación:** Usa valores de Delay y Gain en el DSP real. Implementa topología de subs.",
        "9. **Validación en Campo:** Lleva el PDF y verifica con SMAART/REW."
      ]
    },
    {
      id: "advanced-tips-full",
      title: "32. CONSEJOS AVANZADOS",
      content: [
        "**32.1 Para Mejorar Precisión**",
        "• **Mide RT60:** Usa mediciones reales siempre que sea posible.",
        "• **Drift Térmico:** Anticipa cambios de temperatura entre prueba y show.",
        "• **Catálogo:** Usa modelos exactos de amplificadores para cálculos de consumo reales.",
        "",
        "**32.2 Rigging Seguro**",
        "• Respeta siempre el SWL del venue.",
        "• Considera carga dinámica (viento y motores) en el diseño final."
      ]
    }
  ]
};
