import { CampusConfig, CampusId, Checkpoint, LeaderboardEntry, PowerUp, TeamId, TeamInfo } from '../types';

/**
 * =========================================================================
 * 🎓 ORGANIZER CONFIGURATION SECTION - DAVV CAMPUSES QUEST
 * =========================================================================
 * High-Stakes Geofenced Clue Hunt with:
 * - 2-Stage Mandatory Checkpoints:
 *     Stage 1: Tough Campus Geolocation Riddle (must solve first)
 *     Stage 2: Tough Desi Pop-Culture Riddle (Bollywood, Cricket, Music)
 * - Wrong Guess Penalty: Deducts 25 Team Points (unless Shield is active!)
 * - Locked Scout Hint: Deducts 30 Points to unlock (or use Hint Power-up)
 * =========================================================================
 */

export const DEFAULT_GEOFENCE_RADIUS_METERS = 50;
export const WRONG_ANSWER_PENALTY_POINTS = 25; // High-stakes: 1 wrong answer deducts 25 team points!
export const HINT_UNLOCK_PENALTY_POINTS = 50; // Scout hint requires 50 team points deduction!
export const MIN_ATTEMPTS_BEFORE_OPTIONS = 3; // Options & multiple-choice lifeline unlocked ONLY after 3 answer attempts!
export const MIN_ATTEMPTS_BEFORE_HINT = 5; // Must make at least 5 answer attempts before Scout hint unlocks!

/**
 * Checkpoints for Campus 1: Takshashila Campus (DAVV Main)
 */
