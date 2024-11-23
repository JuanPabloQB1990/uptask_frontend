import { Link } from "react-router-dom"

const NotFound404 = () => {
  return (
    <div>
        <h1 className="font-black text-center text-4xl text-white">Pagina no encontrada</h1>
        <p className="mt-10 text-center text-white">
            Tal vez desees volver a {" "}
            <Link className="text-fuchsia-500" to="/">Proyectos</Link>
        </p>
    </div>
  )
}

export default NotFound404