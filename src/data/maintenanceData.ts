export interface MaintenanceCategory {
  id: string;
  name: string;
  items: MaintenanceItem[];
}

export interface MaintenanceItem {
  id: string;
  name: string;
  description?: string;
  interval?: string; // ✅ Added maintenance interval (km or time)
}

export const maintenanceCategories: MaintenanceCategory[] = [
  {
    id: 'engine-powertrain',
    name: 'Engine & Powertrain',
    items: [
      { id: 'engine-overhaul', name: 'Engine Overhaul or Replacement', interval: '150,000–250,000 km (as needed)' },
      { id: 'cylinder-head', name: 'Cylinder Head Gasket Replacement', interval: 'As needed (failure indication)' },
      { id: 'timing-chain', name: 'Timing Chain/Belt Replacement', interval: '100,000 km or 5 years' },
      { id: 'spark-plug', name: 'Spark Plug Replacement', interval: '30,000–50,000 km (copper), 100,000 km (iridium)' },
      { id: 'fuel-injector', name: 'Fuel Injector System Repair/Replacement', interval: 'Every 80,000–100,000 km or when clogged' },
      { id: 'drive-belt', name: 'Drive Belt Replacement', interval: '80,000–100,000 km or 5 years' },
      { id: 'engine-noise', name: 'Engine Noise, Vibration, or Misfiring', interval: 'As needed (diagnosis)' },
      { id: 'unusual-exhaust', name: 'Unusual Exhaust Smoke (Color, Smell)', interval: 'As needed (diagnosis)' },
      { id: 'engine-oil', name: 'Engine Oil Change', interval: '5,000–10,000 km or 6 months' },
      { id: 'oil-filter', name: 'Oil Filter Replacement', interval: 'Every oil change' },
      { id: 'sensor-replacement', name: 'Sensor Replacement (Oxygen, MAF, etc.)', interval: '80,000–160,000 km or when faulty' }
    ]
  },
  {
    id: 'transmission-drivetrain',
    name: 'Transmission & Drivetrain',
    items: [
      { id: 'transmission-repair', name: 'Transmission Overhaul/Replacement', interval: 'As needed (failure indication)' },
      { id: 'clutch-system', name: 'Clutch System Repair/Replacement (Manual)', interval: '80,000–120,000 km or as worn' },
      { id: 'transmission-fluid', name: 'Transmission Fluid Renewal', interval: '50,000–100,000 km or 3 years' },
      { id: 'differential-repair', name: 'Differential Repair/Replacement', interval: 'As needed (failure indication)' },
      { id: 'drive-shaft', name: 'Drive Shaft Repair/Replacement', interval: 'As needed (wear or damage)' },
      { id: 'cv-joint', name: 'CV Joint/Axle Shaft Replacement', interval: '80,000–100,000 km or when clicking noise' },
      { id: 'ecu-replacement', name: 'ECU (Engine Control Unit) Replacement', interval: 'As needed (fault)' },
      { id: 'oil-leaks', name: 'Oil Leaks (Under Engine, Transmission)', interval: 'As needed (inspection)' }
    ]
  },
  {
    id: 'brakes-suspension',
    name: 'Brakes & Suspension',
    items: [
      { id: 'brake-pad', name: 'Brake Pad and Disc Replacement', interval: '30,000–70,000 km (pads), 80,000–120,000 km (discs)' },
      { id: 'abs-anti-lock', name: 'ABS Repair/Replacement', interval: 'As needed (failure indication)' },
      { id: 'brake-fluid', name: 'Brake Fluid Renewal', interval: '2 years or 40,000 km' },
      { id: 'suspension-overhaul', name: 'Suspension Overhaul', interval: '80,000–100,000 km or when worn' },
      { id: 'suspension-bushings', name: 'Suspension Bushings Renewal', interval: '80,000–100,000 km or when cracked' },
      { id: 'unusual-noises', name: 'Unusual Suspension Noises', interval: 'As needed (inspection)' },
      { id: 'brake-performance', name: 'Brake Performance Issues', interval: 'As needed (diagnosis)' },
      { id: 'steering-rack', name: 'Steering Rack Repair/Replacement', interval: 'As needed (failure indication)' },
      { id: 'power-steering-fluid', name: 'Power Steering Fluid Top-up/Flush', interval: 'Every 50,000 km or 2 years' },
      { id: 'steering-wheel', name: 'Steering Wheel Repair/Replacement', interval: 'As needed' },
      { id: 'steering-column', name: 'Steering Column Repair/Replacement', interval: 'As needed' }
    ]
  },
  {
    id: 'electrical-system',
    name: 'Electrical System',
    items: [
      { id: 'battery-terminal', name: 'Battery Terminal Cleaning', interval: 'Every 20,000 km or annually' },
      { id: 'battery-replacement', name: 'Battery Replacement', interval: '3–5 years' },
      { id: 'alternator', name: 'Alternator Repair/Replacement', interval: '120,000–160,000 km or as faulty' },
      { id: 'starter-motor', name: 'Starter Motor Repair/Replacement', interval: '100,000–150,000 km or when faulty' },
      { id: 'fuse-replacement', name: 'Fuse Replacement', interval: 'As needed' },
      { id: 'horn-repair', name: 'Horn Repair/Replacement', interval: 'As needed' },
      { id: 'dashboard-warning', name: 'Dashboard Warning Lights', interval: 'As needed (diagnosis)' },
      { id: 'electrical-systems', name: 'Electrical Systems (Lights, Windows, Audio)', interval: 'As needed' }
    ]
  },
  {
    id: 'heating-cooling',
    name: 'Heating & Cooling',
    items: [
      { id: 'cooling-system', name: 'Cooling System Overhaul', interval: '80,000–100,000 km or as faulty' },
      { id: 'coolant-top-up', name: 'Coolant Top-up/Flush', interval: '40,000–50,000 km or 2 years' },
      { id: 'ac-major-repair', name: 'Air Conditioning Compressor Replacement', interval: 'As needed (failure indication)' },
      { id: 'ac-efficiency', name: 'Air Conditioning Efficiency Check', interval: 'Annually (before hot season)' },
      { id: 'heater-core', name: 'Heater Core Repair/Replacement', interval: 'As needed (leak/fault)' },
      { id: 'unusual-odors', name: 'Unusual Odors Inside Car', interval: 'As needed (inspection)' }
    ]
  },
  {
    id: 'exhaust-system',
    name: 'Exhaust System',
    items: [
      { id: 'muffler-repair', name: 'Muffler Repair/Replacement', interval: '80,000–100,000 km or when noisy' },
      { id: 'catalytic-converter', name: 'Catalytic Converter Replacement', interval: '160,000 km or when clogged' },
      { id: 'exhaust-leaks', name: 'Exhaust Leaks and Noise Repair', interval: 'As needed' }
    ]
  },
  {
    id: 'interior-safety',
    name: 'Interior & Safety',
    items: [
      { id: 'headlight-taillight', name: 'Headlight/Taillight Bulb Replacement', interval: '2–4 years or when blown' },
      { id: 'windshield-wiper', name: 'Windshield Wiper Replacement', interval: '12–18 months' },
      { id: 'interior-cleanliness', name: 'Interior Cleanliness & Seatbelt Condition', interval: 'Monthly check' },
      { id: 'door-hinges', name: 'Door Hinges, Locks, and Rubber Seals', interval: 'Annually (lubrication)' },
      { id: 'windshield-mirrors', name: 'Windshield & Mirrors Check', interval: 'As needed (cracks/visibility)' },
      { id: 'airbag-system', name: 'Airbag System Diagnostics', interval: '10 years (manufacturer recommended)' },
      { id: 'seatbelt-system', name: 'Seatbelt System Repair/Replacement', interval: 'As needed (wear or failure)' }
    ]
  },
  {
    id: 'tires-wheels',
    name: 'Tires & Wheels',
    items: [
      { id: 'tire-puncture', name: 'Tire Puncture Repairs', interval: 'As needed' },
      { id: 'tire-replacement', name: 'Tire Replacement', interval: '40,000–80,000 km or 4–6 years' },
      { id: 'tire-condition', name: 'Tire Condition and Air Pressure', interval: 'Monthly check / every trip' },
      { id: 'wheel-alignment', name: 'Wheel Alignment and Balancing', interval: '10,000–15,000 km or annually' },
      { id: 'rim-repair', name: 'Rim Repair/Replacement', interval: 'As needed (damage)' }
    ]
  },
  {
    id: 'routine-maintenance',
    name: 'Routine Maintenance',
    items: [
      { id: 'engine-oil-change', name: 'Engine Oil Change', interval: '5,000–10,000 km or 6 months' },
      { id: 'spark-plug-replacement', name: 'Spark Plug Replacement', interval: '30,000–100,000 km depending on type' },
      { id: 'battery-replacement-routine', name: 'Battery Replacement', interval: '3–5 years' },
      { id: 'tire-rotation', name: 'Tire Rotation', interval: '8,000–10,000 km' },
      { id: 'cabin-ac-filter', name: 'Cabin/AC Filter Replacement', interval: '15,000–20,000 km or annually' },
      { id: 'air-filter-replacement', name: 'Air Filter Replacement', interval: '15,000–20,000 km' },
      { id: 'general-inspection', name: 'General Vehicle Inspection', interval: 'Every 5,000 km or 6 months' }
    ]
  },
  {
    id: 'fluids-filters',
    name: 'Fluids & Filters',
    items: [
      { id: 'fuel-filter', name: 'Fuel Filter Replacement', interval: '40,000–50,000 km' },
      { id: 'headlight-taillight-routine', name: 'Headlight/Taillight Bulb Replacement', interval: '2–4 years or when blown' },
      { id: 'dashboard-warning-routine', name: 'Dashboard Warning Lights', interval: 'As needed' },
      { id: 'windshield-routine', name: 'Windshield Wiper Replacement', interval: '12–18 months' },
      { id: 'brake-fluid-check', name: 'Brake Fluid Top-up', interval: '2 years or 40,000 km' },
      { id: 'power-steering-fluid-check', name: 'Power Steering Fluid Check', interval: '50,000 km or 2 years' }
    ]
  },
  {
    id: 'body-repairs',
    name: 'Body & Exterior Repairs',
    items: [
      { id: 'paint-touch-up', name: 'Paint Touch-up/Respray', interval: 'As needed' },
      { id: 'dent-removal', name: 'Dent Removal/Panel Beating', interval: 'As needed' },
      { id: 'rust-treatment', name: 'Rust Treatment/Protection', interval: 'Annually' },
      { id: 'glass-replacement', name: 'Glass/Windshield Replacement', interval: 'As needed (cracks/damage)' }
    ]
  }
];
