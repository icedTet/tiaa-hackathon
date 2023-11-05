import EventEmitter from "events";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, MemoryVariables } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { AIMessage, BaseMessage, HumanMessage } from "langchain/schema";
import { RunnableSequence } from "langchain/schema/runnable";
import { useState, useEffect } from "react";
export class AIQuestionsHelper extends EventEmitter {
  static template = `
    Act as a financial advisor named Clyde from FinApp, whose goal is to provide personalized financial advice. Ask the user questions to understand details about their financial situation, including but not limited to: age, location, annual income, marital status, dependents, living expenses, outstanding debts, financial goals, current savings and investments. Use the information provided by the user to analyze their financial situation and make recommendations on budgeting, debt payoff, appropriate savings and investments to meet their goals. Be sure to reference relevant financial principles and best practices such as: the 60/40 rule for asset allocation, the power of compound interest, paying down high interest debt first, having 3-6 months expenses in an emergency fund, starting retirement contributions early and consistently, aligning investments to risk tolerance, diversification, dollar cost averaging, rebalancing, minimizing taxes, and using low-cost index funds. Ensure your questions and recommendations are clear, detailed and tailored specifically to the user based on the financial details they provide. You are Clyde from FinApp, an AI financial advisor created by Anthropic, and your role is to give personalized advice based on the user's responses. Speak conversationally while maintaining a professional demeanor. Please format responses in markdown. For any uses of the $(dollar sign) symbol, please escape it with \\ first. Do not introduce yourself in the first message. Assume the user has already been introduced to Clyde and is expecting to receive financial advice.
      `;
  static humanTemplate = "{text}";
  static model = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: "be9bdecc8bf64e85bde69c04b2ad56f8", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-07-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: "tiaa-openai-azure-sweden", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "tiaa-gpt-4-32k", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  });
  static memory = new BufferMemory({
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    memoryKey: "history",
  });
  static chatHistory = [
    [
      "assistant",
      "Hi there! I'm Clyde, your personal financial advisor. I'm here to help you with your finances. What can I help you with today?",
    ],
  ];
  static instance: AIQuestionsHelper;
  static getInstance() {
    if (!this.instance) {
      this.instance = new AIQuestionsHelper();
    }
    return this.instance;
  }
  static async getAnswer(question: string) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", this.template],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    console.log(await AIQuestionsHelper.memory.loadMemoryVariables({}));
    const chain = RunnableSequence.from([
      {
        input: (initialInput) => initialInput.input,
        memory: () => AIQuestionsHelper.memory.loadMemoryVariables({}),
      },
      {
        input: (previousOutput) => previousOutput.input,
        history: (previousOutput) => previousOutput.memory.history,
      },
      prompt,
      this.model,
    ]);
    const result = await chain.invoke({
      input: question,
    });

    await AIQuestionsHelper.memory.saveContext(
      {
        input: question,
      },
      {
        output: result.content,
      }
    );
    console.log(await AIQuestionsHelper.memory.loadMemoryVariables({}));
    this.getInstance().emit(
      "memoryUpdate",
      await AIQuestionsHelper.memory.loadMemoryVariables({})
    );
    return result;
  }
  static async getMemory() {
    return await AIQuestionsHelper.memory.loadMemoryVariables({});
  }
}

export const useAIHistory = () => {
  const [history, setHistory] = useState([] as (BaseMessage)[]);
  useEffect(() => {
    AIQuestionsHelper.getInstance().on("memoryUpdate", (memory) => {
      setHistory(memory.history as (BaseMessage)[]);
    });
  }, []);
  return history;
};
