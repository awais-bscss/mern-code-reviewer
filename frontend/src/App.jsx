import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // aur koi bhi theme use kar sakte ho
import "./App.css";
import axios from "axios";

const App = () => {
  const [code, setCode] = useState(`function greet() {
  console.log("Hello, World!");
}`);

  const [response, setResponse] = useState(
    "AI review output will be shown here..."
  );

  async function handleGenerateReview() {
    try {
      const res = await axios.post("http://localhost:4000/ai/get-review", {
        code,
      });

      if (res.data?.text) {
        setResponse(res.data.text);
      } else if (res.data?.response) {
        setResponse(res.data.response);
      } else {
        setResponse("⚠️ No valid response from server");
      }
    } catch (err) {
      console.error("Error fetching review:", err);
      setResponse("❌ Failed to get AI review.");
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <h2>Your Code</h2>
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={12}
            className="editor"
          />
        </div>

        <div className="buttons">
          <button onClick={handleGenerateReview}>Generate Review</button>
        </div>
      </div>

      <div className="right">
        <h2>AI Response</h2>
        <div className="response">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {response}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default App;
