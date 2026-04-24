const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const QUESTION_BANK = [
  { id: 1, question: "You are fitting a classification model to determine whether to offer a discount to a customer.  Your target is whether or not to offer the discount.  Name two models you can use in this scenario.  What metric can you use to evaluate these models against each other?", topic: "Classification" },
  { id: 2, question: "You run a business and are trying to decide whether to go into a particular market.  You build a model to determine the probability of success of the store, and will invest in a given market if the model gives you a high probability.  What is a false positive and a false negative in this scenario?   Explain how you would choose a threshold if you want to avoid false positives?", topic: "False Pos" },
  { id: 3, question: "Name two methods for doing unsupervised learning, or clustering.  Explain the method how you extract clusters from a dendrogram which comes out of a hierarchical clustering exercise.",  topic: "Clustering" },
  { id: 4, question: "Can you explain a situation when you would want to use a lift curve instead of another evaluation curve? ", topic: "LiftCurve" },
  { id: 5, question: "Explain how building training and test sets are different when working with time series data.", topic: "TimeSeries" }
];

const QUESTIONS_PER_SESSION = 2;

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