export const TAKSHASHILA_CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    campusId: 'TAKSHASHILA',
    name: "Pikachu Point",
    pokemonName: "Pikachu",
    pokemonType: "Electric",
    latitude: 22.6898,
    longitude: 75.8748,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 300,
    stage1: {
      riddleTitle: "🚪 The Grand Gateway Riddle",
      riddlePoem: "Jahan se har fresher ki DAVV mein nayi kismat khulti hai, guard bhaiya jahan entry register aur highway ke darwaze par milte hain. Na yeh library hai, na canteen, Khandwa road pe khada sabse bada dwar hai!",
      question: "Pehchano: DAVV Takshashila campus ke is sabse pehle main entrance landmark ka sahi naam kya hai?",
      options: [
        "Main Administrative Entrance Gate",
        "Central Sports Stadium Pavilion",
        "Boys Hostel Mess Backdoor",
        "Auditorium Stage Door"
      ],
      answer: "Main Administrative Entrance Gate",
      acceptedAnswers: ["main gate", "admin gate", "administrative gate", "entrance gate", "main administrative entrance gate"],
      landmarkRevealed: "DAVV Main Admin Gate (Khandwa Road)",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🔢 Classic Number Riddle",
      badgeEmoji: "🧠",
      difficulty: "MEDIUM",
      riddleText: "I am an odd number. Take away a letter and I become even. What number am I?",
      options: [
        "Seven",
        "Eleven",
        "Nine",
        "Three"
      ],
      answer: "Seven",
      acceptedAnswers: ["seven", "7", "number seven"],
      explanation: "Take away the letter 'S' from 'SEVEN' and you get 'EVEN'! A timeless classic brain teaser.",
    },
    lockedScoutHint: "Look directly at the grand university entrance archway where vehicles enter from Khandwa highway.",
    campusLocationDescription: "Main Admin Entrance Gate & Registration Lawn",
  },
  {
    id: 2,
    campusId: 'TAKSHASHILA',
    name: "Charmander Camp",
    pokemonName: "Charmander",
    pokemonType: "Fire",
    latitude: 22.6904,
    longitude: 75.8760,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1: {
      riddleTitle: "☕ Samosa & Chai Adda",
      riddlePoem: "Class bunk karke jahan sabse pehle daudti hai junta, garam poha-jalebi aur cutting chai par jahan banti hai har semester ki planning. Dhuwaan uthta hai, pet bharta hai, har lecture ke baad pair yahin aate hain!",
      question: "Pehchano: Takshashila campus ki is sabse mashhoor bhookh mitane wali adda ka official naam kya hai?",
      options: [
        "Central Student Canteen",
        "Examination Evaluation Centre",
        "Botanical Research Herbarium",
        "Dean Student Welfare Office"
      ],
      answer: "Central Student Canteen",
      acceptedAnswers: ["canteen", "student canteen", "central student canteen", "central canteen", "cafeteria"],
      landmarkRevealed: "Central Student Canteen Quad",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "⏰ Hands & Time Riddle",
      badgeEmoji: "💡",
      difficulty: "MEDIUM",
      riddleText: "What has hands but cannot clap?",
      options: [
        "A clock",
        "A mannequin",
        "A statue",
        "A wristband"
      ],
      answer: "A clock",
      acceptedAnswers: ["clock", "a clock", "watch", "wall clock", "ghadi"],
      explanation: "A clock has hour and minute hands, but it cannot clap!",
    },
    lockedScoutHint: "Follow your nose towards the central buzzing cafeteria where snacks are fried and students sit around tables.",
    campusLocationDescription: "Central Student Canteen & Cafeteria Quad",
  },
  {
    id: 3,
    campusId: 'TAKSHASHILA',
    name: "Squirtle Station",
    pokemonName: "Squirtle",
    pokemonType: "Water",
    latitude: 22.6892,
    longitude: 75.8765,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1: {
      riddleTitle: "📚 Silent Temple of Knowledge",
      riddlePoem: "Pin-drop silence ka poster jahan deewar par laga rehta hai, lakho panno mein gyaan ka bhandaar chhupa rehta hai. Bahar paved plaza par thande paani ka cooler hai, andar AC aur exam ki tension hai!",
      question: "Pehchano: DAVV Takshashila campus ka yeh silent knowledge landmark kaunsa hai?",
      options: [
        "Central Library Plaza",
        "Gymnasium Wooden Badminton Court",
        "Dean Executive Meeting Hall",
        "University Bank Branch"
      ],
      answer: "Central Library Plaza",
      acceptedAnswers: ["library", "central library", "central library plaza", "pustakalaya"],
      landmarkRevealed: "Central Library Building & Water Fountain Area",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🗣️ Echo & Wind Riddle",
      badgeEmoji: "🌬️",
      difficulty: "HARD",
      riddleText: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      options: [
        "An echo",
        "A cloud",
        "A whistle",
        "A ghost"
      ],
      answer: "An echo",
      acceptedAnswers: ["an echo", "echo", "awaaz", "sound echo"],
      explanation: "An echo replies without a mouth, has no flesh or bones, and rebounds across valleys and quads!",
    },
    lockedScoutHint: "A multi-storey quiet academic building with book stacks and drinking water facilities on the paved quad.",
    campusLocationDescription: "Central Library Plaza & Refreshment Hub",
  },
  {
    id: 4,
    campusId: 'TAKSHASHILA',
    name: "Bulbasaur Base",
    pokemonName: "Bulbasaur",
    pokemonType: "Grass",
    latitude: 22.6885,
    longitude: 75.8752,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 450,
    stage1: {
      riddleTitle: "🍃 The Green Canopy Sanctuary",
      riddlePoem: "Cement aur gaadiyon ke shor se door jahan mitti ki mehak aati hai, neem aur peepal ki ghani chhaon jahan thake huye freshers ko sukoon de jaati hai. Ped-paudhon ka sansaar aur hari ghaas ka aangan!",
      question: "Pehchano: Takshashila campus ka yeh botanical green landmark kaunsa hai?",
      options: [
        "Botanical Garden & Central Green Quad",
        "Vehicle Parking Bay 4",
        "Exam Evaluation Control Room",
        "Basketball Hardcourt"
      ],
      answer: "Botanical Garden & Central Green Quad",
      acceptedAnswers: ["botanical garden", "garden", "green quad", "botanical garden & central green quad"],
      landmarkRevealed: "Botanical Garden Grove",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🕯️ Life & Flame Riddle",
      badgeEmoji: "🔥",
      difficulty: "HARD",
      riddleText: "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. The wind is my enemy. What am I?",
      options: [
        "A candle",
        "An hourglass",
        "A matchstick",
        "A smartphone battery"
      ],
      answer: "A candle",
      acceptedAnswers: ["candle", "a candle", "mombatti", "diya"],
      explanation: "A candle's lifespan is measured in hours as it melts down; thin candles burn fast, thick ones slow, and wind extinguishes it!",
    },
    lockedScoutHint: "A dense green grove of tall neem trees with flora away from roads and bike stands.",
    campusLocationDescription: "Botanical Garden & Central Green Quad",
  },
  {
    id: 5,
    campusId: 'TAKSHASHILA',
    name: "Poké Ball Arena",
    pokemonName: "Charizard",
    pokemonType: "Normal",
    latitude: 22.6912,
    longitude: 75.8740,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 600,
    stage1: {
      riddleTitle: "🏟️ The Champion's Stadium",
      riddlePoem: "Yahan padhai ki kitaabein nahi, pasina aur speed bolti hai! Running tracks hain, whistle bajti hai, aur inter-college tournament ka parcham yahin lehrata hai!",
      question: "Pehchano: Campus ka sabse bada sports landmark jahan aakhri final challenge hota hai?",
      options: [
        "University Sports Pavilion & Stadium",
        "Chemistry Lab Complex 2",
        "Auditorium Makeup Green Room",
        "Central Library Basement Archive"
      ],
      answer: "University Sports Pavilion & Stadium",
      acceptedAnswers: ["sports pavilion", "stadium", "sports stadium", "university sports pavilion & stadium", "ground"],
      landmarkRevealed: "University Sports Pavilion Ground",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🔤 Letter & Minute Riddle",
      badgeEmoji: "⏳",
      difficulty: "HARD",
      riddleText: "What occurs once in a minute, twice in a moment, and never in 1,000 years?",
      options: [
        "The letter 'm'",
        "A shooting star",
        "A leap second",
        "A solar eclipse"
      ],
      answer: "The letter 'm'",
      acceptedAnswers: ["m", "letter m", "the letter m", "'m'", "letter 'm'"],
      explanation: "Examine the spelling: 'M'inute (one 'm'), 'M'o'm'ent (two 'm's), and 1,000 years (zero 'm's)!",
    },
    lockedScoutHint: "The massive open-air athletic stadium with running tracks, bleachers, and goalposts.",
    campusLocationDescription: "DAVV University Sports Pavilion & Arena",
  },
];

