export interface DemoItem {
  id: string;
  label: string;
  data: any;
}

export const DEMO_DATASETS: Record<string, any> = {
  apology: {
    slug: "demo-apology",
    creatorName: "Alex",
    recipientName: "Sujan",
    relationshipType: "best_friend",
    occasion: "apology",
    vibeTheme: "dreamy",
    backgroundType: "sakura",
    isLocked: false,
    isPasswordProtected: false,
    favorites: {
      colorPalette: ["#ec4899", "#8b5cf6", "#3b82f6"],
      moviesAndSeries: ["The Summer I Turned Pretty", "La La Land"],
      insideJokes: ["The 2 AM pizza run incident", "Our unfinished playlist debate"],
    },
    aiGeneratedData: {
      headline: "My Heartfelt Apology to Sujan",
      apologyNarrative: "ACT 1: THE SILENCE\nLooking back at how things unfolded, I realize how much my hasty words hurt. In the rush of the moment, I lost sight of what matters most: your trust and our bond.\n\nACT 2: WHAT WE SHARE\nFrom our late-night conversations about everything and nothing, to the laughter during chaotic road trips, you have always been the person who understands me without words.\n\nACT 3: A PROMISE FOR TOMORROW\nI am truly sorry for letting you down. I promise to listen with an open heart, to value your feelings first, and to rebuild the friendship that means the world to me.",
      popCultureReferences: ["Conrad's infinity necklace", "Midnight city drives"],
      themePreset: "sakura_petals",
      characterAttributes: {
        knownFor: "Unmatched loyalty and honest advice.",
        acclaimedFor: "Brightening any room with your laugh.",
        rememberedFor: "Always standing by friends when it counts.",
      },
      memoriesList: [
        "The stormy afternoon coffee run.",
        "Cheering for each other through exams and milestones.",
        "The inside jokes only we understand."
      ],
      credits: {
        writer: "Alex",
        cast: ["Alex", "Sujan"],
      },
    },
    complimentStars: {
      enabled: true,
      list: [
        { title: "Unwavering Loyalty", text: "You've never abandoned a friend in need, and that is a rare gift." },
        { title: "The Best Laugh", text: "Even on the hardest days, your sense of humor fixes everything." },
        { title: "Quiet Strength", text: "The way you handle challenges with grace constantly inspires me." },
        { title: "Honest Heart", text: "You always speak the truth with kindness, even when it's hard." },
        { title: "True Friendship", text: "Having you in my life has been one of my greatest blessings." },
      ],
    },
    endingSurprise: {
      surpriseType: "scratch",
      surpriseData: {
        text: "I value you more than pride. Coffee and dessert on me whenever you're ready to talk. ☕🍰"
      },
    },
    dateInvitation: {
      enabled: true,
      dateType: "coffee",
      dateName: "Peace & Catch-up Coffee",
      dateDate: "This Weekend",
      nickname: "My Favorite Human",
      letterText: "No pressure, just honest conversation, warm drinks, and starting fresh.",
      response: "pending",
    },
    fontStyle: "romantic",
    songName: "Golden Hour - Acoustic",
  },

  birthday: {
    slug: "demo-birthday",
    creatorName: "Emily",
    recipientName: "Sarah",
    relationshipType: "friend",
    occasion: "birthday",
    vibeTheme: "playful",
    backgroundType: "lanterns",
    isLocked: false,
    isPasswordProtected: false,
    favorites: {
      colorPalette: ["#f59e0b", "#ef4444", "#ec4899"],
      moviesAndSeries: ["Harry Potter", "Friends"],
      insideJokes: ["The karaoke disaster of 2024", "Double espresso mornings"],
    },
    aiGeneratedData: {
      headline: "Wishing Sarah a Magical Birthday! 🌟",
      apologyNarrative: "ACT 1: ANOTHER SOLAR ORBIT\nToday marks 365 new days of your brilliance, laughter, and unmatched energy lighting up the lives of everyone around you.\n\nACT 2: MEMORIES & MILESTONES\nFrom spontaneous road trips to hours spent talking about our wildest dreams, you make ordinary moments feel like movie scenes.\n\nACT 3: HERE'S TO YOUR YEAR\nMay this year bring you boundless happiness, thrilling adventures, and all the success your hard-working heart deserves!",
      popCultureReferences: ["Gryffindor courage", "Central Perk vibes"],
      themePreset: "golden_lanterns",
      characterAttributes: {
        knownFor: "Infectious enthusiasm and radiant warmth.",
        acclaimedFor: "Never giving up on a creative vision.",
        rememberedFor: "Making everyone feel seen and celebrated.",
      },
      memoriesList: [
        "Singing along to our favorite songs in the car.",
        "Celebrating our small and big wins together.",
        "Late-night brainstorming and deep life chats."
      ],
      credits: {
        writer: "Emily",
        cast: ["Emily", "Sarah"],
      },
    },
    complimentStars: {
      enabled: true,
      list: [
        { title: "Radiant Spirit", text: "Your positivity is a breath of fresh air wherever you go." },
        { title: "Brilliant Mind", text: "Your creativity and intelligence never cease to amaze me." },
        { title: "Golden Heart", text: "You celebrate others with genuine happiness and kindness." },
        { title: "Adventurous Soul", text: "You turn every weekend into an unforgettable memory." },
        { title: "The Ultimate Friend", text: "Life is simply better with you by my side." },
      ],
    },
    endingSurprise: {
      surpriseType: "scratch",
      surpriseData: {
        text: "Happy Birthday! Your birthday dinner and concert tickets are on me! 🎂🎟️"
      },
    },
    dateInvitation: {
      enabled: true,
      dateType: "dinner",
      dateName: "Birthday Feast & Celebration",
      dateDate: "Friday Night @ 8 PM",
      nickname: "Birthday Star",
      letterText: "Get dressed up! We're celebrating your special day in style.",
      response: "pending",
    },
    fontStyle: "playful",
    songName: "Celebration - Ambient Strings",
  },

  appreciation: {
    slug: "demo-appreciation",
    creatorName: "David",
    recipientName: "Jessica",
    relationshipType: "coworker",
    occasion: "appreciation",
    vibeTheme: "minimal",
    backgroundType: "constellations",
    isLocked: false,
    isPasswordProtected: false,
    favorites: {
      colorPalette: ["#14b8a6", "#3b82f6", "#6366f1"],
      moviesAndSeries: ["Interstellar", "The Social Network"],
      insideJokes: ["Sprint deadline survival", "The mystery of the broken build"],
    },
    aiGeneratedData: {
      headline: "A Sincere Tribute to Jessica",
      apologyNarrative: "ACT 1: THE UNSUNG HERO\nIn the daily rush of projects and deadlines, true excellence often goes unsaid. Today is dedicated to recognizing everything you bring to the table.\n\nACT 2: LEADERSHIP IN ACTION\nYour calm problem-solving, tireless dedication, and patience have guided us through every tough challenge.\n\nACT 3: GRATITUDE & RESPECT\nThank you for being someone we can always rely on. Working alongside you is an absolute privilege.",
      popCultureReferences: ["Gargantua gravity assist", "Clean architecture mastery"],
      themePreset: "constellation_linker",
      characterAttributes: {
        knownFor: "Precision, empathy, and rock-solid reliability.",
        acclaimedFor: "Fixing complex problems under pressure.",
        rememberedFor: "Lifting teammates up every single day.",
      },
      memoriesList: [
        "Crushing the Q3 launch together.",
        "Brainstorming on whiteboards until everything clicked.",
        "Your encouraging words during difficult milestones."
      ],
      credits: {
        writer: "David",
        cast: ["David", "Jessica"],
      },
    },
    complimentStars: {
      enabled: true,
      list: [
        { title: "Master of Solutions", text: "You always find a clear path through ambiguity." },
        { title: "Empathetic Leader", text: "You listen with patience and support everyone around you." },
        { title: "Inspiring Work Ethic", text: "Your dedication sets the standard for the entire team." },
        { title: "Reliable Anchor", text: "No matter how tight the deadline, you deliver with excellence." },
        { title: "A True Friend", text: "Beyond work, you are someone of extraordinary character." },
      ],
    },
    endingSurprise: {
      surpriseType: "heartbeat",
      surpriseData: {
        text: "Thank you for being extraordinary. The team wouldn't be the same without you! ✨👏"
      },
    },
    fontStyle: "modern",
    songName: "Horizon - Lo-Fi Focus",
  },

  anniversary: {
    slug: "demo-anniversary",
    creatorName: "Liam",
    recipientName: "Sophia",
    relationshipType: "partner",
    occasion: "anniversary",
    vibeTheme: "cinematic",
    backgroundType: "particles",
    isLocked: false,
    isPasswordProtected: false,
    favorites: {
      colorPalette: ["#ef4444", "#ec4899", "#d946ef"],
      moviesAndSeries: ["About Time", "Before Sunrise"],
      insideJokes: ["The train station umbrella", "Our first disastrous cooking attempt"],
    },
    aiGeneratedData: {
      headline: "Our Special Journey Together, Sophia",
      apologyNarrative: "ACT 1: HOW IT BEGAN\nFrom the very first moment our eyes met, life shifted in the most wonderful way. Every day since has been an adventure in love.\n\nACT 2: YEARS OF MEMORIES\nThrough every season, triumph, and quiet evening together, you have been my home, my confidante, and my greatest joy.\n\nACT 3: OUR FOREVER\nHappy Anniversary, my love. Here is to all the chapters we've written, and all the magical ones still waiting for us.",
      popCultureReferences: ["Tim's time travel promise", "Celine & Jesse in Vienna"],
      themePreset: "cosmic_hearts",
      characterAttributes: {
        knownFor: "Unconditional love and gentle grace.",
        acclaimedFor: "Making every house feel like a warm home.",
        rememberedFor: "A smile that melts away every worry.",
      },
      memoriesList: [
        "Walking under the rain with one small umbrella.",
        "Traveling together to places we only dreamed of.",
        "Every quiet morning shared with you."
      ],
      credits: {
        writer: "Liam",
        cast: ["Liam", "Sophia"],
      },
    },
    complimentStars: {
      enabled: true,
      list: [
        { title: "My Guiding Star", text: "Your love brings peace to my heart every single day." },
        { title: "Unmatched Beauty", text: "You are as breathtaking today as the moment I first saw you." },
        { title: "My Best Friend", text: "I can tell you anything, and you understand me completely." },
        { title: "A Kind Soul", text: "Your warmth touches everyone who has the honor of knowing you." },
        { title: "My Forever", text: "Loving you has been the greatest adventure of my life." },
      ],
    },
    endingSurprise: {
      surpriseType: "scratch",
      surpriseData: {
        text: "Happy Anniversary, my love! A weekend getaway is booked for just the two of us. 💖✈️"
      },
    },
    dateInvitation: {
      enabled: true,
      dateType: "dinner",
      dateName: "Candlelight Anniversary Date",
      dateDate: "Saturday Evening",
      nickname: "My Beautiful Partner",
      letterText: "A private table by the water, just for you and me.",
      response: "pending",
    },
    fontStyle: "romantic",
    songName: "Until I Found You - Acoustic",
  },
};
