import React, { useState } from 'react';
import QrReader from 'react-qr-barcode-scanner';
import * as XLSX from 'xlsx';

const QrScanner = () => {
  const [data, setData] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const handleScan = (result) => {
    if (result) {
      const isDuplicate = data.some((item) => item.nama === result);
      if (isDuplicate) {
        showAlert("QR code ini sudah pernah dipindai.", "error");
      } else {
        const formattedTimestamp = new Date().toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const newData = { nama: result, kehadiran: formattedTimestamp };
        setData((prevData) => [...prevData, newData]);
        showAlert("QR code berhasil dipindai dan disimpan!", "success");
      }
      setIsScanning(false);
    }
  };
  

  const showAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => setAlert({ visible: false, message: "", type: "" }), 3000);
  };

  const handleError = (err) => console.error("Error saat scan:", err);

  const startScan = () => setIsScanning(true);
  const stopScan = () => setIsScanning(false);

  const exportToExcel = () => {
    if (data.length === 0) return alert("Tidak ada data untuk diekspor.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scan Results");
    XLSX.writeFile(workbook, "ScanResults.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {alert.visible && (
        <div
          className={`fixed top-6 w-11/12 md:w-1/2 lg:w-1/3 px-4 py-3 rounded-lg text-white text-center font-semibold
          ${alert.type === "success" ? "bg-green-500" : "bg-red-500"} shadow-lg transition-transform`}
          style={{ transform: alert.visible ? "translateY(0)" : "translateY(-50px)" }}
        >
          {alert.message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">QR Code Scanner</h1>
        <div className="space-x-2 mb-4">
          <button onClick={startScan} className="px-4 py-2 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600">
            Start Scan
          </button>
          <button onClick={stopScan} className="px-4 py-2 rounded-md text-white font-semibold bg-red-500 hover:bg-red-600">
            Stop Scan
          </button>
          <button onClick={exportToExcel} disabled={data.length === 0} className="px-4 py-2 rounded-md text-white font-semibold bg-green-500 hover:bg-green-600">
            Export to Excel
          </button>
        </div>

        {isScanning && (
          <QrReader
            onUpdate={(err, result) => { if (result) handleScan(result.text); else if (err) handleError(err); }}
            style={{ width: '100%' }}
          />
        )}

        {data.length > 0 && (
          <div className="mt-6 text-left w-full overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border border-gray-300 px-2 py-1">Kehadiran</th>
                  <th className="border border-gray-300 px-2 py-1">Nama</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border border-gray-300 px-2 py-1">{item.kehadiran}</td>
                    <td className="border border-gray-300 px-2 py-1">{item.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
