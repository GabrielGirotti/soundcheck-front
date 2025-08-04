export default function Footer() {
  return (
    <footer className="bg-slate-900 text-orange-500 py-4 px-4 text-center bottom-0 mt-10">
      <h2 className="sr-only">Información del sitio y créditos</h2>

      <p className="bg-gradient-to-r from-orange-400 to-pink-600  inline-block text-transparent bg-clip-text text-lg font-semibold ">
        SoundChek
      </p>
      <p className="text-sm italic text-zinc-400 mb-2">Compra a tu ritmo </p>
      <p className="text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} SoundCheck. Todos los derechos
        reservados.
      </p>

      <p className="text-xs text-zinc-500">
        Hecho por{" "}
        <a
          href="https://gabrielgirotti.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-300 transition"
          aria-label="Portafolio de Gabba en Netlify"
        >
          Gabba
        </a>
      </p>
    </footer>
  );
}
