import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceModal } from './components/VoiceModal';
import { AddProductModal } from './components/AddProductModal';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { HistoryPage } from './pages/HistoryPage';
import { useVoice } from './hooks/useVoice';
import {
  getProducts,
  getDashboardStats,
  getTransactions,
  mutateInventory,
  createProduct,
  updateProduct,
  deleteProduct,
  reseedDatabase,
  checkBackendHealth
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);
  const [isReseeding, setIsReseeding] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Add/Edit Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch inventory data
  const loadData = useCallback(async () => {
    try {
      const [prodResp, statsResp, txResp, healthResp] = await Promise.all([
        getProducts(),
        getDashboardStats(),
        getTransactions(20),
        checkBackendHealth()
      ]);

      if (prodResp.success) setProducts(prodResp.data);
      if (statsResp.success) setStats(statsResp.data);
      if (txResp.success) setTransactions(txResp.data);
      setBackendOnline(healthResp.success);
    } catch (err) {
      console.error("Failed to load inventory data:", err);
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Voice mutation hook
  const voice = useVoice(async () => {
    await loadData();
  });

  const handleOpenMic = () => {
    setIsVoiceModalOpen(true);
    voice.startListening();
  };

  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      await reseedDatabase();
      await loadData();
    } catch (err) {
      console.error("Reseed failed:", err);
    } finally {
      setIsReseeding(false);
    }
  };

  const handleQuickAdd = async (product, amount = 1) => {
    try {
      await mutateInventory({
        action: 'ADD',
        productId: product.id,
        quantity: amount,
        unit: product.unit,
        source: 'MANUAL',
        transcript: `Quick manual add ${amount} ${product.unit} of ${product.name}`,
        requestId: `manual-${Date.now()}`
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleQuickRemove = async (product, amount = 1) => {
    try {
      await mutateInventory({
        action: 'REMOVE',
        productId: product.id,
        quantity: amount,
        unit: product.unit,
        source: 'MANUAL',
        transcript: `Quick manual remove ${amount} ${product.unit} of ${product.name}`,
        requestId: `manual-${Date.now()}`
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update stock");
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        await loadData();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMic={handleOpenMic}
        onReseed={handleReseed}
        isReseeding={isReseeding}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            products={products}
            transactions={transactions}
            onOpenMic={handleOpenMic}
            onQuickAdd={handleQuickAdd}
            onQuickRemove={handleQuickRemove}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryPage
            products={products}
            onQuickAdd={handleQuickAdd}
            onQuickRemove={handleQuickRemove}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsAddModalOpen(true);
            }}
            onEdit={(prod) => {
              setEditingProduct(prod);
              setIsAddModalOpen(true);
            }}
            onDelete={handleDeleteProduct}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            products={products}
            onQuickAdd={handleQuickAdd}
            onQuickRemove={handleQuickRemove}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage transactions={transactions} />
        )}
      </main>

      {/* Stateful Voice Interaction Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voiceState={voice.voiceState}
        transcript={voice.transcript}
        setTranscript={voice.setTranscript}
        confirmationData={voice.confirmationData}
        queryResult={voice.queryResult}
        errorMessage={voice.errorMessage}
        successMessage={voice.successMessage}
        startListening={voice.startListening}
        stopListeningAndProcess={voice.stopListeningAndProcess}
        confirmMutation={voice.confirmMutation}
        resetVoice={voice.resetVoice}
        language={voice.language}
        setLanguage={voice.setLanguage}
      />

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        VoiceStock AI • GigPoint Hackathon Project • Built for Indian Small Business Owners
      </footer>

    </div>
  );
}
