import React, { useState, useEffect } from "react";
import "./style.css";
import ExportLaporan from "./ExportLaporan";

export const App = () => {
  const [transactions, setTransactions] = useState([
    { date: "13/01/25", category: "Makanan", amount: 1400000, description: "Beli bahan masak" },
    { date: "13/01/25", category: "Kebutuhan Rumah", amount: 900000, description: "Alat dan perkakas" },
    { date: "13/01/25", category: "Body Care", amount: 3000000, description: "Sabun, Shampo, DLL" },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [cardContent, setCardContent] = useState({
    pemasukan: 12000000,
  });

  useEffect(() => {
    const totalPengeluaran = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const saldoSaatIni = cardContent.pemasukan - totalPengeluaran;
    setCardContent((prevContent) => ({
      ...prevContent,
      pengeluaran: totalPengeluaran,
      saldo: saldoSaatIni,
    }));
  }, [transactions, cardContent.pemasukan]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 0 }).format(number);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(newTransaction.amount, 10);
    if (editIndex !== null) {
      const updatedTransactions = transactions.map((transaction, index) =>
        index === editIndex ? { ...newTransaction, amount } : transaction
      );
      setTransactions(updatedTransactions);
      setEditIndex(null);
    } else {
      setTransactions([...transactions, { ...newTransaction, amount }]);
    }
    setNewTransaction({
      date: "",
      category: "",
      amount: "",
      description: "",
    });
  };

  const handleEdit = (index) => {
    setNewTransaction(transactions[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleEditCard = () => {
    const newValue = prompt("Masukkan pemasukan baru:", cardContent.pemasukan);
    if (newValue) {
      setCardContent({ ...cardContent, pemasukan: parseInt(newValue, 10) });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">myFin</h1>
      </header>
      <main className="main-content">
        <div className="desktop">
          <section className="summary">
            <div className="card-header">
              <p>Informasi Keuangan Anda</p>
            </div>
            <div className="cards">
              <div className="card">
                <p className="label">Saldo saat ini:</p>
                <p className="value">Rp. {formatNumber(cardContent.saldo)}</p>
              </div>
              <div className="card">
                <p className="label">Pengeluaran bulan ini:</p>
                <p className="value">Rp. {formatNumber(cardContent.pengeluaran)}</p>
              </div>
              <div className="card">
                <p className="label">Pemasukan bulan ini:</p>
                <p className="value">Rp. {formatNumber(cardContent.pemasukan)}</p>
                <button className="edit-card-btn" onClick={handleEditCard}>Edit</button>
              </div>
            </div>
          </section>

          <section className="transaction-history">
            <h2>Riwayat Transaksi</h2>
            <div className="table">
              <div className="table-header">
                <div>Tanggal</div>
                <div>Kategori</div>
                <div>Jumlah</div>
                <div>Deskripsi</div>
                <div>Aksi</div>
              </div>
              {transactions.map((transaction, index) => (
                <div key={index} className="table-row">
                  <div>{transaction.date}</div>
                  <div>{transaction.category}</div>
                  <div>Rp. {formatNumber(transaction.amount)}</div>
                  <div>{transaction.description}</div>
                  <div>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="add-transaction">
            <h2>{editIndex !== null ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                placeholder="Tanggal"
                required
              />
              <input
                type="text"
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                placeholder="Kategori"
                required
              />
              <div className="currency-input">
                <span className="currency">Rp.</span>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="Jumlah"
                  required
                />
              </div>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Deskripsi"
                required
              />
              <button type="submit" className="add-transaction-btn">
                {editIndex !== null ? "Update Transaksi" : "Tambah Transaksi"}
              </button>
            </form>
          </section>

          <section className="report-section">
            <h2>Laporan Bulanan</h2>
            <div className="content-wrapper">
              <div className="transaction-details">
                {transactions.map((transaction, index) => (
                  <div key={index} className="table-row">
                    <div>{transaction.date}</div>
                    <div>{transaction.category}</div>
                    <div>Rp. {formatNumber(transaction.amount)}</div>
                    <div>{transaction.description}</div>
                  </div>
                ))}
              </div>
              <div className="actions">
                <ExportLaporan
                  transactions={transactions}
                  pemasukan={cardContent.pemasukan}
                  pengeluaran={cardContent.pengeluaran}
                  saldo={cardContent.saldo}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
