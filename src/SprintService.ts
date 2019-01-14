import * as vscode from "vscode";

export interface SprintInformation {
    sprint: number;
    week: number;
}

export class SprintService {
    // Refresh interval - every hour
    private _refreshInterval: number = 1000 * 60 * 60;

    private _statusBarItem: vscode.StatusBarItem;
    private _pageUri: string = "https://whatsprintis.it/";

    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1);

        // Get the sprint information
        this.getSprintInformation();

        // Poll the sprint information
        this.pollSprintInformation();
    }

    public openWhatSprintIsIt(): void {
        const open = require("open");

        open(this._pageUri);
    }

    public getSprintInformation(): void {
        const _self = this;

        const rest = require("rest");
        const mime = require("rest/interceptor/mime");
        const client = rest.wrap(mime);

        client(this._pageUri.concat("?json")).then((response: any) => {
            if (response.status.code === 200) {
                const sprintInformation = response.entity as SprintInformation;
                _self._updateStatusBarItem(sprintInformation);
            }
        });
    }

    public pollSprintInformation(): void {
        setInterval(() => this.getSprintInformation(), this._refreshInterval);
    }

    private _updateStatusBarItem(data: SprintInformation): void {
        this._statusBarItem.text = "S" + data.sprint + "." + data.week;
        this._statusBarItem.tooltip = "Sprint " + data.sprint + ", week " + data.week;
        this._statusBarItem.command = "extension.openWhatSprintIsIt";
        this._statusBarItem.show();
    }
}