/**
 * Checkpoints for Campus 2: IET DAVV (Engineering & Technology Campus)
 * Now proudly featuring Pikachu at Block A Foyer & Innovation Porch!
 */
export const IET_DAVV_CHECKPOINTS: Checkpoint[] = [
  {
    id: 1,
    campusId: 'IET_DAVV',
    name: "Pikachu Power Station",
    pokemonName: "Pikachu",
    pokemonType: "Electric",
    latitude: 22.6820,
    longitude: 75.8795,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 300,
    stage1: {
      riddleTitle: "⚡ Pikachu's Innovation Gateway",
      riddlePoem: "Yellow sparks fly where engineers take their very first stride! Ash's Pikachu greets you with 100,000 volts right in front of the Director's Office under the grand entrance pillars. Identify this premier administrative portico!",
      question: "Identify the main entrance block of IET DAVV guarded by Pikachu:",
      options: [
        "IET Block A Main Entrance & Foyer",
        "Civil Survey Backgate 3",
        "Hostel 4 C-Block Mess",
        "Substation Backyard"
      ],
      answer: "IET Block A Main Entrance & Foyer",
      acceptedAnswers: ["block a", "block a porch", "block a main entrance", "admin block a", "iet block a main entrance & foyer"],
      landmarkRevealed: "IET Block A Main Portico & Pikachu's Spark Foyer",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🪣 Bucket & Weight Riddle",
      badgeEmoji: "🧠",
      difficulty: "MEDIUM",
      riddleText: "What can you put in a bucket to make it weigh less?",
      options: [
        "A hole",
        "A sponge",
        "Ice cubes",
        "Helium balloon"
      ],
      answer: "A hole",
      acceptedAnswers: ["a hole", "hole", "holes", "chhed"],
      explanation: "Putting a hole in a bucket releases liquid and subtracts weight, making it weigh less!",
    },
    lockedScoutHint: "The main front entrance porch of Block A right under the large pillars near the Director's Office.",
    campusLocationDescription: "IET Block A Main Entrance & Foyer (Pikachu's Station)",
  },
  {
    id: 2,
    campusId: 'IET_DAVV',
    name: "Charizard Circuits",
    pokemonName: "Charizard",
    pokemonType: "Fire",
    latitude: 22.6814,
    longitude: 75.8778,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1: {
      riddleTitle: "⚙️ Sparks & Foundry Forge",
      riddlePoem: "Lohe ko kaatna, welding ki aag, aur lathe machine par job banana. Engineering freshers ke haath jahan kaale hote hain aur aprons pe pasina behta hai!",
      question: "Pehchano: IET DAVV ka yeh heavy mechanical machinery workshop kahan sthit hai?",
      options: [
        "IET Central Mechanical Engineering Workshop",
        "Computer Graphics Lab 2",
        "Seminar Hall 1",
        "Girls Common Room"
      ],
      answer: "IET Central Mechanical Engineering Workshop",
      acceptedAnswers: ["mechanical workshop", "workshop", "central workshop", "iet central mechanical engineering workshop", "foundry"],
      landmarkRevealed: "Central Workshop & Foundry Shed",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🧶 Yard & Foot Riddle",
      badgeEmoji: "👣",
      difficulty: "HARD",
      riddleText: "What is bought by the yard and worn by the foot?",
      options: [
        "A carpet",
        "A pair of socks",
        "A tape measure",
        "A runner shoe"
      ],
      answer: "A carpet",
      acceptedAnswers: ["a carpet", "carpet", "rug", "mat", "kaleen"],
      explanation: "A carpet is purchased by the yard (length) and walked upon (worn) by feet!",
    },
    lockedScoutHint: "The industrial workshop shed with lathe machines and tools behind Block B.",
    campusLocationDescription: "IET Central Engineering Workshop",
  },
  {
    id: 3,
    campusId: 'IET_DAVV',
    name: "Vaporeon Virtuals",
    pokemonName: "Vaporeon",
    pokemonType: "Water",
    latitude: 22.6802,
    longitude: 75.8762,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1: {
      riddleTitle: "💻 The Coding Citadel",
      riddlePoem: "0 aur 1 ki bhasha mein yahan sapne code hote hain, bugs aate hain, terminal crash hota hai, aur placement season mein coding rounds yahin crack hote hain!",
      question: "Pehchano: IET DAVV ka Computer Science & IT building complex kaunsa block kehlata hai?",
      options: [
        "M-Block (Computer Science & IT Labs)",
        "E-Block Substation",
        "Canteen Kitchen",
        "Foundry Pit"
      ],
      answer: "M-Block (Computer Science & IT Labs)",
      acceptedAnswers: ["m block", "m-block", "computer labs", "it block", "m-block (computer science & it labs)"],
      landmarkRevealed: "M-Block Computer & IT Labs",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "✉️ Envelope Letter Riddle",
      badgeEmoji: "📬",
      difficulty: "MEDIUM",
      riddleText: "I start with 'e', end with 'e', and contain one letter inside me. What am I?",
      options: [
        "An envelope",
        "An engine",
        "An eye",
        "An eagle"
      ],
      answer: "An envelope",
      acceptedAnswers: ["envelope", "an envelope", "lifafa"],
      explanation: "An Envelope begins with 'E', concludes with 'E', and holds a letter inside!",
    },
    lockedScoutHint: "M-Block: The Computer Science & IT building complex with hardware and software labs.",
    campusLocationDescription: "IET M-Block Computer & IT Labs",
  },
  {
    id: 4,
    campusId: 'IET_DAVV',
    name: "Venusaur Vertex",
    pokemonName: "Venusaur",
    pokemonType: "Grass",
    latitude: 22.6798,
    longitude: 75.8774,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 450,
    stage1: {
      riddleTitle: "🍜 Maggi & Gossip Ground",
      riddlePoem: "Coding error se dimag garam ho toh thandi hawa yahan milti hai, 2-minute Maggi plate aur adrak wali chai par poora IET dost group yahin chill karta hai!",
      question: "Pehchano: IET ka yeh central canteen aur lawn quad landmark kaunsa hai?",
      options: [
        "IET Canteen Quad & Central Lawns",
        "Server Room Basement",
        "Transformer Enclosure",
        "Faculty Parking"
      ],
      answer: "IET Canteen Quad & Central Lawns",
      acceptedAnswers: ["canteen", "iet canteen", "canteen quad", "iet canteen quad & central lawns", "maggi adda"],
      landmarkRevealed: "IET Canteen Lawn Quad",
    },
    stage2: {
      category: "BRAIN_TEASER",
      categoryLabel: "🛁 Drying Towel Riddle",
      badgeEmoji: "🌊",
      difficulty: "MEDIUM",
      riddleText: "What gets wetter and wetter the more it dries?",
      options: [
        "A towel",
        "A sponge",
        "An umbrella",
        "The sun"
      ],
      answer: "A towel",
      acceptedAnswers: ["towel", "a towel", "tauliya"],
      explanation: "A towel gets wetter as it absorbs moisture while drying you off!",
    },
    lockedScoutHint: "The green open lawn outside the student canteen where groups sit under the trees with snacks.",
    campusLocationDescription: "IET Central Lawns & Cafeteria Quad",
  },
  {
    id: 5,
    campusId: 'IET_DAVV',
    name: "Mewtwo Matrix",
    pokemonName: "Mewtwo",
    pokemonType: "Psychic",
    latitude: 22.6812,
    longitude: 75.8760,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 600,
    stage1: {
      riddleTitle: "🚀 The Innovation Summit",
      riddlePoem: "Yahan pitch deck banti hai, startup ideas test hote hain, bade seminars hote hain aur campus placements ke offer letters yahin se validate hote hain!",
      question: "Pehchano: IET DAVV ka yeh ultimate incubation and auditorium summit kaunsa landmark hai?",
      options: [
        "IET Incubation Centre & Training Auditorium",
        "Mechanical Foundry Pit",
        "Bicycle Stand 2",
        "Substation Pump Room"
      ],
      answer: "IET Incubation Centre & Training Auditorium",
      acceptedAnswers: ["incubation centre", "e-cell", "auditorium", "iet incubation centre & training auditorium", "incubation center"],
      landmarkRevealed: "IET Incubation Center & Main Auditorium",
    },
    stage2: {
      category: "POKEMON_CLASSIC",
      categoryLabel: "⚡ Electric Mascot Challenge",
      badgeEmoji: "⚡",
      difficulty: "HARD",
      riddleText: "I am yellow with red cheeks, have a lightning bolt tail, and store 100,000 volts of electricity. Who is Ash Ketchum's greatest partner guarding DAVV?",
      options: [
        "Pikachu",
        "Raichu",
        "Electabuzz",
        "Jolteon"
      ],
      answer: "Pikachu",
      acceptedAnswers: ["pikachu", "pika", "pikachu!"],
      explanation: "Pikachu! The beloved electric mascot of DAVV campuses and Ash's number one partner!",
    },
    lockedScoutHint: "The large Incubation Center and Auditorium building complex where orientations and hackathons are held.",
    campusLocationDescription: "IET Incubation Centre & Auditorium",
  },
];

