import Header from "./components/Header";
import Calculator from "./components/Calculator";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.1),transparent_40%)]" />
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        <Header />
        <Calculator />
        <Footer />
      </div>
    </div>
  );
}

export default App;
