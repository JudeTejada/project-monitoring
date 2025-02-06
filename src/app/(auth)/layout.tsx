import type { ReactNode } from "react"



function layout({children}: Readonly<{children: ReactNode}>) {
  return (
    <main>
      <div className="h-screen flex flex-col items-center  justify-center">
        {children}
      </div>
    </main>
  )
}

export default layout