/**
 * Campuses Directory
 */
export const CAMPUSES: Record<CampusId, CampusConfig> = {
  TAKSHASHILA: {
    id: 'TAKSHASHILA',
    name: 'Takshashila Campus (DAVV Main)',
    shortName: 'Takshashila',
    tagline: 'Main University Grounds & Central Hub',
    description: 'Explore the grand administrative buildings, central library, and academic complexes of Devi Ahilya Vishwavidyalaya.',
    icon: '🏛️',
    center: {
      lat: 22.6896,
      lng: 75.8753,
      zoom: 17,
    },
    checkpoints: TAKSHASHILA_CHECKPOINTS,
  },
  IET_DAVV: {
    id: 'IET_DAVV',
    name: 'IET DAVV (Engineering & Technology)',
    shortName: 'IET DAVV',
    tagline: 'Engineers’ Quest • Tech, Workshops & Labs',
    description: 'Traverse the Institute of Engineering & Technology campus: explore Block A, the central workshop, M-Block computer labs, and the incubation center.',
    icon: '⚙️',
    center: {
      lat: 22.6806,
      lng: 75.8770,
      zoom: 17,
    },
    checkpoints: IET_DAVV_CHECKPOINTS,
  },
};

export const DEFAULT_CHECKPOINTS = TAKSHASHILA_CHECKPOINTS;

