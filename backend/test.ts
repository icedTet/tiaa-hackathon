import CsvReadableStream from "csv-reader";
import fs, { readdir, readdirSync, writeFileSync } from "fs";
import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { AIManager } from "./utils/handlers/AIQuestionsThing";
import { BaseMessage } from "langchain/dist/schema";
config();
(async () => {
  const sessionID = await AIManager.getInstance().startSession();
  console.log(sessionID);
  const answerID = await AIManager.getInstance().getAnswer(
    sessionID,
    "Hi there!"
  );
  console.log(answerID);
  AIManager.getInstance().on(answerID, (answer) => console.log(answer));
  AIManager.getInstance().on(
    `${answerID}-end`,
    (memory: { memory: { history: BaseMessage[] } }) => {
      memory.memory.history.map((message) =>
        console.log(message._getType(), message.content)
      );
      AIManager.getInstance()
        .getMemory(sessionID)
        .then((memory) => {
          console.log(memory?.history);
        });
    }
  );

  // console.log(await AIManager.getInstance().getMemory(sessionID));
})();
