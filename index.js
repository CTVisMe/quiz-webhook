const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const QUESTION_BANK = [
  { id: 1, question: "What is the powerhouse of the cell?", answer: "The mitochondria", topic: "Biology" },
  { id: 2, question: "What is the chemical symbol for gold?", answer: "Au", topic: "Chemistry" },
  { id: 3, question: "In what year did World War II end?", answer: "1945", topic: "History" },
  { id: 4, question: "What is the largest planet in our solar system?", answer: "Jupiter", topic: "Astronomy" },
  { id: 5, question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare", topic: "Literature" },
  { id: 6, question: "What is the square root of 144?", answer: "12", topic: "Math" },
  { id: 7, question: "What gas do plants absorb from the atmosphere?", answer: "Carbon dioxide (CO2)", topic: "Biology" },
  { id: 8, question: "What is the capital of France?", answer: "Paris", topic: "Geography" },
  { id: 9, question: "How many sides does a hexagon have?", answer: "Six", topic: "Math" },
  { id: 10, question: "What is the speed of light in a vacuum (approximately)?", answer: "300,000 kilometers per second", topic: "Physics" },
  { id: 11, question: "Which element has the atomic number 1?", answer: "Hydrogen", topic: "Chemistry" },
  { id: 12, question: "What is the longest river in the world?", answer: "The Nile", topic: "Geography" },
  { id: 13, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", topic: "Art" },
  { id: 14, question: "What is the process by which plants make food using sunlight?", answer: "Photosynthesis", topic: "Biology" },
  { id: 15, question: "What is Newton's First Law of Motion?", answer: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force", topic: "Physics" }
];

const QUESTIONS_PER_SESSION = 5;

function shuffleAndPick(array, count) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.get("/questions", (req, res) => {
  const { topic, count } = req.query;
  let pool = QUESTION_BANK;

  if (topic) {
    pool = QUESTION_BANK.filter(
      (q) => q.topic.toLowerCase() === topic.toLowerCase()
    );
  }

  const numToReturn = parseInt(count) || QUESTIONS_PER_SESSION;
  const selected = shuffleAndPick(pool, numToReturn);

  res.json({
    success: true,
    total_in_bank: pool.length,
    questions_returned: selected.length,
    questions: selected
  });
});

// Health check endpoint (Railway uses this)
app.get("/", (req, res) => {
  res.json({ status: "ok", questions_in_bank: QUESTION_BANK.length });
});

app.listen(PORT, () => {
  console.log(`Quiz server running on port ${PORT}`);
});
