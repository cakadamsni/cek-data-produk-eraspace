import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Loader, Clock, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';

const STORE_LIST = [
  { id: 24, company: "EAL", store_type: "ecommerce",   store_code: "jdsport",          store_name: "JD Sport"          },
  { id: 21, company: "EAR", store_type: "ecommerce",   store_code: "eraspace-kredivo",  store_name: "Eraspace Kredivo"  },
  { id: 19, company: "EDC", store_type: "Marketplace", store_code: "mp-edc",            store_name: "Marketplace"       },
  { id: 18, company: "EAL", store_type: "Ecommerce",   store_code: "under-armour",      store_name: "Under Armour"      },
  { id: 17, company: "EAR", store_type: "Ecom",        store_code: "erafone",           store_name: "Erafone"           },
  { id: 16, company: "EAR", store_type: "Ecommerce",   store_code: "eraspace-livin",    store_name: "Eraspace Livin"    },
  { id: 14, company: "DCM", store_type: "Ecommerce",   store_code: "ibox-ent",          store_name: "iBox Enterprise"   },
  { id: 13, company: "DCM", store_type: "ecommerce",   store_code: "ibox-edu",          store_name: "iBox Education"    },
  { id: 12, company: "DCM", store_type: "ecommerce",   store_code: "ibox",              store_name: "iBox"              },
  { id: 11, company: "MII", store_type: "ecommerce",   store_code: "it",                store_name: "Live IT"           },
  { id: 10, company: "DCM", store_type: "ecommerce",   store_code: "ibox-old",          store_name: "Ibox-Old"          },
  { id:  9, company: "TEST",store_type: "testing",     store_code: "storetesting",      store_name: "Store Testing"     },
  { id:  2, company: "ENT", store_type: "ecommerce",   store_code: "en",                store_name: "Enterprise"        },
  { id:  1, company: "EAR", store_type: "ecommerce",   store_code: "eraspace",          store_name: "Eraspace"          },
];

