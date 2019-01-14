import * as vscode from "vscode";
import { SprintService } from "./SprintService";

export function activate(context: vscode.ExtensionContext) {
    const sprintService = new SprintService();
    vscode.commands.registerCommand("extension.openWhatSprintIsIt", () => sprintService.openWhatSprintIsIt());
}
