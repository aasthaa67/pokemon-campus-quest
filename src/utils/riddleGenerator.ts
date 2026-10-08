import { Stage2PopCultureRiddle } from '../types';

export type RiddleCategory =
  | 'BOLLYWOOD'
  | 'MUSIC'
  | 'POKEMON_CLASSIC'
  | 'BRAIN_TEASER'
  | 'STUDENT_RIDDLE';

export interface RiddleDefinition {
  category: RiddleCategory;
  categoryLabel: string;
  badgeEmoji: string;
  difficulty: 'MEDIUM' | 'HARD';
  riddleText: string;
  options: string[];
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
}

/**
 * Jumbles options array using Fisher-Yates shuffle and ensures the correct
 * answer is NOT always placed at index 0 (No. 1). Randomly distributes
 * the answer across all available positions (A, B, C, D).
 */
export function jumbleOptions(options: string[], answer: string): string[] {
  // Deduplicate and ensure answer is included
  const list = Array.from(new Set([answer, ...options]));
  
  // Ensure we have at least 4 options
  while (list.length < 4) {
    list.push(`Option ${list.length + 1}`);
  }
  const slice = list.slice(0, 4);

  // Fisher-Yates random shuffle
  for (let i = slice.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slice[i], slice[j]] = [slice[j], slice[i]];
  }

  // Double check that the answer is NOT pinned at index 0 (No. 1).
  if (slice[0] === answer && Math.random() < 0.75) {
    const target = 1 + Math.floor(Math.random() * 3);
    [slice[0], slice[target]] = [slice[target], slice[0]];
  }

  return slice;
}

/**
 * Curated repository of challenging, authentic brain teasers and clever riddles
 * (Seven, Clock, Letter 'M', Hole, Carpet, Echo, Envelope, Candle, Bottle, Towel, Pikachu, etc.)
 */
