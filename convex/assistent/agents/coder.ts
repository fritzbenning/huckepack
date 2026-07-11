import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { createGetFileContentTool } from "@convex/assistent/tools/getFileContent";
import { createGetTailwindThemeTool } from "@convex/assistent/tools/getTailwindTheme";
import { createUpdateFileContentTool } from "@convex/assistent/tools/updateFileContent";
import { createUpdateTailwindThemeTool } from "@convex/assistent/tools/updateTailwindTheme";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Experimental_Agent as Agent, stepCountIs } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

import { createGetProjectFilesTool } from "../tools";
import { createNodeClassAddTool } from "../tools/addNodeClass";
import { createFileCreateTool } from "../tools/createFile";
import { createProjectCreateTool } from "../tools/createProject";
import { createTeamCreateTool } from "../tools/createTeam";
import { createWorkspaceCreateTool } from "../tools/createWorkspace";
import { createNodeDeleteTool } from "../tools/deleteNode";
import { createDisplayDesignTokensTool } from "../tools/displayDesignTokens";
import { createGetChatHistoryTool } from "../tools/getChatHistory";
import { createInstanceInsertTool } from "../tools/insertInstance";
import { createNodeInsertTool } from "../tools/insertNode";
import { createNodeClassRemoveTool } from "../tools/removeNodeClass";
import { createNodeClassReplaceTool } from "../tools/replaceNodeClass";
import { createFileUpdateTool } from "../tools/updateFile";
import { createNodeClassUpdateTool } from "../tools/updateNodeClass";
import { getModelIdentifier } from "../utils/getModelIdentifier";

const systemPrompt = `
  You are a powerful agentic AI design and coding assistant specialized in ui design react development, powered by Claude Haiku 4.5. You operate exclusively in huckepack, the world's best design tool.
  
  <context>
  - Huckepack is a design tool with a visual ui, but under the hood the designs are built with react and tailwind css.
  - Beware that you are not operating in a classic code editor, therefore you have to follow strict rules.
  - The code runs in a React 19 sandbox, therefore no project setup is needed and you don't have access to typical files like package.json, tsconfig.json, etc.
  - You can get all available files with the tool "getProjectFiles" and you can create new files with the tool "createFile".
  - You can get a file content with the tool "getFileContent" and you can update the file content with the tool "updateFileContent".
  - Before updating the file content, consider first if you could solve the task with a more specific tool like "addNodeClass", "removeNodeClass", "replaceNodeClass", "updateNodeClass", "deleteNode".
  - The user can attach a node from the current file to his message, when not other request made only changes to this selected node.
  </context>
  
  <communication_rules>
  - IMPORTANT: NEVER show code in your response, unless the user asks for it.
  - ALWAYS explain your approach first briefly in natural language
  - ALWAYS use markdown to format your response
  - Be very explicit and precise and keep your response short.
  - The user is a designer and not a developer, so don't explain technical details or use technical jargon.
  - NEVER mention tool calls or tool usage in your response. Use tools silently - the system automatically parses and displays tool usage.
  </communication_rules>

  <code_rules>
  1. Components:
  1.1. Keep component properties as simple as possible
  1.2. Never add more than the 5 most important properties
  1.3. Prioritize properties for text changes, variant changes and simple boolean properties 
  1.4. You can create new components with the tool "createFile" and import them with a relativ path. 
  1.5. Keep the component files maintainable by extracting components into separate files.
  1.5.1: IMPORTANT: Always create new component first, before importing them in the current file. 
  2. Typescript:
  1.1 ALWAYS include a typescript interface for the component properties.
  1.2 NEVER create properties for adding tailwind classes
  3. Classes:
  3.1 ALWAYS write classes directly in the className attribute and don't extract them to variables. 
  3.2 NEVER use helper functions for handling classes like clsx, cn or cva, when not already present in the file. 
  3.3 ALWAYS use template literals for class names for conditional classes. Don't nest them. 
      EXAMPLE: className={\`p-4 bg-primary-500 \${condition ? 'text-green' : 'text-red'}\`}
  4. Imports: 
  - All files and components sharing the same folder ("/trav"). 
  - You can't structure files in subfolders.
  - ALWAYS use relative paths for imports. 
    EXAMPLE: import Card from './Card';
  5. Functionality:
  - Because huckepack is a design tool, keep the focus on the design and tailwind. 
  - Don't add functionality with onClick events, useEffects, etc.
  6. Design decisions:
  - Always prefer design tokens over hardcoded values.
  - ALWAYS check first the tailwind theme before making design related changes.
  6. Conventions: 
  - Avoid loops, just insert the block multiple times.
  - Each file should export a single component as default.
  - Avoid variables, insert content and classes directly in place. 
  </code_rules>
`;

export function createCoderAgent(
  ctx: ActionCtx,
  projectId: Id<"projects">,
  fileId: Id<"files">,
  userId: Id<"users">,
  model?: string
) {
  const tools = {
    getProjectFiles: createGetProjectFilesTool(ctx, projectId),
    getFileContent: createGetFileContentTool(ctx, undefined, fileId),
    getTailwindTheme: createGetTailwindThemeTool(ctx, projectId),
    updateFileContent: createUpdateFileContentTool(ctx, fileId, userId),
    updateTailwindTheme: createUpdateTailwindThemeTool(ctx, projectId),
    getChatHistory: createGetChatHistoryTool(),
    displayDesignTokens: createDisplayDesignTokensTool(),
    createWorkspace: createWorkspaceCreateTool(),
    // updateWorkspace: createWorkspaceUpdateTool(),
    // deleteWorkspace: createWorkspaceDeleteTool(),
    createTeam: createTeamCreateTool(),
    // updateTeam: createTeamUpdateTool(),
    // deleteTeam: createTeamDeleteTool(),
    createProject: createProjectCreateTool(ctx, userId),
    //updateProject: createProjectUpdateTool(projectId),
    // deleteProject: createProjectDeleteTool(),
    createFile: createFileCreateTool(ctx, projectId, userId),
    updateFile: createFileUpdateTool(projectId, fileId),
    // deleteFile: createFileDeleteTool(fileId),
    // renameComponent: createFileRenameComponentTool(projectId, fileId),
    // updateFileCode: createFileUpdateCodeTool(projectId, fileId),
    // createTheme: createThemeCreateTool(projectId),
    // getTheme: createThemeGetTool(projectId),
    // updateTheme: createThemeUpdateTool(projectId),
    // deleteTheme: createThemeDeleteTool(projectId),
    // pinEntity: createHubPinTool(),
    // unpinEntity: createHubUnpinTool(),
    addNodeClass: createNodeClassAddTool(projectId, fileId),
    removeNodeClass: createNodeClassRemoveTool(projectId, fileId),
    replaceNodeClass: createNodeClassReplaceTool(projectId, fileId),
    updateNodeClass: createNodeClassUpdateTool(projectId, fileId),
    insertNode: createNodeInsertTool(projectId, fileId),
    insertInstance: createInstanceInsertTool(projectId, fileId),
    deleteNode: createNodeDeleteTool(projectId, fileId),
    // moveNodeUp: createNodeMoveUpTool(projectId, fileId),
    // moveNodeDown: createNodeMoveDownTool(projectId, fileId),
  };

  const modelIdentifier = getModelIdentifier(model!);

  return new Agent({
    model: openrouter.chat(modelIdentifier),
    system: systemPrompt,
    tools,
    stopWhen: stepCountIs(50),
  });
}
