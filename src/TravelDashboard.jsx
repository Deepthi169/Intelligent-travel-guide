/*
  TravelDashboard.jsx
  - Single-file React component (default export)
  - Uses Tailwind classes (no external CSS here). Make sure your project includes Tailwind and your index.css contains the Tailwind imports.
  - Uses PapaParse to load CSV datasets (hotels, bus routes, attractions)
*/

import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";

export default function TravelDashboard() {
  const [hotels, setHotels] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [attractions, setAttractions] = useState([]);

  // Load CSV datasets on mount
  useEffect(() => {
    Papa.parse("/data/hotels.csv", {
      download: true,
      header: true,
      complete: (results) => setHotels(results.data),
    });
    Papa.parse("/data/busRoutes.csv", {
      download: true,
      header: true,
      complete: (results) => setBusRoutes(results.data),
    });
    Papa.parse("/data/attractions.csv", {
      download: true,
      header: true,
      complete: (results) => setAttractions(results.data),
    });
  }, []);

  const [form, setForm] = useState({
    persons: 1,
    destination: "",
    budgetType: "low",
    exactBudget: "",
    food: "veg",
    emergencyContact: "",
    companionContact: "",
    vehicle: "",
    extraInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Trip request submitted:", form);
    alert("Trip details saved locally (open console to see payload)");
  };

  const matchesDestination = (item) =>
    !form.destination || (item.city && item.city.toLowerCase().includes(form.destination.toLowerCase()));

  // Budget calculation logic
  const totalCost = useMemo(() => {
    let hotelCost = 0;
    let busCost = 0;
    let attractionCost = 0;

    const selectedHotel = hotels.find((h) => matchesDestination(h) && h.type === "Hotel");
    if (selectedHotel && selectedHotel.roomCharge) {
      hotelCost = parseInt(selectedHotel.roomCharge, 10) * form.persons;
    }

    const selectedBus = busRoutes.find(
      (b) =>
        form.destination &&
        ((b.to && b.to.toLowerCase().includes(form.destination.toLowerCase())) ||
          (b.from && b.from.toLowerCase().includes(form.destination.toLowerCase())))
    );
    if (selectedBus && selectedBus.fare) {
      busCost = parseInt(selectedBus.fare, 10) * form.persons;
    }

    const selectedAttraction = attractions.find((a) => matchesDestination(a));
    if (selectedAttraction && selectedAttraction.entryFee) {
      attractionCost = parseInt(selectedAttraction.entryFee, 10) * form.persons;
    }

    return hotelCost + busCost + attractionCost;
  }, [form, hotels, busRoutes, attractions]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 via-white to-amber-50 p-6 flex flex-col items-center">
      <header className="max-w-6xl w-full">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold">JE</div>
          <div>
            <h1 className="text-2xl font-extrabold">Journease — Trip Planner</h1>
            <p className="text-sm text-slate-600">Focused theme: travel & tourism — content centered for a delightful UX</p>
          </div>
          <div className="ml-auto text-sm text-slate-500">Frontend: React + Tailwind CSS</div>
        </div>
      </header>

      <main className="max-w-6xl w-full mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form card */}
        <section className="lg:col-span-1 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Plan your trip</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Number of persons</span>
              <input name="persons" type="number" min="1" value={form.persons} onChange={handleChange} className="mt-1 block w-full rounded-md p-2 border" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Where they want to go</span>
              <input name="destination" value={form.destination} onChange={handleChange} placeholder="City or attraction" className="mt-1 block w-full rounded-md p-2 border" />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-sm font-medium">Budget type</span>
                <select name="budgetType" value={form.budgetType} onChange={handleChange} className="mt-1 block w-full rounded-md p-2 border">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Exact budget (INR)</span>
                <input name="exactBudget" value={form.exactBudget} onChange={handleChange} placeholder="e.g. 5000" className="mt-1 block w-full rounded-md p-2 border" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Food preference</span>
              <select name="food" value={form.food} onChange={handleChange} className="mt-1 block w-full rounded-md p-2 border">
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Veg</option>
                <option value="both">Both</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Emergency contact (from home)</span>
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Name + phone" className="mt-1 block w-full rounded-md p-2 border" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Companion contact</span>
              <input name="companionContact" value={form.companionContact} onChange={handleChange} placeholder="e.g. +91-..." className="mt-1 block w-full rounded-md p-2 border" />
            </label>

            {/* <label className="block">
              <span className="text-sm font-medium">Vehicle</span>
              <input name="vehicle" value={form.vehicle} onChange={handleChange} placeholder="Car / Bike / Bus / None" className="mt-1 block w-full rounded-md p-2 border" />
            </label> */}

            <label className="block">
              <span className="text-sm font-medium">Extra info</span>
              <textarea name="extraInfo" value={form.extraInfo} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md p-2 border" />
            </label>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg py-2 font-semibold shadow bg-amber-500 text-white">Save trip</button>
              <button type="button" onClick={() => setForm({ persons:1,destination:'',budgetType:'low',exactBudget:'',food:'veg',emergencyContact:'',companionContact:'',vehicle:'',extraInfo:'' })} className="flex-1 rounded-lg py-2 border font-medium">Reset</button>
            </div>
          </form>
        </section>

        {/* Content / datasets */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold text-lg">Suggested hotels & hospitals</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">City</th>
                    <th className="pb-2">Phone</th>
                    {/* <th className="pb-2">Vehicle No</th> */}
                    <th className="pb-2">Room Charge (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.filter(matchesDestination).map((h, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2">{h.name}</td>
                      <td className="py-2">{h.type}</td>
                      <td className="py-2">{h.city}</td>
                      <td className="py-2">{h.phone}</td>
                      <td className="py-2">{h.vehicleNo}</td>
                      <td className="py-2">{h.roomCharge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Bus routes</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="pb-2">From</th>
                      <th className="pb-2">To</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Fare (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {busRoutes.filter(r => !form.destination || (r.from && r.from.toLowerCase().includes(form.destination.toLowerCase())) || (r.to && r.to.toLowerCase().includes(form.destination.toLowerCase()))).map((r, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2">{r.from}</td>
                        <td className="py-2">{r.to}</td>
                        <td className="py-2">{r.duration}</td>
                        <td className="py-2">{r.fare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Attractions & entry fees</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="pb-2">Attraction</th>
                      <th className="pb-2">City</th>
                      <th className="pb-2">Entry Fee (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attractions.filter(matchesDestination).map((a, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2">{a.name}</td>
                        <td className="py-2">{a.city}</td>
                        <td className="py-2">{a.entryFee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-semibold">Quick map & summary</h3>
            <div className="mt-4 h-40 rounded-md border-dashed border-2 border-slate-200 flex items-center justify-center text-slate-400">Map placeholder — integrate Leaflet / Google Maps here</div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <div className="font-medium">Selected destination</div>
                <div>{form.destination || "—"}</div>
              </div>
              <div>
                <div className="font-medium">Budget</div>
                <div>
                  {form.exactBudget
                    ? `₹ ${form.exactBudget} (${form.budgetType})`
                    : `${form.budgetType}`} 
                  | Estimated cost: ₹ {totalCost}
                </div>
              </div>
              <div>
                <div className="font-medium">Emergency contact</div>
                <div>{form.emergencyContact || "—"}</div>
              </div>
              <div>
                <div className="font-medium">Companion</div>
                <div>{form.companionContact || "—"}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl w-full mt-6 text-center text-sm text-slate-500">This demo loads TN hotels/hospitals, bus-routes, and attractions datasets from CSV. Replace sample CSV files in /public/data to use real data.</footer>
    </div>
  );
}


