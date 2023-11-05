import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import {
  BaseOutputParser,
  FormatInstructionsOptions,
} from "langchain/schema/output_parser";

export class CommaSeparatedListOutputParser extends BaseOutputParser<string[]> {
  getFormatInstructions(
    options?: FormatInstructionsOptions | undefined
  ): string {
    throw new Error("Method not implemented.");
  }
  lc_namespace: string[];
  async parse(text: string): Promise<string[]> {
    return text.split(",").map((item) => item.trim());
  }
  constructor() {
    super();
    this.lc_namespace = [];
  }
}
export class AIQuestionsHelper {
  static template = `
    You are a helpful virtual assistant who's purpose is to help GenZ and adults become more financially literate. 
    A user will ask general finance and money related questions and you will respond in a short but detailed summary. 
    Keep the tone of the response professional and human-like, and keep the language simple enough for an average human to understand.
    Don't give a comma seperated answer, the answer should be in one concise paragraph.
    `;
  static humanTemplate = "{text}";
  static model = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: "be9bdecc8bf64e85bde69c04b2ad56f8", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: "2023-07-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: "tiaa-openai-azure-sweden", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "tiaa-gpt-4-32k", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
  });
  static parser = new CommaSeparatedListOutputParser();
  static async getAnswer(question: string) {
    const chatPrompt = ChatPromptTemplate.fromMessages([
      ["system", this.template],
      ["human", this.humanTemplate],
    ]);

    const chain = chatPrompt.pipe(this.model).pipe(this.parser);
    const result = await chain.invoke({
      text: question,
    });
    return result.join(" ");
  }
}
