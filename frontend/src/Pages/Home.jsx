import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import api from '../api';
import UserLayout from './UserLayout';

const Home = () => { 

    const cats = [
        { name: '3D Dekor', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400', color: 'bg-orange-50' },
        { name: 'Aydınlatma', img: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=400', color: 'bg-blue-50' },
        { name: 'Minimal Obje', img: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=400', color: 'bg-green-50' },
        { name: 'Duvar Sanatı', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400', color: 'bg-purple-50' },
    ];

    return (
        <UserLayout>
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kategorileri Keşfet</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Evinizin ruhunu değiştirecek modern dokunuşlar.</p>
                </div>
                <button className="text-sm font-bold text-amber-600 border-b-2 border-amber-600 pb-1 hover:text-amber-700 transition-colors">Tümünü Gör</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {cats.map((cat, index) => (
                    <div key={index} className="group cursor-pointer">
                        <div className={`relative overflow-hidden rounded-[2.5rem] aspect-square ${cat.color} dark:bg-gray-800 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-600/10 group-hover:-translate-y-2`}>
                            <img
                                src={cat.img}
                                alt={cat.name}
                                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="mt-4 text-center font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-600 transition-colors">{cat.name}</h3>
                    </div>
                ))}
            </div>
            </section>
        </UserLayout>
    );
};
export default Home;