export const TEAMS: Record<TeamId, TeamInfo> = {
  FIRE: {
    id: 'FIRE',
    name: 'Team Fire',
    motto: 'Blaze of Passion & Speed 🔥',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
    badgeIcon: '🔥',
    starterPokemon: 'Charmander',
    starterSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    description: 'Driven by relentless ambition, speed, and burning enthusiasm.',
  },
  AQUA: {
    id: 'AQUA',
    name: 'Team Aqua',
    motto: 'Torrent of Wisdom & Flow 💧',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-400',
    badgeIcon: '💧',
    starterPokemon: 'Squirtle',
    starterSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    description: 'Calculated, calm under pressure, and masters of deep logic.',
  },
  LEAF: {
    id: 'LEAF',
    name: 'Team Leaf',
    motto: 'Bloom of Harmony & Resilience 🍃',
    color: '#10b981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
    badgeIcon: '🍃',
    starterPokemon: 'Bulbasaur',
    starterSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    description: 'Deeply connected to community, resilience, and steady teamwork.',
  },
};

export const AVAILABLE_POWER_UPS: Omit<PowerUp, 'count'>[] = [
  {
    id: 'HINT_REVEAL',
    type: 'HINT_REVEAL',
    name: '🔍 Free Hint Pass',
    description: 'Unlocks the Scout Hint immediately without deducting the 30 Team Points penalty!',
    icon: '🔍',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'SPEED_BOOST',
    type: 'SPEED_BOOST',
    name: '⚡ Speed Boost',
    description: 'Instantly grants +150 bonus adventure points for active exploration speed.',
    icon: '⚡',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'SHIELD',
    type: 'SHIELD',
    name: '🛡️ Penalty Shield',
    description: 'Absorbs the next wrong answer penalty! Protects your team from losing 25 points.',
    icon: '🛡️',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'XP_BOOST',
    type: 'XP_BOOST',
    name: '⭐ XP Boost (2x)',
    description: 'Doubles the XP and points awarded on your next completed checkpoint!',
    icon: '⭐',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'TIME_BONUS',
    type: 'TIME_BONUS',
    name: '⏱️ Time Bonus',
    description: 'Adds an agility surge score bonus and ranks higher on the speed leaderboard.',
    icon: '⏱️',
    color: 'from-emerald-500 to-teal-400',
  },
];

