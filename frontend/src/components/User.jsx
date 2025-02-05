import { h } from 'preact';

export default function User() {
  return (
    <div className="ps1-window bg-indigo-900 p-6 text-green-400 dither-bg">
      <h1 className="retro-text text-2xl mb-6">USER DATA</h1>
      <div className="space-y-4">
        <p className="retro-text text-sm">NAME: JOHN DOE</p>
        <p className="retro-text text-sm">EMAIL: JOHN.DOE@EXAMPLE.COM</p>
        <p className="retro-text text-sm">MEMBER SINCE: 01/2023</p>
      </div>
    </div>
  );
}
