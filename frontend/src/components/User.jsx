import { h } from 'preact';

export default function User() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">User Account</h1>
      <p className="mb-2">Name: John Doe</p>
      <p className="mb-2">Email: john.doe@example.com</p>
      <p className="mb-2">Member since: January 2023</p>
    </div>
  );
}
