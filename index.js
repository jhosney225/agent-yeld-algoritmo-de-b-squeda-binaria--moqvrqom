
```javascript
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

// Binary search implementation
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  const steps = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = arr[mid];

    steps.push({
      left,
      right,
      mid,
      midValue,
      target,
      comparison: midValue === target ? "found" : midValue < target ? "too small" : "too large",
    });

    if (midValue === target) {
      return { found: true, index: mid, steps };
    } else if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { found: false, index: -1, steps };
}

// Visualize search steps
function visualizeSearch(arr, target, result) {
  console.log("\n" + "=".repeat(60));
  console.log("BINARY SEARCH VISUALIZATION");
  console.log("=".repeat(60));
  console.log(`Array: [${arr.join(", ")}]`);
  console.log(`Target: ${target}`);
  console.log("-".repeat(60));

  result.steps.forEach((step, index) => {
    const visualization = arr
      .map((num, i) => {
        if (i < step.left || i > step.right) return `[${num}]`;
        if (i === step.mid) return `*${num}*`;
        return ` ${num} `;
      })
      .join("");

    console.log(
      `Step ${index + 1}: ${visualization} (mid=${step.midValue}, ${step.comparison})`
    );
  });

  console.log("-".repeat(60));
  if (result.found) {
    console.log(`✓ Found ${target} at index ${result.index}`);
  } else {
    console.log(`✗ ${target} not found in array`);
  }
  console.log("=".repeat(60) + "\n");
}

// Main execution with Claude analysis
async function main() {
  // Test data
  const testCases = [
    { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 7 },
    { arr: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], target: 10 },
    { arr: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], target: 20 },
  ];

  console.log("BINARY SEARCH ALGORITHM WITH CLAUDE ANALYSIS");
  console.log("=" + "=".repeat(59));

  // Process each test case
  for (let i = 0; i < testCases.length; i++) {
    const { arr, target } = testCases[i];
    const result = binarySearch(arr, target);

    // Visualize the search
    visualizeSearch(arr, target, result);

    // Get Claude's analysis
    const prompt = `Analyze this binary search execution:
- Array: [${arr.join(", ")}]
- Target: ${target}
- Result: ${result.found ? `Found at index ${result.index}` : "Not found"}
- Number of steps: ${result.steps.length}
- Time complexity: O(log n)
- Space complexity: O(1)

Provide a brief technical analysis of why binary search is efficient and how it works in this specific case. Keep it concise (2-3 sentences).`;

    try {
      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const analysis = message.content[0].type === "text" ? message.content[0].text : "";

      console.log("CLAUDE'S ANALYSIS:");
      console.log("-".repeat(60));
      console.log(analysis);
      console.log("-".repeat(60) + "\n");
    } catch (error) {
      console.error("Error getting Claude analysis:", error.message);
    }
  }

  // Performance comparison
  console.log("PERFORMANCE METRICS");
  console.log("=".repeat(60));

  const largeArray = Array.from({ length: 1000000 }, (_, i) => i * 2);
  const searchTarget = 999998;

  const startTime = process.hrtime.bigint();
  const largeResult = binarySearch(largeArray, searchTarget);
  const endTime = process.hrtime.bigint();

  const executionTime = Number(endTime - startTime) / 1000;

  console.log(`Array size: ${largeArray.length.toLocaleString()}`);
  console.log(`Search target: ${searchTarget}`);
  console.log(`Steps required: ${largeResult.steps.length}`);
  console.log(`Execution time: ${executionTime.toFixed(3)} microseconds`);
  console.log(`Result: ${largeResult.found ? "Found" : "Not found"}`);
  console.log("=".repeat(60) + "\n");

  // Algorithm explanation with Claude
  const explanationPrompt = `Explain the binary search algorithm in simple terms, including:
1. How it works
2. Why it's efficient (O(log n) complexity)
3. When to use it
Keep the response brief and clear.`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      messages: [