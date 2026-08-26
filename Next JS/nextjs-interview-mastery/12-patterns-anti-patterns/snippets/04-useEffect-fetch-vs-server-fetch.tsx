// Anti-pattern fix: useEffect client fetch vs. Server Component fetch,
// for data known at render time (not client-only or interaction-driven).

// ============ BEFORE ============
// 'use client';
// import { useState, useEffect } from 'react';
// export function TeamRoster({ teamId }: { teamId: string }) {
//   const [members, setMembers] = useState(null);
//   useEffect(() => {
//     fetch(`/api/teams/${teamId}/members`).then((r) => r.json()).then(setMembers);
//   }, [teamId]);
//   if (!members) return <RosterSkeleton />;
//   return <ul>{members.map((m) => <li key={m.id}>{m.name}</li>)}</ul>;
// }

// ============ AFTER ============
// app/teams/[teamId]/roster.tsx (Server Component, no directive needed)
export async function TeamRoster({ teamId }: { teamId: string }) {
  const members = await fetch(`https://api.example.com/teams/${teamId}/members`, {
    next: { revalidate: 300 },
  }).then((res) => res.json());

  return (
    <ul>
      {members.map((m: { id: string; name: string }) => (
        <li key={m.id}>{m.name}</li>
      ))}
    </ul>
  );
}

// Rendered directly from a Server Component page -- no loading state
// needed for this piece specifically, since the data is already
// resolved by the time the HTML reaches the browser:
//
// export default async function TeamPage({ params }) {
//   const { teamId } = await params;
//   return (
//     <div>
//       <h1>Team Roster</h1>
//       <TeamRoster teamId={teamId} />
//     </div>
//   );
// }
