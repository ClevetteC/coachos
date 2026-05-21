import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#D9246A',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          color: '#FCF7E8',
          fontSize: '18px',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 700,
          marginTop: '1px',
        }}>
          C
        </span>
      </div>
    ),
    { ...size }
  )
}
