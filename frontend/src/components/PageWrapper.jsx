function PageWrapper({ children }) {
    return (
      <div className="flex flex-col justify-center min-h-screen bg-gray-100 px-4 text-center">
          <div className="w-full max-w-4xl">{children}</div>        
      </div>
    )
  }
  
  export default PageWrapper