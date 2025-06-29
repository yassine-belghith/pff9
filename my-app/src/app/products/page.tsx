'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiArrowRight, FiWind, FiBox, FiDroplet, FiScissors, FiSun, FiZap, FiMoreHorizontal, FiImage } from 'react-icons/fi';
import AuroraBackground from '../components/AuroraBackground';

interface Product {
  _id: string;
  nomProduit: string;
  description?: string;
  prix: number;
  categorie: string;
  sousCategorie?: string;
  imageUrl?: string;
  quantiteStock: number;
}

const CategoryIcon = ({ name }: { name: string }) => {
  const icons: { [key: string]: React.ElementType } = {
    "Nettoyage": FiWind,
    "Repassage": FiBox,
    "Tapis": FiDroplet,
    "Rideaux": FiSun,
    "Teinture": FiScissors,
    "Sport": FiZap,
    "Extra": FiMoreHorizontal
  };
  const IconComponent = icons[name] || FiMoreHorizontal;
  return <IconComponent className="w-8 h-8 mb-2" />;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/products");
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Tout", ...new Set(products.map(p => p.categorie))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nomProduit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tout" || product.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center">
      <div>
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500 mx-auto"></div>
        <h2 className="text-2xl font-semibold text-white mt-4">Chargement...</h2>
        <p className="text-white/60">Nous préparons les produits pour vous.</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center">
      <div className="bg-black/30 p-8 rounded-2xl border border-red-500/50">
        <h2 className="text-2xl font-semibold text-red-400">Oops! Une erreur est survenue.</h2>
        <p className="text-white/60 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-400 transition-all duration-300">
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <AuroraBackground>
      
      <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-20 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10"
        >
          <div className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center" aria-label="Accueil YallaClean">
              <Image
                src="/96539f82-301e-4773-9046-8111bea17b62.webp"
                alt="Logo YallaClean"
                width={52}
                height={52}
                priority
                className="h-13 w-13 rounded-full object-cover drop-shadow-lg"
              />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                Se connecter
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:from-sky-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
                S'inscrire
              </Link>
            </div>
          </div>
        </motion.nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-gradient-to-r from-sky-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Nos Produits & Services
          </h1>
          <p className="text-lg text-white/70 text-center max-w-3xl mx-auto mb-12">
            Explorez notre catalogue complet. Qualité et soin garantis pour tous vos articles.
          </p>
        </motion.div>

        <div className="sticky top-24 z-10 bg-gray-900/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                className="w-full bg-black/20 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-white/40 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
              {categories.map((category, index) => (
                <button
                  key={`${category}-${index}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-black/20 text-white/60 hover:bg-black/40 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link href={`/products/${product._id}`} key={product._id} className="block h-full">
                <motion.div
                  variants={itemVariants}
                  className="group bg-black/30 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-sky-400/50 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                >
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.nomProduit}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.quantiteStock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Indisponible
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col">
                    <span className="inline-block bg-sky-500/10 text-sky-400 text-xs px-2 py-1 rounded-full mb-2 self-start">
                      {product.categorie}
                    </span>
                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.nomProduit}</h2>
                    <p className="text-white/60 text-xs mb-3 line-clamp-2 flex-grow">{product.description}</p>
                    <div className="mt-auto pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                          {product.prix.toFixed(2)} DT
                        </span>
                      </div>
                      <button
                        disabled={product.quantiteStock === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // In a real app, you'd dispatch an action to add to cart
                          console.log(`Added ${product.nomProduit} to cart`);
                          alert(`${product.nomProduit} a été ajouté au panier!`);
                        }}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                          product.quantiteStock === 0
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-400 hover:to-emerald-400 transform hover:scale-105 shadow-lg'
                        }`}
                      >
                        <FiShoppingCart />
                        {product.quantiteStock === 0 ? 'Indisponible' : 'Ajouter au panier'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-black/20 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-semibold text-white">Aucun produit trouvé</h3>
              <p className="text-white/60 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
            </div>
          )}
        </motion.div>
      </main>
    </AuroraBackground>
  );
}