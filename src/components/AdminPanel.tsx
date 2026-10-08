import React, { useState } from 'react';
import {
  X,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  MapPin,
  Download,
  Upload,
  Check,
  AlertCircle,
  Copy,
  ChevronUp,
  ChevronDown,
  Navigation,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CampusId, Checkpoint, GeoPosition, TrainerProfile } from '../types';
import { CAMPUSES } from '../config/campusConfig';
import { playClickSound, playPowerUpSound } from '../utils/audioUtils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampusId: CampusId;
  onSelectCampus: (campusId: CampusId) => void;
  checkpoints: Checkpoint[];
  onSaveCheckpoints: (cps: Checkpoint[]) => void;
  onResetToDefaults: () => void;
  playerPos: GeoPosition | null;
  trainer: TrainerProfile | null;
  onTeleportPlayer?: (lat: number, lng: number) => void;
}

const POPULAR_POKEMON = [
  { name: 'Pikachu', type: 'Electric', icon: '⚡' },
  { name: 'Charizard', type: 'Fire', icon: '🔥' },
  { name: 'Squirtle', type: 'Water', icon: '💧' },
  { name: 'Bulbasaur', type: 'Grass', icon: '🍃' },
  { name: 'Mewtwo', type: 'Psychic', icon: '🔮' },
  { name: 'Eevee', type: 'Normal', icon: '🦊' },
  { name: 'Jolteon', type: 'Electric', icon: '⚡' },
  { name: 'Vaporeon', type: 'Water', icon: '💧' },
  { name: 'Gengar', type: 'Psychic', icon: '👻' },
  { name: 'Snorlax', type: 'Normal', icon: '🐻' },
] as const;

