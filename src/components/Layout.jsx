import React from 'react';
import LeftColumn from './LeftColumn';
import MiddleColumn from './MiddleColumn';
import RightColumn from './RightColumn';

const Layout = () => {
    // 3-column grid following the "Sidebar - Main - Right Panel" pattern
    // Left: Control Panel
    // Middle: Pulse/KPIs
    // Right: Context/Lists
    return (
        <div className="min-h-screen bg-[#F4F6F8] p-6 lg:p-8 font-sans antialiased text-slate-800">
             <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column - Control Panel */}
                <aside className="lg:col-span-3 lg:sticky lg:top-8 order-2 lg:order-1">
                    <LeftColumn />
                </aside>

                {/* Middle Column - Main Dashboard (Pulse) */}
                <main className="lg:col-span-6 order-1 lg:order-2 space-y-8">
                     {/* Header could go here if needed */}
                     <div className="mb-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Günaydın, Ahmet 👋</h1>
                        <p className="text-slate-500 font-medium">Finansal durumun kontrol altında.</p>
                     </div>
                    <MiddleColumn />
                </main>

                {/* Right Column - Context/Details */}
                <aside className="lg:col-span-3 lg:sticky lg:top-8 order-3 lg:order-3">
                    <RightColumn />
                </aside>

             </div>
        </div>
    );
};

export default Layout;