export const INITIAL_MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'trainer-1',
    name: 'Ash Ketchum',
    team: 'FIRE',
    campusId: 'TAKSHASHILA',
    xp: 1450,
    checkpointsCompleted: 5,
    badgeTitle: 'Pallet Town Ace',
  },
  {
    id: 'trainer-2',
    name: 'Aryan (IET CSE 2nd Yr)',
    team: 'AQUA',
    campusId: 'IET_DAVV',
    xp: 1350,
    checkpointsCompleted: 5,
    badgeTitle: 'IET Tech Champion',
  },
  {
    id: 'trainer-3',
    name: 'Gary Oak',
    team: 'AQUA',
    campusId: 'TAKSHASHILA',
    xp: 1300,
    checkpointsCompleted: 4,
    badgeTitle: 'Elite Rival',
  },
  {
    id: 'trainer-4',
    name: 'Sneha (IET IT 3rd Yr)',
    team: 'LEAF',
    campusId: 'IET_DAVV',
    xp: 1150,
    checkpointsCompleted: 4,
    badgeTitle: 'M-Block Hacker',
  },
  {
    id: 'trainer-5',
    name: 'Misty Waterflower',
    team: 'AQUA',
    campusId: 'TAKSHASHILA',
    xp: 1100,
    checkpointsCompleted: 4,
    badgeTitle: 'Cerulean Star',
  },
  {
    id: 'trainer-6',
    name: 'Brock Stone',
    team: 'LEAF',
    campusId: 'TAKSHASHILA',
    xp: 950,
    checkpointsCompleted: 3,
    badgeTitle: 'Pewter Guardian',
  },
  {
    id: 'trainer-7',
    name: 'Rohit (IET Mech)',
    team: 'FIRE',
    campusId: 'IET_DAVV',
    xp: 880,
    checkpointsCompleted: 3,
    badgeTitle: 'Workshop Blazer',
  },
  {
    id: 'trainer-8',
    name: 'Professor Oak',
    team: 'LEAF',
    campusId: 'TAKSHASHILA',
    xp: 700,
    checkpointsCompleted: 2,
    badgeTitle: 'Campus Mentor',
  },
];