const LANDMARK_PRESETS: Record<CampusId, { label: string; lat: number; lng: number }[]> = {
  TAKSHASHILA: [
    { label: '🏛️ Main Admin Entrance Gate', lat: 22.6898, lng: 75.8748 },
    { label: '☕ Central Student Canteen', lat: 22.6904, lng: 75.8760 },
    { label: '📚 Central Library Plaza', lat: 22.6892, lng: 75.8765 },
    { label: '🍃 Botanical Garden & Quad', lat: 22.6885, lng: 75.8752 },
    { label: '🏟️ University Sports Stadium', lat: 22.6912, lng: 75.8740 },
    { label: '💻 SCSIT Computer Science', lat: 22.6920, lng: 75.8768 },
    { label: '👔 IMS Management Lawn', lat: 22.6908, lng: 75.8778 },
    { label: '🎭 Bhasha Bhavan & Auditorium', lat: 22.6890, lng: 75.8740 },
    { label: '🔬 Vigyan Bhavan Physics Hub', lat: 22.6915, lng: 75.8740 },
    { label: '🎥 EMRC Media Studio', lat: 22.6885, lng: 75.8755 },
    { label: '💼 IIPS Professional Studies', lat: 22.6918, lng: 75.8782 },
    { label: '📊 School of Economics', lat: 22.6902, lng: 75.8772 },
    { label: '📰 School of Journalism (SJMC)', lat: 22.6888, lng: 75.8762 },
    { label: '🧬 Life Sciences & Biotech', lat: 22.6895, lng: 75.8775 },
    { label: '🧪 School of Chemical Sciences', lat: 22.6910, lng: 75.8752 },
    { label: '🎭 Open-Air Amphitheatre (OAT)', lat: 22.6894, lng: 75.8745 },
    { label: '🌐 Central IT Centre (CCC)', lat: 22.6916, lng: 75.8762 },
    { label: '🏥 University Health Centre', lat: 22.6900, lng: 75.8738 },
    { label: '🥘 Jawahar Boys Hostel & Mess', lat: 22.6925, lng: 75.8745 },
    { label: '🌸 Kamala Nehru Girls Hostel', lat: 22.6880, lng: 75.8748 },
    { label: '💰 SBI Bank & Post Office', lat: 22.6895, lng: 75.8742 },
    { label: '🪷 Saraswati Mandir Shrine', lat: 22.6905, lng: 75.8750 },
  ],
  IET_DAVV: [
    { label: '⚡ Block A Main Portico (Pikachu Station)', lat: 22.6820, lng: 75.8795 },
    { label: '⚙️ Central Mechanical Workshop', lat: 22.6814, lng: 75.8778 },
    { label: '🍜 IET Central Canteen & Lawns', lat: 22.6798, lng: 75.8774 },
    { label: '🚀 Incubation Center & Auditorium', lat: 22.6812, lng: 75.8760 },
    { label: '📚 IET Central Library', lat: 22.6830, lng: 75.8790 },
    { label: '💻 M-Block Computer & IT Labs', lat: 22.6802, lng: 75.8762 },
    { label: '⚡ Block B Electronics (E&TC)', lat: 22.6825, lng: 75.8780 },
    { label: '📐 Civil Engineering Lawns', lat: 22.6808, lng: 75.8798 },
    { label: '🏆 Student Activity Center (SAC)', lat: 22.6838, lng: 75.8815 },
    { label: '🍦 Hostels Circle & Amul Parlour', lat: 22.6802, lng: 75.8810 },
    { label: '⚡ Electrical Block C & HV Labs', lat: 22.6818, lng: 75.8788 },
    { label: '🚧 IET Main Security Gate', lat: 22.6825, lng: 75.8802 },
    { label: '🎸 Amphitheatre & Block A Lawns', lat: 22.6822, lng: 75.8790 },
    { label: '🌙 APJ Kalam Boys Hostel', lat: 22.6798, lng: 75.8815 },
    { label: '🌺 IET Girls Hostel Courtyard', lat: 22.6805, lng: 75.8820 },
    { label: '🤖 Robotics & IoT Hardware Lab', lat: 22.6816, lng: 75.8792 },
    { label: '🏀 IET Sports Grounds & Courts', lat: 22.6832, lng: 75.8822 },
  ],
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentCampusId,
  onSelectCampus,
  checkpoints,
  onSaveCheckpoints,
  onResetToDefaults,
  playerPos,
  trainer,
  onTeleportPlayer,
}) => {
  const [editingCheckpoint, setEditingCheckpoint] = useState<Checkpoint | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const showStatus = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const currentCampus = CAMPUSES[currentCampusId];

  const handleEdit = (cp: Checkpoint) => {
    playClickSound();
    setEditingCheckpoint({
      ...cp,
      stage1: {
        ...cp.stage1,
        options: cp.stage1.options ? [...cp.stage1.options] : ['Option A', 'Option B', 'Option C', 'Option D'],
        acceptedAnswers: cp.stage1.acceptedAnswers ? [...cp.stage1.acceptedAnswers] : [],
      },
      stage2: {
        ...cp.stage2,
        options: cp.stage2.options ? [...cp.stage2.options] : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        acceptedAnswers: cp.stage2.acceptedAnswers ? [...cp.stage2.acceptedAnswers] : [],
      },
    });
  };

  const handleCreateNew = () => {
    playClickSound();
    const newId = checkpoints.length > 0 ? Math.max(...checkpoints.map((c) => c.id)) + 1 : 1;
    const defaultCoords = currentCampus.center;

    // Suggest Pikachu by default if IET campus or first checkpoint!
    const defaultPokemon = currentCampusId === 'IET_DAVV' && newId === 1 ? 'Pikachu' : 'Pikachu';

    const newCp: Checkpoint = {
      id: newId,
      campusId: currentCampusId,
      name: `Checkpoint ${newId} – ${defaultPokemon} Station`,
      pokemonName: defaultPokemon,
      pokemonType: 'Electric',
      difficulty: 'MEDIUM',
      latitude: playerPos?.lat || defaultCoords.lat,
      longitude: playerPos?.lng || defaultCoords.lng,
      radius: 50,
      points: 300,
      stage1: {
        riddleTitle: 'Campus Landmark Riddle',
        riddlePoem: 'Enter your witty rhyming campus clue poem here...',
        question: 'Identify this campus landmark:',
        options: ['Landmark A', 'Landmark B', 'Landmark C', 'Landmark D'],
        answer: 'Landmark A',
        acceptedAnswers: ['landmark a', 'a'],
        landmarkRevealed: 'Main Campus Landmark',
      },
      stage2: {
        category: 'BRAIN_TEASER',
        categoryLabel: '🔢 Classic Number Riddle',
        badgeEmoji: '🧠',
        difficulty: 'MEDIUM',
        riddleText: 'I am an odd number. Take away a letter and I become even. What number am I?',
        options: ['Seven', 'Eleven', 'Nine', 'Three'],
        answer: 'Seven',
        acceptedAnswers: ['seven', '7', 'number seven'],
        explanation: 'Take away the letter "S" from "SEVEN" and you get "EVEN"! A classic brain teaser.',
      },
      lockedScoutHint: 'Direct navigation guide for organizers and scouts.',
      campusLocationDescription: `${currentCampus.shortName} Landmark`,
    };
    setEditingCheckpoint(newCp);
  };

  const handleDuplicate = (cp: Checkpoint) => {
    playClickSound();
    const newId = checkpoints.length > 0 ? Math.max(...checkpoints.map((c) => c.id)) + 1 : 1;
    const duplicated: Checkpoint = {
      ...cp,
      id: newId,
      name: `${cp.name} (Copy)`,
      latitude: parseFloat((cp.latitude + 0.0002).toFixed(6)),
      longitude: parseFloat((cp.longitude + 0.0002).toFixed(6)),
      stage1: {
        ...cp.stage1,
        options: [...cp.stage1.options],
        acceptedAnswers: cp.stage1.acceptedAnswers ? [...cp.stage1.acceptedAnswers] : [],
      },
      stage2: {
        ...cp.stage2,
        options: [...cp.stage2.options],
        acceptedAnswers: cp.stage2.acceptedAnswers ? [...cp.stage2.acceptedAnswers] : [],
      },
    };
    const updated = [...checkpoints, duplicated];
    onSaveCheckpoints(updated);
    showStatus(`Duplicated Checkpoint #${cp.id} as #${newId}!`);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    playClickSound();
    const updated = [...checkpoints];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    // Renumber IDs sequentially
    const renumbered = updated.map((c, idx) => ({ ...c, id: idx + 1 }));
    onSaveCheckpoints(renumbered);
    showStatus('Checkpoint moved up in sequence.');
  };

  const handleMoveDown = (index: number) => {
    if (index >= checkpoints.length - 1) return;
    playClickSound();
    const updated = [...checkpoints];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    // Renumber IDs sequentially
    const renumbered = updated.map((c, idx) => ({ ...c, id: idx + 1 }));
    onSaveCheckpoints(renumbered);
    showStatus('Checkpoint moved down in sequence.');
  };

  const handleSaveCurrentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCheckpoint) return;

    playPowerUpSound();
    const exists = checkpoints.some((c) => c.id === editingCheckpoint.id);
    let updated: Checkpoint[];
    if (exists) {
      updated = checkpoints.map((c) => (c.id === editingCheckpoint.id ? editingCheckpoint : c));
    } else {
      updated = [...checkpoints, editingCheckpoint];
    }

    onSaveCheckpoints(updated);
    setEditingCheckpoint(null);
    showStatus(`Saved Checkpoint #${editingCheckpoint.id} to ${currentCampus.shortName}!`);
  };

  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete Checkpoint #${id} from ${currentCampus.shortName}?`)) {
      playClickSound();
      const updated = checkpoints.filter((c) => c.id !== id);
      onSaveCheckpoints(updated);
      showStatus(`Checkpoint #${id} deleted.`);
    }
  };

  const handleSetToCurrentGps = () => {
    if (!playerPos) {
      alert('Current GPS location is not available. Ensure browser location permission is granted.');
      return;
    }
    if (editingCheckpoint) {
      setEditingCheckpoint({
        ...editingCheckpoint,
        latitude: parseFloat(playerPos.lat.toFixed(6)),
        longitude: parseFloat(playerPos.lng.toFixed(6)),
      });
      showStatus(`Updated coordinates to your GPS: ${playerPos.lat.toFixed(5)}, ${playerPos.lng.toFixed(5)}`);
    }
  };

  const handleApplyPresetCoordinates = (lat: number, lng: number, label: string) => {
    if (editingCheckpoint) {
      setEditingCheckpoint({
        ...editingCheckpoint,
        latitude: lat,
        longitude: lng,
        campusLocationDescription: label,
      });
      showStatus(`Applied preset coordinates for ${label}!`);
    }
  };

  const handleSelectQuickPokemon = (name: string, type: any) => {
    if (editingCheckpoint) {
      setEditingCheckpoint({
        ...editingCheckpoint,
        pokemonName: name,
        pokemonType: type,
        name: editingCheckpoint.name.includes('–')
          ? `${name} Station – ${editingCheckpoint.name.split('–')[1].trim()}`
          : `${name} Station`,
      });
    }
  };

  const handleExportJson = () => {
    playClickSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(checkpoints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `davv_${currentCampusId.toLowerCase()}_checkpoints.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showStatus(`Exported ${currentCampus.shortName} JSON configuration.`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onSaveCheckpoints(parsed);
          showStatus(`Imported ${parsed.length} checkpoints into ${currentCampus.shortName}!`);
        } else {
          showStatus('Invalid checkpoint JSON format.', true);
        }
      } catch (err) {
        showStatus('Failed to read JSON file.', true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 p-2.5 flex items-center justify-center text-indigo-400 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                ORGANIZER CONTROLS
              </span>
              <span className="text-xs text-slate-400 font-bold">
                DAVV Campus Quest
              </span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
              Checkpoint & Clue Hunt Organizer Panel
            </h2>
          </div>
        </div>

        {/* Campus Selector Tabs */}
        <div className="mb-5 p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectCampus('TAKSHASHILA');
              setEditingCheckpoint(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentCampusId === 'TAKSHASHILA'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>🏛️</span>
            <span>Takshashila Campus (Main DAVV)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectCampus('IET_DAVV');
              setEditingCheckpoint(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              currentCampusId === 'IET_DAVV'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>⚙️</span>
            <span>IET DAVV (Engineering & Pikachu Hub)</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mb-4 p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              statusMessage.isError
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
            }`}
          >
            {statusMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 p-3.5 rounded-2xl bg-slate-850 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNew}
              className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Checkpoint</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Reset ${currentCampus.name} checkpoints to defaults (includes Pikachu and updated challenge riddles)?`)) {
                  onResetToDefaults();
                  showStatus(`${currentCampus.shortName} checkpoints reset to defaults.`);
                }
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 border border-slate-700 transition"
              title="Export configuration JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <label className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 border border-slate-700 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* Checkpoint Add/Edit Modal Form */}
        {editingCheckpoint ? (
          <form
            onSubmit={handleSaveCurrentEdit}
            className="p-5 sm:p-6 rounded-3xl bg-slate-850 border border-amber-400/50 shadow-2xl mb-6 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-display font-black text-base sm:text-lg text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>
                  {editingCheckpoint.id ? `Editing Checkpoint #${editingCheckpoint.id}` : 'Create New Checkpoint'}{' '}
                  <span className="text-xs text-amber-400 font-normal">({currentCampus.shortName})</span>
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCheckpoint(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {/* Quick Pokémon Picker */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Pokémon Select:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_POKEMON.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectQuickPokemon(p.name, p.type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                      editingCheckpoint.pokemonName.toLowerCase() === p.name.toLowerCase()
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Checkpoint Name
                </label>
                <input
                  type="text"
                  value={editingCheckpoint.name}
                  onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Pokémon Name & Type
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCheckpoint.pokemonName}
                    onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, pokemonName: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-400"
                    placeholder="Pikachu"
                    required
                  />
                  <select
                    value={editingCheckpoint.pokemonType}
                    onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, pokemonType: e.target.value as any })}
                    className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                  >
                    <option value="Electric">Electric</option>
                    <option value="Fire">Fire</option>
                    <option value="Water">Water</option>
                    <option value="Grass">Grass</option>
                    <option value="Normal">Normal</option>
                    <option value="Psychic">Psychic</option>
                  </select>
                </div>
              </div>

              {/* Coordinates with Presets */}
              <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="text-xs font-black text-slate-300 uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Coordinates & Geofence</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSetToCurrentGps}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 flex items-center gap-1 font-bold"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Use My Device GPS</span>
                    </button>
                    {onTeleportPlayer && (
                      <button
                        type="button"
                        onClick={() => {
                          onTeleportPlayer(editingCheckpoint.latitude, editingCheckpoint.longitude);
                          showStatus(`Teleported simulated player to ${editingCheckpoint.latitude.toFixed(5)}, ${editingCheckpoint.longitude.toFixed(5)}!`);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/50 hover:border-purple-400 flex items-center gap-1 font-bold"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Teleport to Here</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Campus Landmark Presets Dropdown */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Quick Landmark Presets ({currentCampus.shortName}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LANDMARK_PRESETS[currentCampusId]?.map((lm) => (
                      <button
                        key={lm.label}
                        type="button"
                        onClick={() => handleApplyPresetCoordinates(lm.lat, lm.lng, lm.label)}
                        className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      >
                        {lm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingCheckpoint.latitude}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingCheckpoint.longitude}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Radius (m)</label>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={editingCheckpoint.radius}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, radius: parseInt(e.target.value) || 50 })}
                      className="w-full px-2.5 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">XP Reward</label>
                    <input
                      type="number"
                      min="50"
                      max="1500"
                      value={editingCheckpoint.points}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, points: parseInt(e.target.value) || 300 })}
                      className="w-full px-2.5 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 1 Location Clue Configuration */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-amber-300 uppercase block tracking-wider">
                🎯 Stage 1: Campus Location Clue & Riddle
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Clue Title
                  </label>
                  <input
                    type="text"
                    value={editingCheckpoint.stage1?.riddleTitle || ''}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage1: {
                          ...editingCheckpoint.stage1,
                          riddleTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. 🚪 The Grand Gateway Riddle"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Verification Question
                  </label>
                  <input
                    type="text"
                    value={editingCheckpoint.stage1?.question || ''}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage1: {
                          ...editingCheckpoint.stage1,
                          question: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="Identify this campus landmark:"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Riddle Poem / Cryptic Clue (Typed Answer Required First)
                </label>
                <textarea
                  rows={2}
                  value={editingCheckpoint.stage1?.riddlePoem || ''}
                  onChange={(e) =>
                    setEditingCheckpoint({
                      ...editingCheckpoint,
                      stage1: {
                        ...editingCheckpoint.stage1,
                        riddlePoem: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                  placeholder="Witty clue describing the location without giving the name away directly..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={editingCheckpoint.stage1?.answer || ''}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage1: {
                          ...editingCheckpoint.stage1,
                          answer: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-emerald-500/50 rounded-lg text-white text-xs"
                    placeholder="Exact correct answer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Accepted Aliases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingCheckpoint.stage1?.acceptedAnswers || []).join(', ')}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage1: {
                          ...editingCheckpoint.stage1,
                          acceptedAnswers: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="main gate, admin gate, entrance"
                  />
                </div>
              </div>

              {/* 4 Multiple Choice Options (for when 3 attempts unlock!) */}
              <div>
                <label className="block text-[11px] font-bold text-amber-300 uppercase mb-1">
                  4 Multiple Choice Options (Unlocked after 3 answer attempts)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <input
                        type="text"
                        value={editingCheckpoint.stage1?.options?.[optIdx] || ''}
                        onChange={(e) => {
                          const updatedOpts = [...(editingCheckpoint.stage1?.options || ['', '', '', ''])];
                          updatedOpts[optIdx] = e.target.value;
                          setEditingCheckpoint({
                            ...editingCheckpoint,
                            stage1: {
                              ...editingCheckpoint.stage1,
                              options: updatedOpts,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage 2 Challenge Riddle Configuration */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-indigo-300 uppercase block tracking-wider">
                🎭 Stage 2: Challenge Riddle & Brain Teaser
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingCheckpoint.stage2?.category || 'BRAIN_TEASER'}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage2: {
                          ...editingCheckpoint.stage2,
                          category: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="BRAIN_TEASER">🧠 Brain Teaser & Logic</option>
                    <option value="POKEMON_CLASSIC">⚡ Pokémon Challenge</option>
                    <option value="STUDENT_RIDDLE">🎓 Student & Campus Life</option>
                    <option value="BOLLYWOOD">🎬 Bollywood Lore</option>
                    <option value="CRICKET">🏏 Cricket Feats</option>
                    <option value="MUSIC">🎵 Music Masterpieces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Category Title / Label
                  </label>
                  <input
                    type="text"
                    value={editingCheckpoint.stage2?.categoryLabel || ''}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage2: {
                          ...editingCheckpoint.stage2,
                          categoryLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. 🔢 Classic Number Riddle"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Riddle Question Text (Typed Answer Required First)
                </label>
                <textarea
                  rows={2}
                  value={editingCheckpoint.stage2?.riddleText || ''}
                  onChange={(e) =>
                    setEditingCheckpoint({
                      ...editingCheckpoint,
                      stage2: {
                        ...editingCheckpoint.stage2,
                        riddleText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                  placeholder="e.g. I am an odd number. Take away a letter and I become even. What number am I?"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={editingCheckpoint.stage2?.answer || ''}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage2: {
                          ...editingCheckpoint.stage2,
                          answer: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-emerald-500/50 rounded-lg text-white text-xs"
                    placeholder="e.g. Seven"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Accepted Aliases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingCheckpoint.stage2?.acceptedAnswers || []).join(', ')}
                    onChange={(e) =>
                      setEditingCheckpoint({
                        ...editingCheckpoint,
                        stage2: {
                          ...editingCheckpoint.stage2,
                          acceptedAnswers: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="seven, 7, number seven"
                  />
                </div>
              </div>

              {/* 4 Multiple Choice Options (for when 3 attempts unlock!) */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-300 uppercase mb-1">
                  4 Multiple Choice Options (Unlocked after 3 answer attempts)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <input
                        type="text"
                        value={editingCheckpoint.stage2?.options?.[optIdx] || ''}
                        onChange={(e) => {
                          const updatedOpts = [...(editingCheckpoint.stage2?.options || ['', '', '', ''])];
                          updatedOpts[optIdx] = e.target.value;
                          setEditingCheckpoint({
                            ...editingCheckpoint,
                            stage2: {
                              ...editingCheckpoint.stage2,
                              options: updatedOpts,
                            },
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Trivia Fact / Riddle Explanation
                </label>
                <input
                  type="text"
                  value={editingCheckpoint.stage2?.explanation || ''}
                  onChange={(e) =>
                    setEditingCheckpoint({
                      ...editingCheckpoint,
                      stage2: {
                        ...editingCheckpoint.stage2,
                        explanation: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-lg text-white text-xs"
                  placeholder="Explanation shown upon solving..."
                />
              </div>
            </div>

            {/* Locked Scout Hint */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Scout Navigation Hint
              </label>
              <input
                type="text"
                value={editingCheckpoint.lockedScoutHint || ''}
                onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, lockedScoutHint: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                placeholder="Direct real-world landmark orientation clue..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCheckpoint(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Checkpoint</span>
              </button>
            </div>
          </form>
        ) : null}

        {/* Existing Checkpoints Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>{currentCampus.name} Checkpoints ({checkpoints.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Center: {currentCampus.center.lat.toFixed(4)}, {currentCampus.center.lng.toFixed(4)}
            </span>
          </div>

          <div className="space-y-2.5">
            {checkpoints.map((cp, idx) => (
              <div
                key={cp.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-black text-sm flex items-center justify-center shrink-0">
                    #{cp.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-display font-extrabold text-sm text-white">
                        {cp.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {cp.pokemonName} ({cp.pokemonType})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {cp.radius}m
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        +{cp.points} XP
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Lat: {cp.latitude.toFixed(5)} • Lng: {cp.longitude.toFixed(5)}
                    </p>

                    <div className="mt-1 text-xs text-slate-300 space-y-0.5">
                      <p className="line-clamp-1 text-slate-300">
                        <strong className="text-amber-400 font-bold">Stage 1:</strong> {cp.stage1?.riddleTitle} (Ans: {cp.stage1?.answer})
                      </p>
                      <p className="line-clamp-1 text-slate-400">
                        <strong className="text-indigo-400 font-bold">Stage 2:</strong> {cp.stage2?.riddleText} (Ans: {cp.stage2?.answer})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organizer Action Buttons */}
                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
                    title="Move up in sequence"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === checkpoints.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition"
                    title="Move down in sequence"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Teleport / Test location button */}
                  {onTeleportPlayer && (
                    <button
                      type="button"
                      onClick={() => {
                        onTeleportPlayer(cp.latitude, cp.longitude);
                        showStatus(`Simulated player teleported to Checkpoint #${cp.id} (${cp.name})!`);
                      }}
                      className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition"
                      title="Test GPS Teleport to this checkpoint"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  )}

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(cp)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                    title="Duplicate checkpoint"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEdit(cp)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                    title="Edit checkpoint details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(cp.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition"
                    title="Delete checkpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
