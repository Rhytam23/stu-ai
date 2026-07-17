"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle, XCircle, RotateCcw, ChevronRight, Brain } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    category: "History",
    question: "Who published the foundational paper 'Computing Machinery and Intelligence' in 1950, introducing the Turing Test?",
    options: ["John McCarthy", "Alan Turing", "Marvin Minsky", "Claude Shannon"],
    correct: 1,
    explanation: "Alan Turing published this paper in 1950, proposing the 'imitation game' as a test of machine intelligence. The Dartmouth Conference in 1956, organized by John McCarthy, formally named the field 'Artificial Intelligence'.",
  },
  {
    id: 2,
    category: "History",
    question: "What year did the first major 'AI Winter' begin, following the Lighthill Report's criticism of AI research?",
    options: ["1960", "1969", "1974", "1980"],
    correct: 2,
    explanation: "The first AI Winter began around 1974 following the Lighthill Report in the UK and cuts in US DARPA funding. The report criticized AI research for failing to deliver on its promises.",
  },
  {
    id: 3,
    category: "Machine Learning",
    question: "Which type of machine learning trains an agent by giving it rewards or penalties for actions in an environment?",
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
    correct: 2,
    explanation: "Reinforcement Learning trains agents through trial and error in an environment. DeepMind's AlphaGo and AlphaZero are famous examples that mastered chess and Go through self-play.",
  },
  {
    id: 4,
    category: "Machine Learning",
    question: "In supervised learning, what term describes when a model performs well on training data but poorly on new data?",
    options: ["Underfitting", "Overfitting", "Regularization", "Normalization"],
    correct: 1,
    explanation: "Overfitting occurs when a model memorizes training data instead of learning generalizable patterns. It leads to high accuracy on training data but poor performance on unseen test data.",
  },
  {
    id: 5,
    category: "Machine Learning",
    question: "What optimization algorithm adjusts a model's weights by computing the gradient of the loss function?",
    options: ["Random Search", "Simulated Annealing", "Gradient Descent", "Genetic Algorithm"],
    correct: 2,
    explanation: "Gradient Descent iteratively adjusts model weights in the direction that reduces the loss function. Stochastic Gradient Descent (SGD) and Adam are popular variants used in deep learning.",
  },
  {
    id: 6,
    category: "Deep Learning",
    question: "What was the key algorithm that enabled efficient training of deep neural networks by propagating errors backward?",
    options: ["Forward Propagation", "Backpropagation", "Monte Carlo Method", "Bayesian Inference"],
    correct: 1,
    explanation: "Backpropagation computes gradients by propagating errors from the output layer back to the input layer using the chain rule. It enabled training of multi-layer neural networks at scale.",
  },
  {
    id: 7,
    category: "Deep Learning",
    question: "Which 2012 ImageNet competition winner demonstrated deep learning's power for image recognition?",
    options: ["LeNet", "VGG16", "AlexNet", "ResNet"],
    correct: 2,
    explanation: "AlexNet, developed by Krizhevsky, Sutskever, and Hinton, won the 2012 ImageNet competition with a top-5 error rate of 15.3% — dramatically better than runner-ups. It sparked the deep learning revolution.",
  },
  {
    id: 8,
    category: "Deep Learning",
    question: "What architecture is particularly well-suited for processing sequential data like text and time series?",
    options: ["CNN", "GAN", "RNN/LSTM", "ResNet"],
    correct: 2,
    explanation: "Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) networks process sequential data by maintaining a hidden state that carries information across time steps.",
  },
  {
    id: 9,
    category: "Transformers & LLMs",
    question: "What foundational paper introduced the Transformer architecture in 2017?",
    options: ["BERT: Pre-training of Deep Bidirectional Transformers", "Attention Is All You Need", "Language Models are Few-Shot Learners", "Deep Residual Learning"],
    correct: 1,
    explanation: "'Attention Is All You Need' by Vaswani et al. (2017) introduced the Transformer architecture, replacing recurrent networks with self-attention mechanisms, enabling massive parallel training.",
  },
  {
    id: 10,
    category: "Transformers & LLMs",
    question: "What mechanism in Transformers allows each token to weigh the relevance of all other tokens in a sequence?",
    options: ["Pooling", "Convolution", "Self-Attention", "Normalization"],
    correct: 2,
    explanation: "Self-Attention computes a weighted sum of all token representations, where weights reflect each token's relevance to the current token. This enables capturing long-range dependencies in parallel.",
  },
  {
    id: 11,
    category: "Transformers & LLMs",
    question: "What does RLHF stand for in the context of fine-tuning language models?",
    options: ["Recursive Layer with Hidden Features", "Reinforcement Learning from Human Feedback", "Regularized Language with High Frequency", "Retrieval Learning for Human Functions"],
    correct: 1,
    explanation: "RLHF (Reinforcement Learning from Human Feedback) uses human raters to rank model outputs, then trains a reward model to score responses. The main LLM is then fine-tuned to maximize this reward.",
  },
  {
    id: 12,
    category: "Transformers & LLMs",
    question: "What is the maximum context window of Google's Gemini 1.5 Pro model?",
    options: ["32K tokens", "128K tokens", "512K tokens", "1 million tokens"],
    correct: 3,
    explanation: "Gemini 1.5 Pro supports a context window of up to 1 million tokens, enabling it to process entire codebases, long documents, or hours of video within a single prompt.",
  },
  {
    id: 13,
    category: "Coding Assistants",
    question: "GitHub Copilot is primarily powered by which underlying model?",
    options: ["GPT-3", "Claude", "Codex (GPT-4 Turbo)", "Gemini"],
    correct: 2,
    explanation: "GitHub Copilot uses OpenAI's Codex model (a code-specialized version of GPT), now updated to use GPT-4 Turbo. It provides real-time code completions based on code context in your editor.",
  },
  {
    id: 14,
    category: "Coding Assistants",
    question: "Which IDE-integrated AI tool is known for 'agent mode' that can make multi-file edits across an entire codebase?",
    options: ["Tabnine", "Copilot", "Cursor", "CodeWhisperer"],
    correct: 2,
    explanation: "Cursor is an AI-first code editor (VSCode fork) with an Agent Mode that can plan, write, and execute changes across multiple files simultaneously based on a natural language instruction.",
  },
  {
    id: 15,
    category: "Prompt Engineering",
    question: "Which prompting technique involves providing 2–5 input-output examples before the actual query?",
    options: ["Zero-Shot Prompting", "Few-Shot Prompting", "Chain-of-Thought Prompting", "System Prompting"],
    correct: 1,
    explanation: "Few-Shot Prompting provides several examples of the desired input-output format before the actual request, teaching the model the expected pattern without any fine-tuning.",
  },
  {
    id: 16,
    category: "Prompt Engineering",
    question: "What prompting technique improves complex reasoning by adding 'Think step by step' to the prompt?",
    options: ["Zero-Shot", "Few-Shot", "Chain-of-Thought", "Role Prompting"],
    correct: 2,
    explanation: "Chain-of-Thought (CoT) prompting, introduced by Wei et al. (2022), encourages models to show their reasoning process before producing a final answer, dramatically improving performance on math and logic problems.",
  },
  {
    id: 17,
    category: "AI Safety & Ethics",
    question: "What AI safety concern involves a model generating syntactically correct but logically wrong information confidently?",
    options: ["Bias", "Hallucination", "Data Poisoning", "Prompt Injection"],
    correct: 1,
    explanation: "Hallucination refers to AI models generating plausible-sounding but factually incorrect information. This is a significant concern for code generation, where hallucinated APIs or logic bugs can be hard to spot.",
  },
  {
    id: 18,
    category: "AI Safety & Ethics",
    question: "What practice involves training an LLM on a smaller, domain-specific dataset after initial pre-training?",
    options: ["Pre-training", "Fine-tuning", "Distillation", "Quantization"],
    correct: 1,
    explanation: "Fine-tuning adapts a pre-trained model to a specific domain or task using a smaller labeled dataset. It's far cheaper than training from scratch and enables specialization (e.g., medical, legal, or coding models).",
  },
  {
    id: 19,
    category: "Technical Concepts",
    question: "What does RAG stand for in the context of enhancing LLM accuracy?",
    options: ["Recursive Attention Generation", "Retrieval-Augmented Generation", "Recurrent AI Gateway", "Real-time Answer Grounding"],
    correct: 1,
    explanation: "Retrieval-Augmented Generation (RAG) grounds LLM responses by retrieving relevant documents from a knowledge base before generating an answer. This reduces hallucinations and enables up-to-date information.",
  },
  {
    id: 20,
    category: "Technical Concepts",
    question: "In neural networks, what activation function is commonly used in hidden layers and is defined as f(x) = max(0, x)?",
    options: ["Sigmoid", "Tanh", "ReLU", "Softmax"],
    correct: 2,
    explanation: "ReLU (Rectified Linear Unit) is the most popular activation function in hidden layers. It's computationally efficient and solves the vanishing gradient problem that plagued Sigmoid and Tanh functions in deep networks.",
  },
  {
    id: 21,
    category: "Future of AI",
    question: "What term describes AI systems that can autonomously plan and execute multi-step tasks, using tools and APIs?",
    options: ["Chatbots", "AI Agents", "Expert Systems", "Neural Engines"],
    correct: 1,
    explanation: "AI Agents combine LLMs with tool use, memory, and planning to autonomously execute complex, multi-step tasks. Examples include AutoGPT, LangChain agents, and Gemini's Astra project.",
  },
  {
    id: 22,
    category: "Security",
    question: "Where should API keys like the Gemini API key be stored in a Next.js application?",
    options: ["In client-side JavaScript files", "In the browser's localStorage", "In .env.local as server-side variables", "Hardcoded in the frontend code"],
    correct: 2,
    explanation: "API keys must be stored in .env.local (or equivalent server environment) and accessed only via server-side API routes. They should NEVER appear in client-side code or browser network requests.",
  },
];

