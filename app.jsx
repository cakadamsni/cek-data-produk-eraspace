import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function ProductChecker() {
  const [sku, setSku] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!sku.trim() || !storeCode.trim()) {
      setError('SKU dan store code harus diisi');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(
        `https://jeanne.eraspace.com/products/api/v4.1/products/${sku}?store_code=${storeCode}`
      );

      if (!response.ok) {
        throw new Error('Produk tidak ditemukan atau data tidak tersedia');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge = ({ label, value }) => {
    const isActive = value === true;
    const bgColor = isActive ? 'bg-blue-100' : 'bg-gray-100';
    const textColor = isActive ? 'text-blue-700' : 'text-gray-700';

    return (
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
        {label}: {isActive ? '✓ Aktif' : '✗ Tidak'}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Product Status Checker
          </h1>
          <p className="text-slate-600">
            Cek status produk di production secara real-time
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleCheck} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SKU Produk
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Contoh: 8100026281"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Store Code Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Store Code
                </label>
                <input
                  type="text"
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  placeholder="Contoh: erafone"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Mengecek data...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Cek Status Produk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Terjadi Kesalahan</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Result Card */}
        {data && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header Result */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Data Ditemukan</h2>
              </div>
              <p className="text-green-100 text-sm">
                SKU: <span className="font-semibold">{sku}</span> | Store: <span className="font-semibold">{storeCode}</span>
              </p>
            </div>

            {/* Status Badges */}
            <div className="px-8 py-6 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                Status Produk
              </h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadge label="Preorder" value={data.is_preorder} />
                <StatusBadge label="New Custom" value={data.is_new_custom} />
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.atc_disabled_start || data.atc_disabled_end
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  ATC: {data.atc_disabled_start || data.atc_disabled_end ? '⚠ Disabled' : '✓ Aktif'}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-8 py-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                  Detail Produk
                </h3>
                <div className="space-y-4">
                  {/* ATC Status */}
                  <div className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Add to Cart Status</p>
                      <p className="text-xs text-slate-500 mt-1">Cek kapan ATC diaktifkan/dinonaktifkan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {data.atc_disabled_start || data.atc_disabled_end ? '⚠ Disabled' : '✓ Enabled'}
                      </p>
                    </div>
                  </div>

                  {data.atc_disabled_start && (
                    <div className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-slate-700">ATC Disabled Start</p>
                      <p className="text-sm text-slate-900 font-semibold">{formatDate(data.atc_disabled_start)}</p>
                    </div>
                  )}

                  {data.atc_disabled_end && (
                    <div className="flex justify-between items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-slate-700">ATC Disabled End</p>
                      <p className="text-sm text-slate-900 font-semibold">{formatDate(data.atc_disabled_end)}</p>
                    </div>
                  )}

                  {/* Preorder Info */}
                  {data.is_preorder && (
                    <>
                      <div className="flex justify-between items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-slate-700">Preorder Start</p>
                        <p className="text-sm text-slate-900 font-semibold">{formatDate(data.preorder_start)}</p>
                      </div>

                      <div className="flex justify-between items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-slate-700">Preorder End</p>
                        <p className="text-sm text-slate-900 font-semibold">{formatDate(data.preorder_end)}</p>
                      </div>

                      {data.preorder_store && data.preorder_store.length > 0 && (
                        <div className="flex justify-between items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-slate-700">Preorder Store</p>
                          <div className="text-right">
                            {data.preorder_store.map((store, idx) => (
                              <p key={idx} className="text-sm text-slate-900 font-semibold">{store}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Raw Data (Optional) */}
              <div className="pt-4 border-t border-slate-200">
                <details className="cursor-pointer">
                  <summary className="text-xs font-semibold text-slate-600 uppercase tracking-wide hover:text-slate-900">
                    📋 Lihat Data Lengkap
                  </summary>
                  <pre className="mt-4 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-auto max-h-64">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !error && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-600">Masukkan SKU dan store code untuk melihat status produk</p>
          </div>
        )}
      </div>
    </div>
  );
}
