import { useState } from 'react';
import { ListFilter, ArrowDownUp, ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, Heart } from 'lucide-react';
import UserLayout from './UserLayout';

const Home = () => {
    const tumUrunler = [
        { id: 1, name: 'Monna Mdf Çerçeve 10x15 Cm Kiremit', price: 399.99, oldPrice: 1999.99, discount: 80, img: 'https://cdn-nq.akinon.net/products/2023/10/18/1199321/e5926715-7798-46c5-9b76-6515c1e5d796_size320x320_cropCenter.jpg', tag: '4 AL 3 ÖDE' },
        { id: 2, name: 'Lierre Çerçeve 15x20 Cm Kırmızı', price: 299.99, oldPrice: 1499.99, discount: 80, img: 'https://cdn-nq.akinon.net/products/2023/10/18/1199318/10d196f7-c918-47f2-bd55-75e149865c3b_size320x320_cropCenter.jpg', tag: null, colors: ['🔴', '🔵', '🟢'] },
        { id: 3, name: 'Mantha Vazo Gri 20 cm', price: 749.99, oldPrice: 3499.99, discount: 79, img: 'https://cdn-nq.akinon.net/products/2023/10/12/1198642/4e34c679-b13c-41c0-a78b-c6b7381284b3_size320x320_cropCenter.jpg', tag: 'YENİ ÜRÜN' },
        { id: 4, name: 'Marthe Vazo 35 Cm Krem', price: 2599.99, oldPrice: 11999.99, discount: 78, img: 'https://cdn-nq.akinon.net/products/2023/10/12/1198644/1a74d75d-6c1f-4940-b6c8-580798e27f6a_size320x320_cropCenter.jpg', tag: 'Ücretsiz Kargo' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const urunPerPage = 8;
    const indexOfLastUrun = currentPage * urunPerPage;
    const indexOfFirstUrun = indexOfLastUrun - urunPerPage;
    const currentUrunler = tumUrunler.slice(indexOfFirstUrun, indexOfLastUrun);
    const totalPages = Math.ceil(tumUrunler.length / urunPerPage);

    return (
        <UserLayout>
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10">

                <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-3 md:gap-4 flex-wrap">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none">
                        <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-amber-600 transition-all shadow-sm active:scale-95">
                            <ListFilter size={16} className="text-gray-400" />
                            Filtrele
                        </button>
                        <span className="hidden sm:inline text-xs text-gray-400 font-medium tracking-tight">
                            <span className="font-bold text-gray-900 dark:text-white">{tumUrunler.length}</span> ürün listeleniyor
                        </span>
                    </div>

                    <div className="relative group flex-1 md:flex-none">
                        <button className="w-full flex items-center gap-2 px-4 md:px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-amber-600 transition-all shadow-sm justify-between active:scale-95">
                            <div className="flex items-center gap-2">
                                <ArrowDownUp size={16} className="text-gray-400" />
                                <span className="truncate">Sırala</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 transition-transform group-hover:rotate-180" />
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                            {['Önerilen', 'Fiyata Göre Artan', 'Fiyata Göre Azalan', 'En Yeniler'].map(item => (
                                <button key={item} className="w-full text-left text-xs md:text-sm px-4 py-3 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-colors">{item}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-8 md:gap-y-12">
                    {currentUrunler.map((urun) => (
                        <div key={urun.id} className="group relative flex flex-col">

                            <div className="relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#F5F5F5] dark:bg-gray-800 transition-all duration-500">
                                <img
                                    src={urun.img}
                                    alt={urun.name}
                                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
                                />

                                {urun.tag && (
                                    <span className={`absolute top-3 left-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm ${urun.tag === 'YENİ ÜRÜN' ? 'bg-amber-600 text-white' : 'bg-gray-900 text-white'}`}>
                                        {urun.tag}
                                    </span>
                                )}

                                <div className="absolute inset-x-0 bottom-3 px-3 flex justify-between items-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-2 md:group-hover:translate-y-0">
                                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 hover:bg-amber-600 hover:text-white transition-all active:scale-90">
                                        <ShoppingBag size={18} />
                                    </button>
                                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-gray-900 hover:text-red-500 transition-all active:scale-90">
                                        <Heart size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex-1 flex flex-col">
                                <h3 className="text-[13px] md:text-[15px] font-bold text-gray-800 dark:text-gray-100 leading-tight group-hover:text-amber-600 transition-colors line-clamp-2 h-10">
                                    {urun.name}
                                </h3>

                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-[16px] md:text-[20px] font-black text-gray-950 dark:text-white tracking-tighter">
                                        ₺{urun.price.toLocaleString('tr-TR')}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 line-through leading-none">
                                            ₺{urun.oldPrice.toLocaleString('tr-TR')}
                                        </span>
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">
                                            -%{urun.discount} İndirim
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 md:mt-24 py-8 border-t border-gray-100 dark:border-gray-800 flex justify-center items-center gap-1 md:gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-600 disabled:opacity-30 transition-all active:scale-90"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1 md:gap-2 mx-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl text-xs md:text-sm font-black transition-all ${currentPage === i + 1 ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-amber-600 disabled:opacity-30 transition-all active:scale-90"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <section className="py-20 md:py-32 mt-10 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] text-amber-600 mb-6 block">Deco.Studio Philosophy</span>
                    <h2 className="text-3xl md:text-5xl font-light leading-tight mb-8 dark:text-white">
                        Eviniz, Sizin <span className="italic font-serif">Kişisel</span> <br className="hidden md:block" />
                        <span className="font-bold">Müzenizdir.</span>
                    </h2>
                    <div className="w-16 h-1 bg-amber-600 mx-auto mb-10 rounded-full"></div>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Her parça, zanaatın ruhunu ve 3D teknolojisinin hassasiyetini taşır. Sizin için sadece eşya değil, yıllarca saklanacak anılar tasarlıyoruz.
                    </p>
                </div>
            </section>
        </UserLayout>
    );
};

export default Home;