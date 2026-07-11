import type { Id } from "@convex/_generated/dataModel";
import { getSelectedNode } from "@editor/canvas";
import { addClass, removeClass, replaceClass, updateClass } from "@editor/class-manager/actions";
import { deleteNode, insertInstance, insertNode, moveNode } from "@editor/node-manager";
import { pinEntity, unpinEntity } from "@hub/pinned-items/actions";
import { createProject, deleteProject, updateProject } from "@hub/projects/actions";
import { createTeam, deleteTeam, updateTeam } from "@hub/teams/actions";
import { createWorkspace, deleteWorkspace, updateWorkspace } from "@hub/workspace/actions";
import { saveFileCode } from "@project/file";
import { createFile, deleteFile, renameComponent, updateFile } from "@project/file/actions";
import { createTheme, deleteTheme, getTheme, updateTheme } from "@project/theme/actions";

export interface ActionDefinition<T = Record<string, unknown>> {
  handler: (params: T) => Promise<unknown>;
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      description: string;
    }
  >;
}

export const actionRegistry = {
  "workspace.create": {
    handler: createWorkspace,
    description: "Create a new workspace",
    parameters: {
      name: { type: "string", description: "Workspace name" },
    },
  },
  "workspace.update": {
    handler: updateWorkspace,
    description: "Update an existing workspace",
    parameters: {
      id: { type: "string", description: "Workspace ID" },
      name: { type: "string", description: "New workspace name" },
    },
  },
  "workspace.delete": {
    handler: deleteWorkspace,
    description: "Delete a workspace",
    parameters: {
      id: { type: "string", description: "Workspace ID" },
    },
  },
  "team.create": {
    handler: createTeam,
    description: "Create a new team within a workspace",
    parameters: {
      workspaceId: { type: "string", description: "Workspace ID" },
      name: { type: "string", description: "Team name" },
    },
  },
  "team.update": {
    handler: updateTeam,
    description: "Update an existing team",
    parameters: {
      id: { type: "string", description: "Team ID" },
      name: { type: "string", description: "New team name" },
    },
  },
  "team.delete": {
    handler: deleteTeam,
    description: "Delete a team",
    parameters: {
      id: { type: "string", description: "Team ID" },
    },
  },
  "project.create": {
    handler: createProject,
    description: "Create a new project within a team",
    parameters: {
      teamId: { type: "string", description: "Team ID" },
      name: { type: "string", description: "Project name" },
      description: { type: "string", description: "Project description (optional)" },
    },
  },
  "project.update": {
    handler: updateProject,
    description: "Update an existing project",
    parameters: {
      id: { type: "string", description: "Project ID" },
      name: { type: "string", description: "New project name (optional)" },
      description: { type: "string", description: "New project description (optional)" },
    },
  },
  "project.delete": {
    handler: deleteProject,
    description: "Delete a project",
    parameters: {
      id: { type: "string", description: "Project ID" },
    },
  },
  "file.create": {
    handler: createFile,
    description: "Create a new file in a project",
    parameters: {
      projectId: { type: "string", description: "Project ID" },
      name: { type: "string", description: "File name" },
      code: { type: "string", description: "Initial file code" },
    },
  },
  "file.update": {
    handler: updateFile,
    description: "Update file metadata (name, tags, etc.)",
    parameters: {
      fileId: { type: "string", description: "File ID" },
      projectId: { type: "string", description: "Project ID" },
      name: { type: "string", description: "New file name (optional)" },
    },
  },
  "file.delete": {
    handler: deleteFile,
    description: "Delete a file from a project",
    parameters: {
      fileId: { type: "string", description: "File ID" },
      projectId: { type: "string", description: "Project ID" },
    },
  },
  "file.renameComponent": {
    handler: renameComponent,
    description: "Rename a React component in a file (updates component name and all JSX references)",
    parameters: {
      fileId: { type: "string", description: "File ID" },
      projectId: { type: "string", description: "Project ID" },
      oldComponentName: { type: "string", description: "Current component name" },
      newComponentName: { type: "string", description: "New component name" },
    },
  },
  "file.updateCode": {
    handler: async (params: { fileId: string; projectId: string; updatedCode: string }) => {
      return saveFileCode({
        projectId: params.projectId,
        fileId: params.fileId as Id<"files">,
        code: params.updatedCode,
      });
    },
    description: "Update the code content of a file",
    parameters: {
      fileId: { type: "string", description: "File ID" },
      projectId: { type: "string", description: "Project ID" },
      updatedCode: { type: "string", description: "New file code" },
    },
  },
  "theme.create": {
    handler: createTheme,
    description: "Create a new theme in a project",
    parameters: {
      projectId: { type: "string", description: "Project ID" },
      name: { type: "string", description: "Theme name" },
      content: { type: "object", description: "Theme CSS content" },
    },
  },
  "theme.get": {
    handler: getTheme,
    description: "Get an existing theme",
    parameters: {
      themeId: { type: "string", description: "Theme ID" },
      projectId: { type: "string", description: "Project ID" },
    },
  },
  "theme.update": {
    handler: updateTheme,
    description: "Update a theme's content",
    parameters: {
      themeId: { type: "string", description: "Theme ID" },
      projectId: { type: "string", description: "Project ID" },
      content: { type: "object", description: "Updated theme CSS content" },
    },
  },
  "theme.delete": {
    handler: deleteTheme,
    description: "Delete a theme",
    parameters: {
      themeId: { type: "string", description: "Theme ID" },
      projectId: { type: "string", description: "Project ID" },
    },
  },
  "hub.pin": {
    handler: pinEntity,
    description: "Pin an entity (workspace, team, project, file) to favorites",
    parameters: {
      entityId: { type: "string", description: "Entity ID (workspace, team, project, or file)" },
      entityType: { type: "string", description: "Type of entity: 'workspace' | 'team' | 'project' | 'file'" },
    },
  },
  "hub.unpin": {
    handler: unpinEntity,
    description: "Unpin an entity from favorites",
    parameters: {
      entityId: { type: "string", description: "Entity ID" },
      entityType: { type: "string", description: "Type of entity: 'workspace' | 'team' | 'project' | 'file'" },
    },
  },
  "node.current.get": {
    handler: getSelectedNode,
    description: "Get the currently selected DOM element in the canvas",
    parameters: {},
  },
  "node.class.add": {
    handler: addClass,
    description: "Add CSS classes to the selected DOM element",
    parameters: {
      className: { type: "string", description: "CSS class name to add" },
      nodeStart: { type: "number", description: "AST node start position" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.class.remove": {
    handler: removeClass,
    description: "Remove CSS classes from the selected DOM element",
    parameters: {
      className: { type: "string", description: "CSS class name to remove" },
      nodeStart: { type: "number", description: "AST node start position" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.class.replace": {
    handler: replaceClass,
    description: "Replace a CSS class with another class on the selected DOM element",
    parameters: {
      oldClassName: { type: "string", description: "CSS class name to replace" },
      newClassName: { type: "string", description: "New CSS class name" },
      nodeStart: { type: "number", description: "AST node start position" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.class.update": {
    handler: updateClass,
    description: "Add and remove CSS classes from the selected DOM element in a single atomic operation",
    parameters: {
      classesToAdd: { type: "array", description: "Array of CSS class names to add" },
      classesToRemove: { type: "array", description: "Array of CSS class names to remove" },
      nodeStart: { type: "number", description: "AST node start position" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.insert": {
    handler: insertNode,
    description:
      "Insert a new HTML/JSX element into the canvas. If a node is selected, inserts as the last child. If no node is selected, inserts at the top level.",
    parameters: {
      elementType: { type: "string", description: "HTML element type (e.g., 'div', 'span', 'button', 'input', 'img')" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
      customClasses: { type: "string", description: "Optional custom CSS classes to apply to the element" },
    },
  },
  "instance.insert": {
    handler: insertInstance,
    description:
      "Insert an existing component instance from the project into the canvas. Adds the import statement and creates a JSX element with mandatory props.",
    parameters: {
      instanceFileId: { type: "string", description: "File ID of the component instance to insert" },
      projectId: { type: "string", description: "Project ID" },
      targetFileId: { type: "string", description: "File ID where the component instance will be inserted" },
    },
  },
  "node.delete": {
    handler: deleteNode,
    description: "Delete a JSX element node from the canvas by its node ID.",
    parameters: {
      nodeId: { type: "string", description: "The ID of the node to delete" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.move.up": {
    handler: (params: { nodeId: string; projectId: string; fileId: string }) =>
      moveNode({ ...params, direction: "up" }),
    description:
      "Move a node up one position in its parent's children array. For flex-col containers, moves visually up. For flex-row containers, moves left.",
    parameters: {
      nodeId: { type: "string", description: "The ID of the node to move" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
  "node.move.down": {
    handler: (params: { nodeId: string; projectId: string; fileId: string }) =>
      moveNode({ ...params, direction: "down" }),
    description:
      "Move a node down one position in its parent's children array. For flex-col containers, moves visually down. For flex-row containers, moves right.",
    parameters: {
      nodeId: { type: "string", description: "The ID of the node to move" },
      projectId: { type: "string", description: "Project ID" },
      fileId: { type: "string", description: "File ID" },
    },
  },
} as const;
