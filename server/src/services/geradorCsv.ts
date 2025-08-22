import Papa from 'papaparse';

type Links = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
  createdAt: Date;
};

/**
 * @param {Array<Links>} linksData
 * @returns {string}
 */

export function generateCsvContent(linksData: Links[]) : string {
  if (!linksData || linksData.length === 0) {
    return '';
  }

  return Papa.unparse(linksData, {
    delimiter: ';',
  });
}