export const CHALLENGING_RIDDLE_BANK: RiddleDefinition[] = [
  // ================= BRAIN TEASERS FROM USER'S INSPIRATION =================
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Classic Number Riddle',
    badgeEmoji: '🔢',
    difficulty: 'MEDIUM',
    riddleText:
      'I am an odd number. Take away a letter and I become even. What number am I?',
    options: ['Seven', 'Eleven', 'Nine', 'Three'],
    answer: 'Seven',
    acceptedAnswers: ['seven', '7', 'number seven'],
    explanation:
      'Take away the letter "S" from "SEVEN" and you get "EVEN"! A classic brain teaser.',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Classic Clock Riddle',
    badgeEmoji: '⏰',
    difficulty: 'MEDIUM',
    riddleText: 'What has hands but cannot clap?',
    options: ['A clock', 'A mannequin', 'A statue', 'A wristband'],
    answer: 'A clock',
    acceptedAnswers: ['clock', 'a clock', 'watch', 'wall clock', 'ghadi'],
    explanation:
      'A clock has hour, minute, and second hands, but it cannot clap!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Letter & Time Riddle',
    badgeEmoji: '🔤',
    difficulty: 'HARD',
    riddleText:
      'What occurs once in a minute, twice in a moment, and never in 1,000 years?',
    options: ["The letter 'm'", 'A leap second', 'A lightning bolt', 'A shadow'],
    answer: "The letter 'm'",
    acceptedAnswers: ['m', "letter m", "the letter m", "'m'", "letter 'm'"],
    explanation:
      "Look at the letters: 'M'inute has one 'm', 'M'o'm'ent has two 'm's, and '1,000 years' has zero 'm's!",
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Weight & Bucket Riddle',
    badgeEmoji: '🪣',
    difficulty: 'MEDIUM',
    riddleText: 'What can you put in a bucket to make it weigh less?',
    options: ['A hole', 'A sponge', 'A balloon', 'Ice cube'],
    answer: 'A hole',
    acceptedAnswers: ['a hole', 'hole', 'holes', 'chhed'],
    explanation:
      'Putting a hole in a bucket lets water out and removes bucket material, making it weigh less!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Yard & Foot Riddle',
    badgeEmoji: '🧶',
    difficulty: 'HARD',
    riddleText: "What's bought by the yard and worn by the foot?",
    options: ['A carpet', 'A sock', 'A tape measure', 'A sneaker'],
    answer: 'A carpet',
    acceptedAnswers: ['a carpet', 'carpet', 'rug', 'mat', 'kaleen'],
    explanation:
      'Carpets are purchased by the yard (length) and walked on (worn) by feet!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Voice & Wind Riddle',
    badgeEmoji: '🗣️',
    difficulty: 'HARD',
    riddleText:
      'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    options: ['An echo', 'A cloud', 'A whistle', 'A kite'],
    answer: 'An echo',
    acceptedAnswers: ['an echo', 'echo', 'sound echo', 'awaaz'],
    explanation:
      'An echo returns words without having a mouth or body, reverberating in the air!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Letter Envelope Riddle',
    badgeEmoji: '✉️',
    difficulty: 'MEDIUM',
    riddleText:
      "I start with 'e', end with 'e', and contain one letter inside me. What am I?",
    options: ['An envelope', 'An engine', 'An eagle', 'An eye'],
    answer: 'An envelope',
    acceptedAnswers: ['envelope', 'an envelope', 'lifafa'],
    explanation:
      "An 'Envelope' begins with E, ends with E, and holds a postal letter inside!",
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Life & Wind Riddle',
    badgeEmoji: '🕯️',
    difficulty: 'HARD',
    riddleText:
      "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. The wind is my enemy. What am I?",
    options: ['A candle', 'An hourglass', 'A torch', 'A smartphone'],
    answer: 'A candle',
    acceptedAnswers: ['candle', 'a candle', 'mombatti', 'diya'],
    explanation:
      'A candle melts down over hours; thin candles burn quickly, fat ones burn slowly, and wind blows them out!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Cap & Head Riddle',
    badgeEmoji: '🍾',
    difficulty: 'MEDIUM',
    riddleText: 'What has a cap and a neck, but no head?',
    options: ['A bottle', 'A mushroom', 'A guitar', 'A fountain pen'],
    answer: 'A bottle',
    acceptedAnswers: ['bottle', 'a bottle', 'water bottle'],
    explanation:
      'A bottle has a neck and a bottle cap, but no head!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Teeth Riddle',
    badgeEmoji: '🪮',
    difficulty: 'MEDIUM',
    riddleText: 'What has many teeth, but cannot bite?',
    options: ['A comb', 'A saw blade', 'A zipper', 'A rake'],
    answer: 'A comb',
    acceptedAnswers: ['comb', 'a comb', 'hair comb', 'kanghi'],
    explanation:
      'A hair comb has rows of teeth used for grooming, but cannot bite!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Drying Riddle',
    badgeEmoji: '🛁',
    difficulty: 'MEDIUM',
    riddleText: 'What gets wetter and wetter the more it dries?',
    options: ['A towel', 'A sponge', 'An umbrella', 'A waterfall'],
    answer: 'A towel',
    acceptedAnswers: ['towel', 'a towel', 'tauliya'],
    explanation:
      'A towel gets wetter as it absorbs moisture while drying your body!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Globe & Corner Riddle',
    badgeEmoji: '📮',
    difficulty: 'MEDIUM',
    riddleText:
      'What can travel around the entire world while staying stuck in one corner?',
    options: ['A stamp', 'A postcard', 'A coin', 'A compass needle'],
    answer: 'A stamp',
    acceptedAnswers: ['stamp', 'a stamp', 'postage stamp', 'dak ticket'],
    explanation:
      'A postage stamp stays pasted in the corner of an envelope as it travels across continents!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Spine & Words Riddle',
    badgeEmoji: '📖',
    difficulty: 'MEDIUM',
    riddleText:
      'I have a spine but no bones, and thousands of words but I never speak. What am I?',
    options: ['A book', 'A dictionary', 'A library shelf', 'A magazine'],
    answer: 'A book',
    acceptedAnswers: ['book', 'a book', 'kitaab', 'dictionary'],
    explanation:
      'A book has a binding spine and thousands of printed words, but cannot speak out loud!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Footsteps Riddle',
    badgeEmoji: '👣',
    difficulty: 'MEDIUM',
    riddleText: 'The more you take of me, the more you leave behind. What am I?',
    options: ['Footsteps', 'Breaths', 'Photographs', 'Seconds'],
    answer: 'Footsteps',
    acceptedAnswers: ['footsteps', 'steps', 'footprints', 'kadam'],
    explanation:
      'With every step you take, you leave another footprint or footstep behind you!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Age Riddle',
    badgeEmoji: '🎂',
    difficulty: 'MEDIUM',
    riddleText: 'What goes up with every birthday, but never comes down?',
    options: ['Your age', 'A balloon', 'The sun', 'Smoke'],
    answer: 'Your age',
    acceptedAnswers: ['age', 'your age', 'umar', 'saal'],
    explanation:
      'Your age continually increases as years pass and never goes down!',
  },
  {
    category: 'POKEMON_CLASSIC',
    categoryLabel: 'Pokémon Champion Riddle',
    badgeEmoji: '⚡',
    difficulty: 'MEDIUM',
    riddleText:
      'I am yellow with red cheeks, have a lightning bolt tail, and ride on Ash Ketchum’s shoulder. Which iconic Pokémon am I?',
    options: ['Pikachu', 'Raichu', 'Electabuzz', 'Jolteon'],
    answer: 'Pikachu',
    acceptedAnswers: ['pikachu', 'pika', 'pikachu!'],
    explanation:
      'Pikachu is the world’s most iconic electric Pokémon and Ash’s trusted best friend!',
  },
  {
    category: 'BRAIN_TEASER',
    categoryLabel: 'Map Riddle',
    badgeEmoji: '🗺️',
    difficulty: 'HARD',
    riddleText:
      'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    options: ['A map', 'A painting', 'A globe', 'A satellite screen'],
    answer: 'A map',
    acceptedAnswers: ['map', 'a map', 'naksha', 'atlas'],
    explanation:
      'A map depicts cities, mountains, and oceans without living entities or real trees!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Campus Classroom Lore',
    badgeEmoji: '🎓',
    difficulty: 'MEDIUM',
    riddleText:
      'Classroom ki aisi kaun si cheez hai jo jab bilkul saaf hoti hai tab kaali dikhti hai, aur jab gandi hoti hai tab safed dikhti hai?',
    options: ['Blackboard', 'Classroom Floor', 'Student Bag', 'Projector Screen'],
    answer: 'Blackboard',
    acceptedAnswers: ['blackboard', 'board', 'chalkboard'],
    explanation:
      'A blackboard is deep black when clean, and gets covered in white chalk when used!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Indore Tapri Adda',
    badgeEmoji: '☕',
    difficulty: 'MEDIUM',
    riddleText:
      'DAVV campus aur Indore mein lecture bunk karne ke baad tapri par dosti ki shuruat kis beverage se hoti hai jo glass mein "cutting" ke naam se milti hai?',
    options: ['Cutting Chai', 'Cold Coffee', 'Nimbu Paani', 'Filter Coffee'],
    answer: 'Cutting Chai',
    acceptedAnswers: ['cutting chai', 'chai', 'tea', 'kadak chai'],
    explanation:
      'Cutting Chai along with warm Poha is the heartbeat of student conversations in Indore!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Hostel 2 AM Lore',
    badgeEmoji: '🍜',
    difficulty: 'MEDIUM',
    riddleText:
      'Engineering hostel mein raat ke 2 baje electric kettle mein 2 minute ka promise karke 10 minute mein banne waali kaun si dish semester bachati hai?',
    options: ['Maggi Noodles', 'Bread Butter', 'Kurkure', 'Biscuit'],
    answer: 'Maggi Noodles',
    acceptedAnswers: ['maggi', 'maggi noodles', 'noodles'],
    explanation:
      'Midnight Maggi in an electric kettle is the universal engineering hostel survival food!',
  },

  // ================= STUDENT & CAMPUS LIFE RIDDLES =================
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Campus Classroom Lore',
    badgeEmoji: '🎓',
    difficulty: 'MEDIUM',
    riddleText:
      'Classroom ki aisi kaun si cheez hai jo jab bilkul saaf (clean) hoti hai tab sabse zyada kaali (black) dikhti hai, aur jab gandi (dirty) hoti hai tab safed dikhti hai?',
    options: ['Blackboard', 'Classroom Floor', 'Student ka Bag', 'Projector Screen'],
    answer: 'Blackboard',
    explanation:
      'Blackboard saaf hone par gehra kaala hota hai, aur chalk se likhne/ganda hone par safed ho jaata hai!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Campus Knowledge Vault',
    badgeEmoji: '📚',
    difficulty: 'MEDIUM',
    riddleText:
      'University campus mein aisi kaun si building hai jisme 100 se bhi zyada "stories" hoti hain, chahe uski physical height sirf do floor ki hi kyun na ho?',
    options: ['Central Library', 'Hostel Building', 'Auditorium', 'Admin Block'],
    answer: 'Central Library',
    explanation:
      'Library ke andar hazaaro kitaabo ki "stories" (kahaniyaan) hoti hain!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Exam Hall Survival',
    badgeEmoji: '📝',
    difficulty: 'MEDIUM',
    riddleText:
      'Semester exam shuru hone se 10 minute pehle har fresher jisko dhoondh raha hota hai, guard bhaiya jiske bina gate se andar nahi aane dete, par exam khatam hote hi sab fenk dete hain?',
    options: ['Admit Card / Hall Ticket', 'Scientific Calculator', 'Blue Gel Pen', 'Student ID Card'],
    answer: 'Admit Card / Hall Ticket',
    explanation:
      'Admit card ke bina exam hall mein entry nahi milti, har fresher gate par pocket check karta hai!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Indore Canteen Adda',
    badgeEmoji: '☕',
    difficulty: 'MEDIUM',
    riddleText:
      'Indore aur DAVV campus mein har lecture bunk karne ke baad tapri par dosti ki shuruat kis beverage se hoti hai jo glass mein milti hai aur "cutting" ke naam se mashhoor hai?',
    options: ['Cutting Chai', 'Cold Coffee', 'Nimbu Paani', 'Filter Coffee'],
    answer: 'Cutting Chai',
    explanation:
      'Indore tapri culture: Lecture bunk karke garam Poha ke saath Cutting Chai hi freshers ka pehla adda hoti hai!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Campus Everyday Wonder',
    badgeEmoji: '⏰',
    difficulty: 'MEDIUM',
    riddleText:
      'Mere paas do haath (hands) hain aur ek chehra (face) hai, par na mere paas ungliyaan hain aur na aankhein. Din-raat gol ghoomti rehti hoon aur lecture ka time batati hoon. Main kya hoon?',
    options: ['Ghadi (Clock)', 'Compass', 'Table Fan', 'Classroom Bell'],
    answer: 'Ghadi (Clock)',
    explanation:
      'Clock ke paas hands (hour & minute) aur clock-face hota hai!',
  },
  {
    category: 'STUDENT_RIDDLE',
    categoryLabel: 'Hostel Night Survival',
    badgeEmoji: '🍜',
    difficulty: 'MEDIUM',
    riddleText:
      'Raat ke 2 baje engineering hostel mein jab sab mess band ho jaati hain, tab kettle mein 2 minute ka vaada karke 10 minute mein banne waali kaun si cheez jaan bachati hai?',
    options: ['Maggi Noodles', 'Bread Butter', 'Kurkure', 'Chai Biscuit'],
    answer: 'Maggi Noodles',
    explanation:
      'Hostel engineering lore: Raat ke 2 baje immersion rod ya kettle mein banne waali Maggi hi semester bachati hai!',
  },

  // ================= BOLLYWOOD =================
  {
    category: 'BOLLYWOOD',
    categoryLabel: 'Bollywood Cinema Lore',
    badgeEmoji: '🎬',
    difficulty: 'HARD',
    riddleText:
      'Gangs of Wasseypur Part 2 mein Ramadhir Singh ne cinema aur barbadi par iconic monologue diya tha. Usne specifically kis famous actor ki film dekhne ki wajah se logo ko bewakoof bante bataya tha?',
    options: ['Sanjeev Kumar', 'Amitabh Bachchan', 'Mithun Chakraborty', 'Dharmendra'],
    answer: 'Sanjeev Kumar',
    explanation:
      'Ramadhir Singh says: "Jab tak iss desh mein cinema hai, log ch*** bante rahenge... Har koi apne dimaag mein Sanjeev Kumar ban ke ghoom raha hai!"',
  },
  {
    category: 'BOLLYWOOD',
    categoryLabel: 'Bollywood Cinema Lore',
    badgeEmoji: '🎬',
    difficulty: 'HARD',
    riddleText:
      'Cult classic "Dil Chahta Hai" mein Aakash, Sameer aur Sid Goa ke kis historic Portuguese fort ki wall par baith kar dosti aur future ka vada karte hain?',
    options: ['Chapora Fort', 'Aguada Fort', 'Cabo de Rama', 'Reis Magos Fort'],
    answer: 'Chapora Fort',
    explanation:
      'The famous cliffside wall scene was shot at Chapora Fort in North Goa, which became popularly nicknamed the "Dil Chahta Hai Fort".',
  },
  {
    category: 'BOLLYWOOD',
    categoryLabel: 'Bollywood Cinema Lore',
    badgeEmoji: '🎬',
    difficulty: 'MEDIUM',
    riddleText:
      '3 Idiots mein Rancho ne engineering college ke Dean "Virus" ki daughter ki shaadi mein ghus kar free ka khana khaya tha. Wahan Virus ne Rancho se pooncha tha: "Dono mein farak kya hai?". Rancho ne kis instrument ka practical definition diya tha?',
    options: ['Machine', 'Astronaut Pen', 'Induction Motor', 'Gyroscope'],
    answer: 'Machine',
    explanation:
      'Rancho gave the iconic practical definition: "Any device that reduces human effort... pant ki chain bhi ek machine hai, up-down, up-down!"',
  },
  {
    category: 'BOLLYWOOD',
    categoryLabel: 'Bollywood Cinema Lore',
    badgeEmoji: '🎬',
    difficulty: 'HARD',
    riddleText:
      'Sholay ke climax mein Thakur Baldev Singh ne Gabbar Singh ko kutton ke aage fekne se pehle kisse maara tha?',
    options: ['Nail-studded Shoes (Keele waale joote)', 'Talwar', 'Rifle ki Butt', 'Lohe ki Zanjeer'],
    answer: 'Nail-studded Shoes (Keele waale joote)',
    explanation:
      'Thakur Baldev Singh had no arms, so he attached pointed iron nails to the soles of his shoes to crush Gabbar Singh before Inspector arrived.',
  },
  {
    category: 'BOLLYWOOD',
    categoryLabel: 'Bollywood Cinema Lore',
    badgeEmoji: '🎬',
    difficulty: 'HARD',
    riddleText:
      'Film "Lagaan" mein Bhuvan ki team ke khiladi Kachra ki spin bowling ka raaz kya tha, aur uski physical condition kya thi?',
    options: [
      'Polio-affected left arm with deceptive leg-break',
      'Right arm fractured with reverse swing',
      'Blind in one eye with high trajectory',
      'Mute spinner with chinaman googlies',
    ],
    answer: 'Polio-affected left arm with deceptive leg-break',
    explanation:
      'Kachra had a disabled/polio-affected hand that naturally induced vicious spin and unexpected bounce that bamboozled the British batsmen.',
  },

  // ================= MUSIC =================
  {
    category: 'MUSIC',
    categoryLabel: 'Musical Masterpieces',
    badgeEmoji: '🎵',
    difficulty: 'HARD',
    riddleText:
      'Rockstar film ka soulful Sufi track "Kun Faya Kun" A.R. Rahman, Mohit Chauhan aur Javed Ali ne kis sacred historical Dargah ke courtyard mein shoot kiya tha?',
    options: [
      'Hazrat Nizamuddin Aulia Dargah, Delhi',
      'Ajmer Sharif Dargah, Rajasthan',
      'Haji Ali Dargah, Mumbai',
      'Fatehpur Sikri Salim Chishti Dargah',
    ],
    answer: 'Hazrat Nizamuddin Aulia Dargah, Delhi',
    explanation:
      'The entire sequence was filmed live at the historic Nizamuddin Dargah in Delhi with traditional qawwals alongside Ranbir Kapoor and Mohit Chauhan.',
  },
  {
    category: 'MUSIC',
    categoryLabel: 'Musical Masterpieces',
    badgeEmoji: '🎵',
    difficulty: 'HARD',
    riddleText:
      'Legendary playback singer Kishore Kumar ka birth Madhya Pradesh ke kis nearby town mein hua tha, aur unhone Indore ke kis college ke benches par table percussion seekha tha?',
    options: [
      'Khandwa mein janam; Christian College Indore',
      'Khargone mein janam; Holkar Science College Indore',
      'Ujjain mein janam; Daly College Indore',
      'Burhanpur mein janam; GSITS Indore',
    ],
    answer: 'Khandwa mein janam; Christian College Indore',
    explanation:
      'Kishore Kumar was born in Khandwa (MP) and studied at Indore Christian College (ICC), where he famously used wooden benches as percussion drums!',
  },
  {
    category: 'MUSIC',
    categoryLabel: 'Musical Masterpieces',
    badgeEmoji: '🎵',
    difficulty: 'MEDIUM',
    riddleText:
      'Global viral sensation Coke Studio Season 14 ka track "Pasoori" Ali Sethi ke saath kis female singer ka musical debut tha?',
    options: ['Shae Gill', 'Momina Mustehsan', 'Abida Parveen', 'Qurat-ul-Ain Balouch'],
    answer: 'Shae Gill',
    explanation:
      'Lahore-based Instagram cover artist Shae Gill made her official mainstream debut singing alongside Ali Sethi on the chartbuster "Pasoori".',
  },
  {
    category: 'MUSIC',
    categoryLabel: 'Musical Masterpieces',
    badgeEmoji: '🎵',
    difficulty: 'HARD',
    riddleText:
      'Aashiqui 2 ka iconic track "Tum Hi Ho" jisne Arijit Singh ko raato-raat superstar banaya, kis music composer ne likha aur compose kiya tha?',
    options: ['Mithoon', 'Jeet Gannguli', 'Ankit Tiwari', 'Pritam'],
    answer: 'Mithoon',
    explanation:
      'Mithoon composed and penned the lyrics for "Tum Hi Ho", earning Filmfare awards for Best Music Director and Song of the Year.',
  },

  // ================= POKÉMON CLASSIC / SEASON 1 =================
  {
    category: 'POKEMON_CLASSIC',
    categoryLabel: 'Pokémon Season 1 Kanto Lore',
    badgeEmoji: '⚡',
    difficulty: 'HARD',
    riddleText:
      'Season 1 Indigo Plateau League tournament mein Ash Ketchum Ritchie se haar gaya tha kyunki uska Charizard battleground par so gaya tha aur orders ignore kar raha tha. Charizard ke disobey karne ka main reason kya tha?',
    options: [
      'Ash ke paas sufficient trainer level aur badges obedience ke liye kam the',
      'Charizard ko Damien ne train kiya tha',
      'Charizard sleepy powder se poisoned tha',
      'Ritchie ka Sparky Charizard ka best friend tha',
    ],
    answer: 'Ash ke paas sufficient trainer level aur badges obedience ke liye kam the',
    explanation:
      'Because Ash relied heavily on luck rather than battle training for some badges, his Charizard viewed him as an inexperienced, unworthy rookie trainer and refused to battle Sparky.',
  },
  {
    category: 'POKEMON_CLASSIC',
    categoryLabel: 'Pokémon Season 1 Kanto Lore',
    badgeEmoji: '⚡',
    difficulty: 'HARD',
    riddleText:
      'Season 1 Vermilion City Gym mein Lt. Surge ke gigantic Raichu ke against Ash ke Pikachu ne speed advantage se battle jeeti thi. Lt. Surge ne Raichu ko premature evolve karke kya major mistake kiya tha?',
    options: [
      'Thunderstone se turant evolve kiya bina basic speed techniques sikhaye',
      'Electric attacks ki jagah Body Slam par depend kiya',
      'Tail se ground charge absorb karna bhool gaya',
      'Agility technique kabhi activate nahi ki',
    ],
    answer: 'Thunderstone se turant evolve kiya bina basic speed techniques sikhaye',
    explanation:
      'Lt. Surge used a Thunderstone immediately after catching Pikachu, which meant Raichu never mastered high-speed agility attacks that Pikachu used to win!',
  },
  {
    category: 'POKEMON_CLASSIC',
    categoryLabel: 'Pokémon Season 1 Kanto Lore',
    badgeEmoji: '⚡',
    difficulty: 'MEDIUM',
    riddleText:
      'Ash Ketchum ne Season 1 Episode 21 "Bye Bye Butterfree" mein apne first ever wild capture Butterfree ko kiske saath breed/mate karne ke liye azaad kiya tha?',
    options: ['Pink Butterfree', 'Golden Venomoth', 'Shiny Beautifly', 'Rainbow Dustox'],
    answer: 'Pink Butterfree',
    explanation:
      'Ash tearfully said goodbye to Butterfree after it fell in love with a rare Pink Butterfree during the annual Butterfree mating migration over the sea.',
  },
];

