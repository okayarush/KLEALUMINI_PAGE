'use client';

export default function BackgroundOrbs() {
  return (
    <>
      {/* Deep navy orb top-left */}
      <div
        className="bg-orb"
        style={{
          width: 600,
          height: 600,
          top: '-200px',
          left: '-200px',
          background: 'radial-gradient(circle, rgba(13, 27, 62, 0.8) 0%, transparent 70%)',
        }}
      />
      {/* Gold orb top-right */}
      <div
        className="bg-orb"
        style={{
          width: 500,
          height: 500,
          top: '-100px',
          right: '-150px',
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 70%)',
        }}
      />
      {/* Maroon orb center */}
      <div
        className="bg-orb"
        style={{
          width: 700,
          height: 700,
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(123, 30, 46, 0.08) 0%, transparent 70%)',
        }}
      />
      {/* Blue orb bottom-right */}
      <div
        className="bg-orb"
        style={{
          width: 400,
          height: 400,
          bottom: '-100px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(74, 144, 217, 0.08) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