function getGrade(score: number, total: number): { letter: string; label: string; color: string } {
  const pct = (score / total) * 100;
  if (pct >= 90) return { letter: "A+", label: "Outstanding!", color: "text-green-400" };
  if (pct >= 80) return { letter: "A", label: "Excellent!", color: "text-emerald-400" };
  if (pct >= 70) return { letter: "B", label: "Good Job!", color: "text-accent-primary" };
  if (pct >= 60) return { letter: "C", label: "Passing", color: "text-yellow-400" };
  if (pct >= 50) return { letter: "D", label: "Keep Studying", color: "text-orange-400" };
  return { letter: "F", label: "Try Again!", color: "text-red-400" };
}

export default function QuizPage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[currentQuestion];
  const total = questions.length;
  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const grade = getGrade(score, total);

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer ?? -1];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestion + 1 >= total) {
      setPhase("results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const restart = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const categories = [...new Set(questions.map((q) => q.category))];

  return (
    <div className="relative min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />

      <PageHero
        badge="Test Your Knowledge"
        title="AI"
        highlight="Quiz"
        subtitle={`${total} questions covering AI history, machine learning, deep learning, LLMs, prompt engineering, and more.`}
        icon={Trophy}
      />

      <div className="max-w-3xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">

          {/* Intro */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-panel rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Questions", value: `${total}` },
                    { label: "Categories", value: `${categories.length}` },
                    { label: "No Time Limit", value: "∞" },
                    { label: "Instant Feedback", value: "✓" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="font-display font-bold text-2xl text-accent-primary">{stat.value}</p>
                      <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Topics Covered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span key={cat} className="text-xs px-3 py-1 rounded-full bg-accent-secondary/15 border border-accent-secondary/25 text-accent-secondary">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPhase("quiz")}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-accent-primary/80 to-accent-secondary/80 hover:from-accent-primary hover:to-accent-secondary text-white font-semibold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(110,231,255,0.2)]"
                >
                  Start Quiz →
                </button>
              </div>
            </motion.div>
          )}

          {/* Quiz */}
          {phase === "quiz" && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Question {currentQuestion + 1} of {total}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent-secondary/15 border border-accent-secondary/25 text-accent-secondary">
                    {q.category}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-accent-primary to-accent-secondary"
                    initial={{ width: `${(currentQuestion / total) * 100}%` }}
                    animate={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-display font-semibold text-xl text-white leading-snug mb-6">
                  {q.question}
                </h2>

                <div className="space-y-3">
                  {q.options.map((option, i) => {
                    let style = "bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:border-white/20 hover:text-white";
                    if (selectedAnswer !== null) {
                      if (i === q.correct) {
                        style = "bg-green-500/15 border-green-500/40 text-green-300";
                      } else if (i === selectedAnswer && i !== q.correct) {
                        style = "bg-red-500/15 border-red-500/40 text-red-300";
                      } else {
                        style = "bg-white/3 border-white/5 text-text-muted opacity-60";
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all duration-200 disabled:cursor-default ${style}`}
                      >
                        <span className="font-semibold mr-2">{["A", "B", "C", "D"][i]}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-5 pt-5 border-t border-white/10 overflow-hidden"
                    >
                      <div className="flex items-start gap-3">
                        {selectedAnswer === q.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-semibold text-sm mb-1 ${selectedAnswer === q.correct ? "text-green-400" : "text-red-400"}`}>
                            {selectedAnswer === q.correct ? "Correct!" : `Incorrect — correct answer: ${["A", "B", "C", "D"][q.correct]}`}
                          </p>
                          <p className="text-text-muted text-sm leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedAnswer !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent-primary/20 border border-accent-primary/40 hover:bg-accent-primary/30 text-accent-primary font-semibold transition-all duration-300"
                >
                  {currentQuestion + 1 >= total ? "See Results" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Results */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score card */}
              <div className="glass-panel rounded-2xl p-8 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-linear-to-tr from-accent-secondary/30 to-accent-primary/30 border-2 border-accent-primary/40 flex items-center justify-center mx-auto"
                >
                  <span className={`font-display font-bold text-4xl ${grade.color}`}>{grade.letter}</span>
                </motion.div>

                <div>
                  <p className={`font-display font-bold text-2xl ${grade.color}`}>{grade.label}</p>
                  <p className="text-text-muted mt-1">
                    You scored <span className="text-white font-semibold">{score}</span> out of{" "}
                    <span className="text-white font-semibold">{total}</span> ({Math.round((score / total) * 100)}%)
                  </p>
                </div>

                {/* Per-category breakdown */}
                <div className="pt-4 border-t border-white/10 space-y-2 text-left">
                  {categories.map((cat) => {
                    const catQs = questions.filter((q) => q.category === cat);
                    const catScore = catQs.filter((q, i) => {
                      const qi = questions.indexOf(q);
                      return answers[qi] === q.correct;
                    }).length;
                    const pct = Math.round((catScore / catQs.length) * 100);
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-xs text-text-muted w-36 shrink-0">{cat}</span>
                        <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-linear-to-r from-accent-secondary to-accent-primary"
                          />
                        </div>
                        <span className="text-xs text-text-muted w-12 text-right">{catScore}/{catQs.length}</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={restart}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/8 border border-white/15 hover:bg-white/12 text-white font-semibold transition-all duration-300 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </div>

              {/* Answer review */}
              <h3 className="font-display font-bold text-xl text-white">Review Your Answers</h3>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct;
                  return (
                    <div
                      key={q.id}
                      className={`glass-panel rounded-xl p-4 border ${isCorrect ? "border-green-500/20" : "border-red-500/20"}`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium mb-1">{q.question}</p>
                          {!isCorrect && (
                            <p className="text-xs text-green-400">
                              Correct: {q.options[q.correct]}
                            </p>
                          )}
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
