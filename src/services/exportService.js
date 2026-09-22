/**
 * Export Utility Service for BankAdmin Portal
 * Generates genuine native Microsoft Excel (.xlsx) workbooks using SheetJS (xlsx)
 */

import * as XLSX from 'xlsx';

/**
 * Primary Excel Export Function
 * Produces authentic binary .xlsx files that open directly in Microsoft Excel,
 * LibreOffice, and Google Sheets without format/corruption warnings.
 */
export const exportToExcel = (data, filename = 'BankAdmin_Report.xlsx', customHeaders = null) => {
  if (!data || !data.length) return;

  let worksheet;
  if (customHeaders && Array.isArray(customHeaders)) {
    if (Array.isArray(data[0])) {
      worksheet = XLSX.utils.aoa_to_sheet([customHeaders, ...data]);
    } else {
      worksheet = XLSX.utils.json_to_sheet(data, { header: customHeaders });
    }
  } else {
    worksheet = XLSX.utils.json_to_sheet(data);
  }

  // Auto-size column widths for clean readability
  const sampleRow = data[0];
  const keys = Array.isArray(sampleRow) ? sampleRow.map((_, i) => i) : Object.keys(sampleRow || {});
  const colWidths = keys.map(key => {
    let maxLen = String(key).length;
    data.slice(0, 100).forEach(row => {
      const val = row[key];
      if (val !== null && val !== undefined) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    });
    return { wch: Math.min(Math.max(maxLen + 4, 14), 45) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Banking Ledger');

  const safeFilename = filename.endsWith('.xlsx')
    ? filename
    : `${filename.replace(/\.csv$/, '')}.xlsx`;

  XLSX.writeFile(workbook, safeFilename, { bookType: 'xlsx' });
};

// Aliases for compatibility
export const exportToCSV = (data, filename = 'BankAdmin_Export.xlsx') => {
  exportToExcel(data, filename);
};

export const exportToPDF = ({
  title = "BankAdmin Financial Report",
  subtitle = "Generated from BankAdmin Portal",
  headers = [],
  rows = [],
  filename = "BankAdmin_Report.xlsx"
}) => {
  exportToExcel(rows, filename, headers);
};

export const printDocument = () => {
  window.print();
};
