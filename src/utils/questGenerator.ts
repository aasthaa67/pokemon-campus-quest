import { CampusId, Checkpoint, Stage1LocationRiddle } from '../types';
import { DEFAULT_GEOFENCE_RADIUS_METERS } from '../config/campusConfig';
import { generateChallengingRiddle, jumbleOptions } from './riddleGenerator';

export interface LandmarkTemplate {
  name: string;
  pokemonName: string;
  pokemonType: 'Electric' | 'Fire' | 'Water' | 'Grass' | 'Normal' | 'Psychic';
  latitude: number;
  longitude: number;
  radius: number;
  points: number;
  stage1Variants: Stage1LocationRiddle[];
  lockedScoutHint: string;
  campusLocationDescription: string;
}

/**
 * Rich pool of 10 real landmarks on Takshashila Main Campus (DAVV, Khandwa Road)
 */
export const TAKSHASHILA_LANDMARK_POOL: LandmarkTemplate[] = [
  {
    name: 'Pikachu Point – Main Entrance Arch',
    pokemonName: 'Pikachu',
    pokemonType: 'Electric',
    latitude: 22.6898,
    longitude: 75.8748,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 300,
    stage1Variants: [
      {
        riddleTitle: '🚪 The Grand Gateway Clue',
        riddlePoem:
          'Jahan se har fresher ki DAVV mein nayi kismat khulti hai, guard bhaiya jahan entry register aur highway ke darwaze par milte hain. Na yeh library hai, na canteen, Khandwa road pe khada sabse bada dwar hai!',
        question: 'Pehchano: DAVV Takshashila campus ke is sabse pehle main entrance landmark ka sahi naam kya hai?',
        options: [
          'Main Administrative Entrance Gate',
          'Central Sports Stadium Pavilion',
          'Boys Hostel Mess Backdoor',
          'Auditorium Stage Door',
        ],
        answer: 'Main Administrative Entrance Gate',
        landmarkRevealed: 'DAVV Main Admin Gate (Khandwa Road)',
      },
      {
        riddleTitle: '🛣️ Highway Checkpoint Riddle',
        riddlePoem:
          'College ki boundary shuru yahin se hoti hai, auto-rickshaw aur city bus sab yahin break lagati hain. White letters mein University ka naam likha hai, batao yeh kaun sa dwar hai?',
        question: 'Campus ka pehla darwaza jahan se har saal hazaaron freshers entry lete hain:',
        options: [
          'Main Administrative Entrance Gate',
          'Exam Control Center',
          'Chemistry Research Block',
          'Faculty Guest House',
        ],
        answer: 'Main Administrative Entrance Gate',
        landmarkRevealed: 'DAVV Main Admin Gate (Khandwa Road)',
      },
    ],
    lockedScoutHint: 'Look directly at the grand university entrance archway on Khandwa highway.',
    campusLocationDescription: 'Main Admin Entrance Gate & Registration Lawn',
  },
  {
    name: 'Charmander Camp – Canteen Quad',
    pokemonName: 'Charmander',
    pokemonType: 'Fire',
    latitude: 22.6904,
    longitude: 75.8760,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '☕ Samosa & Poha Adda',
        riddlePoem:
          'Class bunk karke jahan sabse pehle daudti hai junta, garam poha-jalebi aur cutting chai par jahan banti hai har semester ki planning. Dhuwaan uthta hai, pet bharta hai, har lecture ke baad pair yahin aate hain!',
        question: 'Pehchano: Takshashila campus ki is sabse mashhoor bhookh mitane wali adda ka official naam kya hai?',
        options: [
          'Central Student Canteen',
          'Examination Evaluation Centre',
          'Botanical Research Herbarium',
          'Dean Student Welfare Office',
        ],
        answer: 'Central Student Canteen',
        landmarkRevealed: 'Central Student Canteen Quad',
      },
      {
        riddleTitle: '🥪 The Hunger Haven Clue',
        riddlePoem:
          'Notes ki photostat baad mein, pehle yahan ki cutting chai chahiye! Bench par baith kar dosto ke saath semester ki gossip yahin hoti hai. Batao yeh kaun si jagah hai?',
        question: 'Campus ka sabse buzzing food landmark jahan snacks aur chai milti hai:',
        options: [
          'Central Student Canteen',
          'Sports Pavilion Office',
          'Physics Lecture Theatre',
          'Language Lab',
        ],
        answer: 'Central Student Canteen',
        landmarkRevealed: 'Central Student Canteen Quad',
      },
    ],
    lockedScoutHint: 'Follow your nose towards the central buzzing cafeteria where snacks are fried.',
    campusLocationDescription: 'Central Student Canteen & Cafeteria Quad',
  },
  {
    name: 'Squirtle Station – Knowledge Library',
    pokemonName: 'Squirtle',
    pokemonType: 'Water',
    latitude: 22.6892,
    longitude: 75.8765,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1Variants: [
      {
        riddleTitle: '📚 Silent Temple of Knowledge',
        riddlePoem:
          'Pin-drop silence ka poster jahan deewar par laga rehta hai, lakho panno mein gyaan ka bhandaar chhupa rehta hai. Bahar paved plaza par thande paani ka cooler hai, andar AC aur exam ki tension hai!',
        question: 'Pehchano: DAVV Takshashila campus ka yeh silent knowledge landmark kaunsa hai?',
        options: [
          'Central Library Plaza',
          'Gymnasium Badminton Court',
          'Dean Executive Meeting Hall',
          'University Bank Branch',
        ],
        answer: 'Central Library Plaza',
        landmarkRevealed: 'Central Library Building & Water Fountain Area',
      },
      {
        riddleTitle: '📖 Book Vault Clue',
        riddlePoem:
          'Jahan har subject ki reference book milti hai, card dikha kar issue karwana padta hai, aur librarian maam "Shhh!" keh kar shaanti banaye rakhti hain. Yeh kaun sa sthan hai?',
        question: 'Takshashila campus ka sabse bada multi-storey pustakalaya landmark:',
        options: [
          'Central Library Plaza',
          'Cricket Dressing Room',
          'Security Guard Cabin',
          'Generator Room',
        ],
        answer: 'Central Library Plaza',
        landmarkRevealed: 'Central Library Building & Water Fountain Area',
      },
    ],
    lockedScoutHint: 'A multi-storey quiet academic building with book stacks and drinking water plaza.',
    campusLocationDescription: 'Central Library Plaza & Refreshment Hub',
  },
  {
    name: 'Bulbasaur Base – Botanical Grove',
    pokemonName: 'Bulbasaur',
    pokemonType: 'Grass',
    latitude: 22.6885,
    longitude: 75.8752,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 450,
    stage1Variants: [
      {
        riddleTitle: '🍃 The Green Canopy Sanctuary',
        riddlePoem:
          'Cement aur gaadiyon ke shor se door jahan mitti ki mehak aati hai, neem aur peepal ki ghani chhaon jahan thake huye freshers ko sukoon de jaati hai. Ped-paudhon ka sansaar aur hari ghaas ka aangan!',
        question: 'Pehchano: Takshashila campus ka yeh botanical green landmark kaunsa hai?',
        options: [
          'Botanical Garden & Central Green Quad',
          'Vehicle Parking Bay 4',
          'Exam Evaluation Control Room',
          'Basketball Hardcourt',
        ],
        answer: 'Botanical Garden & Central Green Quad',
        landmarkRevealed: 'Botanical Garden Grove',
      },
      {
        riddleTitle: '🌳 Nature Oasis Clue',
        riddlePoem:
          'Yahan phool khilte hain, medicinal plants ki research hoti hai, aur chidiya chehchahati hain. Padhai ke beech sukoon ki thandi chhaanv dene waali hari-bhari jagah kaun si hai?',
        question: 'Campus ka eco-friendly garden aur research nursery area:',
        options: [
          'Botanical Garden & Central Green Quad',
          'Hostel Mess Store',
          'Auditorium Basement',
          'Bank ATM Counter',
        ],
        answer: 'Botanical Garden & Central Green Quad',
        landmarkRevealed: 'Botanical Garden Grove',
      },
    ],
    lockedScoutHint: 'A dense green grove of tall neem trees with flora away from roads.',
    campusLocationDescription: 'Botanical Garden & Central Green Quad',
  },
  {
    name: 'Charizard Colosseum – Sports Stadium',
    pokemonName: 'Charizard',
    pokemonType: 'Fire',
    latitude: 22.6912,
    longitude: 75.8740,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 600,
    stage1Variants: [
      {
        riddleTitle: '🏟️ The Champion’s Stadium',
        riddlePoem:
          'Yahan padhai ki kitaabein nahi, pasina aur speed bolti hai! Running tracks hain, whistle bajti hai, aur inter-college tournament ka parcham yahin lehrata hai!',
        question: 'Pehchano: Campus ka sabse bada sports landmark jahan running track aur cricket pitch hai?',
        options: [
          'University Sports Pavilion & Stadium',
          'Chemistry Lab Complex 2',
          'Auditorium Makeup Green Room',
          'Central Library Basement',
        ],
        answer: 'University Sports Pavilion & Stadium',
        landmarkRevealed: 'University Sports Pavilion Ground',
      },
      {
        riddleTitle: '🏃 Athletic Arena Clue',
        riddlePoem:
          '400-meter track par daudte athlete, football ke goalpost aur cricket ke chhakke! Evening walk aur sports trials ka yeh sabse bada maidan kaun sa hai?',
        question: 'DAVV Takshashila ka sports & athletics hub:',
        options: [
          'University Sports Pavilion & Stadium',
          'IMS Seminar Hall',
          'Registrar Cabin',
          'Health Center Clinic',
        ],
        answer: 'University Sports Pavilion & Stadium',
        landmarkRevealed: 'University Sports Pavilion Ground',
      },
    ],
    lockedScoutHint: 'The massive open-air athletic stadium with running tracks, bleachers, and goalposts.',
    campusLocationDescription: 'DAVV University Sports Pavilion & Arena',
  },
  {
    name: 'Alakazam Academy – SCSIT IT Quad',
    pokemonName: 'Alakazam',
    pokemonType: 'Psychic',
    latitude: 22.6920,
    longitude: 75.8768,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1Variants: [
      {
        riddleTitle: '💻 Binary Silicon Sanctuary',
        riddlePoem:
          'C++ ke code aur Python ke script jahan din-raat compile hote hain, keyboards ki click-clack aawaz jahan monitors par glow karti hai. University ke computer scientists ka headquarter kaun sa hai?',
        question: 'Pehchano: School of Computer Science & IT (SCSIT) ka landmark quad:',
        options: [
          'School of Computer Science & IT (SCSIT) Quad',
          'Music Department Studio',
          'Botanical Greenhouse',
          'Power Substation',
        ],
        answer: 'School of Computer Science & IT (SCSIT) Quad',
        landmarkRevealed: 'SCSIT IT Block Quad',
      },
    ],
    lockedScoutHint: 'Follow the cables to the multi-storey IT and Computer Science building.',
    campusLocationDescription: 'School of Computer Science & IT Building',
  },
  {
    name: 'Eevee Empire – IMS Management Lawn',
    pokemonName: 'Eevee',
    pokemonType: 'Normal',
    latitude: 22.6908,
    longitude: 75.8778,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 380,
    stage1Variants: [
      {
        riddleTitle: '👔 Corporate Suits & Case Studies',
        riddlePoem:
          'Formal blazers, PowerPoint presentations aur business case studies jahan discuss hoti hain! MBA ke future managers aur corporate leaders ka sabse famous institute kaun sa hai?',
        question: 'Pehchano: Takshashila campus ka Institute of Management Studies:',
        options: [
          'IMS (Institute of Management Studies) Lawn',
          'Carpentry Workshop Shed',
          'Central Water Reservoir',
          'Sports Store Room',
        ],
        answer: 'IMS (Institute of Management Studies) Lawn',
        landmarkRevealed: 'IMS Front Lawn & Amphitheatre',
      },
    ],
    lockedScoutHint: 'The elegant management institute building with landscaped front lawns.',
    campusLocationDescription: 'IMS Management Block & Lawns',
  },
  {
    name: 'Gengar Gallery – Bhasha Bhavan & Auditorium',
    pokemonName: 'Gengar',
    pokemonType: 'Psychic',
    latitude: 22.6890,
    longitude: 75.8740,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 420,
    stage1Variants: [
      {
        riddleTitle: '🎭 Cultural Spotlight & Stage',
        riddlePoem:
          'Lights, camera, stage aur curtain! Jahan youth festival, debate competitions aur rangmanch ke naatak hote hain. Bhasha aur sahitya ka yeh bada hall kaunsa hai?',
        question: 'Takshashila campus ka sabse bada cultural auditorium & Bhasha Bhavan:',
        options: [
          'Bhasha Bhavan & Central Auditorium',
          'Bicycle Stand Zone 2',
          'Sanitary Staff Office',
          'Exam Vault',
        ],
        answer: 'Bhasha Bhavan & Central Auditorium',
        landmarkRevealed: 'Bhasha Bhavan Auditorium Complex',
      },
    ],
    lockedScoutHint: 'The massive cultural stage and auditorium complex near the entrance road.',
    campusLocationDescription: 'Bhasha Bhavan & Central Auditorium Plaza',
  },
  {
    name: 'Mewtwo Monolith – Vigyan Bhavan Science Hub',
    pokemonName: 'Mewtwo',
    pokemonType: 'Psychic',
    latitude: 22.6915,
    longitude: 75.8740,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 500,
    stage1Variants: [
      {
        riddleTitle: '🔬 Quantum Physics & Laser Labs',
        riddlePoem:
          'Prism, spectrometer aur laser rays jahan dark rooms mein chamakti hain! Albert Einstein ke theory of relativity se le kar thermodynamics ke practicals ka kendra kaun sa hai?',
        question: 'Takshashila campus ka Physics aur Pure Science research block:',
        options: [
          'School of Physics (Vigyan Bhavan)',
          'Guest House Dining Hall',
          'Boys Hostel Laundry Area',
          'Main Gate Ticket Counter',
        ],
        answer: 'School of Physics (Vigyan Bhavan)',
        landmarkRevealed: 'School of Physics & Vigyan Bhavan Lab Complex',
      },
    ],
    lockedScoutHint: 'The prominent science research block with optical and research towers.',
    campusLocationDescription: 'Vigyan Bhavan & School of Physics',
  },
  {
    name: 'Snorlax Sanctuary – Media Studio & EMRC',
    pokemonName: 'Snorlax',
    pokemonType: 'Normal',
    latitude: 22.6885,
    longitude: 75.8755,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 360,
    stage1Variants: [
      {
        riddleTitle: '🎥 Studio Lights & Media Camera',
        riddlePoem:
          'Microphones, acoustic foam deewarein aur boom camera! Jahan educational television documentaries shoot hoti hain aur UGC ke programs bante hain. Yeh kaun sa media kendra hai?',
        question: 'Educational Multimedia Research Centre (EMRC) studio landmark:',
        options: [
          'EMRC Educational Media Centre & Studio',
          'Bus Driver Rest House',
          'Nursery Plant Shed',
          'Cricket Scoreboard',
        ],
        answer: 'EMRC Educational Media Centre & Studio',
        landmarkRevealed: 'EMRC Media Production Building',
      },
    ],
    lockedScoutHint: 'The dedicated broadcasting and media production facility with satellite dishes.',
    campusLocationDescription: 'EMRC Audio-Visual Studios',
  },
  {
    name: 'Lucario Launchpad – IIPS Professional Studies',
    pokemonName: 'Lucario',
    pokemonType: 'Psychic',
    latitude: 22.6918,
    longitude: 75.8782,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 380,
    stage1Variants: [
      {
        riddleTitle: '💼 IIPS Corporate & Data Citadel',
        riddlePoem:
          'Integrated MBA, MCA aur data analytics ke freshers jahan formal attire mein case study discuss karte hain. Takshashila ka sabse mashhoor professional studies institute kaunsa hai?',
        question: 'Takshashila campus ka International Institute of Professional Studies landmark:',
        options: [
          'IIPS (International Institute of Professional Studies)',
          'Central Workshop Bay',
          'Dean Residence Porch',
          'Gardener Nursery Shed',
        ],
        answer: 'IIPS (International Institute of Professional Studies)',
        acceptedAnswers: ['iips', 'iips quad', 'international institute of professional studies', 'iips building'],
        landmarkRevealed: 'IIPS Academic Complex & Courtyard',
      },
    ],
    lockedScoutHint: 'The modern multi-floor building near the east ring road with seminar halls and corporate placement rooms.',
    campusLocationDescription: 'IIPS (International Institute of Professional Studies) Quad',
  },
  {
    name: 'Gyarados Grid – School of Economics',
    pokemonName: 'Gyarados',
    pokemonType: 'Water',
    latitude: 22.6902,
    longitude: 75.8772,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 370,
    stage1Variants: [
      {
        riddleTitle: '📊 GDP, Budgets & Arthashastra',
        riddlePoem:
          'Supply and demand ke graphs, inflation aur union budget ka analysis jahan profs aur research scholars karte hain. Economics aur vitta ka yeh pramukh vibhag kaun sa hai?',
        question: 'Pehchano: DAVV Takshashila ka School of Economics:',
        options: [
          'School of Economics (Arthashastra Bhavan)',
          'Bus Parking Lot',
          'Badminton Court',
          'Water Booster Pump',
        ],
        answer: 'School of Economics (Arthashastra Bhavan)',
        acceptedAnswers: ['school of economics', 'economics department', 'arthashastra bhavan', 'economics block'],
        landmarkRevealed: 'School of Economics Building',
      },
    ],
    lockedScoutHint: 'The dedicated social sciences and economics block adjacent to the central lawns.',
    campusLocationDescription: 'School of Economics (Arthashastra Bhavan)',
  },
  {
    name: 'Dragonite Desk – School of Journalism (SJMC)',
    pokemonName: 'Dragonite',
    pokemonType: 'Normal',
    latitude: 22.6888,
    longitude: 75.8762,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 390,
    stage1Variants: [
      {
        riddleTitle: '📰 Breaking News & Broadcast Studio',
        riddlePoem:
          'Teleprompter par news reading, press conference ki reporting aur documentary filmmaking jahan seekhi jaati hai. Patrakarita aur media ka yeh shikshan kendra kaunsa hai?',
        question: 'Takshashila campus ka journalism & media institute:',
        options: [
          'School of Journalism & Mass Communication (SJMC)',
          'Vehicle Repair Shed',
          'Chemistry Gas Plant',
          'Hostel Mess Godown',
        ],
        answer: 'School of Journalism & Mass Communication (SJMC)',
        acceptedAnswers: ['sjmc', 'school of journalism', 'mass communication', 'school of journalism & mass communication'],
        landmarkRevealed: 'SJMC Media Building',
      },
    ],
    lockedScoutHint: 'Look for the journalism department with the radio transmission setup and media newsroom.',
    campusLocationDescription: 'School of Journalism & Mass Communication (SJMC)',
  },
  {
    name: 'Blastoise Bio-Sphere – Life Sciences & Biotech',
    pokemonName: 'Blastoise',
    pokemonType: 'Water',
    latitude: 22.6895,
    longitude: 75.8775,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 410,
    stage1Variants: [
      {
        riddleTitle: '🧬 DNA Helix & Cell Biology Complex',
        riddlePoem:
          'Petri dishes mein bacterial cultures, DNA sequencing aur centrifuge machines jahan 24/7 ghoomti hain. Biological research ka yeh multi-lab complex kaunsa hai?',
        question: 'Takshashila campus ka Life Sciences & Biotechnology department:',
        options: [
          'School of Life Sciences & Biotechnology',
          'Gymnasium Locker Room',
          'Post Office Counter',
          'Security Guard Restroom',
        ],
        answer: 'School of Life Sciences & Biotechnology',
        acceptedAnswers: ['life sciences', 'biotechnology', 'school of life sciences', 'biotech block', 'school of biotechnology'],
        landmarkRevealed: 'Life Sciences & Biotech Lab Wing',
      },
    ],
    lockedScoutHint: 'The advanced bioscience research building near the botanical pathways.',
    campusLocationDescription: 'School of Life Sciences & Biotechnology',
  },
  {
    name: 'Arcanine Alchemy – School of Chemical Sciences',
    pokemonName: 'Arcanine',
    pokemonType: 'Fire',
    latitude: 22.6910,
    longitude: 75.8752,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1Variants: [
      {
        riddleTitle: '🧪 Test Tubes & Bunsen Burners',
        riddlePoem:
          'Beakers mein bubbling solutions, titration pipettes aur periodic table ke elements ka jahan deep analysis hota hai. Chemistry ke professors ka yeh iconic research block kaun sa hai?',
        question: 'DAVV Takshashila ka School of Chemical Sciences:',
        options: [
          'School of Chemical Sciences (Chemistry Block)',
          'Bank ATM Hall',
          'Guest House Lawn',
          'Sports Store Room',
        ],
        answer: 'School of Chemical Sciences (Chemistry Block)',
        acceptedAnswers: ['chemistry block', 'chemical sciences', 'school of chemical sciences', 'chemistry department'],
        landmarkRevealed: 'School of Chemical Sciences Lab Complex',
      },
    ],
    lockedScoutHint: 'The tall academic building with exhaust chimneys and chemical research laboratories.',
    campusLocationDescription: 'School of Chemical Sciences',
  },
  {
    name: 'Lapras Lawn – University Open-Air Amphitheatre',
    pokemonName: 'Lapras',
    pokemonType: 'Water',
    latitude: 22.6894,
    longitude: 75.8745,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '🎭 Stepped Stone Theatre & Acoustic Sky',
        riddlePoem:
          'Golakar stepped concrete stairs jahan shaam ko dost baith kar guitar bajate hain, street plays aur Nukkad Naatak ki aawaz jahan goonjti hai. Khule aasmaan ke neeche yeh kaunsa theatre hai?',
        question: 'Takshashila campus ka Open-Air Theatre (OAT) landmark:',
        options: [
          'University Open-Air Amphitheatre (OAT)',
          'Generator Substation',
          'Transformer Pen',
          'Bicycle Parking Zone B',
        ],
        answer: 'University Open-Air Amphitheatre (OAT)',
        acceptedAnswers: ['open-air amphitheatre', 'amphitheatre', 'oat', 'open air theatre', 'oat steps'],
        landmarkRevealed: 'Open-Air Amphitheatre (OAT)',
      },
    ],
    lockedScoutHint: 'The semi-circular open amphitheatre with stone steps near the main cultural lawns.',
    campusLocationDescription: 'University Open-Air Amphitheatre (OAT)',
  },
  {
    name: 'Jolteon Junction – Central IT Centre (CCC)',
    pokemonName: 'Jolteon',
    pokemonType: 'Electric',
    latitude: 22.6916,
    longitude: 75.8762,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 420,
    stage1Variants: [
      {
        riddleTitle: '🌐 Campus High-Speed Fiber & Server Core',
        riddlePoem:
          'Poore university campus ka Wi-Fi, optical fiber network aur student admission servers jahan se control hote hain. DAVV ka central digital backbone kaunsa tower hai?',
        question: 'Takshashila campus ka Central Computer Centre (CCC):',
        options: [
          'Central IT & Computer Centre (CCC)',
          'Cafeteria Kitchen',
          'Security Room',
          'Gardener Tool Shed',
        ],
        answer: 'Central IT & Computer Centre (CCC)',
        acceptedAnswers: ['ccc', 'computer centre', 'central computer centre', 'it centre', 'central it centre'],
        landmarkRevealed: 'Central Computer Centre (CCC) Tower',
      },
    ],
    lockedScoutHint: 'The dedicated digital administration building housing server racks and campus internet NOC.',
    campusLocationDescription: 'Central IT & Computer Centre (CCC)',
  },
  {
    name: 'Chansey Clinic – University Health Centre',
    pokemonName: 'Chansey',
    pokemonType: 'Normal',
    latitude: 22.6900,
    longitude: 75.8738,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 320,
    stage1Variants: [
      {
        riddleTitle: '🏥 Stethoscope & First-Aid Dispensary',
        riddlePoem:
          'Sports ke dauraan chot lage ya sudden fever aaye, campus doctor aur nurse jahan free medicines aur first-aid dete hain. Freshers ka yeh healthcare clinic kaunsa hai?',
        question: 'DAVV Takshashila ka student medical centre:',
        options: [
          'Devi Ahilya University Health Centre',
          'Auditorium Backstage',
          'Cricket Pavilion Bleacher',
          'Physics Darkroom',
        ],
        answer: 'Devi Ahilya University Health Centre',
        acceptedAnswers: ['health centre', 'dispensary', 'university health centre', 'medical clinic', 'doctor clinic'],
        landmarkRevealed: 'University Health Centre & Clinic',
      },
    ],
    lockedScoutHint: 'The medical dispensary building with the red cross sign near the residential gate.',
    campusLocationDescription: 'University Health Centre & Medical Dispensary',
  },
  {
    name: 'Machamp Mess – Jawahar Boys Hostel',
    pokemonName: 'Machamp',
    pokemonType: 'Normal',
    latitude: 22.6925,
    longitude: 75.8745,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 360,
    stage1Variants: [
      {
        riddleTitle: '🥘 Midnight Hostel Adda & Dal-Roti Mess',
        riddlePoem:
          'Raat bhar roommates ke saath guitar jam sessions, assignment deadlines se pehle panicking aur garam rotis ki khushboo! Boys hostel ka yeh famous block kaunsa hai?',
        question: 'Takshashila campus ka boys residential hostel:',
        options: [
          'Jawahar Boys Hostel & Mess Quad',
          'Administrative Meeting Hall',
          'Printing Press Cell',
          'Chemistry Storage Yard',
        ],
        answer: 'Jawahar Boys Hostel & Mess Quad',
        acceptedAnswers: ['jawahar hostel', 'boys hostel', 'hostel mess', 'jawahar boys hostel'],
        landmarkRevealed: 'Jawahar Boys Hostel Complex',
      },
    ],
    lockedScoutHint: 'The multi-storey brick residential hostel block for university boys with open quad.',
    campusLocationDescription: 'Jawahar Boys Hostel & Courtyard',
  },
  {
    name: 'Gardevoir Greens – Kamala Nehru Girls Hostel',
    pokemonName: 'Gardevoir',
    pokemonType: 'Psychic',
    latitude: 22.6880,
    longitude: 75.8748,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 360,
    stage1Variants: [
      {
        riddleTitle: '🌸 Safe Sanctuary & Courtyard Garden',
        riddlePoem:
          'Flower beds se ghiri safe residential boundary jahan campus ki girl students rehti hain, curfew time se pehle guard maushi attendance leti hain. Yeh kaun sa hostel hai?',
        question: 'Takshashila campus ka girls hostel landmark:',
        options: [
          'Kamala Nehru Girls Hostel & Lawn',
          'Main Road Bus Stop',
          'Transformer Backyard',
          'Sports Pavilion Dugout',
        ],
        answer: 'Kamala Nehru Girls Hostel & Lawn',
        acceptedAnswers: ['kamala nehru hostel', 'girls hostel', 'kamala nehru girls hostel'],
        landmarkRevealed: 'Kamala Nehru Girls Hostel',
      },
    ],
    lockedScoutHint: 'The secured residential hostel compound for women students with internal gardens.',
    campusLocationDescription: 'Kamala Nehru Girls Hostel & Lawn',
  },
  {
    name: 'Meowth Mint – SBI Branch & Post Office',
    pokemonName: 'Meowth',
    pokemonType: 'Normal',
    latitude: 22.6895,
    longitude: 75.8742,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 330,
    stage1Variants: [
      {
        riddleTitle: '💰 Fee Challans, Passbooks & Post Boxes',
        riddlePoem:
          'Challan form bharne ki lambi line, ATM machine se cash withdrawal aur speed post bhejne ka kendra. University campus ki official banking branch kaunsi hai?',
        question: 'Takshashila campus ka State Bank of India & Post Office branch:',
        options: [
          'SBI University Branch & Campus Post Office',
          'Auditorium Greenroom',
          'Botanical Herbarium',
          'Dean Cabin',
        ],
        answer: 'SBI University Branch & Campus Post Office',
        acceptedAnswers: ['sbi branch', 'sbi bank', 'post office', 'sbi university branch', 'campus bank'],
        landmarkRevealed: 'SBI University Branch & Post Office',
      },
    ],
    lockedScoutHint: 'The public service building with blue SBI signage and red India Post box near the admin avenue.',
    campusLocationDescription: 'SBI University Branch & Campus Post Office',
  },
  {
    name: 'Togepi Temple – Saraswati Mandir',
    pokemonName: 'Togepi',
    pokemonType: 'Normal',
    latitude: 22.6905,
    longitude: 75.8750,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '🪷 Goddess of Wisdom & Tranquil Shrine',
        riddlePoem:
          'Exam se theek pehle har student jahan hath jod kar acche marks ki prarthana karta hai, safed sangmarmar ki Devi Saraswati ki murti jahan sthit hai. Yeh pavitra spot kaunsa hai?',
        question: 'Takshashila campus ka sacred Saraswati Mandir shrine:',
        options: [
          'Saraswati Mandir & Peace Fountain Plaza',
          'Substation Switchyard',
          'Exam Evaluation Strongroom',
          'Bus Depot',
        ],
        answer: 'Saraswati Mandir & Peace Fountain Plaza',
        acceptedAnswers: ['saraswati mandir', 'saraswati temple', 'temple', 'peace fountain'],
        landmarkRevealed: 'Campus Saraswati Temple',
      },
    ],
    lockedScoutHint: 'The peaceful marble temple shrine dedicated to Maa Saraswati surrounded by flower gardens.',
    campusLocationDescription: 'Campus Saraswati Mandir & Peace Fountain',
  },
];

