import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportLaporan = ({ transactions, pemasukan, pengeluaran, saldo }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID');
    const leftMargin = 20;
    const colonMargin = 70;

    // Set Title and Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Laporan Bulanan myFin', leftMargin, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    doc.text('Tanggal Laporan', leftMargin, 30);
    doc.text(':', colonMargin -5, 30);
    doc.text(dateString, colonMargin, 30);

    doc.text('User', leftMargin, 35);
    doc.text(':', colonMargin - 5, 35);
    doc.text('Kelompok yali yali', colonMargin, 35);

    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);  // Horizontal line

    // Table Column Setup
    const tableColumn = ["Tanggal", "Kategori", "Jumlah", "Deskripsi"];
    const tableRows = [];

    transactions.forEach(transaction => {
      const transactionData = [
        transaction.date,
        transaction.category,
        new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(transaction.amount),
        transaction.description
      ];
      tableRows.push(transactionData);
    });

    // Auto Table for Transactions
    doc.autoTable(tableColumn, tableRows, {
      startY: 45,
      theme: 'striped', // Striping effect
      headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], fontSize: 12 }, // Blue header
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] }, // Black body text
      styles: { halign: 'center' },
      margin: { top: 10, left: 20, right: 20 }
    });

    // Pemasukan, Pengeluaran, and Saldo in the right corner
    const YPosition = doc.autoTable.previous.finalY + 10;
    const rightMargin = doc.internal.pageSize.width - 20;

    doc.setFontSize(12);
    doc.text(`Pemasukan: Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(pemasukan)}`, rightMargin, YPosition, { align: 'right' });
    doc.text(`Pengeluaran: Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(pengeluaran)}`, rightMargin, YPosition + 10, { align: 'right' });
    doc.text(`Sisa Saldo: Rp. ${new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(saldo)}`, rightMargin, YPosition + 20, { align: 'right' });

    // Footer with Page Number
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Halaman ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);

    // Save the PDF
    doc.save(`laporan_bulanan_myFin.pdf`);
  };

  return (
    <button onClick={exportPDF} className="export-button" style={{ padding: '12px 24px', backgroundColor: '#1976D2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
      Export Laporan
    </button>
  );
};

export default ExportLaporan;