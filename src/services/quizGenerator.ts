
import { QuizQuestion } from '../types';
import { getSubjectTopics } from './topics';

interface QuestionHistoryItem {
  id: string;
  question: string;
  subject: string;
  difficulty: string;
}

class SessionHistory {
  private questions: QuestionHistoryItem[] = [];

  addQuestion(question: QuizQuestion) {
    this.questions.push({
      id: question.id.toString(),
      question: question.question,
      subject: question.subject,
      difficulty: question.difficulty,
    });
  }

  getQuestions(): QuestionHistoryItem[] {
    return this.questions;
  }

  clearHistory() {
    this.questions = [];
  }
}

class GlobalHistory {
  private questions: QuestionHistoryItem[] = [];

  addQuestion(question: QuizQuestion) {
    this.questions.push({
      id: question.id.toString(),
      question: question.question,
      subject: question.subject,
      difficulty: question.difficulty,
    });
  }

  getQuestions(): QuestionHistoryItem[] {
    return this.questions;
  }
}

export const sessionQuestionHistory = new SessionHistory();
export const globalQuestionHistory = new GlobalHistory();

export const generateQuiz = async (
  subject: string,
  difficulty: string,
  questionCount: number
): Promise<QuizQuestion[]> => {
  console.log(`🎯 Generating quiz: ${subject}, ${difficulty}, ${questionCount} questions`);
  
  // Get subject-specific topics
  const topics = getSubjectTopics(subject);
  console.log(`📚 Available topics for ${subject}:`, topics);
  
  // Get previous questions to avoid repetition
  const sessionHistory = sessionQuestionHistory.getQuestions();
  const globalHistory = globalQuestionHistory.getQuestions();
  const allPreviousQuestions = [...sessionHistory, ...globalHistory];
  
  console.log(`📝 Previous questions count: ${allPreviousQuestions.length}`);
  
  // For now, use fallback questions since API endpoint doesn't exist
  console.log('🔄 Using fallback question generation');
  const questions = getFallbackQuestions(subject, difficulty, questionCount);
  
  // Remove duplicates and validate
  const uniqueQuestions = removeDuplicateQuestions(questions, allPreviousQuestions);
  
  const finalQuestions = uniqueQuestions.slice(0, questionCount);
  
  // Store questions in history
  finalQuestions.forEach(q => {
    sessionQuestionHistory.addQuestion(q);
    globalQuestionHistory.addQuestion(q);
  });
  
  console.log(`✅ Generated ${finalQuestions.length} questions for ${subject} (${difficulty})`);
  return finalQuestions;
};

const removeDuplicateQuestions = (questions: QuizQuestion[], previousQuestions: QuestionHistoryItem[]): QuizQuestion[] => {
  const uniqueQuestions: QuizQuestion[] = [];

  questions.forEach(question => {
    const isDuplicate = previousQuestions.some(
      prevQuestion => question.question === prevQuestion.question
    );

    if (!isDuplicate) {
      uniqueQuestions.push(question);
    }
  });

  return uniqueQuestions;
};

