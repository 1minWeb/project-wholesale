import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Lock, X } from 'lucide-react';

interface WholesaleProduct {
  id: string;
  number: string;
  name: string;
  basePrice: number;
  pPlus10: number;
  markup15Before: number;
  markup15After: number;
  markup20Before: number;
  markup20After: number;
  markup25Before: number;
  markup25After: number;
  finalPrice: number;
  description: string;
  category: string;
}

const App: React.FC = () => {
  const [wholesaleData, setWholesaleData] = useState<WholesaleProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['Default']);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [currentPage, setCurrentPage] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const correctPassword = 'Samala@1234';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<WholesaleProduct>({
    id: '',
    number: '',
    name: '',
    basePrice: 0,
    pPlus10: 0,
    markup15Before: 0,
    markup15After: 0,
    markup20Before: 0,
    markup20After: 0,
    markup25Before: 0,
    markup25After: 0,
    finalPrice: 0,
    description: '',
    category: 'Default'
  });

  const rowsPerPage = 5;
  const showStatus = (msg: string, type: 'success' | 'error' | 'info') => {
    setStatus(msg);
    setStatusType(type);
    setTimeout(() => setStatus(''), 3000);
  };

  const addOrUpdateProduct = () => {
    if (!newProduct.number || !newProduct.name || newProduct.basePrice <= 0) {
      showStatus('Number, name and base price must be valid', 'error');
      return;
    }

    const updatedCategory = newProduct.category.trim();
    if (!categories.includes(updatedCategory)) {
      setCategories(prev => [...prev, updatedCategory]);
    }

    if (editingId) {
      setWholesaleData(prev => prev.map(item => item.id === editingId ? { ...newProduct } : item));
      showStatus('Product updated!', 'success');
    } else {
      const newEntry = { ...newProduct, id: new Date().toISOString() };
      setWholesaleData(prev => [...prev, newEntry]);
      showStatus('Product added!', 'success');
    }

    setNewProduct({
      id: '', number: '', name: '', basePrice: 0, pPlus10: 0,
      markup15Before: 0, markup15After: 0,
      markup20Before: 0, markup20After: 0,
      markup25Before: 0, markup25After: 0,
      finalPrice: 0, description: '', category: 'Default'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (id: string) => {
    const product = wholesaleData.find(p => p.id === id);
    if (product) {
      setEditingId(id);
      setNewProduct(product);
      setShowForm(true);
    }
  };

  const deleteProduct = (id: string) => {
    setWholesaleData(prev => prev.filter(p => p.id !== id));
    showStatus('Product deleted', 'info');
  };

  const filteredData = wholesaleData.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'All' || item.category === categoryFilter)
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const changePage = (dir: 'prev' | 'next') => {
    if (dir === 'prev' && currentPage > 1) setCurrentPage(p => p - 1);
    if (dir === 'next' && currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  if (!unlocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm animate-fadeIn">
          <h2 className="text-xl font-semibold text-center mb-4">Unlock Application</h2>
          <input
            type="password"
            placeholder="Enter Password"
            className="p-3 border rounded w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setUnlocked(password === correctPassword)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            <Lock className="inline mr-2" size={18} /> Unlock
          </button>
          {password && password !== correctPassword && (
            <p className="text-red-600 text-sm mt-2 text-center">Incorrect password.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center text-2xl font-bold p-4 text-white bg-cyan-800 rounded shadow mb-4 animate-slideIn">Samala Cloth Stores</header>

      {status && <div className={`text-white text-center py-2 mb-4 rounded transition ${statusType === 'success' ? 'bg-green-500' : statusType === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>{status}</div>}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-3 border rounded flex-1" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-3 border rounded">
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"><Plus className="mr-2" size={18} />Add Product</button>
      </div>

      {/* Cards for Mobile View */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {currentData.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow animate-fadeIn">
            <div className="font-semibold text-lg">{item.name} ({item.number})</div>
            <div className="text-sm text-gray-600">Category: {item.category}</div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm">
              <span>Base: ₹{item.basePrice}</span>
              <span>+10: ₹{item.pPlus10}</span>
              <span>15%: ₹{item.markup15After}</span>
              <span>20%: ₹{item.markup20After}</span>
              <span>25%: ₹{item.markup25After}</span>
              <span>Final: ₹{item.finalPrice}</span>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => startEdit(item.id)} aria-label="Edit product" className="text-blue-600"><Edit3 size={18} /></button>
              <button aria-label='Delete' onClick={() => deleteProduct(item.id)} className="text-red-600"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Table for Desktop View */}
      <div className="hidden md:block overflow-x-auto mt-6">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Base</th>
              <th className="px-3 py-2">P+10</th>
              <th className="px-3 py-2">15% Aft</th>
              <th className="px-3 py-2">20% Aft</th>
              <th className="px-3 py-2">25% Aft</th>
              <th className="px-3 py-2">Final</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{item.number}</td>
                <td className="px-3 py-2">{item.name}</td>
                <td className="px-3 py-2">₹{item.basePrice}</td>
                <td className="px-3 py-2">₹{item.pPlus10}</td>
                <td className="px-3 py-2">₹{item.markup15After}</td>
                <td className="px-3 py-2">₹{item.markup20After}</td>
                <td className="px-3 py-2">₹{item.markup25After}</td>
                <td className="px-3 py-2">₹{item.finalPrice}</td>
                <td className="px-3 py-2">{item.category}</td>
                <td className="px-3 py-2 space-x-2">
                  <button aria-label='edit' className="text-blue-600" onClick={() => startEdit(item.id)}><Edit3 size={16} /></button>
                  <button aria-label='delete' className="text-red-600" onClick={() => deleteProduct(item.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => changePage('prev')} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => changePage('next')} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative animate-slideIn">
            <button aria-label='Close' className="absolute top-2 right-2 text-gray-600" onClick={() => setShowForm(false)}><X size={20} /></button>
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Number" value={newProduct.number} onChange={e => setNewProduct({ ...newProduct, number: e.target.value })} className="p-2 border rounded" />
              <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="p-2 border rounded" />
              <input type="number" placeholder="Base Price" value={newProduct.basePrice} onChange={e => {
                const base = parseFloat(e.target.value);
                setNewProduct({
                  ...newProduct,
                  basePrice: base,
                  pPlus10: base + 10,
                  markup15Before: base * 1.15,
                  markup15After: Math.round(base * 1.15),
                  markup20Before: base * 1.2,
                  markup20After: Math.round(base * 1.2),
                  markup25Before: base * 1.25,
                  markup25After: Math.round(base * 1.25),
                  finalPrice: base + 355
                });
              }} className="p-2 border rounded" />
              <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="p-2 border rounded" />
              <input type="text" list="category-options" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="p-2 border rounded" />
              <datalist id="category-options">
                {categories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
            <div className="mt-4 text-right">
              <button onClick={addOrUpdateProduct} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
