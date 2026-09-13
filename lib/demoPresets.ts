export interface DemoPreset {
  id: string;
  label: string;
  badge: string;
  title: string;
  desc: string;
  themeName: string;
  colors: string[];
  data: any;
}

export const DEMO_PRESETS: Record<string, DemoPreset> = {
  proposal: {
    id: "proposal",
    label: "🌹 Will You Be Mine Forever?",
    badge: "Romantic Love & 'Will You Be Mine Forever?'",
    title: "Will You Be Mine Forever, Sujan? 💖🌹",
    desc: "A breathtaking twilight terrace garden journey with starlight constellations, blooming pink roses, vintage 'For You ♡' love letter, interactive YES button, and Certificate of Forever.",
    themeName: "Twilight Starlight & Rose Terrace",
    colors: ["#fda4af", "#f472b6", "#fbbf24"],
    data: {
      slug: "demo-proposal",
      creatorName: "Adnan",
      recipientName: "Sujan",
      occasion: "proposal",
      websiteType: "proposal",
      relationshipType: "partner",
      vibeTheme: "romantic",
      backgroundType: "particles",
      youtubeUrl: "https://youtu.be/CnEqrgMlWLQ",
      songName: "Romantic Love Melody",
      favorites: {
        colorPalette: ["#f43f5e", "#fda4af", "#e11d48"],
        moviesAndSeries: [],
        insideJokes: []
      },
      proposalData: {
        partnerName: "Sujan",
        partnerNickname: "My Entire Universe",
        proposalType: "forever",
        proposalQuestion: "Will you be mine forever and share all of life's magic with me? 💖",
        headline: "For My Forever, Sujan 🌹",
        storyChapter1Title: "Chapter I: The Day Everything Changed",
        storyChapter1Text: "The moment our paths crossed, the entire world seemed to fade into the background. A single smile from you turned an ordinary day into something pure and cinematic.",
        storyChapter2Title: "Chapter II: The Moments That Built Us",
        storyChapter2Text: "From late-night laughter and shared coffee to quiet moments where words weren't even needed, you became my peace, my home, and my favorite adventure.",
        storyChapter3Title: "Chapter III: The Vow of Forever",
        storyChapter3Text: "I don't just love you for who you are—I love the world we've created together. I choose you today, tomorrow, and through every lifetime.",
        secretLoveNote: "You are the quiet prayer I didn't know I was making, and the greatest blessing I have ever received. Thank you for being my light. Forever yours, Adnan.",
        celebrationDateTitle: "Our Celebration Dinner & Stargazing 🥂",
        celebrationDateTime: "This Saturday at Sunset • The Grand Rooftop",
        enableDodgeButton: true,
        enablePromises: true,
        promises: [
          { title: "To Always Listen", text: "Even in comfortable silence, I promise to hear what your heart doesn't say out loud." },
          { title: "To Stand Beside You in Every Storm", text: "Through sunny days and stormy nights, my hand will always be the one holding yours." },
          { title: "To Never Stop Choosing You", text: "Every morning when I open my eyes, I will choose you all over again, unconditionally." }
        ],
        enableConstellation: true,
        constellationNodes: [
          { title: "The First Spark", subtitle: "Where our paths aligned", quote: "Among billions of people on this planet, our orbits crossed in the most breathtaking way." },
          { title: "The Quiet Sanctuary", subtitle: "Home in each other's eyes", quote: "Realizing that home isn't a place on a map—it's wherever you are standing." },
          { title: "The Eternal Orbit", subtitle: "Forever by your side", quote: "Written in the constellations long before we even knew each other's names." }
        ],
        enableLoveCoupons: true,
        loveCoupons: [
          { badge: "Midnight Escape", title: "1x Stargazing & Hot Cocoa Night", desc: "Valid anytime. Blankets, acoustic melodies, and endless sky under the moon." },
          { badge: "Comfort Pass", title: "1x Endless Warm Hug Whenever Needed", desc: "No questions asked. Just unconditional warmth, peace, and holding you close." },
          { badge: "Spontaneous Vibe", title: "1x Unplanned Road Trip & Sunset Chase", desc: "Pack a mini bag, pick a playlist, and let's drive wherever the road takes us." }
        ],
        enableReasonsWhy: true,
        reasonsWhy: [
          { title: "Your Radiant Smile", desc: "The way your entire face lights up when you're genuinely happy—it's my favorite sight in the world." },
          { title: "Our Quiet Comfort", desc: "How we can sit together for hours without saying a word, yet feel completely understood and at peace." },
          { title: "Our Spontaneous Adventures", desc: "Whether it's a 2 AM drive or a simple grocery run, everything with you feels cinematic." }
        ],
        enableWhispers: true,
        whispers: [
          { title: "On Difficult Days", preview: "When the weight of the world feels heavy...", letter: "Remember that you never have to carry anything alone anymore. You have my hand to hold, my shoulder to lean on, and my heart completely devoted to shielding your peace. You are stronger than you know, and loved more than you can imagine." },
          { title: "The Moment I Knew", preview: "The exact day everything clicked...", letter: "It wasn't during a grand fireworks moment. It was when we were just talking, smiling over something silly, and I looked at you and thought: 'I want this person in every single chapter of my life.' There was no turning back." }
        ],
        enableBucketList: true,
        bucketList: [
          { text: "Watch the Northern Lights wrapped together in one thick wool blanket" },
          { text: "Slow dance barefoot in the warm summer rain with our favorite song playing" },
          { text: "Grow old together and still look at each other with stars in our eyes" }
        ],
        enableMemoryVault: true,
        memoryKeepsakes: [
          { tag: "Day One", title: "The First Smile", desc: "When an ordinary day turned into the start of forever." },
          { tag: "Late Nights", title: "Midnight Conversations", desc: "Talking until 3 AM about everything and nothing." },
          { tag: "Adventures", title: "Chasing Sunsets", desc: "Standing side by side as the sky turned shades of gold and rose." },
          { tag: "Shared Dreams", title: "Quiet Moments Together", desc: "Sitting beside you in comfortable silence, knowing you are my home." }
        ],
        responseStatus: "pending"
      },
      aiGeneratedData: {
        headline: "For My Forever, Sujan 🌹",
        themePreset: "cherry_blossoms",
      },
      status: "sent"
    }
  },

  engagement: {
    id: "engagement",
    label: "💍 Engagement Ceremony",
    badge: "Botanical Garden Ring Ceremony",
    title: "Engagement & Ring Ceremony of Adnan & Sujan 🌿",
    desc: "An airy botanical watercolor garden invitation with sage green wax seal, hand-painted couple artwork, countdown clock, and live guest RSVPs.",
    themeName: "Botanical Sage & Rose Blush",
    colors: ["#2d5a3c", "#556b2f", "#d4a373"],
    data: {
      slug: "demo-engagement",
      creatorName: "Adnan",
      recipientName: "Family & Dear Friends",
      occasion: "engagement",
      websiteType: "engagement",
      relationshipType: "Family & Friends",
      vibeTheme: "dreamy",
      backgroundType: "particles",
      youtubeUrl: "https://youtu.be/Nnop2walGmM",
      songName: "Acoustic Engagement Romance",
      favorites: {
        colorPalette: ["#2d5a3c", "#556b2f", "#d4a373"],
        moviesAndSeries: [],
        insideJokes: []
      },
      weddingData: {
        coupleNames: "Adnan & Sujan",
        invitationType: "engagement",
        weddingDate: "2030-11-20",
        weddingTime: "6:30 PM",
        venueName: "The Botanical Meadow & Garden Lawn",
        venueAddress: "Lakeview Promenade, Rosewood Greens, Grand Celebration Grounds",
        venueMapsUrl: "https://maps.google.com/?q=The+Botanical+Meadow+Garden",
        hostNames: "Together with the Ajmeri & Bhatti Families, cordially invite you to celebrate their ring ceremony",
        hashtag: "#AdnanSujanEngagement",
        guestRsvps: [
          { name: "The Sharma Family", attendance: "attending", headcount: 3, message: "So overjoyed for Adnan & Sujan! Can't wait to celebrate under the garden stars! 🌿💍", submittedAt: new Date() },
          { name: "Uncle Farooq", attendance: "attending", headcount: 2, message: "May your journey together be as timeless and beautiful as this garden! 🌸", submittedAt: new Date() }
        ]
      },
      aiGeneratedData: {
        headline: "Engagement & Ring Ceremony of Adnan & Sujan",
        themePreset: "cherry_blossoms",
      },
      status: "sent"
    }
  },

  wedding: {
    id: "wedding",
    label: "👑 Royal Wedding Invitation",
    badge: "Royal Digital Wedding Invitation",
    title: "The Royal Wedding of Adnan & Sujan 💍",
    desc: "A royal wax-sealed wedding invitation with falling rose petals, live countdown, itinerary cards, and guest RSVP tracking.",
    themeName: "Royal Emerald & Gold",
    colors: ["#f59e0b", "#10b981", "#fbbf24"],
    data: {
      slug: "demo-wedding",
      creatorName: "Adnan",
      recipientName: "Guests & Family",
      occasion: "wedding",
      websiteType: "wedding",
      relationshipType: "Family & Friends",
      vibeTheme: "dreamy",
      backgroundType: "particles",
      youtubeUrl: "https://youtu.be/MPLWw4-q93U",
      songName: "Royal Wedding Song",
      favorites: {
        colorPalette: ["#f59e0b", "#10b981", "#fbbf24"],
        moviesAndSeries: [],
        insideJokes: []
      },
      weddingData: {
        coupleNames: "Adnan & Sujan",
        invitationType: "official",
        weddingDate: "2035-12-18",
        weddingTime: "7:00 PM",
        venueName: "The Royal Grand Palace Ballroom",
        venueAddress: "123 Heritage Palace Boulevard, Grand Celebration Hall",
        venueMapsUrl: "https://maps.google.com/?q=The+Royal+Palace",
        hostNames: "Together with the Ajmeri & Bhatti Families",
        monogram: "A & S",
        groomBio: "Software architect, avid stargazer, and chai enthusiast who loves capturing life's candid moments.",
        brideBio: "Creative designer, classical dance lover, and passionate baker with an infectious smile.",
        itinerary: [
          { title: "Mehndi & Sangeet Night", date: "Friday, Dec 16, 2035", time: "6:30 PM", desc: "An evening filled with music, henna, and dance performances.", icon: "🎵" },
          { title: "The Sacred Wedding Ceremony", date: "Saturday, Dec 17, 2035", time: "11:00 AM", desc: "The auspicious union surrounded by sacred vows and blessings.", icon: "💍" },
          { title: "Grand Royal Reception Dinner", date: "Sunday, Dec 18, 2035", time: "7:30 PM", desc: "Dinner, toasts, and celebrating our new chapter together.", icon: "✨" }
        ],
        guestRsvps: [
          { name: "Farooq Uncle & Family", attendance: "attending", headcount: 4, message: "Congratulations to Adnan and Sujan! May God bless your union with eternal happiness! 💖", submittedAt: new Date() },
          { name: "Zainab Auntie", attendance: "attending", headcount: 2, message: "So happy for you both! Sending all our love and blessings!", submittedAt: new Date() }
        ]
      },
      aiGeneratedData: {
        headline: "The Royal Wedding Celebration of Adnan & Sujan",
        themePreset: "cherry_blossoms",
        apologyNarrative: "Together with our families, we joyfully invite you to celebrate our wedding.[BREAK]Surrounded by love, tradition, and blessings, we begin our new chapter.[BREAK]Please grace the occasion with your presence and blessings.",
        popCultureReferences: [],
        characterAttributes: {
          knownFor: "Warm hospitality and shared smiles.",
          acclaimedFor: "Bringing families together with love.",
          rememberedFor: "A celebration to remember for a lifetime."
        },
        memoriesList: [],
        credits: {
          writer: "Adnan",
          cast: ["Adnan", "Sujan"]
        }
      },
      status: "sent"
    }
  },

  apology: {
    id: "apology",
    label: "🩹 Apology & Reconnect",
    badge: "Apology & Reconciliation",
    title: "My Heartfelt Apology, Sujan",
    desc: "A custom reconciliation website designed to say sorry, featuring soothing raindrops on glass.",
    themeName: "Raindrops on Glass",
    colors: ["#ec4899", "#8b5cf6", "#3b82f6"],
    data: {
      slug: "demo-apology",
      creatorName: "Adnan",
      recipientName: "Sujan",
      occasion: "apology",
      relationshipType: "best_friend",
      vibeTheme: "dreamy",
      backgroundType: "raindrops",
      youtubeUrl: "https://youtu.be/-BjZmE2gtdo",
      songName: "Apology & Heartfelt Melody",
      favorites: {
        colorPalette: ["#ec4899", "#8b5cf6", "#3b82f6"],
        moviesAndSeries: ["Our Favorite Memories", "Late Night Talks"],
        insideJokes: ["The broken umbrella rainy walk", "Our endless memes and banter", "Unspoken understandings"],
      },
      aiGeneratedData: {
        headline: "Because our bond means too much for words to stay unspoken.",
        themePreset: "raindrops",
        apologyNarrative: "Sujan, I've been thinking about where things got messy, and honestly, the silence has been the hardest part. You've always been someone I truly respect and value, and causing any distance between us is the last thing I ever wanted.[BREAK]Looking back at our late-night conversations, the endless inside jokes, and the times you stood by me without asking for anything in return, I realize how irreplaceable your friendship is in my life. The rain outside reminds me that stormy days are temporary, but real connections run deep.[BREAK]I'm genuinely sorry for my part in this. No excuses, just pure accountability from my side. If you're open to it, I would love a fresh start, a clean slate, and a chance to make things right. Whenever you're ready, I'm here.",
        popCultureReferences: ["Late night car rides", "Endless memes", "Unspoken understandings"],
        memoriesList: [
          "The rainy night we laughed till our stomachs hurt",
          "When we promised to always have each other's back",
          "Every quiet moment where words weren't even needed"
        ],
        characterAttributes: {
          knownFor: "Unmatched loyalty and quiet strength.",
          acclaimedFor: "Making everyone around you feel genuinely heard.",
          rememberedFor: "A heart of gold that never holds grudges."
        },
        credits: {
          writer: "Adnan",
          cast: ["Adnan", "Sujan"]
        }
      },
      complimentStars: {
        enabled: true,
        list: [
          { title: "Your Endless Patience", text: "You always listen even when I'm rambling about nothing, Sujan." },
          { title: "The Shared Laughter", text: "No one else understands my weird humor the way you do." },
          { title: "The Unspoken Safe Space", text: "With you, I never had to pretend to be someone I'm not." },
          { title: "Quiet Kindness", text: "You notice the small things about people that others completely miss." },
          { title: "A Bright Future", text: "I hope our friendship still has many more unwritten chapters ahead." }
        ]
      },
      endingSurprise: {
        surpriseType: "scratch",
        surpriseData: {
          secretMessage: "I promise your favorite dinner is on me whenever you're ready to catch up, Sujan. Thank you for reading this. 🤍 — Adnan"
        }
      },
      dateInvitation: {
        enabled: true,
        dateType: "coffee",
        dateName: "Coffee & Long Catchup Walk ☕",
        dateDate: "This upcoming weekend",
        nickname: "Sujan",
        letterText: "Would you be open to grabbing a cup of coffee this weekend? No pressure, just good vibes and catching up.",
        response: "pending"
      },
      status: "sent",
      fontStyle: "romantic"
    }
  },

  birthday_party: {
    id: "birthday_party",
    label: "🎉 Birthday Party Invitation",
    badge: "Birthday Party Celebration Invitation",
    title: "Adnan's 21st Grand Birthday Celebration ✨",
    desc: "A luxury champagne ivory & rose gold invitation with 3D metallic balloons, golden filigree framing, live countdown, and DJ song requests RSVP.",
    themeName: "Champagne & Pearl Gold Theme",
    colors: ["#d4af37", "#f7c6cc", "#eed180"],
    data: {
      slug: "demo-birthday-party",
      creatorName: "Adnan",
      recipientName: "VIP Guests & Friends",
      occasion: "birthday_party",
      websiteType: "birthday_party",
      relationshipType: "Family & Friends",
      vibeTheme: "playful",
      backgroundType: "particles",
      youtubeUrl: "https://youtu.be/4adZ7AguVcw",
      songName: "Happy Birthday Acoustic Romance",
      favorites: {
        colorPalette: ["#d4af37", "#f7c6cc", "#eed180"],
        moviesAndSeries: [],
        insideJokes: []
      },
      birthdayPartyData: {
        birthdayPersonName: "Adnan",
        ageMilestone: "21st Milestone Soirée",
        eventTitle: "Adnan's 21st Grand Birthday Celebration ✨",
        hostNames: "Together with Family & Friends",
        tagline: "Champagne flutes, passed hors d'oeuvres & unforgettable midnight memories under the stars!",
        partyDate: "2027-08-18",
        partyTime: "7:00 PM onwards",
        venueName: "The Grand Imperial Ballroom & Rooftop Terrace",
        venueAddress: "108 Royal Heritage Promenade, Golden Greens, Mumbai",
        venueMapsUrl: "https://maps.google.com/?q=The+Grand+Imperial+Ballroom",
        dressCode: "Champagne Gold & Elegant Pastel Chic ✨",
        specialNotes: "Passed champagne, curated gourmet dining & Valet parking available on arrival.",
        allowDjRequests: true,
        itinerary: [
          { title: "Welcome High Tea & Cocktails 🍸", time: "7:00 PM", desc: "Signature artisanal mocktails, champagne flutes, and hors d'oeuvres." },
          { title: "Grand Birthday Cake Cutting 🎂", time: "8:30 PM", desc: "Gather around for the grand cake cutting and champagne toasts." },
          { title: "Gourmet Dinner & Celebration Toasts 🥂", time: "9:15 PM", desc: "A curated feast with live acoustic melodies and heartfelt toasts." },
          { title: "DJ Music & Dance Floor Open 🪩", time: "10:15 PM", desc: "Celebratory tracks, dancing under the stars, and unforgettable memories." }
        ],
        guestRsvps: [
          { name: "Rahul & Squad", attendance: "attending", headcount: 3, djSong: "Starboy - The Weeknd", message: "Ready to celebrate the legend in royal style! 🥳", submittedAt: new Date() },
          { name: "Sanya M.", attendance: "attending", headcount: 1, djSong: "Levitating - Dua Lipa", message: "Happy 21st! Wouldn't miss this grand celebration for the world! ✨", submittedAt: new Date() }
        ]
      },
      aiGeneratedData: {
        headline: "VIP Birthday Party Invitation",
        themePreset: "cherry_blossoms",
      },
      status: "sent"
    }
  },

  birthday: {
    id: "birthday",
    label: "🎂 Birthday Gift & Wishes",
    badge: "Birthday Gift & Wishes",
    title: "Wishing You a Happy Birthday, Sujan! 🌟",
    desc: "A personalized birthday gift website to celebrate their special day with floating balloons, music, and shared memories.",
    themeName: "Floating Lanterns",
    colors: ["#f59e0b", "#ef4444", "#ec4899"],
    data: {
      slug: "demo-birthday",
      creatorName: "Adnan",
      recipientName: "Sujan",
      occasion: "birthday",
      relationshipType: "friend",
      vibeTheme: "playful",
      backgroundType: "lanterns",
      youtubeUrl: "https://youtu.be/4adZ7AguVcw",
      songName: "Birthday Special Melody",
      favorites: {
        colorPalette: ["#f59e0b", "#ef4444", "#ec4899"],
        moviesAndSeries: ["Epic Roadtrips", "Shared Playlists"],
        insideJokes: ["Dancing in the supermarket", "Spontaneous 2 AM roadtrips", "The shared iced latte obsession"],
      },
      aiGeneratedData: {
        headline: "Another 365 days of making the entire room light up, Sujan.",
        themePreset: "lanterns",
        apologyNarrative: "Happy Birthday Sujan! Watching you conquer this past year has been nothing short of inspiring. You bring a spark of genuine warmth to every single room you walk into.[BREAK]From spontaneous coffee runs to laughing uncontrollably at 2 AM, every single memory with you turns into an unforgettable milestone. You're the kind of friend who turns ordinary moments into cinematic memories.[BREAK]May this upcoming year bring you every bit of happiness, success, and peace that you so effortlessly give to everyone around you. Here's to your biggest, boldest, and brightest year yet!",
        popCultureReferences: ["The ultimate hype friend", "Main character energy", "Iconic laughter"],
        memoriesList: [
          "The roadtrip where our playlist was on repeat for 6 hours",
          "Crying from laughing so hard at 2 AM",
          "Celebrating your biggest wins like they were my own"
        ],
        characterAttributes: {
          knownFor: "Unstoppable positive energy and radiant kindness.",
          acclaimedFor: "Giving the most comforting advice when it matters most.",
          rememberedFor: "Never letting anyone feel left out."
        },
        credits: {
          writer: "Adnan",
          cast: ["Adnan", "Sujan"]
        }
      },
      complimentStars: {
        enabled: true,
        list: [
          { title: "Your Contagious Smile", text: "You have a way of brightening up the gloomiest days effortlessly, Sujan." },
          { title: "Unconditional Support", text: "Thank you for always being in my corner and cheering me on." },
          { title: "Immaculate Vibe", text: "From your energy to your music taste, you're always 100% genuine." },
          { title: "Pure Authenticity", text: "You stay completely true to yourself in a world full of imitations." },
          { title: "The Next Chapter", text: "This year is going to be your absolute biggest and happiest yet!" }
        ]
      },
      endingSurprise: {
        surpriseType: "polaroid",
        surpriseData: {
          caption: "To another year of chaotic memories & unforgettable milestones! 📸✨ — Adnan",
          imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80"
        }
      },
      dateInvitation: {
        enabled: true,
        dateType: "dinner",
        dateName: "Birthday Celebration Dinner & Cake 🎂",
        dateDate: "Friday night at 7:00 PM",
        nickname: "Sujan",
        letterText: "Let me treat you to your favorite dinner and birthday dessert this Friday night to celebrate!",
        response: "pending"
      },
      status: "sent",
      fontStyle: "playful"
    }
  },

  anniversary: {
    id: "anniversary",
    label: "💖 Anniversary Milestone",
    badge: "Anniversary Milestone",
    title: "Our Special Journey Together, Sujan 🌸",
    desc: "A romantic timeline website celebrating anniversaries, with drifting sakura blossom petals.",
    themeName: "Sakura Blossom Drift",
    colors: ["#ef4444", "#ec4899", "#d946ef"],
    data: {
      slug: "demo-anniversary",
      creatorName: "Adnan",
      recipientName: "Sujan",
      occasion: "anniversary",
      relationshipType: "partner",
      vibeTheme: "cinematic",
      backgroundType: "sakura",
      youtubeUrl: "https://youtu.be/HexFqifusOk",
      songName: "Anniversary Love Melody",
      favorites: {
        colorPalette: ["#ef4444", "#ec4899", "#d946ef"],
        moviesAndSeries: ["Our Private Universe", "Stargazing Nights"],
        insideJokes: ["The broken umbrella rainy walk", "Late night tea talks", "Our secret hand squeeze"],
      },
      aiGeneratedData: {
        headline: "To my favorite chapter, my home, and my forever adventure, Sujan.",
        themePreset: "sakura",
        apologyNarrative: "Happy Anniversary, Sujan. Looking back at the day we first crossed paths, I had no idea you would become the most beautiful part of my entire universe.[BREAK]Through every quiet morning, shared cup of tea, and unspoken glance across crowded rooms, you've shown me what real warmth feels like. Falling petals remind me that beauty is in every season we share.[BREAK]Thank you for loving me through all of my seasons and inspiring me to be better every single day. I would choose you over and over again in every lifetime.",
        popCultureReferences: ["The Summer I Turned Pretty infinity necklace", "Paper rings & slow dances", "Our private universe"],
        memoriesList: [
          "Our first rainy walk under that broken umbrella",
          "The night we talked until sunrise without looking at the clock",
          "Every single time your hand found mine in the dark"
        ],
        characterAttributes: {
          knownFor: "A soul as deep and gentle as the ocean.",
          acclaimedFor: "Knowing what I'm thinking with just one look.",
          rememberedFor: "Being my anchor through every storm."
        },
        credits: {
          writer: "Adnan",
          cast: ["Adnan", "Sujan"]
        }
      },
      complimentStars: {
        enabled: true,
        list: [
          { title: "Your Gentle Soul", text: "You love so softly yet so fiercely. It's my favorite thing about you, Sujan." },
          { title: "The Way You Laugh", text: "Hearing you genuinely happy is the sweetest sound in my world." },
          { title: "Safe In Your Presence", text: "Whenever life gets overwhelming, being with you heals everything." },
          { title: "Our Little Inside World", text: "The private jokes only we understand make every day sweeter." },
          { title: "Forever & Always", text: "I love you more today than yesterday, and even more tomorrow." }
        ]
      },
      endingSurprise: {
        surpriseType: "heartbeat",
        surpriseData: {
          secretMessage: "Every heartbeat of mine beats in sync with yours. Happy Anniversary, Sujan. 💖 — Adnan"
        }
      },
      dateInvitation: {
        enabled: true,
        dateType: "romantic",
        dateName: "Candlelight Rooftop Dinner & Stargazing 🌹",
        dateDate: "Saturday night under the stars",
        nickname: "Sujan",
        letterText: "Would you do me the honor of joining me for our anniversary date this Saturday night?",
        response: "pending"
      },
      status: "sent",
      fontStyle: "romantic"
    }
  },

  appreciation: {
    id: "appreciation",
    label: "✨ Gratitude & Appreciation",
    badge: "Gratitude & Appreciation",
    title: "A Tribute to an Incredible Partner, Sujan",
    desc: "A minimal, modern appreciation page expressing gratitude, featuring glowing constellation nodes.",
    themeName: "Cosmic Constellations",
    colors: ["#14b8a6", "#3b82f6", "#6366f1"],
    data: {
      slug: "demo-appreciation",
      creatorName: "Adnan",
      recipientName: "Sujan",
      occasion: "appreciation",
      relationshipType: "friend",
      vibeTheme: "minimal",
      backgroundType: "constellations",
      youtubeUrl: "https://youtu.be/XEkbF_vwnPY",
      songName: "Gratitude & Appreciation Anthem",
      favorites: {
        colorPalette: ["#14b8a6", "#3b82f6", "#6366f1"],
        moviesAndSeries: ["Shared Milestones", "Creative Projects"],
        insideJokes: ["The great coffee machine debate", "Crushing deadlines at 5 PM", "Zero drama energy"],
      },
      aiGeneratedData: {
        headline: "A sincere tribute to someone who always shows up with dedication, Sujan.",
        themePreset: "constellations",
        apologyNarrative: "Sujan, I wanted to take a moment to express some well-deserved appreciation. In the midst of busy schedules and constant momentum, your dedication and positive attitude never go unnoticed.[BREAK]Working alongside you and sharing this journey makes every complex challenge feel manageable and exciting. Thank you for your clarity, your sharp instincts, and your steady support.[BREAK]You're an exceptional companion and a true anchor. Excited for all the amazing milestones, wins, and adventures we'll conquer together in the future!",
        popCultureReferences: ["The real MVP", "Quiet excellence", "Reliable as clockwork"],
        memoriesList: [
          "Crushing our biggest goals under pressure",
          "The great debates over coffee and ideas",
          "Always celebrating each other's wins"
        ],
        characterAttributes: {
          knownFor: "Unshakable calm under pressure.",
          acclaimedFor: "Turning complex chaos into structured brilliance.",
          rememberedFor: "Lifting up everyone around them."
        },
        credits: {
          writer: "Adnan",
          cast: ["Adnan", "Sujan"]
        }
      },
      complimentStars: {
        enabled: true,
        list: [
          { title: "Rock-Solid Reliability", text: "When you're involved, everyone knows things are in the best hands, Sujan." },
          { title: "Steady Anchor", text: "You bring a sense of clarity and purpose to every single challenge." },
          { title: "Creative Insight", text: "You always find a smart, elegant solution when others get stuck." },
          { title: "Generous Nature", text: "Thank you for always taking the time to support and uplift others." },
          { title: "Great Energy", text: "Life and work are simply better and more inspiring with you around!" }
        ]
      },
      endingSurprise: {
        surpriseType: "scratch",
        surpriseData: {
          secretMessage: "Lunch and iced coffee are on me this Friday! Thank you for being such an awesome person, Sujan. 🚀 — Adnan"
        }
      },
      dateInvitation: {
        enabled: true,
        dateType: "lunch",
        dateName: "Celebration Lunch & Coffee ☕",
        dateDate: "Friday at 1:00 PM",
        nickname: "Sujan",
        letterText: "Lunch & coffee are on me this Friday to celebrate your awesome contributions!",
        response: "pending"
      },
      status: "sent",
      fontStyle: "classic"
    }
  }
};