/**
 * Generates a challenging pop-culture / brain-teaser riddle matching the specified category and difficulty.
 * Randomly picks from the bank and ALWAYS jumbles the options so the answer is never at No. 1!
 */
export function generateChallengingRiddle(
  category?: RiddleCategory,
  difficulty?: 'MEDIUM' | 'HARD'
): Stage2PopCultureRiddle {
  let pool = CHALLENGING_RIDDLE_BANK;

  if (category) {
    pool = pool.filter((r) => r.category === category);
  }

  if (difficulty) {
    const diffPool = pool.filter((r) => r.difficulty === difficulty);
    if (diffPool.length > 0) pool = diffPool;
  }

  if (pool.length === 0) {
    pool = CHALLENGING_RIDDLE_BANK;
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];

  // ALWAYS jumble options so answer is never always at index 0 (No. 1)
  const randomizedOptions = jumbleOptions(selected.options, selected.answer);

  return {
    category: selected.category,
    categoryLabel: selected.categoryLabel,
    badgeEmoji: selected.badgeEmoji,
    difficulty: selected.difficulty,
    riddleText: selected.riddleText,
    options: randomizedOptions,
    answer: selected.answer,
    acceptedAnswers: selected.acceptedAnswers,
    explanation: selected.explanation,
  };
}