export default function ProductChecker() {
  const [sku, setSku] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedStore = STORE_LIST.find(s => s.store_code === storeCode);

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
      setData(result.data ?? result);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDateDetailed = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return `${dateFormatted} pukul ${timeFormatted}`;
  };

  const getATCStatus = (startDate, endDate) => {
    if (!startDate && !endDate) {
      return { status: 'enabled', label: 'ATC Aktif' };
    }

    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && now < start) {
      return { status: 'upcoming', label: 'Akan Disable' };
    }

    if (start && end && now >= start && now <= end) {
      return { status: 'ongoing', label: 'Sedang Disabled' };
    }

    if (end && now > end) {
      return { status: 'ended', label: 'Sudah Aktif Kembali' };
    }

    return { status: 'ongoing', label: 'Sedang Disabled' };
  };

  const getDurationText = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const diffMs = new Date(endDate) - new Date(startDate);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffDays > 0) return `${diffDays} hari ${diffHours} jam`;
    return `${diffHours} jam ${diffMinutes} menit`;
  };

  const StatusBadge = ({ label, value }) => {
    const isActive = value === true;
    return (
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
        {label}: {isActive ? '✓ Aktif' : '✗ Tidak'}
      </div>
    );
  };

  const ATCScheduleCard = ({ atcDisabledStart, atcDisabledEnd }) => {
    const atcStatus = getATCStatus(atcDisabledStart, atcDisabledEnd);
    const duration = getDurationText(atcDisabledStart, atcDisabledEnd);

    const colorMap = {
      enabled: { wrap: 'bg-green-50 border-green-300', text: 'text-green-700', badge: 'bg-green-100 border-green-300 text-green-700', icon: 'text-green-500' },
      upcoming: { wrap: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 border-yellow-300 text-yellow-700', icon: 'text-yellow-500' },
      ongoing:  { wrap: 'bg-red-50 border-red-300',    text: 'text-red-700',    badge: 'bg-red-100 border-red-300 text-red-700',    icon: 'text-red-500'    },
      ended:    { wrap: 'bg-green-50 border-green-300', text: 'text-green-700', badge: 'bg-green-100 border-green-300 text-green-700', icon: 'text-green-500' },
    };
    const c = colorMap[atcStatus.status];

    const badgeLabel = {
      enabled:  '✓ Aktif',
      upcoming: '⏱ Akan Disable',
      ongoing:  '⛔ Sedang Disabled',
      ended:    '✓ Aktif Kembali',
    }[atcStatus.status];

    return (
      <div className={`border-2 rounded-xl p-5 ${c.wrap}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${c.icon}`} />
            <span className={`font-bold text-base ${c.text}`}>{atcStatus.label}</span>
            <span className="text-slate-500 text-sm font-normal">— Add to Cart</span>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${c.badge}`}>
            {badgeLabel}
          </span>
        </div>

        {/* Timeline baris */}
        <div className="space-y-2">
          {/* Mulai Disabled */}
          <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mulai Disabled</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {atcDisabledStart ? formatDateDetailed(atcDisabledStart) : <span className="text-slate-400 font-normal italic">Tidak ada jadwal</span>}
              </p>
            </div>
          </div>

          {/* Selesai Disabled */}
          <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Selesai Disabled</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {atcDisabledEnd ? formatDateDetailed(atcDisabledEnd) : <span className="text-slate-400 font-normal italic">Tidak ada jadwal</span>}
              </p>
            </div>
          </div>

          {/* Durasi — hanya tampil jika ada keduanya */}
          {duration && (
            <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Durasi Disable</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{duration}</p>
              </div>
            </div>
          )}
        </div>
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">SKU Produk</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Contoh: 8100026281"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Store</label>
                <div className="relative">
                  <select
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white text-slate-800"
                  >
                    <option value="">— Pilih Store —</option>
                    {STORE_LIST.map(store => (
                      <option key={store.id} value={store.store_code}>
                        {store.store_name} ({store.store_code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {selectedStore && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Company: <span className="font-semibold">{selectedStore.company}</span>
                    &nbsp;·&nbsp;Type: <span className="font-semibold">{selectedStore.store_type}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader className="w-5 h-5 animate-spin" /> Mengecek data...</>
              ) : (
                <><Search className="w-5 h-5" /> Cek Status Produk</>
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Terjadi Kesalahan</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {data && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Status Produk</h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadge label="Preorder" value={data.is_preorder} />
                <StatusBadge label="New Custom" value={data.is_new_custom} />
              </div>
            </div>

            {/* ATC Schedule */}
            <div className="px-8 pt-6 pb-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                Jadwal Add to Cart (ATC)
              </h3>
              <ATCScheduleCard
                atcDisabledStart={data.atc_disabled_start}
                atcDisabledEnd={data.atc_disabled_end}
              />
            </div>

            {/* Preorder Info */}
            {data.is_preorder && (
              <div className="px-8 pt-6 pb-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                  Jadwal Preorder
                </h3>
                <div className="space-y-2 bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
                  <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide">Mulai Preorder</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDateDetailed(data.preorder_start)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide">Selesai Preorder</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDateDetailed(data.preorder_end)}</p>
                    </div>
                  </div>
                  {getDurationText(data.preorder_start, data.preorder_end) && (
                    <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
                      <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide">Total Durasi Preorder</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{getDurationText(data.preorder_start, data.preorder_end)}</p>
                      </div>
                    </div>
                  )}
                  {data.preorder_store?.length > 0 && (
                    <div className="flex items-start gap-3 bg-white bg-opacity-70 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide mb-2">Store Preorder</p>
                        <div className="flex flex-wrap gap-2">
                          {data.preorder_store.map((store, idx) => (
                            <span key={idx} className="bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {store}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Raw Data */}
            <div className="px-8 py-6">
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
