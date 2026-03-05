'use client';

import React, { useState } from 'react';
import { useStands } from '@/hooks/useStands';
import StandMap from '@/components/StandMap';
import StandModal from '@/components/StandModal';
import Legend from '@/components/Legend';
import DashboardStats from '@/components/DashboardStats';
import { Stand } from '@/types/stand';
import Link from 'next/link';

export default function HomePage() {
  const { stands, loading, stats, updateStand } = useStands();
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStandClick = (stand: Stand) => {
    setSelectedStand(stand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStand(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              T3 Experience
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Mapa Interativo de Stands</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-sm font-medium border border-gray-700/50 hover:border-gray-600"
          >
            ⚙️ Admin
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <DashboardStats stats={stats} />
      </div>

      {/* Map + Legend */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map */}
          <div className="flex-1 min-w-0">
            <StandMap
              stands={stands}
              onStandClick={handleStandClick}
              selectedStandId={selectedStand?.id}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-52 flex-shrink-0 space-y-4">
            <Legend stats={stats} />

            {/* Quick info */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 shadow-xl">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Instruções
              </h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2">
                  <span>👆</span>
                  <span>Clique em um stand para ver detalhes</span>
                </li>
                <li className="flex gap-2">
                  <span>🔍</span>
                  <span>Busque por número ou empresa no campo de busca</span>
                </li>
                <li className="flex gap-2">
                  <span>🔎</span>
                  <span>Scroll ou pinch para zoom • arraste para mover</span>
                </li>
                <li className="flex gap-2">
                  <span>⚙️</span>
                  <span>Use o painel Admin para editar stands</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-4 text-center">
        <p className="text-sm text-gray-500">
          T3 Experience © {new Date().getFullYear()} • {stats.vendido} vendidos de {stats.total} stands
        </p>
      </footer>

      {/* Modal (view only on home page) */}
      <StandModal
        stand={selectedStand}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={updateStand}
        isAdmin={false}
      />
    </div>
  );
}
