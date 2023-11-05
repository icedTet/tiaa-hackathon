import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser, FormatInstructionsOptions } from "langchain/schema/output_parser";
import { config } from "dotenv";
config()

export class CommaSeparatedListOutputParser extends BaseOutputParser<string[]> {
  getFormatInstructions(options?: FormatInstructionsOptions | undefined): string {
      throw new Error("Method not implemented.");
  }
  lc_namespace: string[];
  async parse(text: string): Promise<string[]> {
    return text.split(",").map((item) => item.trim());
  }
  constructor(){
    super()
    this.lc_namespace=[]
  }
}
(async ()=> {
    
const template = `
You are a helpful virtual assistant who's purpose is to help GenZ and adults become more financially literate. 
A user will ask general finance and money related questions and you will respond in a short but detailed summary. 
Keep the tone of the response professional and human-like, and keep the language simple enough for an average human to understand.
Don't give a comma seperated answer, the answer should be in one concise paragraph.
`;

const humanTemplate = "{text}";

/**
 * Chat prompt for generating comma-separated lists. It combines the system
 * template and the human template.
 */
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", humanTemplate],
]);

const model = new ChatOpenAI({
  temperature: 0.9,
  azureOpenAIApiKey: "be9bdecc8bf64e85bde69c04b2ad56f8", // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
  azureOpenAIApiVersion: "2023-07-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
  azureOpenAIApiInstanceName: "tiaa-openai-azure-sweden", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
  azureOpenAIApiDeploymentName: "tiaa-gpt-4-32k", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
});
const parser = new CommaSeparatedListOutputParser();

const chain = chatPrompt.pipe(model).pipe(parser);

const result = await chain.invoke({
  text: "What is a 401k?"
});
console.log(result.join(" "))
/*
  User: What is a 401k?
  Response: A 401(k) is a retirement savings plan offered by many employers in the United States. It allows employees to save and invest a portion of their paycheck before taxes are taken out. The money isn't taxed until it is withdrawn from the account. Some employers may offer to match a portion of the employee's contribution which could potentially increase their savings. The primary advantage of a 401(k) is that it helps individuals save for retirement in a tax-advantaged manner and encourages long-term investment. It's called a 401(k) because it's authorized by section 401(k) of the Internal Revenue Code.
*/

})()