import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'PDF Service running' });
});

// Endpoint para generar PDF
app.post('/api/generate-pdf', async (req: Request, res: Response) => {
  let browser;
  
  try {
    console.log('Iniciando generación de PDF...');
    
    const { url, html } = req.body;
    
    if (!url && !html) {
      return res.status(400).json({ 
        error: 'Se requiere URL o HTML' 
      });
    }

    // Lanzar navegador headless
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });

    // Cargar contenido
    if (url) {
      console.log(`Navegando a: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    } else if (html) {
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });
    }

    // Esperar a que se cargue todo el contenido dinámico de React
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve());
        }
      });
    });

    // Inyectar estilos adicionales para impresión
    await page.addStyleTag({
      content: `
        @media print {
          @page {
            margin: 20mm;
            size: A4;
          }
        }
      `
    });

    console.log('Generando PDF...');
    
    // Generar PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 8px; text-align: center; width: 100%; color: #666; padding: 5mm 0; font-family: sans-serif;">
          <span>Manual LiveSync PRO - Technical Rider</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 8px; text-align: center; width: 100%; color: #666; padding: 5mm 0; font-family: sans-serif;">
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span> | © ${new Date().getFullYear()} LiveSync Pro</span>
        </div>
      `,
      preferCSSPageSize: true
    });

    console.log('PDF generado exitosamente');

    // Enviar PDF como descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Manual-LiveSync-PRO.pdf');
    res.setHeader('Content-Length', pdf.length);
    res.send(pdf);

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ 
      error: 'Error al generar PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 PDF Service corriendo en http://localhost:${PORT}`);
  console.log(`📄 Endpoint: POST /api/generate-pdf`);
});