import { h } from 'preact';

export default function Inventory() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">User Inventory</h1>
      <p className="mb-2">Item 1: Fishing Rod</p>
      <p className="mb-2">Item 2: Bait</p>
      <p className="mb-2">Item 3: Tackle Box</p>
    </div>
  );
}
