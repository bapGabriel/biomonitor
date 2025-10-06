function Navbar() {
  return (
    <nav className="bg-cyan-500 text-white h-16 md:h-auto md:w-48 md:h-screen shadow-lg shadow-cyan-500/50">
      <div className="flex md:flex-col md:h-full md:items-start md:justify-start items-center justify-between px-4">
        <h1 className="text-xl font-bold my-2">BioMonitor</h1>
        <ul className="flex md:flex-col gap-4 md:mt-8">
          <li><a href="/" className="hover:underline">Visualizador</a></li>
          <li><a href="/patients" className="hover:underline">Buscar paciente</a></li>
          <li><a href="/observations" className="hover:underline">Registrar paciente</a></li>
          <li><a href="/observations" className="hover:underline">Registrar exame</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;