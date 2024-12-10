"use client"
export default function View() {
  return (
    <div style={{
      height: '100dvh',
      width: '100dvw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <style>
        {`
          h1 {
            font-size: 4rem;
          }

          @media screen and (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
          }
        `}
      </style>
      <h1>
        Hvala za vaš nakup ŠKG puloverjev! :D
      </h1>
    </div>
  )
}