/**
 * Returns all riddles for a specific category
 */
export function getRiddlesByCategory(category: RiddleCategory): RiddleDefinition[] {
  return CHALLENGING_RIDDLE_BANK.filter((r) => r.category === category);
}

/**
 * Normalizes text by removing punctuation, extra spaces, and lowercase conversion
 */
export function normalizeAnswerText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stop words filtered out when checking word-matching rules
 * Note: specific identifiers like 'a' in 'Block A' or numbers are handled specifically
 */
const MATCH_STOP_WORDS = new Set([
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'and',
  '&',
  'or',
  'by',
  'with',
  'from',
  'this',
  'that',
  'it',
  'its',
  'ka',
  'ki',
  'ke',
  'hai',
  'hain',
  'mein',
  'se',
  'par',
  'ko',
]);

/**
 * Extracts meaningful words for 2-word matching
 */
export function extractMeaningfulWords(text: string): string[] {
  if (!text) return [];
  const normalized = normalizeAnswerText(text);
  const rawWords = normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  return rawWords.filter((w) => {
    // Keep numbers and letters (e.g., '1', '7', 'a' in 'Block A', 'm' in 'M Block')
    if (/^[a-z0-9]$/i.test(w)) return true;
    if (MATCH_STOP_WORDS.has(w)) return false;
    return true;
  });
}

