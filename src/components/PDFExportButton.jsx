import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import { StudentIDCard, AttendanceReportPDF } from './PDFTemplates';

/**
 * PDF Export Button component
 */
const PDFExportButton = ({ type = 'id-card', data, fileName = 'export.pdf' }) => {
  const getPDFDocument = () => {
    switch (type) {
      case 'id-card':
        return <StudentIDCard student={data} />;
      case 'attendance-report':
        return <AttendanceReportPDF data={data} />;
      default:
        return null;
    }
  };

  return (
    <PDFDownloadLink document={getPDFDocument()} fileName={fileName}>
      {({ blob, url, loading, error }) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || error}
          className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Download PDF"
        >
          <FiDownload size={18} />
          {loading ? 'Generating...' : 'Download PDF'}
        </motion.button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFExportButton;