/**
 * Rich pool of 10 real landmarks on IET DAVV Campus (Engineering Campus)
 */
export const IET_DAVV_LANDMARK_POOL: LandmarkTemplate[] = [
  {
    name: 'Pikachu Power Station – Block A Porch',
    pokemonName: 'Pikachu',
    pokemonType: 'Electric',
    latitude: 22.6820,
    longitude: 75.8795,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 300,
    stage1Variants: [
      {
        riddleTitle: '⚡ Pikachu\'s Innovation Gateway',
        riddlePoem:
          'Yellow sparks fly where engineers take their very first stride! Ash\'s Pikachu greets you with 100,000 volts right in front of the Director\'s Office under the grand entrance pillars. Identify this premier administrative portico!',
        question: 'Identify the main entrance academic block of IET DAVV guarded by Pikachu:',
        options: [
          'Block A Main Administrative Porch',
          'Carpentry Wood Shed',
          'Hostel Mess Backdoor',
          'Civil Survey Shack',
        ],
        answer: 'Block A Main Administrative Porch',
        landmarkRevealed: 'Block A Main Portico (Pikachu\'s Spark Station)',
      },
      {
        riddleTitle: '⚡ Academic Spark & Porch Clue',
        riddlePoem:
          'Notice board par exam schedule jahan lagta hai, administrative fee counter jahan hai, aur Block A ka sabse uncha archway khada hai. Pikachu yahan pehra deta hai! Yeh kaun sa spot hai?',
        question: 'IET DAVV ka central administrative entrance porch jahan Pikachu sthit hai:',
        options: [
          'Block A Main Administrative Porch',
          'Foundry Furnace Yard',
          'Cycle Stand East',
          'Volleyball Sand Court',
        ],
        answer: 'Block A Main Administrative Porch',
        landmarkRevealed: 'Block A Main Portico',
      },
    ],
    lockedScoutHint: 'Stand directly under the tall concrete entrance porch of Academic Block A where Pikachu resides.',
    campusLocationDescription: 'Block A Main Administrative Entrance (Pikachu Station)',
  },
  {
    name: 'Charizard Circuits – Mechanical Workshops',
    pokemonName: 'Charizard',
    pokemonType: 'Fire',
    latitude: 22.6812,
    longitude: 75.8805,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '⚙️ Lathe & Foundry Forges',
        riddlePoem:
          'Apron pehan kar jahan file aur chheni chalani padti hai, welding sparks udti hain aur lathe machine par job banaye jaate hain! 1st year fresher ka sabse loud practical adda kaunsa hai?',
        question: 'Pehchano: IET DAVV ke central engineering workshops ka official landmark:',
        options: [
          'Central Mechanical Workshop Sheds',
          'Girls Common Room',
          'Exam Control Strongroom',
          'Digital Reading Hall',
        ],
        answer: 'Central Mechanical Workshop Sheds',
        landmarkRevealed: 'Central Mechanical Workshop & Foundry Bay',
      },
      {
        riddleTitle: '🔩 Sparks & Welding Bay Clue',
        riddlePoem:
          'Lohe ki mehak, hammer ki aawaz aur workshop sir ka strict viva! Jahan har engineer ne carpentry aur smithy practical seekha. Yeh kaun si building hai?',
        question: 'IET campus ke heavy machines aur metal cutting sheds:',
        options: [
          'Central Mechanical Workshop Sheds',
          'Language Lab Pod',
          'Medical First Aid Room',
          'Director Residence',
        ],
        answer: 'Central Mechanical Workshop Sheds',
        landmarkRevealed: 'Central Mechanical Workshop & Foundry Bay',
      },
    ],
    lockedScoutHint: 'Follow the industrial hum towards the tall corrugated roofing workshop sheds.',
    campusLocationDescription: 'Mechanical & Central Workshops Shed',
  },
  {
    name: 'Venusaur Vertex – IET Central Canteen',
    pokemonName: 'Venusaur',
    pokemonType: 'Grass',
    latitude: 22.6828,
    longitude: 75.8812,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1Variants: [
      {
        riddleTitle: '☕ Chai, Maggi & Bunk Spot',
        riddlePoem:
          'Assignment submission ke baad thake huye coders jahan Maggi aur Cold Drink par debate karte hain. Sham ko hostelers aur day-scholars ka sabse bada socializing lawn kaunsa hai?',
        question: 'Pehchano: IET DAVV campus ka main food hub landmark:',
        options: [
          'IET Central Canteen & Chai Quad',
          'Physics Optical Darkroom',
          'Server Room Rack 4',
          'Chemistry Titration Bench',
        ],
        answer: 'IET Central Canteen & Chai Quad',
        landmarkRevealed: 'IET Canteen & Shaded Lawn',
      },
      {
        riddleTitle: '🍜 2-Minute Maggi Shelter',
        riddlePoem:
          'Lunch break mein sabse lambi line jahan lagti hai, garam samosa aur cold coffee table par aati hai. IET students ki sabse priye adda kaun si hai?',
        question: 'IET campus ka buzzing student canteen aur lawn:',
        options: [
          'IET Central Canteen & Chai Quad',
          'Substation Transformer Pen',
          'Exam Office Vault',
          'Security Cabin 2',
        ],
        answer: 'IET Central Canteen & Chai Quad',
        landmarkRevealed: 'IET Canteen & Shaded Lawn',
      },
    ],
    lockedScoutHint: 'Look for the buzzing cafeteria building surrounded by green tree shades and tables.',
    campusLocationDescription: 'IET Student Canteen & Lawn Quad',
  },
  {
    name: 'Mewtwo Matrix – E-Cell & Incubation Hub',
    pokemonName: 'Mewtwo',
    pokemonType: 'Psychic',
    latitude: 22.6835,
    longitude: 75.8800,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 500,
    stage1Variants: [
      {
        riddleTitle: '🚀 Startup & Hacker Headquarters',
        riddlePoem:
          'Pitch deck banti hai, angel investor aate hain, aur midnight hackathon mein AI apps deploy hoti hain. IET ke budding entrepreneurs aur innovators ka launching pad kaun sa hai?',
        question: 'Pehchano: IET DAVV ka Incubation & Innovation E-Cell hub:',
        options: [
          'IET Incubation & Innovation E-Cell Hub',
          'Bus Stand Waiting Bench',
          'Pump House Reservoir',
          'Sports Equipment Locker',
        ],
        answer: 'IET Incubation & Innovation E-Cell Hub',
        landmarkRevealed: 'IET E-Cell Innovation Center',
      },
    ],
    lockedScoutHint: 'The modern incubation and start-up center featuring hackathon rooms and high-speed Wi-Fi.',
    campusLocationDescription: 'IET Innovation & Startup Incubation Center',
  },
  {
    name: 'Blastoise Bay – IET Central Library',
    pokemonName: 'Blastoise',
    pokemonType: 'Water',
    latitude: 22.6830,
    longitude: 75.8790,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 420,
    stage1Variants: [
      {
        riddleTitle: '📚 Engineering Digital Reading Hall',
        riddlePoem:
          'IEEE papers, gate exam guide books aur previous year question papers ka khazana! Exam season ki raat jahan silence mein page palatne ki aawaz aati hai. Yeh kaun si building hai?',
        question: 'IET DAVV campus ka engineering library & study plaza:',
        options: [
          'IET Central Library & Reading Hall',
          'Carpentry Bench 4',
          'Boys Hostel Kitchen',
          'Sports Ground Dugout',
        ],
        answer: 'IET Central Library & Reading Hall',
        landmarkRevealed: 'IET Central Library Hall',
      },
    ],
    lockedScoutHint: 'The quiet knowledge hub with reference stacks, journals, and digital terminals.',
    campusLocationDescription: 'IET Central Library Plaza',
  },
  {
    name: 'Raichu Reactor – Computer Science & IT Block',
    pokemonName: 'Raichu',
    pokemonType: 'Electric',
    latitude: 22.6815,
    longitude: 75.8785,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 400,
    stage1Variants: [
      {
        riddleTitle: '💻 Silicon Coders & Linux Labs',
        riddlePoem:
          'GitHub commits, competitive coding aur DSA algorithms jahan 100+ screens par chalte hain! Computer Science aur Information Technology departments ka central wing kaun sa hai?',
        question: 'IET DAVV ka Computer Engineering & IT Lab block:',
        options: [
          'Computer Engineering & IT Lab Block',
          'Acoustic Music Room',
          'Chemical Warehouse',
          'Generator Room 2',
        ],
        answer: 'Computer Engineering & IT Lab Block',
        landmarkRevealed: 'IET Computer Science & IT Labs',
      },
    ],
    lockedScoutHint: 'The multi-floor academic block housing software labs, server racks, and AI terminals.',
    campusLocationDescription: 'Computer Engineering & IT Academic Wing',
  },
  {
    name: 'Electabuzz Edge – Electronics & E&TC Block',
    pokemonName: 'Electabuzz',
    pokemonType: 'Electric',
    latitude: 22.6825,
    longitude: 75.8780,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 380,
    stage1Variants: [
      {
        riddleTitle: '⚡ Breadboards, Oscilloscopes & Microchips',
        riddlePoem:
          'Soldering iron ki garmi, resistor aur capacitor ke color bands, aur Cathode Ray Oscilloscope par sine wave! Electronics & Telecommunication engineer ka gadh kaun sa hai?',
        question: 'IET DAVV ka Electronics & Telecommunication (E&TC) block:',
        options: [
          'Electronics & Telecommunication (E&TC) Block',
          'Cricket Pavilion Changing Room',
          'Hostel Laundry Shed',
          'Gardener Potting Room',
        ],
        answer: 'Electronics & Telecommunication (E&TC) Block',
        landmarkRevealed: 'E&TC Department Block',
      },
    ],
    lockedScoutHint: 'The dedicated engineering wing for microprocessors, communication signals, and IoT hardware.',
    campusLocationDescription: 'Electronics & Telecommunication Wing',
  },
  {
    name: 'Geodude Ground – Civil Engineering & Survey Lawn',
    pokemonName: 'Geodude',
    pokemonType: 'Normal',
    latitude: 22.6808,
    longitude: 75.8798,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 360,
    stage1Variants: [
      {
        riddleTitle: '📐 Theodolite & Concrete Crushing Labs',
        riddlePoem:
          'Tripod stand par theodolite set karke campus ka survey jahan hota hai, concrete beams ki compressive strength test hoti hai! Civil engineers ka outdoor survey ground kaunsa hai?',
        question: 'IET Civil Engineering survey & material testing lawn:',
        options: [
          'Civil Engineering & Survey Lawns',
          'Principal Guest Suite',
          'Hostel Iron Gate',
          'Canteen Dishwashing Sink',
        ],
        answer: 'Civil Engineering & Survey Lawns',
        landmarkRevealed: 'Civil Engineering Survey Lawns',
      },
    ],
    lockedScoutHint: 'The open lawn area outside the Civil department where surveying tripods are mounted.',
    campusLocationDescription: 'Civil Engineering & Surveying Grounds',
  },
  {
    name: 'Dragonite Dome – Student Activity Center & Sports',
    pokemonName: 'Dragonite',
    pokemonType: 'Normal',
    latitude: 22.6838,
    longitude: 75.8815,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 450,
    stage1Variants: [
      {
        riddleTitle: '🏆 Badges, Trophies & Table Tennis',
        riddlePoem:
          'Inter-college robotics tournament, robotics arena, aur evening table tennis matches! Clubs aur cultural fests ki meeting ka central spot kaunsa hai?',
        question: 'IET Student Activity Center (SAC) & sports zone:',
        options: [
          'Student Activity Center & Sports Arena',
          'Transformer High Voltage Cage',
          'Dean Car Porch',
          'Library Binding Room',
        ],
        answer: 'Student Activity Center & Sports Arena',
        landmarkRevealed: 'Student Activity Center (SAC)',
      },
    ],
    lockedScoutHint: 'The multi-purpose student recreation building with sports courts and club rooms.',
    campusLocationDescription: 'IET Student Activity Center & Sports Arena',
  },
  {
    name: 'Snorlax Square – Hostel Circle & Amul Parlour',
    pokemonName: 'Snorlax',
    pokemonType: 'Normal',
    latitude: 22.6802,
    longitude: 75.8810,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 340,
    stage1Variants: [
      {
        riddleTitle: '🍦 Evening Ice-Cream & Hostel Adda',
        riddlePoem:
          'Classes khatam hone ke baad jahan hostel junta chhat se nikal kar aati hai, thandi ice cream aur flavored milk par din bhar ki baatein hoti hain. Yeh kaun sa circle hai?',
        question: 'IET campus ka Hostel Circle & Amul Parlour meeting hub:',
        options: [
          'IET Campus Hostel Circle & Amul Parlour',
          'Transformer Substation Block',
          'Chemical Waste Disposal Pit',
          'Main Road Toll Booth',
        ],
        answer: 'IET Campus Hostel Circle & Amul Parlour',
        landmarkRevealed: 'Hostel Circle & Milk Parlour',
      },
    ],
    lockedScoutHint: 'The friendly student roundabout near the boys & girls hostel gate with snack stalls.',
    campusLocationDescription: 'IET Hostels Circle & Evening Snack Square',
  },
  {
    name: 'Jolteon Jolt – Electrical Block C & HV Labs',
    pokemonName: 'Jolteon',
    pokemonType: 'Electric',
    latitude: 22.6818,
    longitude: 75.8788,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 390,
    stage1Variants: [
      {
        riddleTitle: '⚡ High Voltage Transformers & Induction Motors',
        riddlePoem:
          'Three-phase power supply, megger insulation testing aur humming transformers! Electrical engineers ke heavy machines aur control systems ka central block kaun sa hai?',
        question: 'IET DAVV ka Electrical Engineering Block C:',
        options: [
          'Electrical Engineering Block C & High Voltage Labs',
          'Canteen Dishwashing Area',
          'Cycle Stand North',
          'Director Car Porch',
        ],
        answer: 'Electrical Engineering Block C & High Voltage Labs',
        acceptedAnswers: ['block c', 'electrical block', 'electrical engineering', 'high voltage lab', 'electrical engineering block c'],
        landmarkRevealed: 'Block C Electrical Engineering Labs',
      },
    ],
    lockedScoutHint: 'The engineering block behind Block A featuring outdoor high-voltage cages and motor testing beds.',
    campusLocationDescription: 'IET Block C Electrical Engineering Wing',
  },
  {
    name: 'Squirtle Sentry – IET Main Security Gate',
    pokemonName: 'Squirtle',
    pokemonType: 'Water',
    latitude: 22.6825,
    longitude: 75.8802,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 300,
    stage1Variants: [
      {
        riddleTitle: '🚧 Boom Barrier & Khandwa Road Checkpost',
        riddlePoem:
          'College id card dikha kar jahan bikes aur autos campus mein enter hote hain, guard bhaiya jahan helmet aur registration check karte hain. IET ka front main gate kaunsa hai?',
        question: 'IET DAVV ka main entrance security checkpost:',
        options: [
          'IET Main Security Entrance Gate',
          'Mess Back Kitchen',
          'Foundry Yard',
          'Auditorium Projector Room',
        ],
        answer: 'IET Main Security Entrance Gate',
        acceptedAnswers: ['main gate', 'iet main gate', 'security gate', 'entrance gate', 'iet main security entrance gate'],
        landmarkRevealed: 'IET Main Security Gate',
      },
    ],
    lockedScoutHint: 'The main university vehicular boom-barrier gate on Khandwa Road.',
    campusLocationDescription: 'IET Main Entrance Gate & Security Checkpost',
  },
  {
    name: 'Alakazam Arena – Amphitheatre & Block A Lawns',
    pokemonName: 'Alakazam',
    pokemonType: 'Psychic',
    latitude: 22.6822,
    longitude: 75.8790,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 370,
    stage1Variants: [
      {
        riddleTitle: '🎸 Band Battles & Tech-Fest Arena',
        riddlePoem:
          'Aakshank aur tech-fest ki musical night jahan hoti hai, green grass steps par students group jam sessions karte hain. Block A ke theek peeche ka amphitheatre kaunsa hai?',
        question: 'IET central open-air amphitheatre & lawn:',
        options: [
          'IET Central Open-Air Amphitheatre & Block A Lawns',
          'Server Room Rack',
          'Chemical Pit',
          'Faculty Garage',
        ],
        answer: 'IET Central Open-Air Amphitheatre & Block A Lawns',
        acceptedAnswers: ['iet amphitheatre', 'open-air amphitheatre', 'amphitheatre', 'block a lawns', 'iet central open-air amphitheatre'],
        landmarkRevealed: 'IET Amphitheatre & Lawns',
      },
    ],
    lockedScoutHint: 'The open stepped lawn theatre directly behind academic Block A.',
    campusLocationDescription: 'IET Central Open-Air Amphitheatre',
  },
  {
    name: 'Gengar Gate – APJ Kalam Boys Hostel',
    pokemonName: 'Gengar',
    pokemonType: 'Psychic',
    latitude: 22.6798,
    longitude: 75.8815,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '🌙 3 AM Coding Deadlines & Corridor Echoes',
        riddlePoem:
          'Exam se ek raat pehle syllabus khatam karne ka mission, Wi-Fi LAN cables aur mess food par endless debates! IET engineering boys hostels ka building block kaun sa hai?',
        question: 'IET boys hostels complex:',
        options: [
          'APJ Abdul Kalam & Ramanujan Boys Hostel Block',
          'Administrative Board Room',
          'Exam Strong Vault',
          'Library Reference Deck',
        ],
        answer: 'APJ Abdul Kalam & Ramanujan Boys Hostel Block',
        acceptedAnswers: ['boys hostel', 'kalam hostel', 'ramanujan hostel', 'iet boys hostel', 'apj abdul kalam boys hostel'],
        landmarkRevealed: 'IET Boys Hostel Complex',
      },
    ],
    lockedScoutHint: 'The red-brick engineering residential hostels located at the southern corner of the campus.',
    campusLocationDescription: 'APJ Abdul Kalam & Ramanujan Boys Hostel',
  },
  {
    name: 'Sylveon Square – IET Girls Hostel Courtyard',
    pokemonName: 'Sylveon',
    pokemonType: 'Normal',
    latitude: 22.6805,
    longitude: 75.8820,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 350,
    stage1Variants: [
      {
        riddleTitle: '🌺 Badminton Courtyard & Peaceful Living',
        riddlePoem:
          'Internal badminton court, evening walks aur assignment study groups! IET ki women engineers ka secure residential hostel kaun sa hai?',
        question: 'IET Girls Hostel complex:',
        options: [
          'IET Girls Hostel Courtyard & Recreation Lawn',
          'Bus Garage',
          'Mechanical Workshop Furnace',
          'Substation Cage',
        ],
        answer: 'IET Girls Hostel Courtyard & Recreation Lawn',
        acceptedAnswers: ['girls hostel', 'iet girls hostel', 'girls hostel courtyard', 'iet girls hostel courtyard'],
        landmarkRevealed: 'IET Girls Hostel Complex',
      },
    ],
    lockedScoutHint: 'The secure gated residential hostel for female engineers with recreation lawns.',
    campusLocationDescription: 'IET Girls Hostel & Courtyard',
  },
  {
    name: 'Porygon Portal – Robotics & IoT Lab',
    pokemonName: 'Porygon',
    pokemonType: 'Normal',
    latitude: 22.6816,
    longitude: 75.8792,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 430,
    stage1Variants: [
      {
        riddleTitle: '🤖 Microcontrollers, Drones & Line Follower Bots',
        riddlePoem:
          'Arduino, Raspberry Pi, 3D printers aur quadcopter drones jahan test fly hote hain! National Robocon competitions ki preparation karne waali student club lab kaun si hai?',
        question: 'IET Robotics & IoT Club Innovation Lab:',
        options: [
          'Robotics Club & IoT Hardware Innovation Lab',
          'Canteen Snack Store',
          'Guard Rest Room',
          'Gardener Shed',
        ],
        answer: 'Robotics Club & IoT Hardware Innovation Lab',
        acceptedAnswers: ['robotics lab', 'iot lab', 'robotics club', 'hardware lab', 'robotics club & iot hardware innovation lab'],
        landmarkRevealed: 'IET Robotics & IoT Innovation Lab',
      },
    ],
    lockedScoutHint: 'The makerspace laboratory filled with electronics test benches and robot arenas.',
    campusLocationDescription: 'Robotics Club & IoT Hardware Lab',
  },
  {
    name: 'Arcanine Athletics – IET Sports Grounds',
    pokemonName: 'Arcanine',
    pokemonType: 'Fire',
    latitude: 22.6832,
    longitude: 75.8822,
    radius: DEFAULT_GEOFENCE_RADIUS_METERS,
    points: 380,
    stage1Variants: [
      {
        riddleTitle: '🏀 Basketball Hoops & Floodlit Volley Matches',
        riddlePoem:
          'Evening basketball dribble sound, volleyball spikes aur annual sports fest ki trophy matches! IET engineers ka outdoor sports field kaunsa hai?',
        question: 'IET sports ground & hardcourts:',
        options: [
          'IET Sports Grounds, Basketball & Volleyball Courts',
          'Administrative Record Room',
          'Library Binding Cell',
          'Dean Cabin',
        ],
        answer: 'IET Sports Grounds, Basketball & Volleyball Courts',
        acceptedAnswers: ['sports grounds', 'basketball court', 'volleyball court', 'iet sports ground', 'sports ground'],
        landmarkRevealed: 'IET Sports Grounds',
      },
    ],
    lockedScoutHint: 'The open sports grounds with basketball hardcourts and spectator bleachers.',
    campusLocationDescription: 'IET Sports Grounds & Courts',
  },
];

