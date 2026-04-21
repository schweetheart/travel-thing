import { Navbar } from "@/components/navbar"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
)

export default Layout
