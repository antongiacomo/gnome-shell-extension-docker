/*
 * Gnome3 Docker Menu Extension
 * Copyright (C) 2017 Guillaume Pouilloux <gui.pouilloux@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const DockerMenuItem = Me.imports.src.dockerMenuItem;

/**
 * Create a St.Icon
 * @param {String} name The name of the icon 
 * @param {String} styleClass The style of the icon
 * @return {Object} an St.Icon instance
 */
const createIcon = (name, styleClass) => new St.Icon({ icon_name: name, style_class: styleClass, icon_size: '14' });

/**
 * Get the status of a container from the status message obtained with the docker command
 * @param {String} statusMessage The status message
 * @return {String} The status in ['running', 'paused', 'stopped'] 
 */
const getStatus = (statusMessage) => {
    let status = 'stopped';
    if (statusMessage.indexOf("Up") > -1)
        status = 'running';

    if (statusMessage.indexOf("Paused") > -1)
        status = 'paused';

    return status;
}

// Menu entry representing a docker container
const DockerSubMenuMenuItem = new Lang.Class({
    Name: 'DockerMenu.DockerSubMenuMenuItem',
    Extends: PopupMenu.PopupSubMenuMenuItem,

    _init: function (containerName, containerStatusMessage, containerPort) {
    	this.parent(containerName);
        this.containerPort=containerPort;
        this.parent(containerName);

        switch (getStatus(containerStatusMessage)) {
            case "stopped":
                this.actor.insert_child_at_index(createIcon('process-stop-symbolic', 'status-stopped'), 1);
                this.menu.addMenuItem(new DockerMenuItem.DockerMenuItem(containerName, "start"));
                this.menu.addMenuItem(new DockerMenuItem.DockerMenuItem(containerName, "rm"));
                break;
            case "running":
                this.actor.insert_child_at_index(createIcon('system-run-symbolic', 'status-running'), 1);
                this.menu.addMenuItem(new DockerMenuItem.DockerMenuItem(containerName, "pause"));
                this.menu.addMenuItem(new DockerMenuItem.DockerMenuItem(containerName, "stop"));
                break;
            case "paused":
                this.actor.insert_child_at_index(createIcon('media-playback-pause-symbolic', 'status-paused'), 1);
                this.menu.addMenuItem(new DockerMenuItem.DockerMenuItem(containerName, "unpause"));
                break;
            default:
                this.actor.insert_child_at_index(createIcon('action-unavailable-symbolic', 'status-undefined'), 1);
                break;
        }

        var portItem = new PopupMenu.PopupMenuItem(getPort(containerPort)[1])
        this.menu.addMenuItem(portItem);
        portItem.actor.connect('button_press_event', Lang.bind(this, this._portClick));
    },
    _portClick: function (portItem) {
      log("ciao"+ getPort(this.containerPort)[0]);
      Gio.app_info_launch_default_for_uri("http://"+
        getPort(this.containerPort)[0],
        global.create_app_launch_context(global.display.get_current_time_roundtrip().timestamp,-1)
        );
  }

});
var getPort = (port) => {
    if(port.length == 0)
        return "No Ports exposed";
    else{
        var values = port.split('->');
        return values;
    }

    
};