/**
 * Dynamically generates a fresh, randomized 5-checkpoint quest for the specified campus:
 * - Selects 5 distinct landmarks randomly from the 10-landmark pool (places change every game!)
 * - Randomizes their sequence (different order every game!)
 * - Selects a fresh Stage 1 riddle variant for each place, and JUMBLES the options so the answer is NEVER always at No. 1!
 * - Selects a fresh student-friendly Stage 2 riddle from the riddle bank, and JUMBLES the options so the answer is NEVER always at No. 1!
 */
export function generateCampusQuest(campusId: CampusId): Checkpoint[] {
  const pool = campusId === 'IET_DAVV' ? IET_DAVV_LANDMARK_POOL : TAKSHASHILA_LANDMARK_POOL;

  // Shuffle the landmark pool (Fisher-Yates)
  const shuffledLandmarks = [...pool];
  for (let i = shuffledLandmarks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLandmarks[i], shuffledLandmarks[j]] = [shuffledLandmarks[j], shuffledLandmarks[i]];
  }

  // Pick top 5 places for this game
  const selectedPlaces = shuffledLandmarks.slice(0, 5);

  const checkpoints: Checkpoint[] = selectedPlaces.map((landmark, idx) => {
    const id = idx + 1; // 1 to 5 sequential sequence

    // Pick a Stage 1 riddle variant
    const variantIndex = Math.floor(Math.random() * landmark.stage1Variants.length);
    const chosenVariant = landmark.stage1Variants[variantIndex];

    // Jumble the Stage 1 options! Guarantee answer is NOT fixed at No. 1
    const jumbledStage1Options = jumbleOptions(chosenVariant.options, chosenVariant.answer);

    const stage1: Stage1LocationRiddle = {
      riddleTitle: chosenVariant.riddleTitle,
      riddlePoem: chosenVariant.riddlePoem,
      question: chosenVariant.question,
      options: jumbledStage1Options,
      answer: chosenVariant.answer,
      acceptedAnswers: chosenVariant.acceptedAnswers,
      landmarkRevealed: chosenVariant.landmarkRevealed,
    };

    // Pick a fresh student-friendly Stage 2 riddle from our bank (Brain teaser, Student life, Bollywood, Music, Pokémon)
    // Rotate categories across the 5 checkpoints for maximum engagement:
    const categoryRotation = [
      'BRAIN_TEASER' as const,
      'STUDENT_RIDDLE' as const,
      'BOLLYWOOD' as const,
      'MUSIC' as const,
      'POKEMON_CLASSIC' as const,
    ];
    const category = categoryRotation[idx % categoryRotation.length];
    const stage2 = generateChallengingRiddle(category);

    return {
      id,
      campusId,
      name: landmark.name,
      pokemonName: landmark.pokemonName,
      pokemonType: landmark.pokemonType,
      latitude: landmark.latitude,
      longitude: landmark.longitude,
      radius: landmark.radius,
      points: landmark.points,
      stage1,
      stage2,
      lockedScoutHint: landmark.lockedScoutHint,
      campusLocationDescription: landmark.campusLocationDescription,
    };
  });

  return checkpoints;
}
