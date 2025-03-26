import { ReactNode } from "react"

function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
