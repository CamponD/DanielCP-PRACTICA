import Navbar from "./Navbar"

function PageWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow px-4 pt-24 text-center">
        {children}
      </main>
    </div>
  )
}

export default PageWrapper