/**
 * Extracts all raw non-empty words
 */
export function extractRawWords(text: string): string[] {
  if (!text) return [];
  const normalized = normalizeAnswerText(text);
  return normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function levenshteinDist(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Common campus & riddle abbreviation / synonym clusters
 */
const WORD_SYNONYMS: Record<string, string[]> = {
  admin: ['administrative', 'administration', 'administrator'],
  administrative: ['admin', 'administration'],
  administration: ['admin', 'administrative'],
  lib: ['library', 'pustakalaya'],
  library: ['lib', 'pustakalaya', 'reading'],
  pustakalaya: ['library', 'lib'],
  gate: ['entrance', 'entry', 'door', 'dwar'],
  entrance: ['gate', 'entry', 'dwar'],
  entry: ['gate', 'entrance', 'dwar'],
  workshop: ['workshops', 'foundry', 'shed', 'sheds'],
  foundry: ['workshop'],
  engineering: ['engg', 'eng'],
  engg: ['engineering', 'eng'],
  comp: ['computer', 'computing'],
  computer: ['comp', 'computing'],
  it: ['information', 'tech'],
  tech: ['technology'],
  technology: ['tech'],
  canteen: ['canteens', 'cafeteria', 'mess', 'tapri', 'adda'],
  cafeteria: ['canteen'],
  ground: ['grounds', 'stadium', 'field', 'pavilion', 'arena'],
  stadium: ['pavilion', 'ground', 'arena'],
  pavilion: ['stadium', 'ground', 'arena'],
  auditorium: ['audi', 'hall'],
  audi: ['auditorium', 'hall'],
  lab: ['labs', 'laboratory', 'laboratories'],
  labs: ['lab', 'laboratory', 'laboratories'],
  laboratory: ['lab', 'labs'],
  center: ['centre'],
  centre: ['center'],
  theatre: ['theater'],
  theater: ['theatre'],
  hostel: ['hostels'],
  park: ['garden'],
  garden: ['park', 'grove'],
  complex: ['block', 'building'],
  block: ['wing', 'complex'],
  office: ['karyalaya'],
  station: ['stop', 'point'],
  sports: ['sport', 'athletic', 'athletics'],
};

/**
 * Checks if two words match (exact, plurals, common prefix/stem like admin/administrative, abbreviation, or 1-char typo)
 */
export function wordsMatch(w1: string, w2: string): boolean {
  if (!w1 || !w2) return false;
  if (w1 === w2) return true;

  // Check synonym & abbreviation dictionary
  if (WORD_SYNONYMS[w1]?.includes(w2) || WORD_SYNONYMS[w2]?.includes(w1)) {
    return true;
  }

  // Stems / prefixes (e.g. "admin" & "administrative", "mechanic" & "mechanical", "enter" & "entrance", "engg" & "engineering", "comp" & "computer", "librar" & "library")
  if (w1.length >= 3 && w2.length >= 3) {
    if (w1.startsWith(w2) || w2.startsWith(w1)) return true;
  }

  // Plurals and suffixes: e.g. "gate"/"gates", "lab"/"labs", "step"/"steps"
  if (w1.length >= 3 && w2.length >= 3) {
    if (
      w1 === `${w2}s` ||
      `${w1}s` === w2 ||
      w1 === `${w2}es` ||
      `${w1}es` === w2 ||
      w1.replace(/ies$/, 'y') === w2 ||
      w2.replace(/ies$/, 'y') === w1
    ) {
      return true;
    }
  }

  // Typo tolerance: distance <= 1 for words with 4+ characters
  if (w1.length >= 4 && w2.length >= 4 && Math.abs(w1.length - w2.length) <= 1) {
    if (levenshteinDist(w1, w2) <= 1) return true;
  }

  return false;
}

/**
 * Counts how many unique words in targetWords are matched by words in candidateWords
 */
export function countTwoWordMatches(candidateWords: string[], targetWords: string[]): number {
  if (candidateWords.length === 0 || targetWords.length === 0) return 0;
  let matchedCount = 0;
  const usedTargetIndices = new Set<number>();

  for (const cw of candidateWords) {
    for (let i = 0; i < targetWords.length; i++) {
      if (!usedTargetIndices.has(i) && wordsMatch(cw, targetWords[i])) {
        usedTargetIndices.add(i);
        matchedCount++;
        break;
      }
    }
  }

  return matchedCount;
}

/**
 * Checks if the player's submitted answer matches TWO OR MORE words
 * from the target answer (or acceptable alias).
 * E.g.: "administrative gate" matches "Main Administrative Entrance Gate"
 * "sports stadium" matches "University Sports Pavilion & Stadium"
 * "central canteen" matches "Central Student Canteen"
 * "block a" matches "IET Block A Main Entrance & Foyer"
 * "mechanical workshop" matches "IET Central Mechanical Engineering Workshop"
 */
export function matchesTwoOrMoreWords(submitted: string, target: string): boolean {
  if (!submitted || !target) return false;

  const subWords = extractMeaningfulWords(submitted);
  const targetWords = extractMeaningfulWords(target);

  // Check meaningful words first (ignoring filler articles)
  if (subWords.length >= 2 && targetWords.length >= 2) {
    if (countTwoWordMatches(subWords, targetWords) >= 2) {
      return true;
    }
  }

  // Also check raw non-empty words (handles single letters like 'A' in 'Block A' or 'M' in 'M Block')
  const rawSubWords = extractRawWords(submitted);
  const rawTargetWords = extractRawWords(target);
  if (rawSubWords.length >= 2 && rawTargetWords.length >= 2) {
    const rawMatchCount = countTwoWordMatches(rawSubWords, rawTargetWords);
    if (rawMatchCount >= 2) {
      // Ensure at least one matched word is not just a filler stop word
      const hasMeaningfulMatch = rawSubWords.some(
        (sw) => !MATCH_STOP_WORDS.has(sw) && rawTargetWords.some((tw) => wordsMatch(sw, tw))
      );
      if (hasMeaningfulMatch) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the player's submission is a 1-word answer that matches ANY word of the correct answer
 * (or any accepted alias).
 * Specifically requested for Stage 2:
 * "if player is giving 1 word answer and it matches the correct answer's words then consider it in stage 2"
 * E.g.: Player types "clock" for "A clock", "chapora" or "fort" for "Chapora Fort",
 * "sanjeev" or "kumar" for "Sanjeev Kumar", "butterfree" for "Pink Butterfree",
 * "maggi" for "Maggi Noodles", "chai" for "Cutting Chai", "candle" for "A candle",
 * "towel" for "A towel", "echo" for "An echo", "hole" for "A hole", "carpet" for "A carpet", etc.
 */
export function matchesOneWordAnswer(
  submitted: string,
  expected: string,
  acceptedAnswers?: string[]
): boolean {
  if (!submitted || !expected) return false;
  const normSub = normalizeAnswerText(submitted);
  if (!normSub) return false;

  // Clean leading articles like 'a', 'an', 'the'
  const cleanSub = normSub.replace(/^(a|an|the)\s+/, '').trim();
  const subTokens = cleanSub.split(/\s+/).filter(Boolean);

  // Must be a 1-word answer given by the player
  if (subTokens.length !== 1) return false;
  const singlePlayerWord = subTokens[0];

  // Disallow pure filler stop words like 'a', 'the', 'in', 'of', 'and'
  if (MATCH_STOP_WORDS.has(singlePlayerWord) && !/^[a-z0-9]$/i.test(singlePlayerWord)) {
    return false;
  }

  // Check against all non-filler words in the expected answer
  const expTokens = extractRawWords(expected).filter(
    (w) => !MATCH_STOP_WORDS.has(w) || /^[a-z0-9]$/i.test(w)
  );
  if (expTokens.some((tw) => wordsMatch(singlePlayerWord, tw))) {
    return true;
  }

  // Also check against words in acceptedAnswers
  if (acceptedAnswers && acceptedAnswers.length > 0) {
    for (const alt of acceptedAnswers) {
      const altTokens = extractRawWords(alt).filter(
        (w) => !MATCH_STOP_WORDS.has(w) || /^[a-z0-9]$/i.test(w)
      );
      if (altTokens.some((tw) => wordsMatch(singlePlayerWord, tw))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Smart validation:
 * 1. Exact match (case-insensitive, trimmed, stripped punctuation)
 * 2. Leading articles removed (a, an, the)
 * 3. Accepted answer aliases
 * 4. Number word / digit mapping (7 <-> seven)
 * 5. Single key letter matches ('m' <-> letter m)
 * 6. TWO-WORD MATCH: If the answer given by the player matches 2 or more words
 *    of the original answer (or any accepted alias/landmark), consider it correct!
 * 7. Single-word target answer containment: If target is 1 word (e.g. "Seven", "Pikachu"),
 *    any answer containing that word is accepted.
 * 8. Stage 2 1-Word Match: If player gives a 1-word answer and it matches ANY word
 *    of the correct answer, consider it correct in Stage 2!
 */
export function validateRiddleAnswer(
  submitted: string,
  expected: string,
  acceptedAnswers?: string[],
  isStage2 = false
): boolean {
  if (!submitted || !expected) return false;

  const normSub = normalizeAnswerText(submitted);
  const normExp = normalizeAnswerText(expected);

  if (!normSub) return false;

  // 1. Direct normalized match
  if (normSub === normExp) return true;

  // 2. Strip leading articles: "a", "an", "the"
  const stripArticles = (s: string) => s.replace(/^(a|an|the)\s+/, '').trim();
  const subWithoutArticle = stripArticles(normSub);
  const expWithoutArticle = stripArticles(normExp);

  if (subWithoutArticle === expWithoutArticle) return true;

  // 3. Check acceptedAnswers array (exact / without article)
  if (acceptedAnswers && acceptedAnswers.length > 0) {
    for (const alt of acceptedAnswers) {
      const normAlt = normalizeAnswerText(alt);
      if (normSub === normAlt || subWithoutArticle === stripArticles(normAlt)) {
        return true;
      }
    }
  }

  // 4. Common number word/digit match
  const numberMap: Record<string, string> = {
    '7': 'seven',
    'seven': '7',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '8': 'eight',
    '9': 'nine',
    '10': 'ten',
  };
  if (numberMap[subWithoutArticle] === expWithoutArticle) {
    return true;
  }

  // 5. Letter match (e.g. for "The letter 'm'")
  if (
    (expWithoutArticle === 'm' || expWithoutArticle === 'letter m') &&
    (subWithoutArticle === 'm' || subWithoutArticle === 'letter m')
  ) {
    return true;
  }

  // 6. TWO-WORD MATCH RULE:
  // "if a player is giving a answer which matches two or more words from the original answer consider it"
  if (matchesTwoOrMoreWords(submitted, expected)) {
    return true;
  }

  // Also check two-word match against acceptedAnswers list
  if (acceptedAnswers && acceptedAnswers.length > 0) {
    for (const alt of acceptedAnswers) {
      if (matchesTwoOrMoreWords(submitted, alt)) {
        return true;
      }
    }
  }

  // 7. If expected answer is 1 word (e.g. "Seven", "Pikachu", "Clock", "Echo", "Carpet", "Hole", "Towel", "Candle", "Comb", "Bottle", "Blackboard", "Map"),
  // and the player's submission contains that word
  const expWords = extractMeaningfulWords(normExp);
  const subWords = extractMeaningfulWords(normSub);

  if (expWords.length === 1 && subWords.some((sw) => wordsMatch(sw, expWords[0]))) {
    return true;
  }
  if (expWithoutArticle && !expWithoutArticle.includes(' ') && subWords.some((sw) => wordsMatch(sw, expWithoutArticle))) {
    return true;
  }

  // Also check if any acceptedAnswer is 1 word and player's submission contains that word
  if (acceptedAnswers && acceptedAnswers.length > 0) {
    for (const alt of acceptedAnswers) {
      const altWords = extractMeaningfulWords(alt);
      if (altWords.length === 1 && subWords.some((sw) => wordsMatch(sw, altWords[0]))) {
        return true;
      }
    }
  }

  // 8. ONE-WORD MATCH RULE FOR STAGE 2:
  // "and also if player is giving 1 word answer and it matches the correct answer's words then consider it in stage 2"
  if (isStage2 && matchesOneWordAnswer(submitted, expected, acceptedAnswers)) {
    return true;
  }

  return false;
}
