'use client'

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 animate-[blob1_20s_ease-in-out_infinite]"
        style={{ background: 'oklch(0.70 0.12 180 / 0.3)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full blur-3xl opacity-10 animate-[blob2_25s_ease-in-out_infinite]"
        style={{ background: 'oklch(0.68 0.15 310 / 0.3)' }}
      />
      <div
        className="absolute bottom-1/4 left-[40%] w-[300px] h-[300px] rounded-full blur-3xl opacity-10 animate-[blob3_22s_ease-in-out_infinite]"
        style={{ background: 'oklch(0.75 0.15 55 / 0.3)' }}
      />
    </div>
  )
}
