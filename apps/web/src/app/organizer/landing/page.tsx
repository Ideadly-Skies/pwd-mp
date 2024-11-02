
'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import 'tailwindcss/tailwind.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard(){
  const [netSalesData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'This Week',
        data: [2400, 1500, 3100, 1700, 2000, 800, 3000],
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Tyovent</div>
          <div className="flex space-x-8 items-center">
            <input type="text" placeholder="Search" className="px-4 py-2 rounded-md bg-gray-800 focus:outline-none" />
            <button className="bg-red-500 px-4 py-2 rounded-md">Create New Event</button>
            <span>REVENUE: $2500.00</span>
            <div className="w-10 h-10 rounded-full bg-gray-600"></div> {/* Profile picture placeholder */}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
          <a href="#" className="block font-semibold text-gray-200">Dashboard</a>
          <a href="#" className="block text-gray-400 hover:text-gray-200">Events</a>
          <a href="#" className="block text-gray-400 hover:text-gray-200">People</a>
          <a href="#" className="block text-gray-400 hover:text-gray-200">Messages</a>
          <a href="#" className="block text-gray-400 hover:text-gray-200">Calendar</a>
          <a href="#" className="block text-gray-400 hover:text-gray-200">Setting</a>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Sales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Net Sales</h3>
                <span>This Week</span>
              </div>
              <p className="text-2xl font-bold text-red-500">$5500.00</p>
              <p className="text-gray-500">Previous Week: $6550.00</p>
              <Line data={netSalesData} />
            </div>

            {/* Tickets */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">Tickets</h3>
              <p className="text-4xl font-bold text-red-500">90</p>
              <p className="text-gray-500">Sold Seats</p>
              <p>Total Seats: 350</p>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold">Event Name</h4>
                    <p className="text-gray-500">Location</p>
                  </div>
                </div>
                {/* Repeat above block for each event */}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Recent Sells */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Sells</h3>
              <p>This Week: 90 Tickets</p>
              <p>Previous Week: 75 Tickets</p>
              <ul className="mt-4 space-y-2">
                <li className="flex justify-between">
                  <span>John Doe</span>
                  <span>$165</span>
                </li>
                <li className="flex justify-between bg-red-100">
                  <span>Jessica William</span>
                  <span>$165</span>
                </li>
                {/* Add more items as needed */}
              </ul>
            </div>

            {/* Total Seats */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4">Total Seats</h3>
              <p className="text-4xl font-bold text-red-500">350</p>
              <p>Total Seats</p>
            </div>

            {/* Online Sells */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">Online Sells</h3>
              <p className="text-2xl font-bold text-red-500">$7500.00</p>
              <div className="h-16 mt-4 bg-gray-200 rounded-lg"></div> {/* Placeholder for chart */}
            </div>

            {/* Email Campaign */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">Email Campaign</h3>
              <div className="flex justify-between items-center mt-4">
                <span>Send Emails</span>
                <span>+165</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Clicks</span>
                <span>+355</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// // pages/dashboard.tsx
// 'use client';
// import { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// export default function Dashboard() {
//   const [netSalesData] = useState({
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'This Week',
//         data: [2400, 1500, 3100, 1700, 2000, 800, 3000],
//         fill: true,
//         backgroundColor: 'rgba(255,99,132,0.2)',
//         borderColor: 'rgba(255,99,132,1)',
//       },
//     ],
//   });

//   return (
//     <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
//       {/* Navbar */}
//       <nav style={{ backgroundColor: '#1a202c', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Tyovent</h1>
//         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//           <input type="text" placeholder="Search" style={{ backgroundColor: '#2d3748', color: 'white', padding: '8px' }} />
//           <button style={{ backgroundColor: '#319795', color: 'white', padding: '8px' }}>Create New Event</button>
//           <p>REVENUE: $2500.00</p>
//           <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4a5568' }}></div>
//         </div>
//       </nav>

//       <div style={{ display: 'flex' }}>
//         {/* Sidebar */}
//         <div style={{ width: '200px', backgroundColor: '#2d3748', color: 'white', padding: '24px' }}>
//           <p><a href="#" style={{ color: '#e2e8f0' }}>Dashboard</a></p>
//           <p><a href="#" style={{ color: '#cbd5e0' }}>Events</a></p>
//           <p><a href="#" style={{ color: '#cbd5e0' }}>People</a></p>
//           <p><a href="#" style={{ color: '#cbd5e0' }}>Messages</a></p>
//           <p><a href="#" style={{ color: '#cbd5e0' }}>Calendar</a></p>
//           <p><a href="#" style={{ color: '#cbd5e0' }}>Setting</a></p>
//         </div>

//         {/* Main Content */}
//         <div style={{ flex: 1, padding: '24px' }}>
//           {/* Net Sales */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
//               <h2>Net Sales</h2>
//               <p>This Week</p>
//             </div>
//             <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e53e3e' }}>$5500.00</p>
//             <p style={{ color: '#718096' }}>Previous Week: $6550.00</p>
//             <Line data={netSalesData} />
//           </div>

//           {/* Tickets */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
//             <h2>Tickets</h2>
//             <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#e53e3e' }}>90</p>
//             <p style={{ color: '#718096' }}>Sold Seats</p>
//             <p>Total Seats: 350</p>
//           </div>

//           {/* Upcoming Events */}
//           <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
//             <h2>Upcoming Events</h2>
//             <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
//               <div style={{ width: '40px', height: '40px', backgroundColor: '#cbd5e0', borderRadius: '50%' }}></div>
//               <div>
//                 <h3>Event Name</h3>
//                 <p style={{ color: '#718096' }}>Location</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// devan - CRUD
// pages/dashboard.tsx
