import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "../components/Navbar/Label";
import NavLink from "../components/Navbar/NavLink";
import { faFileWaveform, faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-cyan-500 text-white h-16 md:h-auto md:w-64 md:h-screen shadow-lg shadow-cyan-500/50">
            <div className="flex md:flex-col md:h-full md:items-start md:justify-start items-center justify-between px-4">
                <h1 className="text-xl font-bold my-2">BioMonitor</h1>

                <div className="mt-0 md:mt-4 w-full">
                    <div className="w-full mb-4">
                        <Label>Principal</Label>
                        <div className="flex md:flex-col md:mt-2 w-full">
                            <Link
                                to="/"
                                className="flex items-center hover:bg-cyan-400 rounded w-full transition-colors duration-200 p-2"
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-2" />
                                <span>Visualizador</span>
                            </Link>
                            <Link
                                to="/search"
                                className="flex items-center hover:bg-cyan-400 rounded w-full transition-colors duration-200 p-2"
                            >
                                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                <span>Buscar Pacientes</span>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full mb-4">
                        <Label>Registros</Label>
                        <div className="flex md:flex-col md:mt-2 w-full">
                            <Link
                                to="/observations/new"
                                className="flex items-center hover:bg-cyan-400 rounded w-full transition-colors duration-200 p-2"
                            >
                                <FontAwesomeIcon icon={faFileWaveform} className="mr-2" />
                                <span>Exames</span>
                            </Link>
                            <Link
                                to="/patients/new"
                                className="flex items-center hover:bg-cyan-400 rounded w-full transition-colors duration-200 p-2"
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                <span>Pacientes</span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;