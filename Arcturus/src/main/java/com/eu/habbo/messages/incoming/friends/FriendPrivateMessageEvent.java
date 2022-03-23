package com.eu.habbo.messages.incoming.friends;

import com.eu.habbo.Emulator;
import com.eu.habbo.habbohotel.messenger.MessengerBuddy;
import com.eu.habbo.messages.incoming.MessageHandler;
import com.eu.habbo.plugin.events.users.friends.UserFriendChatEvent;

public class FriendPrivateMessageEvent extends MessageHandler {
    @Override
    public void handle() throws Exception {
        int userId = this.packet.readInt();
        String message = this.packet.readString();

        if (!this.client.getHabbo().getHabboStats().allowTalk()) {
            return;
        }

        long millis = System.currentTimeMillis();
        if (millis - this.client.getHabbo().getHabboStats().lastChat < 750) {
            return;
        }
        this.client.getHabbo().getHabboStats().lastChat = millis;

        MessengerBuddy buddy = this.client.getHabbo().getMessenger().getFriend(userId);
        if (buddy == null)
            return;

        if (message.length() > 255) message = message.substring(0, 255);

        UserFriendChatEvent event = new UserFriendChatEvent(this.client.getHabbo(), buddy, message);
        if (Emulator.getPluginManager().fireEvent(event).isCancelled())
            return;

        buddy.onMessageReceived(this.client.getHabbo(), message);
    }
}
