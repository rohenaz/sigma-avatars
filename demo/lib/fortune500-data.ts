// Fortune 500 / S&P 500 Companies Data
// Extended list for infinite scroll demo

export const fortune500Companies = [
  // Tech Giants (Top 50)
  'Apple', 'Microsoft', 'Amazon', 'NVIDIA', 'Alphabet', 'Meta', 'Tesla', 'Broadcom', 'Oracle', 'Salesforce',
  'AMD', 'Adobe', 'Netflix', 'Intel', 'IBM', 'Qualcomm', 'Applied Materials', 'ServiceNow', 'Intuit', 'Cisco',
  'Texas Instruments', 'Accenture', 'Palo Alto Networks', 'Synopsys', 'Cadence Design', 'Micron Technology',
  'Analog Devices', 'KLA Corporation', 'Autodesk', 'Workday', 'Datadog', 'Snowflake', 'CrowdStrike', 'Zscaler',
  'MongoDB', 'Cloudflare', 'Atlassian', 'Zoom', 'Palantir', 'Unity', 'Roblox', 'DoorDash', 'Airbnb', 'Uber',
  'Lyft', 'Pinterest', 'Snap', 'Twitter', 'Reddit', 'Discord',

  // Financial Services (50)
  'Berkshire Hathaway', 'JPMorgan Chase', 'Visa', 'Mastercard', 'Bank of America', 'Wells Fargo', 'Goldman Sachs',
  'Morgan Stanley', 'American Express', 'PayPal', 'BlackRock', 'Charles Schwab', 'S&P Global', 'Citigroup',
  'U.S. Bancorp', 'PNC Financial', 'Truist', 'Capital One', 'State Street', 'Discover', 'Fidelity', 'Vanguard',
  'T. Rowe Price', 'Franklin Templeton', 'Invesco', 'Northern Trust', 'M&T Bank', 'Fifth Third', 'KeyCorp',
  'Regions Financial', 'Citizens Financial', 'Huntington Bancshares', 'Comerica', 'Zions Bancorporation',
  'First Republic', 'SVB Financial', 'Signature Bank', 'Western Alliance', 'East West Bank', 'Commerce Bancshares',
  'Synchrony Financial', 'Ally Financial', 'SoFi', 'Robinhood', 'Coinbase', 'Block', 'Stripe', 'Plaid', 'Chime',
  'Affirm',

  // Healthcare & Pharma (50)
  'UnitedHealth Group', 'Johnson & Johnson', 'Eli Lilly', 'AbbVie', 'Pfizer', 'Merck', 'Thermo Fisher', 'Abbott',
  'Danaher', 'Bristol-Myers Squibb', 'Amgen', 'CVS Health', 'Cigna', 'Elevance Health', 'Gilead Sciences',
  'Moderna', 'Regeneron', 'Vertex Pharmaceuticals', 'Zoetis', 'Boston Scientific', 'Stryker', 'Medtronic',
  'Intuitive Surgical', 'Edwards Lifesciences', 'Becton Dickinson', 'Humana', 'Centene', 'Molina Healthcare',
  'DaVita', 'HCA Healthcare', 'Universal Health', 'Tenet Healthcare', 'Community Health', 'LabCorp', 'Quest Diagnostics',
  'McKesson', 'AmerisourceBergen', 'Cardinal Health', 'Henry Schein', 'IQVIA', 'Veeva Systems', 'Doximity',
  'Teladoc', 'GoodRx', 'Hims & Hers', 'Ro', 'Curative', 'Carbon Health', 'One Medical', 'Oak Street Health',

  // Retail & Consumer (50)
  'Walmart', 'Amazon', 'Home Depot', "Lowe's", 'Costco', 'Target', 'Kroger', 'Walgreens', 'CVS', 'Best Buy',
  'TJX Companies', "Macy's", "Kohl's", 'Nordstrom', 'Ross Stores', 'Burlington', 'Dollar General', 'Dollar Tree',
  'Five Below', 'Ulta Beauty', 'Sephora', 'Bath & Body Works', "Victoria's Secret", 'Gap', 'Old Navy',
  'Banana Republic', 'Abercrombie & Fitch', 'American Eagle', 'Urban Outfitters', 'Lululemon', 'Nike', 'Adidas',
  'Under Armour', 'Puma', 'New Balance', 'Foot Locker', 'Dick\'s Sporting', 'REI', 'Patagonia', 'North Face',
  'Columbia Sportswear', 'Lands\' End', 'L.L.Bean', 'Eddie Bauer', 'Carhartt', 'Dickies', 'Wrangler', 'Levi\'s',
  'Ralph Lauren', 'Tommy Hilfiger',

  // Food & Beverage (50)
  'McDonald\'s', 'Starbucks', 'Coca-Cola', 'PepsiCo', 'Nestle USA', 'Procter & Gamble', 'Mondelez', 'General Mills',
  'Kellogg', 'Campbell Soup', 'Kraft Heinz', 'ConAgra', 'Tyson Foods', 'Hormel', 'JBS USA', 'Cargill',
  'Archer-Daniels-Midland', 'Bunge', 'Pilgrim\'s Pride', 'Perdue Farms', 'Sanderson Farms', 'Chipotle', 'Yum! Brands',
  'Restaurant Brands', 'Domino\'s', 'Papa John\'s', 'Wendy\'s', 'Burger King', 'Subway', 'Dunkin\'', 'Tim Hortons',
  'Panera Bread', 'Chick-fil-A', 'Popeyes', 'KFC', 'Taco Bell', 'Pizza Hut', 'Little Caesars', 'Jimmy John\'s',
  'Arby\'s', 'Sonic', 'Jack in the Box', 'Carl\'s Jr.', 'Hardee\'s', 'Five Guys', 'In-N-Out', 'Shake Shack',
  'Whataburger', 'White Castle', 'Culver\'s',

  // Automotive & Transportation (50)
  'Tesla', 'Ford', 'General Motors', 'Stellantis', 'Toyota USA', 'Honda USA', 'Nissan USA', 'Hyundai USA',
  'BMW USA', 'Mercedes-Benz USA', 'Volkswagen USA', 'Audi USA', 'Porsche USA', 'Ferrari', 'Lamborghini',
  'Rivian', 'Lucid Motors', 'Nikola', 'Canoo', 'Fisker', 'Polestar', 'Faraday Future', 'Arrival', 'Proterra',
  'ChargePoint', 'EVgo', 'Blink Charging', 'Electrify America', 'Tesla Supercharger', 'FedEx', 'UPS', 'USPS',
  'DHL', 'XPO Logistics', 'J.B. Hunt', 'Knight-Swift', 'Schneider National', 'Werner Enterprises', 'Old Dominion',
  'Yellow Corporation', 'ArcBest', 'Saia', 'Estes Express', 'Union Pacific', 'BNSF Railway', 'CSX', 'Norfolk Southern',
  'Kansas City Southern', 'Canadian Pacific', 'Delta Air Lines',

  // Energy & Utilities (50)
  'ExxonMobil', 'Chevron', 'ConocoPhillips', 'EOG Resources', 'Schlumberger', 'Marathon Petroleum', 'Phillips 66',
  'Valero Energy', 'Occidental Petroleum', 'Hess Corporation', 'Devon Energy', 'Pioneer Natural', 'Diamondback Energy',
  'Continental Resources', 'Apache Corporation', 'Chesapeake Energy', 'Range Resources', 'EQT Corporation',
  'Antero Resources', 'Cabot Oil & Gas', 'NextEra Energy', 'Duke Energy', 'Southern Company', 'Dominion Energy',
  'American Electric Power', 'Exelon', 'Sempra Energy', 'Xcel Energy', 'WEC Energy', 'DTE Energy', 'FirstEnergy',
  'Entergy', 'CMS Energy', 'Eversource Energy', 'Public Service Enterprise', 'Edison International', 'PG&E',
  'ConEd', 'National Grid USA', 'PPL Corporation', 'Ameren', 'CenterPoint Energy', 'NiSource', 'Atmos Energy',
  'Southwest Gas', 'NRG Energy', 'Vistra', 'Calpine', 'AES Corporation', 'Brookfield Renewable',

  // Industrial & Manufacturing (50)
  'Boeing', 'Lockheed Martin', 'Raytheon Technologies', 'General Dynamics', 'Northrop Grumman', 'L3Harris',
  'Honeywell', 'General Electric', '3M', 'Caterpillar', 'Deere & Company', 'United Technologies', 'Illinois Tool Works',
  'Emerson Electric', 'Parker-Hannifin', 'Ingersoll Rand', 'Johnson Controls', 'Carrier Global', 'Otis Worldwide',
  'Trane Technologies', 'Dover Corporation', 'Fortive', 'Rockwell Automation', 'ABB USA', 'Siemens USA',
  'Schneider Electric USA', 'Eaton Corporation', 'TE Connectivity', 'Amphenol', 'Corning', 'Mettler-Toledo',
  'Waters Corporation', 'Agilent Technologies', 'PerkinElmer', 'Thermo Fisher Scientific', 'Danaher Corporation',
  'Roper Technologies', 'IDEX Corporation', 'Nordson', 'Graco', 'Stanley Black & Decker', 'Snap-on', 'Makita USA',
  'Milwaukee Tool', 'DeWalt', 'Bosch USA', 'Husqvarna', 'Toro Company', 'Textron', 'Spirit AeroSystems',

  // Media & Entertainment (50)
  'Disney', 'Comcast', 'Charter Communications', 'AT&T', 'Verizon', 'T-Mobile', 'Netflix', 'Warner Bros Discovery',
  'Paramount Global', 'Fox Corporation', 'Sony Pictures', 'Universal Pictures', 'Lionsgate', 'MGM', 'AMC Entertainment',
  'Cinemark', 'Regal Cinemas', 'IMAX', 'Live Nation', 'Ticketmaster', 'Spotify USA', 'Apple Music', 'YouTube',
  'Amazon Prime', 'Hulu', 'HBO Max', 'Peacock', 'Paramount+', 'Discovery+', 'ESPN+', 'DAZN', 'FuboTV',
  'Sling TV', 'DirecTV', 'Dish Network', 'SiriusXM', 'iHeartMedia', 'Audacy', 'Cumulus Media', 'Entercom',
  'New York Times', 'Wall Street Journal', 'Washington Post', 'USA Today', 'Los Angeles Times', 'Chicago Tribune',
  'Boston Globe', 'Bloomberg', 'Reuters', 'Associated Press',

  // Real Estate & Construction (50)
  'CBRE Group', 'Jones Lang LaSalle', 'Cushman & Wakefield', 'Colliers', 'Marcus & Millichap', 'Newmark',
  'Prologis', 'American Tower', 'Crown Castle', 'Equinix', 'Digital Realty', 'Public Storage', 'Welltower',
  'Simon Property', 'Realty Income', 'AvalonBay', 'Equity Residential', 'Essex Property', 'Mid-America Apartment',
  'Camden Property', 'UDR Inc', 'Apartment Income REIT', 'Invitation Homes', 'American Homes 4 Rent', 'Lennar',
  'D.R. Horton', 'PulteGroup', 'NVR Inc', 'Toll Brothers', 'KB Home', 'Taylor Morrison', 'Meritage Homes',
  'Century Communities', 'M/I Homes', 'Beazer Homes', 'Hovnanian', 'Fluor Corporation', 'Jacobs Engineering',
  'AECOM', 'Quanta Services', 'EMCOR Group', 'MasTec', 'Dycom Industries', 'Granite Construction', 'Tutor Perini',
  'Walsh Group', 'Whiting-Turner', 'Clark Construction', 'Mortenson', 'Skanska USA',

  // Additional Companies to reach 500
  'Acuity Brands', 'Advanced Auto Parts', 'Advance Auto Parts', 'AutoZone', "O'Reilly Automotive", 'Genuine Parts',
  'LKQ Corporation', 'CarMax', 'Carvana', 'Vroom', 'Shift Technologies', 'Copart', 'IAA Inc', 'KAR Auction',
  'Manheim', 'Hertz', 'Avis Budget', 'Enterprise Holdings', 'National Car Rental', 'Alamo', 'Thrifty',
  'Zipcar', 'Turo', 'Getaround', 'Fair', 'Clutch Technologies', 'Beepi', 'Shift', 'CarGurus', 'Cars.com',
  'AutoTrader', 'TrueCar', 'Edmunds', 'Kelley Blue Book', 'NADA', 'Black Book', 'ALG', 'Vincentric',
  'Strategic Vision', 'AutoPacific', 'Cox Automotive', 'CDK Global', 'Reynolds and Reynolds', 'DealerTrack',
  'RouteOne', 'Dealertrack', 'vAuto', 'HomeNet Automotive', 'Vauto', 'Xtime'
];

// Helper function to get paginated companies
export function getCompanies(page: number, limit: number = 20) {
  const start = page * limit;
  const end = start + limit;
  return {
    companies: fortune500Companies.slice(start, end),
    hasMore: end < fortune500Companies.length,
    totalCount: fortune500Companies.length,
    currentPage: page,
    totalPages: Math.ceil(fortune500Companies.length / limit)
  };
}

// Simulate API delay
export async function fetchCompanies(page: number, limit: number = 20): Promise<ReturnType<typeof getCompanies>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Simulate occasional errors for retry logic demo
  if (Math.random() < 0.05) { // 5% chance of error
    throw new Error('Network error - please retry');
  }
  
  return getCompanies(page, limit);
}