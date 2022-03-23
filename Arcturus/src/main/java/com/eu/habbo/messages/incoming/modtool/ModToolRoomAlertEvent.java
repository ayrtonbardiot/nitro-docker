package com.eu.habbo.messages.incoming.modtool;

import com.eu.habbo.Emulator;
import com.eu.habbo.habbohotel.modtool.ScripterManager;
import com.eu.habbo.habbohotel.permissions.Permission;
import com.eu.habbo.habbohotel.rooms.Room;
import com.eu.habbo.messages.incoming.MessageHandler;

public class ModToolRoomAlertEvent extends MessageHandler {
    @Override
    public void handle() throws Exception {
        if (this.client.getHabbo().hasPermission(Permission.ACC_SUPPORTTOOL)) {
            int type = this.packet.readInt();

            Room room = this.client.getHabbo().getHabboInfo().getCurrentRoom();
            if (room != null) {
                room.alert(this.packet.readString());
            }
        } else {
            ScripterManager.scripterDetected(this.client, Emulator.getTexts().getValue("scripter.warning.roomalert").replace("%username%", this.client.getHabbo().getHabboInfo().getUsername()));
        }
    }
}
