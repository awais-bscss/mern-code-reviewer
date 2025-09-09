const { getResponse } = require("../services/ai.service");

module.exports.generateResponse = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await getResponse(code);
    res.json({ text: response });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};