const getFallbackQuestions = (subject: string, difficulty: string, count: number): QuizQuestion[] => {
  console.log(`🔄 Using fallback questions for ${subject} (${difficulty})`);
  
  const fallbackQuestions: Record<string, Record<string, QuizQuestion[]>> = {
    "Computer Science": {
      beginner: [
        {
          id: 'cs-beginner-1',
          question: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language', 
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ],
          correctAnswer: 0,
          explanation: 'HTML stands for Hyper Text Markup Language, which is used to create web pages.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-2',
          question: 'Which of these is a programming language?',
          options: ['Microsoft Word', 'Python', 'Internet Explorer', 'Adobe Photoshop'],
          correctAnswer: 1,
          explanation: 'Python is a popular programming language used for web development, data analysis, and more.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-3',
          question: 'What does CPU stand for?',
          options: ['Computer Processing Unit', 'Central Processing Unit', 'Core Processing Unit', 'Computer Program Unit'],
          correctAnswer: 1,
          explanation: 'CPU stands for Central Processing Unit, which is the main component that executes instructions in a computer.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-4',
          question: 'Which of the following is a web browser?',
          options: ['Microsoft Word', 'Adobe Photoshop', 'Google Chrome', 'Windows Media Player'],
          correctAnswer: 2,
          explanation: 'Google Chrome is a web browser used to access and view websites on the internet.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-5',
          question: 'What does RAM stand for?',
          options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Real Access Memory'],
          correctAnswer: 0,
          explanation: 'RAM stands for Random Access Memory, which temporarily stores data that the CPU needs quick access to.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-6',
          question: 'What is the primary function of an operating system?',
          options: ['Create documents', 'Manage computer hardware and software', 'Browse the internet', 'Play games'],
          correctAnswer: 1,
          explanation: 'An operating system manages computer hardware and software resources and provides common services for programs.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-7',
          question: 'Which file extension is commonly used for images?',
          options: ['.txt', '.exe', '.jpg', '.doc'],
          correctAnswer: 2,
          explanation: '.jpg (or .jpeg) is a common file extension for image files.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        },
        {
          id: 'cs-beginner-8',
          question: 'What does URL stand for?',
          options: ['Universal Resource Locator', 'Uniform Resource Locator', 'United Resource Link', 'Universal Reference Link'],
          correctAnswer: 1,
          explanation: 'URL stands for Uniform Resource Locator, which is the address of a web page.',
          subject: 'Computer Science',
          difficulty: 'beginner'
        }
      ],
      intermediate: [
        {
          id: 'cs-intermediate-1',
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correctAnswer: 1,
          explanation: 'Binary search has O(log n) time complexity because it eliminates half the search space in each iteration.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-2',
          question: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 1,
          explanation: 'A Stack uses Last In, First Out (LIFO) principle where the last element added is the first to be removed.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-3',
          question: 'What is the purpose of a hash table?',
          options: ['Sort data', 'Store data with fast lookup', 'Compress files', 'Send network packets'],
          correctAnswer: 1,
          explanation: 'Hash tables provide fast average-case O(1) lookup, insertion, and deletion operations using hash functions.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-4',
          question: 'Which sorting algorithm has the best worst-case time complexity?',
          options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'],
          correctAnswer: 2,
          explanation: 'Merge Sort has O(n log n) worst-case time complexity, which is optimal for comparison-based sorting.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-5',
          question: 'What is polymorphism in object-oriented programming?',
          options: ['Data hiding', 'Code reusability', 'Multiple forms of methods', 'Memory management'],
          correctAnswer: 2,
          explanation: 'Polymorphism allows objects of different types to be treated as instances of the same type through a common interface.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-6',
          question: 'What is the difference between HTTP and HTTPS?',
          options: ['No difference', 'HTTPS is faster', 'HTTPS is encrypted', 'HTTP is newer'],
          correctAnswer: 2,
          explanation: 'HTTPS (HTTP Secure) uses SSL/TLS encryption to secure data transmission between client and server.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-7',
          question: 'What is a database index?',
          options: ['A backup copy', 'A data structure for faster queries', 'A type of database', 'A security feature'],
          correctAnswer: 1,
          explanation: 'A database index is a data structure that improves the speed of data retrieval operations on a table.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        },
        {
          id: 'cs-intermediate-8',
          question: 'What does API stand for?',
          options: ['Advanced Programming Interface', 'Application Programming Interface', 'Automated Program Integration', 'Application Process Integration'],
          correctAnswer: 1,
          explanation: 'API stands for Application Programming Interface, which allows different software applications to communicate.',
          subject: 'Computer Science',
          difficulty: 'intermediate'
        }
      ],
      advanced: [
        {
          id: 'cs-advanced-1',
          question: 'In distributed systems, what does the CAP theorem state?',
          options: [
            'You can have Consistency, Availability, and Partition tolerance simultaneously',
            'You can only guarantee two out of three: Consistency, Availability, Partition tolerance',
            'Consistency is always more important than Availability',
            'Partition tolerance is impossible to achieve'
          ],
          correctAnswer: 1,
          explanation: 'The CAP theorem states that in a distributed system, you can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance.',
          subject: 'Computer Science',
          difficulty: 'advanced'
        },
        {
          id: 'cs-advanced-2',
          question: 'What is the purpose of a load balancer in system architecture?',
          options: ['Store data', 'Distribute incoming requests across multiple servers', 'Encrypt data', 'Monitor system performance'],
          correctAnswer: 1,
          explanation: 'A load balancer distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.',
          subject: 'Computer Science',
          difficulty: 'advanced'
        },
        {
          id: 'cs-advanced-3',
          question: 'What is eventual consistency in distributed databases?',
          options: ['Data is always consistent', 'Data becomes consistent over time', 'Data is never consistent', 'Data consistency is guaranteed'],
          correctAnswer: 1,
          explanation: 'Eventual consistency guarantees that if no new updates are made, eventually all replicas will converge to the same value.',
          subject: 'Computer Science',
          difficulty: 'advanced'
        }
      ]
    },
    "Mathematics": {
      beginner: [
        {
          id: 'math-beginner-1',
          question: 'What is 15 + 27?',
          options: ['41', '42', '43', '44'],
          correctAnswer: 1,
          explanation: '15 + 27 = 42',
          subject: 'Mathematics',
          difficulty: 'beginner'
        },
        {
          id: 'math-beginner-2',
          question: 'What is 8 × 7?',
          options: ['54', '55', '56', '57'],
          correctAnswer: 2,
          explanation: '8 × 7 = 56',
          subject: 'Mathematics',
          difficulty: 'beginner'
        },
        {
          id: 'math-beginner-3',
          question: 'What is 100 ÷ 4?',
          options: ['20', '25', '30', '35'],
          correctAnswer: 1,
          explanation: '100 ÷ 4 = 25',
          subject: 'Mathematics',
          difficulty: 'beginner'
        },
        {
          id: 'math-beginner-4',
          question: 'What is the area of a rectangle with length 6 and width 4?',
          options: ['20', '24', '28', '32'],
          correctAnswer: 1,
          explanation: 'Area = length × width = 6 × 4 = 24',
          subject: 'Mathematics',
          difficulty: 'beginner'
        }
      ],
      intermediate: [
        {
          id: 'math-intermediate-1',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', 'x²', '2x²'],
          correctAnswer: 1,
          explanation: 'The derivative of x² is 2x using the power rule.',
          subject: 'Mathematics',
          difficulty: 'intermediate'
        },
        {
          id: 'math-intermediate-2',
          question: 'What is the slope of the line y = 3x + 5?',
          options: ['3', '5', '8', '15'],
          correctAnswer: 0,
          explanation: 'In the form y = mx + b, the slope is m, which is 3.',
          subject: 'Mathematics',
          difficulty: 'intermediate'
        },
        {
          id: 'math-intermediate-3',
          question: 'What is the quadratic formula?',
          options: ['x = -b ± √(b² - 4ac) / 2a', 'x = b ± √(b² + 4ac) / 2a', 'x = -b ± √(b² + 4ac) / a', 'x = b ± √(b² - 4ac) / a'],
          correctAnswer: 0,
          explanation: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a for solving ax² + bx + c = 0.',
          subject: 'Mathematics',
          difficulty: 'intermediate'
        }
      ],
      advanced: [
        {
          id: 'math-advanced-1',
          question: 'What is the integral of e^x dx?',
          options: ['e^x + C', 'xe^x + C', 'e^x', 'x²e^x + C'],
          correctAnswer: 0,
          explanation: 'The integral of e^x is e^x + C, as the exponential function is its own derivative and integral.',
          subject: 'Mathematics',
          difficulty: 'advanced'
        }
      ]
    },
    "Chemistry": {
      beginner: [
        {
          id: 'chem-beginner-1',
          question: 'What is the chemical symbol for water?',
          options: ['H₂O', 'CO₂', 'NaCl', 'O₂'],
          correctAnswer: 0,
          explanation: 'Water consists of two hydrogen atoms and one oxygen atom, so its formula is H₂O.',
          subject: 'Chemistry',
          difficulty: 'beginner'
        },
        {
          id: 'chem-beginner-2',
          question: 'How many protons does a carbon atom have?',
          options: ['4', '6', '8', '12'],
          correctAnswer: 1,
          explanation: 'Carbon has an atomic number of 6, which means it has 6 protons.',
          subject: 'Chemistry',
          difficulty: 'beginner'
        },
        {
          id: 'chem-beginner-3',
          question: 'What is the most abundant gas in Earth\'s atmosphere?',
          options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
          correctAnswer: 2,
          explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
          subject: 'Chemistry',
          difficulty: 'beginner'
        },
        {
          id: 'chem-beginner-4',
          question: 'What type of bond forms when electrons are shared between atoms?',
          options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
          correctAnswer: 1,
          explanation: 'Covalent bonds form when atoms share electrons to achieve stable electron configurations.',
          subject: 'Chemistry',
          difficulty: 'beginner'
        },
        {
          id: 'chem-beginner-5',
          question: 'What is the pH of pure water at 25°C?',
          options: ['0', '7', '10', '14'],
          correctAnswer: 1,
          explanation: 'Pure water has a pH of 7, which is neutral (neither acidic nor basic).',
          subject: 'Chemistry',
          difficulty: 'beginner'
        }
      ],
      intermediate: [
        {
          id: 'chem-intermediate-1',
          question: 'What is the molecular geometry of methane (CH₄)?',
          options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'],
          correctAnswer: 2,
          explanation: 'Methane has a tetrahedral geometry with bond angles of approximately 109.5°.',
          subject: 'Chemistry',
          difficulty: 'intermediate'
        },
        {
          id: 'chem-intermediate-2',
          question: 'Which type of reaction is represented by A + B → AB?',
          options: ['Decomposition', 'Single replacement', 'Double replacement', 'Synthesis'],
          correctAnswer: 3,
          explanation: 'A synthesis (combination) reaction occurs when two or more reactants combine to form a single product.',
          subject: 'Chemistry',
          difficulty: 'intermediate'
        },
        {
          id: 'chem-intermediate-3',
          question: 'What is the oxidation state of sulfur in SO₄²⁻?',
          options: ['+4', '+6', '-2', '+2'],
          correctAnswer: 1,
          explanation: 'In SO₄²⁻, oxygen has -2 oxidation state. With 4 oxygens (-8) and overall charge -2, sulfur must be +6.',
          subject: 'Chemistry',
          difficulty: 'intermediate'
        }
      ],
      advanced: [
        {
          id: 'chem-advanced-1',
          question: 'What is the rate-determining step in a multi-step reaction mechanism?',
          options: ['The first step', 'The last step', 'The fastest step', 'The slowest step'],
          correctAnswer: 3,
          explanation: 'The rate-determining step is the slowest step in a reaction mechanism, which controls the overall reaction rate.',
          subject: 'Chemistry',
          difficulty: 'advanced'
        }
      ]
    },
    "Physics": {
      beginner: [
        {
          id: 'phys-beginner-1',
          question: 'What is the unit of force in the SI system?',
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correctAnswer: 1,
          explanation: 'The Newton (N) is the SI unit of force, defined as kg⋅m/s².',
          subject: 'Physics',
          difficulty: 'beginner'
        },
        {
          id: 'phys-beginner-2',
          question: 'What is the acceleration due to gravity on Earth?',
          options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
          correctAnswer: 0,
          explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s².',
          subject: 'Physics',
          difficulty: 'beginner'
        }
      ],
      intermediate: [
        {
          id: 'phys-intermediate-1',
          question: 'What is the speed of light in a vacuum?',
          options: ['3.0 × 10⁸ m/s', '3.0 × 10⁶ m/s', '3.0 × 10¹⁰ m/s', '3.0 × 10⁴ m/s'],
          correctAnswer: 0,
          explanation: 'The speed of light in a vacuum is approximately 3.0 × 10⁸ meters per second.',
          subject: 'Physics',
          difficulty: 'intermediate'
        }
      ],
      advanced: [
        {
          id: 'phys-advanced-1',
          question: 'What does Heisenberg\'s uncertainty principle state?',
          options: [
            'Energy cannot be created or destroyed',
            'Position and momentum cannot both be precisely determined',
            'Mass and energy are equivalent',
            'Time is relative to the observer'
          ],
          correctAnswer: 1,
          explanation: 'Heisenberg\'s uncertainty principle states that the position and momentum of a particle cannot both be precisely determined simultaneously.',
          subject: 'Physics',
          difficulty: 'advanced'
        }
      ]
    }
  };

  const subjectQuestions = fallbackQuestions[subject];
  if (!subjectQuestions) {
    console.warn(`⚠️ No fallback questions for subject: ${subject}`);
    // Create dynamic questions for unknown subjects
    const dynamicQuestions: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      dynamicQuestions.push({
        id: `fallback-${subject}-${difficulty}-${Date.now()}-${i}`,
        question: `What is an important concept in ${subject}?`,
        options: [
          `Basic ${subject} principle`,
          `Advanced ${subject} theory`, 
          `Fundamental ${subject} law`,
          `Core ${subject} concept`
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is a ${difficulty} level question about ${subject}.`,
        subject,
        difficulty
      });
    }
    return dynamicQuestions;
  }

  const difficultyQuestions = subjectQuestions[difficulty] || subjectQuestions['intermediate'] || [];
  
  if (difficultyQuestions.length === 0) {
    // Create fallback if no questions exist for this difficulty
    const fallbackQuestion: QuizQuestion = {
      id: `fallback-${subject}-${difficulty}-${Date.now()}`,
      question: `What is a key principle in ${subject}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: `This is a ${difficulty} level question about ${subject}.`,
      subject,
      difficulty
    };
    return Array(count).fill(null).map((_, index) => ({
      ...fallbackQuestion,
      id: `${fallbackQuestion.id}-${index}`
    }));
  }
  
  const result: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const questionIndex = i % difficultyQuestions.length;
    const baseQuestion = difficultyQuestions[questionIndex];
    // Create a deep copy to avoid circular references
    const question: QuizQuestion = {
      id: `${baseQuestion.id}-${Date.now()}-${i}`,
      question: baseQuestion.question,
      options: [...baseQuestion.options], // Create new array
      correctAnswer: baseQuestion.correctAnswer,
      explanation: baseQuestion.explanation,
      subject: baseQuestion.subject,
      difficulty: baseQuestion.difficulty
    };
    result.push(question);
  }
  
  return result;
};

// Create a service interface for compatibility
export const quizGeneratorService = {
  generateQuiz: async (
    subject: string,
    difficulty: string,
    questionCount: number,
    onProgress?: (progress: number, stage: string) => void
  ) => {
    if (onProgress) {
      onProgress(25, 'Preparing quiz generation...');
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress(75, 'Generating questions...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const result = await generateQuiz(subject, difficulty, questionCount);
    
    if (onProgress) {
      onProgress(100, 'Quiz generation complete!');
    }
    
    return result;
  },
  
  isModelReady: () => {
    // Since we're using fallback questions, the model is always "ready"
    return true;
  }
};

export type { QuizQuestion };
