import { isElectron } from "@lib/utils";

export const handleInstallGitHubApp = async () => {
  const appName = "trav-beta-dev";

  const setupUrl = isElectron() ? "http://localhost:5173/dashboard" : `${window.location.origin}/dashboard`;

  const installUrl = `https://github.com/apps/${appName}/installations/new?setup_url=${encodeURIComponent(setupUrl)}`;

  if (isElectron() && window.electron?.auth?.openExternal) {
    // Use Electron's openExternal for integrated experience
    await window.electron.auth.openExternal(installUrl);
  } else {
    window.open(installUrl, "_self");
  }
};
