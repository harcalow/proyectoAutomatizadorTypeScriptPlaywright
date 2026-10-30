import fs from 'node:fs';
import path from 'node:path';

const STORIES_DIR = path.resolve(__dirname, '../../historias-usuario');

export interface UserStory {
  id: string;
  title: string;
  description: string;
  criteria: Record<string, string>;
  /** Devuelve el título del test para un criterio: "CA-01: Dado ..." */
  criterion(id: string): string;
}

function sections(markdown: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const block of markdown.split(/^## /m).slice(1)) {
    const [heading, ...body] = block.split('\n');
    result[normalize(heading)] = body.join('\n').trim();
  }
  return result;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function loadUserStory(id: string): UserStory {
  const file = fs.readdirSync(STORIES_DIR).find((f) => f.startsWith(`${id}-`) || f === `${id}.md`);
  if (!file) throw new Error(`No existe la historia ${id} en ${STORIES_DIR}`);

  const markdown = fs.readFileSync(path.join(STORIES_DIR, file), 'utf8').replace(/\r\n/g, '\n');
  const parts = sections(markdown);
  const title = parts['titulo'];
  const description = parts['descripcion'];
  const criteriaText = parts['criterios de aceptacion'];
  if (!title || !description || !criteriaText) {
    throw new Error(`${file} debe tener las secciones "## Título", "## Descripción" y "## Criterios de aceptación"`);
  }

  const criteria: Record<string, string> = {};
  for (const match of criteriaText.matchAll(/^-\s*(CA-\d+)\s*:\s*(.+)$/gm)) {
    criteria[match[1]] = match[2].trim();
  }

  return {
    id,
    title,
    description,
    criteria,
    criterion(caId: string): string {
      const text = criteria[caId];
      if (!text) throw new Error(`El criterio ${caId} no existe en ${file}`);
      return `${caId}: ${text}`;
    },
  };
}
