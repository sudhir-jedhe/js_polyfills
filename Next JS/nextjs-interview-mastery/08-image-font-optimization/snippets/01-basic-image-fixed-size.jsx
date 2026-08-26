// A basic fixed-dimension image — the most common next/image usage.
import Image from 'next/image';

export default function Avatar({ user }) {
  return (
    <Image
      src={user.avatarUrl}
      alt={`${user.name}'s avatar`}
      width={48}
      height={48}
      className="rounded-full"
    />
  );
}
