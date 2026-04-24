const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const TOPIC_BANK = [
  { id: 1, topic: "You are fitting a classification model to determine whether to offer a discount to a customer.  Your target is whether or not to offer the discount.  Name two models you can use in this scenario.  What metric can you use to evaluate these models against each other?", category: "Classification" },
  { id: 2, topic: "You run a business and are trying to decide whether to go into a particular market.  You build a model to determine the probability of success of the store, and will invest in a given market if the model gives you a high probability.  What is a false positive and a false negative in this scenario?   Explain how you would choose a threshold if you want to avoid false positives?", category: "False Pos" },
  { id: 3, topic: "Name two methods for doing unsupervised learning, or clustering.  Explain the method how you extract clusters from a dendrogram which comes out of a hierarchical clustering exercise.",  category: "Clustering" },
  { id: 4, topic: "Can you explain a situation when you would want to use a lift curve instead of another evaluation curve? ", category: "LiftCurve" },
  { id: 5, topic: "Explain how building training and test sets are different when working with time series data.", category: "TimeSeries" }
];

const TOPICS_PER_SESSION = 2;

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
  let pool = TOPIC_BANK;

  if (topic) {
    pool = TOPIC_BANK.filter(
      (q) => q.topic.toLowerCase() === topic.toLowerCase()
    );
  }

  const numToReturn = parseInt(count) || TOPICS_PER_SESSION;
  const selected = shuffleAndPick(pool, numToReturn);

  res.json({
    success: true,
    total_in_bank: pool.length,
    topics_returned: selected.length,
    topics: selected
  });
});

// Health check endpoint (Railway uses this)
app.get("/", (req, res) => {
  res.json({ status: "ok", questions_in_bank: TOPIC_BANK.length });
});

app.listen(PORT, () => {
  console.log(`Quiz server running on port ${PORT}`);
});
