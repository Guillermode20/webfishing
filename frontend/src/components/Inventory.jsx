import { h } from 'preact';

export default function Inventory() {
  return (
    <div className="ps1-window bg-indigo-900 p-6 text-green-400 dither-bg">
      <h1 className="retro-text text-2xl mb-6">INVENTORY</h1>
      <div className="space-y-4">
        <div className="bg-indigo-950 bg-opacity-50 p-4 border-2 border-green-400">
          <p className="retro-text text-sm">ITEM_01: FISHING ROD</p>
        </div>
        <div className="bg-indigo-950 bg-opacity-50 p-4 border-2 border-green-400">
          <p className="retro-text text-sm">ITEM_02: BAIT</p>
        </div>
        <div className="bg-indigo-950 bg-opacity-50 p-4 border-2 border-green-400">
          <p className="retro-text text-sm">ITEM_03: TACKLE BOX</p>
        </div>
      </div>
    </div>
  );
}
