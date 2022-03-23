package com.eu.habbo.messages.incoming.rooms.users;

import com.eu.habbo.Emulator;
import com.eu.habbo.habbohotel.items.interactions.InteractionVoteCounter;
import com.eu.habbo.habbohotel.rooms.Room;
import com.eu.habbo.habbohotel.rooms.RoomUnitStatus;
import com.eu.habbo.habbohotel.users.HabboItem;
import com.eu.habbo.messages.incoming.MessageHandler;
import com.eu.habbo.plugin.events.users.UserSignEvent;

public class RoomUserSignEvent extends MessageHandler {
    @Override
    public void handle() throws Exception {
        int signId = this.packet.readInt();

        Room room = this.client.getHabbo().getHabboInfo().getCurrentRoom();

        if (room == null)
            return;

        UserSignEvent event = new UserSignEvent(this.client.getHabbo(), signId);
        if (!Emulator.getPluginManager().fireEvent(event).isCancelled()) {
            this.client.getHabbo().getRoomUnit().setStatus(RoomUnitStatus.SIGN, event.sign + "");
            this.client.getHabbo().getHabboInfo().getCurrentRoom().unIdle(this.client.getHabbo());

            if(signId <= 10) {

                int userId = this.client.getHabbo().getHabboInfo().getId();
                for (HabboItem item : room.getFloorItems()) {
                    if (item instanceof InteractionVoteCounter) {
                        ((InteractionVoteCounter)item).vote(room, userId, signId);
                    }
                }
            }
        }
    }
}
