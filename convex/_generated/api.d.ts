/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as assistent_agents_briefingAgent from "../assistent/agents/briefingAgent.js";
import type * as assistent_agents_codeAgent from "../assistent/agents/codeAgent.js";
import type * as assistent_agents_coder from "../assistent/agents/coder.js";
import type * as assistent_agents_filePlannerAgent from "../assistent/agents/filePlannerAgent.js";
import type * as assistent_agents_index from "../assistent/agents/index.js";
import type * as assistent_agents_metaEditor from "../assistent/agents/metaEditor.js";
import type * as assistent_agents_projectMetaAgent from "../assistent/agents/projectMetaAgent.js";
import type * as assistent_agents_projectPlannerAgent from "../assistent/agents/projectPlannerAgent.js";
import type * as assistent_http_chat from "../assistent/http/chat.js";
import type * as assistent_http_getClassSuggestions from "../assistent/http/getClassSuggestions.js";
import type * as assistent_http_getTitle from "../assistent/http/getTitle.js";
import type * as assistent_http_imagine from "../assistent/http/imagine.js";
import type * as assistent_imagine_index from "../assistent/imagine/index.js";
import type * as assistent_imagine_orchestrator_index from "../assistent/imagine/orchestrator/index.js";
import type * as assistent_imagine_orchestrator_stream from "../assistent/imagine/orchestrator/stream.js";
import type * as assistent_imagine_orchestrator_types from "../assistent/imagine/orchestrator/types.js";
import type * as assistent_imagine_orchestrator_workflow from "../assistent/imagine/orchestrator/workflow.js";
import type * as assistent_imagine_steps_architecture_config from "../assistent/imagine/steps/architecture/config.js";
import type * as assistent_imagine_steps_architecture_handler from "../assistent/imagine/steps/architecture/handler.js";
import type * as assistent_imagine_steps_architecture_index from "../assistent/imagine/steps/architecture/index.js";
import type * as assistent_imagine_steps_architecture_stream from "../assistent/imagine/steps/architecture/stream.js";
import type * as assistent_imagine_steps_files_config from "../assistent/imagine/steps/files/config.js";
import type * as assistent_imagine_steps_files_handler from "../assistent/imagine/steps/files/handler.js";
import type * as assistent_imagine_steps_files_index from "../assistent/imagine/steps/files/index.js";
import type * as assistent_imagine_steps_files_stream from "../assistent/imagine/steps/files/stream.js";
import type * as assistent_imagine_steps_metadata_config from "../assistent/imagine/steps/metadata/config.js";
import type * as assistent_imagine_steps_metadata_handler from "../assistent/imagine/steps/metadata/handler.js";
import type * as assistent_imagine_steps_metadata_index from "../assistent/imagine/steps/metadata/index.js";
import type * as assistent_imagine_steps_planning_config from "../assistent/imagine/steps/planning/config.js";
import type * as assistent_imagine_steps_planning_handler from "../assistent/imagine/steps/planning/handler.js";
import type * as assistent_imagine_steps_planning_index from "../assistent/imagine/steps/planning/index.js";
import type * as assistent_imagine_steps_rebriefing_config from "../assistent/imagine/steps/rebriefing/config.js";
import type * as assistent_imagine_steps_rebriefing_handler from "../assistent/imagine/steps/rebriefing/handler.js";
import type * as assistent_imagine_steps_rebriefing_index from "../assistent/imagine/steps/rebriefing/index.js";
import type * as assistent_imagine_steps_setup_config from "../assistent/imagine/steps/setup/config.js";
import type * as assistent_imagine_steps_setup_handler from "../assistent/imagine/steps/setup/handler.js";
import type * as assistent_imagine_steps_setup_index from "../assistent/imagine/steps/setup/index.js";
import type * as assistent_imagine_types_index from "../assistent/imagine/types/index.js";
import type * as assistent_imagine_utils_errorHandlers from "../assistent/imagine/utils/errorHandlers.js";
import type * as assistent_imagine_utils_extractPrompt from "../assistent/imagine/utils/extractPrompt.js";
import type * as assistent_imagine_utils_promptTemplate from "../assistent/imagine/utils/promptTemplate.js";
import type * as assistent_index from "../assistent/index.js";
import type * as assistent_shared_providers from "../assistent/shared/providers.js";
import type * as assistent_tools_addNodeClass from "../assistent/tools/addNodeClass.js";
import type * as assistent_tools_createFile from "../assistent/tools/createFile.js";
import type * as assistent_tools_createFileWithGeneratedContent from "../assistent/tools/createFileWithGeneratedContent.js";
import type * as assistent_tools_createProject from "../assistent/tools/createProject.js";
import type * as assistent_tools_createTeam from "../assistent/tools/createTeam.js";
import type * as assistent_tools_createTheme from "../assistent/tools/createTheme.js";
import type * as assistent_tools_createWorkspace from "../assistent/tools/createWorkspace.js";
import type * as assistent_tools_deleteFile from "../assistent/tools/deleteFile.js";
import type * as assistent_tools_deleteNode from "../assistent/tools/deleteNode.js";
import type * as assistent_tools_deleteProject from "../assistent/tools/deleteProject.js";
import type * as assistent_tools_deleteTeam from "../assistent/tools/deleteTeam.js";
import type * as assistent_tools_deleteTheme from "../assistent/tools/deleteTheme.js";
import type * as assistent_tools_deleteWorkspace from "../assistent/tools/deleteWorkspace.js";
import type * as assistent_tools_displayDesignTokens from "../assistent/tools/displayDesignTokens.js";
import type * as assistent_tools_errorMessages from "../assistent/tools/errorMessages.js";
import type * as assistent_tools_getChatHistory from "../assistent/tools/getChatHistory.js";
import type * as assistent_tools_getCurrentFile from "../assistent/tools/getCurrentFile.js";
import type * as assistent_tools_getFileContent from "../assistent/tools/getFileContent.js";
import type * as assistent_tools_getProjectFiles from "../assistent/tools/getProjectFiles.js";
import type * as assistent_tools_getTailwindTheme from "../assistent/tools/getTailwindTheme.js";
import type * as assistent_tools_getTheme from "../assistent/tools/getTheme.js";
import type * as assistent_tools_index from "../assistent/tools/index.js";
import type * as assistent_tools_insertInstance from "../assistent/tools/insertInstance.js";
import type * as assistent_tools_insertNode from "../assistent/tools/insertNode.js";
import type * as assistent_tools_moveNodeDown from "../assistent/tools/moveNodeDown.js";
import type * as assistent_tools_moveNodeUp from "../assistent/tools/moveNodeUp.js";
import type * as assistent_tools_nodeCurrentGet from "../assistent/tools/nodeCurrentGet.js";
import type * as assistent_tools_notifyProjectCreated from "../assistent/tools/notifyProjectCreated.js";
import type * as assistent_tools_pinEntity from "../assistent/tools/pinEntity.js";
import type * as assistent_tools_removeNodeClass from "../assistent/tools/removeNodeClass.js";
import type * as assistent_tools_renameComponent from "../assistent/tools/renameComponent.js";
import type * as assistent_tools_replaceNodeClass from "../assistent/tools/replaceNodeClass.js";
import type * as assistent_tools_types from "../assistent/tools/types.js";
import type * as assistent_tools_unpinEntity from "../assistent/tools/unpinEntity.js";
import type * as assistent_tools_updateFile from "../assistent/tools/updateFile.js";
import type * as assistent_tools_updateFileCode from "../assistent/tools/updateFileCode.js";
import type * as assistent_tools_updateFileContent from "../assistent/tools/updateFileContent.js";
import type * as assistent_tools_updateNodeClass from "../assistent/tools/updateNodeClass.js";
import type * as assistent_tools_updateProject from "../assistent/tools/updateProject.js";
import type * as assistent_tools_updateTailwindTheme from "../assistent/tools/updateTailwindTheme.js";
import type * as assistent_tools_updateTeam from "../assistent/tools/updateTeam.js";
import type * as assistent_tools_updateTheme from "../assistent/tools/updateTheme.js";
import type * as assistent_tools_updateWorkspace from "../assistent/tools/updateWorkspace.js";
import type * as assistent_tools_utils_createZodSchemaFromParameters from "../assistent/tools/utils/createZodSchemaFromParameters.js";
import type * as assistent_utils_buildClassSuggestionsPrompt from "../assistent/utils/buildClassSuggestionsPrompt.js";
import type * as assistent_utils_convertUIMessages from "../assistent/utils/convertUIMessages.js";
import type * as assistent_utils_getCorsHeaders from "../assistent/utils/getCorsHeaders.js";
import type * as assistent_utils_getModelIdentifier from "../assistent/utils/getModelIdentifier.js";
import type * as assistent_utils_toTitleCase from "../assistent/utils/toTitleCase.js";
import type * as auth from "../auth.js";
import type * as collaboration from "../collaboration.js";
import type * as fileVersions from "../fileVersions.js";
import type * as files from "../files.js";
import type * as github_actions from "../github/actions.js";
import type * as github_webhook from "../github/webhook.js";
import type * as githubInstallations from "../githubInstallations.js";
import type * as http from "../http.js";
import type * as lib_access_index from "../lib/access/index.js";
import type * as lib_access_isOwner from "../lib/access/isOwner.js";
import type * as lib_access_requireFileAccess from "../lib/access/requireFileAccess.js";
import type * as lib_access_requireProjectAccess from "../lib/access/requireProjectAccess.js";
import type * as lib_access_requireTeamAccess from "../lib/access/requireTeamAccess.js";
import type * as lib_access_requireWorkspaceAccess from "../lib/access/requireWorkspaceAccess.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_index from "../lib/index.js";
import type * as lib_pagination from "../lib/pagination.js";
import type * as lib_roles from "../lib/roles.js";
import type * as lib_upsertUserProfile from "../lib/upsertUserProfile.js";
import type * as lib_validators from "../lib/validators.js";
import type * as pinnedItems from "../pinnedItems.js";
import type * as presence from "../presence.js";
import type * as projects from "../projects.js";
import type * as teams from "../teams.js";
import type * as themeVersions from "../themeVersions.js";
import type * as themes from "../themes.js";
import type * as users from "../users.js";
import type * as workspaces from "../workspaces.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "assistent/agents/briefingAgent": typeof assistent_agents_briefingAgent;
  "assistent/agents/codeAgent": typeof assistent_agents_codeAgent;
  "assistent/agents/coder": typeof assistent_agents_coder;
  "assistent/agents/filePlannerAgent": typeof assistent_agents_filePlannerAgent;
  "assistent/agents/index": typeof assistent_agents_index;
  "assistent/agents/metaEditor": typeof assistent_agents_metaEditor;
  "assistent/agents/projectMetaAgent": typeof assistent_agents_projectMetaAgent;
  "assistent/agents/projectPlannerAgent": typeof assistent_agents_projectPlannerAgent;
  "assistent/http/chat": typeof assistent_http_chat;
  "assistent/http/getClassSuggestions": typeof assistent_http_getClassSuggestions;
  "assistent/http/getTitle": typeof assistent_http_getTitle;
  "assistent/http/imagine": typeof assistent_http_imagine;
  "assistent/imagine/index": typeof assistent_imagine_index;
  "assistent/imagine/orchestrator/index": typeof assistent_imagine_orchestrator_index;
  "assistent/imagine/orchestrator/stream": typeof assistent_imagine_orchestrator_stream;
  "assistent/imagine/orchestrator/types": typeof assistent_imagine_orchestrator_types;
  "assistent/imagine/orchestrator/workflow": typeof assistent_imagine_orchestrator_workflow;
  "assistent/imagine/steps/architecture/config": typeof assistent_imagine_steps_architecture_config;
  "assistent/imagine/steps/architecture/handler": typeof assistent_imagine_steps_architecture_handler;
  "assistent/imagine/steps/architecture/index": typeof assistent_imagine_steps_architecture_index;
  "assistent/imagine/steps/architecture/stream": typeof assistent_imagine_steps_architecture_stream;
  "assistent/imagine/steps/files/config": typeof assistent_imagine_steps_files_config;
  "assistent/imagine/steps/files/handler": typeof assistent_imagine_steps_files_handler;
  "assistent/imagine/steps/files/index": typeof assistent_imagine_steps_files_index;
  "assistent/imagine/steps/files/stream": typeof assistent_imagine_steps_files_stream;
  "assistent/imagine/steps/metadata/config": typeof assistent_imagine_steps_metadata_config;
  "assistent/imagine/steps/metadata/handler": typeof assistent_imagine_steps_metadata_handler;
  "assistent/imagine/steps/metadata/index": typeof assistent_imagine_steps_metadata_index;
  "assistent/imagine/steps/planning/config": typeof assistent_imagine_steps_planning_config;
  "assistent/imagine/steps/planning/handler": typeof assistent_imagine_steps_planning_handler;
  "assistent/imagine/steps/planning/index": typeof assistent_imagine_steps_planning_index;
  "assistent/imagine/steps/rebriefing/config": typeof assistent_imagine_steps_rebriefing_config;
  "assistent/imagine/steps/rebriefing/handler": typeof assistent_imagine_steps_rebriefing_handler;
  "assistent/imagine/steps/rebriefing/index": typeof assistent_imagine_steps_rebriefing_index;
  "assistent/imagine/steps/setup/config": typeof assistent_imagine_steps_setup_config;
  "assistent/imagine/steps/setup/handler": typeof assistent_imagine_steps_setup_handler;
  "assistent/imagine/steps/setup/index": typeof assistent_imagine_steps_setup_index;
  "assistent/imagine/types/index": typeof assistent_imagine_types_index;
  "assistent/imagine/utils/errorHandlers": typeof assistent_imagine_utils_errorHandlers;
  "assistent/imagine/utils/extractPrompt": typeof assistent_imagine_utils_extractPrompt;
  "assistent/imagine/utils/promptTemplate": typeof assistent_imagine_utils_promptTemplate;
  "assistent/index": typeof assistent_index;
  "assistent/shared/providers": typeof assistent_shared_providers;
  "assistent/tools/addNodeClass": typeof assistent_tools_addNodeClass;
  "assistent/tools/createFile": typeof assistent_tools_createFile;
  "assistent/tools/createFileWithGeneratedContent": typeof assistent_tools_createFileWithGeneratedContent;
  "assistent/tools/createProject": typeof assistent_tools_createProject;
  "assistent/tools/createTeam": typeof assistent_tools_createTeam;
  "assistent/tools/createTheme": typeof assistent_tools_createTheme;
  "assistent/tools/createWorkspace": typeof assistent_tools_createWorkspace;
  "assistent/tools/deleteFile": typeof assistent_tools_deleteFile;
  "assistent/tools/deleteNode": typeof assistent_tools_deleteNode;
  "assistent/tools/deleteProject": typeof assistent_tools_deleteProject;
  "assistent/tools/deleteTeam": typeof assistent_tools_deleteTeam;
  "assistent/tools/deleteTheme": typeof assistent_tools_deleteTheme;
  "assistent/tools/deleteWorkspace": typeof assistent_tools_deleteWorkspace;
  "assistent/tools/displayDesignTokens": typeof assistent_tools_displayDesignTokens;
  "assistent/tools/errorMessages": typeof assistent_tools_errorMessages;
  "assistent/tools/getChatHistory": typeof assistent_tools_getChatHistory;
  "assistent/tools/getCurrentFile": typeof assistent_tools_getCurrentFile;
  "assistent/tools/getFileContent": typeof assistent_tools_getFileContent;
  "assistent/tools/getProjectFiles": typeof assistent_tools_getProjectFiles;
  "assistent/tools/getTailwindTheme": typeof assistent_tools_getTailwindTheme;
  "assistent/tools/getTheme": typeof assistent_tools_getTheme;
  "assistent/tools/index": typeof assistent_tools_index;
  "assistent/tools/insertInstance": typeof assistent_tools_insertInstance;
  "assistent/tools/insertNode": typeof assistent_tools_insertNode;
  "assistent/tools/moveNodeDown": typeof assistent_tools_moveNodeDown;
  "assistent/tools/moveNodeUp": typeof assistent_tools_moveNodeUp;
  "assistent/tools/nodeCurrentGet": typeof assistent_tools_nodeCurrentGet;
  "assistent/tools/notifyProjectCreated": typeof assistent_tools_notifyProjectCreated;
  "assistent/tools/pinEntity": typeof assistent_tools_pinEntity;
  "assistent/tools/removeNodeClass": typeof assistent_tools_removeNodeClass;
  "assistent/tools/renameComponent": typeof assistent_tools_renameComponent;
  "assistent/tools/replaceNodeClass": typeof assistent_tools_replaceNodeClass;
  "assistent/tools/types": typeof assistent_tools_types;
  "assistent/tools/unpinEntity": typeof assistent_tools_unpinEntity;
  "assistent/tools/updateFile": typeof assistent_tools_updateFile;
  "assistent/tools/updateFileCode": typeof assistent_tools_updateFileCode;
  "assistent/tools/updateFileContent": typeof assistent_tools_updateFileContent;
  "assistent/tools/updateNodeClass": typeof assistent_tools_updateNodeClass;
  "assistent/tools/updateProject": typeof assistent_tools_updateProject;
  "assistent/tools/updateTailwindTheme": typeof assistent_tools_updateTailwindTheme;
  "assistent/tools/updateTeam": typeof assistent_tools_updateTeam;
  "assistent/tools/updateTheme": typeof assistent_tools_updateTheme;
  "assistent/tools/updateWorkspace": typeof assistent_tools_updateWorkspace;
  "assistent/tools/utils/createZodSchemaFromParameters": typeof assistent_tools_utils_createZodSchemaFromParameters;
  "assistent/utils/buildClassSuggestionsPrompt": typeof assistent_utils_buildClassSuggestionsPrompt;
  "assistent/utils/convertUIMessages": typeof assistent_utils_convertUIMessages;
  "assistent/utils/getCorsHeaders": typeof assistent_utils_getCorsHeaders;
  "assistent/utils/getModelIdentifier": typeof assistent_utils_getModelIdentifier;
  "assistent/utils/toTitleCase": typeof assistent_utils_toTitleCase;
  auth: typeof auth;
  collaboration: typeof collaboration;
  fileVersions: typeof fileVersions;
  files: typeof files;
  "github/actions": typeof github_actions;
  "github/webhook": typeof github_webhook;
  githubInstallations: typeof githubInstallations;
  http: typeof http;
  "lib/access/index": typeof lib_access_index;
  "lib/access/isOwner": typeof lib_access_isOwner;
  "lib/access/requireFileAccess": typeof lib_access_requireFileAccess;
  "lib/access/requireProjectAccess": typeof lib_access_requireProjectAccess;
  "lib/access/requireTeamAccess": typeof lib_access_requireTeamAccess;
  "lib/access/requireWorkspaceAccess": typeof lib_access_requireWorkspaceAccess;
  "lib/auth": typeof lib_auth;
  "lib/index": typeof lib_index;
  "lib/pagination": typeof lib_pagination;
  "lib/roles": typeof lib_roles;
  "lib/upsertUserProfile": typeof lib_upsertUserProfile;
  "lib/validators": typeof lib_validators;
  pinnedItems: typeof pinnedItems;
  presence: typeof presence;
  projects: typeof projects;
  teams: typeof teams;
  themeVersions: typeof themeVersions;
  themes: typeof themes;
  users: typeof users;
  workspaces: typeof workspaces;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
