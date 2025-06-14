
export const getSubjectTopics = (subject: string): string[] => {
  const topics: Record<string, string[]> = {
    "Computer Science": [
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "Databases",
      "Networking",
      "Artificial Intelligence",
      "Machine Learning",
      "Software Engineering",
      "Cybersecurity",
      "Cloud Computing"
    ],
    "Mathematics": [
      "Algebra",
      "Calculus",
      "Geometry",
      "Trigonometry",
      "Statistics",
      "Probability",
      "Discrete Mathematics",
      "Linear Algebra",
      "Differential Equations",
      "Number Theory"
    ],
    "Physics": [
      "Mechanics",
      "Thermodynamics",
      "Electromagnetism",
      "Optics",
      "Quantum Mechanics",
      "Relativity",
      "Nuclear Physics",
      "Particle Physics",
      "Astrophysics",
      "Condensed Matter Physics"
    ],
    "Chemistry": [
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Physical Chemistry",
      "Analytical Chemistry",
      "Biochemistry",
      "Nuclear Chemistry",
      "Polymer Chemistry",
      "Environmental Chemistry",
      "Thermochemistry",
      "Quantum Chemistry"
    ],
    "Biology": [
      "Cell Biology",
      "Genetics",
      "Ecology",
      "Evolution",
      "Anatomy",
      "Physiology",
      "Microbiology",
      "Botany",
      "Zoology",
      "Biochemistry"
    ],
    "History": [
      "Ancient History",
      "Medieval History",
      "Modern History",
      "World War I",
      "World War II",
      "American History",
      "European History",
      "Asian History",
      "African History",
      "Political History"
    ],
    "Literature": [
      "Poetry",
      "Drama",
      "Fiction",
      "Non-Fiction",
      "Literary Theory",
      "American Literature",
      "British Literature",
      "World Literature",
      "Literary Criticism",
      "Comparative Literature"
    ],
    "Business": [
      "Accounting",
      "Finance",
      "Marketing",
      "Management",
      "Economics",
      "Entrepreneurship",
      "Business Law",
      "Human Resources",
      "Operations Management",
      "International Business"
    ]
  };

  return topics[subject] || ["General Knowledge"];
};
