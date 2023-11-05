import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
// const SyntaxHighlighter = loadable(() => import('./MarkdownRendererComponents/SyntaxHighlighter'))

import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkBreaks from "remark-breaks";
import { EmojiConvertor } from "emoji-js";
import rehypeTwemojify from "rehype-twemojify";
import { useContext, useEffect, useState } from "react";
import { rehypeLinks } from "./MarkdownRendererComponents/RehypeLinks";
import { rehypeIFrames } from "./MarkdownRendererComponents/RehypeIFrames";
import SyntaxHighlighter from "./MarkdownRendererComponents/SyntaxHighlighter";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { ClipboardIcon } from "@heroicons/react/24/outline";
const ranges = [
  "\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]",
  " ", // Also allow spaces
].join("|");

const emojiConverter = new EmojiConvertor();
emojiConverter.replace_mode = "unified";

const recursiveStringifyNode = (node: any) =>
  node?.props?.children
    ? node?.props?.children.map((v: any) => recursiveStringifyNode(v)).join("")
    : node?.props?.alt ?? node;

export const MarkdownRenderer = (props: {
  children: string;
  className?: string;
  destyle?: boolean;
}) => {
  // const [anonymousDark, setAnonymousDark] = useState(null as boolean | null);
  // useEffect(() => {
  //   setAnonymousDark(
  //     window.matchMedia &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches
  //   );
  // }, []);
  const style = prism;
  return (
    <ReactMarkdown
      // plugins={[remarkGfm]}
      // disable linkify
      remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]}
      rehypePlugins={[
        [
          rehypeStringify,
          {
            allowDangerousHtml: true,
            allowDangerousCharacters: true,
            // passThrough:
          },
        ],
        rehypeRaw,
        rehypeKatex,
        [
          rehypeIFrames,
          {
            className: "iframe w-full aspect-video rounded-2xl shadow-lg",
          },
        ],
        // [
        //   rehypeLinks,
        //   {
        //     className: "underline text-primary",
        //   },
        // ],
      ]}
      className={
        !props.destyle
          ? `prose dark:prose dark:prose-invert prose-img:mt-0 prose-img:mb-0 break-words
          prose-pre:p-0
          prose-pre:overflow-auto
          prose-pre:bg-transparent
          prose-pre:margin-0
          hover:prose-a:text-pink-500
          prose-a:transition-all
          ${props.className ?? ""}`
          : `${props.className ?? ""}
          `
      }
      components={{
        //@ts-ignore
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (Array.isArray(children)) {
            if ((children[0] as any)?.props?.children)
              children = recursiveStringifyNode(children[0]);
            // console.log(children)
          }
          // const [copied, setCopied] = useState(false);
          return match ? (
            //@ts-ignore
            <div className="relative p-0 overflow-hidden group shadow-md">
              <SyntaxHighlighter
              //@ts-ignore
                style={vs}
                customStyle={{ wordBreak: "break-word", padding: "1rem" }}
                codeTagProps={{ style: { wordBreak: "break-word" } }}
                language={match[1]}
                PreTag="div"
                {...props}
                wrapLongLines
                className={`relative !font-light`}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
              <div
                className={`absolute -top-20 right-4 group-hover:top-4 transition-all duration-150`}
              >
                <button
                  className={`border p-1 px-2 flex flex-row items-center border-gray-400 text-gray-600  hover:text-gray-50 hover:bg-gray-900 transition-all duration-150 font-wsans text-xs`}
                  onClick={() => {
                    // setCopied(true);
                    navigator.clipboard.writeText(
                      String(children).replace(/\n$/, "")
                    );
                    setTimeout(() => {
                      // setCopied(false);
                    }, 1000);
                  }}
                >
                  <ClipboardIcon className={`w-5 h-5 mr-2`} />
                  {/* {copied ? "Copied!" : "Copy Code"} */}
                </button>
              </div>
            </div>
          ) : (
            <code className={`${className}`} {...props}>
              {children}
            </code>
          );
        },
        img({ node, className, children, ...props }) {
          return (
            <img
              className={`${className}`}
              {...props}
              referrerPolicy="no-referrer"
            />
          );
        },
        iframe({ node, className, children, ...props }) {
          let src = props.src?.substring(2, props.src.length - 1);
          if (src?.match(/^https?:\/\/(www\.)?disadus\.app/)) {
            return null;
          }
          // enable modest branding on youtube iframe
          if (src?.match(/^https?:\/\/(www\.)?youtube(-no-cookie)?\.com/)) {
            src += "&modestbranding=1";
          }
          return (
            <iframe
              className={`${className}`}
              {...props}
              src={src}
              allowFullScreen
              key={src}
            />
          );
        },
      }}
    >
      {emojiConverter.replace_colons(props.children)}
    </ReactMarkdown>
  );
};
export default MarkdownRenderer;
