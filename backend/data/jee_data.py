"""Static JEE domain data: subjects, chapters and pre-loaded YouTube channels."""

SUBJECTS = {
    "physics": {"name": "Physics", "color": "#3B82F6"},
    "chemistry": {"name": "Chemistry", "color": "#10B981"},
    "mathematics": {"name": "Mathematics", "color": "#F59E0B"},
}

# JEE (Main + Advanced) chapter lists per subject.
CHAPTERS = {
    "physics": [
        "Units and Measurements", "Kinematics", "Laws of Motion",
        "Work, Energy and Power", "System of Particles and Rotational Motion",
        "Gravitation", "Mechanical Properties of Solids",
        "Mechanical Properties of Fluids", "Thermal Properties of Matter",
        "Thermodynamics", "Kinetic Theory of Gases", "Oscillations", "Waves",
        "Electrostatics", "Current Electricity", "Moving Charges and Magnetism",
        "Magnetism and Matter", "Electromagnetic Induction",
        "Alternating Current", "Electromagnetic Waves", "Ray Optics",
        "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei",
        "Semiconductor Electronics",
    ],
    "chemistry": [
        "Some Basic Concepts of Chemistry", "Structure of Atom",
        "Classification of Elements and Periodicity", "Chemical Bonding",
        "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions",
        "Hydrogen", "The s-Block Elements", "The p-Block Elements",
        "Organic Chemistry - Basic Principles", "Hydrocarbons",
        "Environmental Chemistry", "Solid State", "Solutions", "Electrochemistry",
        "Chemical Kinetics", "Surface Chemistry",
        "General Principles of Isolation of Elements", "The d- and f-Block Elements",
        "Coordination Compounds", "Haloalkanes and Haloarenes",
        "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids",
        "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life",
    ],
    "mathematics": [
        "Sets, Relations and Functions", "Complex Numbers and Quadratic Equations",
        "Matrices and Determinants", "Permutations and Combinations",
        "Binomial Theorem", "Sequences and Series", "Limits, Continuity and Differentiability",
        "Differential Calculus", "Integral Calculus", "Differential Equations",
        "Coordinate Geometry - Straight Lines", "Circles", "Conic Sections",
        "Three Dimensional Geometry", "Vector Algebra", "Statistics and Probability",
        "Trigonometry", "Inverse Trigonometric Functions", "Mathematical Reasoning",
        "Linear Programming",
    ],
}

# Pre-loaded popular JEE YouTube channels.
# - channel_id: real channel ID used for live API calls (verified via YouTube API).
# - search_name: query used to dynamically re-resolve the channel ID at runtime,
#   so the app keeps working even if an ID ever changes.
# - subscribers: static fallback shown when the YouTube API key is not configured.
CHANNELS = [
    {
        "id": "physics-wallah",
        "name": "Physics Wallah",
        "channel_id": "UCiGyWN6DEbnj2alu7iapuKQ",
        "search_name": "Physics Wallah Alakh Pandey",
        "subject": "all",
        "subscribers": "14.2M",
        "description": "Affordable JEE/NEET prep by Alakh Pandey.",
        "thumbnail": "",
    },
    {
        "id": "vedantu-jee",
        "name": "Vedantu JEE",
        "channel_id": "UCwBfgxcxKUzlhpEMJxWEmdg",
        "search_name": "Vedantu JEE English",
        "subject": "all",
        "subscribers": "327K",
        "description": "Live JEE Main & Advanced classes by Vedantu.",
        "thumbnail": "",
    },
    {
        "id": "unacademy-jee",
        "name": "Unacademy JEE",
        "channel_id": "UCcMU5NE1Lmf4Fqpx7n9F3Sw",
        "search_name": "JEE Nexus by Unacademy",
        "subject": "all",
        "subscribers": "503K",
        "description": "JEE preparation with India's top educators.",
        "thumbnail": "",
    },
    {
        "id": "khan-sir",
        "name": "Khan Sir Patna",
        "channel_id": "UCL77mMHDQV_D2DixeqD1Tyg",
        "search_name": "Khan Sir Patna",
        "subject": "all",
        "subscribers": "5.1M",
        "description": "Concept-first teaching by Khan Sir, Patna.",
        "thumbnail": "",
    },
    {
        "id": "etoos-education",
        "name": "Etoos Education",
        "channel_id": "UCck8RejS9Ug2fbTYcGVBwjA",
        "search_name": "Etoos Education",
        "subject": "all",
        "subscribers": "1.5M",
        "description": "Kota's faculty for JEE Main & Advanced.",
        "thumbnail": "",
    },
]

MOTIVATIONAL_QUOTES = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner. Keep going.",
    "Don't watch the clock; do what it does. Keep going.",
    "JEE is not about being the smartest, it's about being the most consistent.",
    "Every topper was once a beginner who refused to give up.",
    "Hard work beats talent when talent doesn't work hard.",
    "Your only limit is the one you set yourself.",
    "Discipline is choosing between what you want now and what you want most.",
    "One chapter a day keeps the backlog away.",
    "The future belongs to those who prepare for it today.",
]
