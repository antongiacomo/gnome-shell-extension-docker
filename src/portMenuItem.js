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
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;


// Docker actions for each container
const PortMenuItem = new Lang.Class({
    Name: 'DockerMenu.PortMenuItem',
    Extends: PopupMenu.PopupMenuItem,

    _init: function (dockerPort) {
       this.parent(this._getPort(dockerPort)[1]);
        this.dockerPort = dockerPort;
        this.connect('activate', Lang.bind(this, this._portClick));

    },

    _portClick: function () {
        
        Gio.app_info_launch_default_for_uri("http://"+
            this._getPort( this.dockerPort)[0],
            global.create_app_launch_context(global.display.get_current_time_roundtrip().timestamp,-1));
    },


    _getPort: function (port) {
        if(port.length == 0)
            return "No Ports exposed";
        else{
            var values = port.split('->');
            return values;
        }
    }



});
